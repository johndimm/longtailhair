import db from '@/util/db'
import OpenAI from "openai";
import Anthropic from '@anthropic-ai/sdk';
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function getGeminiRecommendations(prompt) {

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(prompt);
  let response = result.response.text()

  response = response.replace(/`/g, '')
  response = response.replace(/^json/, '')
  console.log("response from Gemini:", response)

  const json = JSON.parse(response)
  return json
}

async function getDeepseekRecommendations(prompt) {
  const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: "deepseek-chat",
    store: true,
    messages: [
      { "role": "user", "content": prompt },
    ],
  });

  let response = completion.choices[0].message.content
  response = response.replace("```json", "").replace("```", "")

  let json = {}
  try {
    json = JSON.parse(response)
  }
  catch (e) {
    console.log("Error parsing JSON from ai", e)
    console.log("response from ai:", response)
    json = { "response": response }
  }

  return json
}

async function getChatgptRecommendations(prompt) {

  const key = process.env.CHATGPT_API_KEY

  const openai = new OpenAI({
    apiKey: key,
  });

  const completion = await openai.chat.completions.create({
    // model: "gpt-4o-mini",
    // model: "03-mini",
    // model: "gpt-4.5-preview",
    model: "gpt-4o",
    store: true,
    messages: [
      { "role": "user", "content": prompt },
    ],
  });

  let response = completion.choices[0].message.content

  response = response.replace(/`/g, '')
  response = response.replace(/^json/, '')

  const json = JSON.parse(response)

  return json

}

async function getClaudeRecommendations(prompt) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
    const message = await anthropic.messages.create({
      // model: "claude-3-opus-20240229",
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 4000,
      system: `You are a movie recommendation expert. Provide recommendations in the exact JSON format requested.  
    Please wrap strings in double quotes.  Return a valid JSON array.`,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const jsonString = message.content[0].text
    const json = JSON.parse(jsonString)

    return json
  } catch (e) {
    const jsonError = { title: 'Error: Unable to get response from Claude.' }
    console.log(jsonError, e)
    alert(jsonError + '   ' + e)
    return jsonError
  }
}

export const aiRecsPrompt = async (user_id, titletype, genres, aiModel, user_ratings_recs) => {

  // Clear out any previous recommendations
  //await db.performQuery(`delete from user_ratings where user_id=${user_id} and rating=-3`)

  let movies = 'movies'
  let titletypeInstruction = 'You can provide a few tv series but I am currently looking at movies, so provide mostly movies.'
  if (titletype != 'movie') {
    movies = 'tv series'
    titletypeInstruction = 'You can provide a few movies but I am currently looking at tv series, so provide ostly tv series.'
  }
  let genresFilter = ''
  if (genres && genres != 'undefined' && genres != 'null') {
    genresFilter = `Return mainly movies or tv series in the genre ${genres}`
  }

  const intro = `

Hello ${aiModel}!

<goal>
Give me an interesting list of movies and tv series I have not yet seen.  The feature
will be a success if I later watch the recommendations and give them good ratings.  
</goal>

<request>
You are a movie and tv show recommendation expert.
Provide 30 movie and tv recommendations based on the ratings I provide in the resources section.  
</request>

<constraint>
CRITICAL: DO NOT recommend ANY movies listed ANYWHERE in this prompt. This is the most important rule.

Every single title mentioned in any section must be excluded from recommendations, including:
- All movies in the do_not_want_to_see list
- All movies in the want_to_see list
- All movies in the rated list

Before finalizing each recommendation, explicitly verify it does NOT appear anywhere in this prompt.
</constraint>

<strategy>
Do NOT focus only on the most similar movies to my highest-rated films.
Instead, rotate through different aspects of my taste profile:
- First third: recommend based on my top-rated films
- Second third: recommend based on directors/creators of my top-rated films
- Final third: recommend films that represent different eras/styles but match my general preferences

In your "why_recommended" field, try to flesh out the connection between some aspect of a movie I liked and this recommendation.  Same actor or crew, same plot theme, same pace, same atmosphere.

Do not use each rated title independently to generate a single recommendation.  Look for common themes among the highly rated titles.  For example, if most of them are about chefs and cooking, the user will be more interested in recommendations about chefs and cooking.

</strategy>

<constraint>
The primary goal is discovering new, high-quality films I haven't seen, not just finding the closest matches to my existing favorites.
</constraint>

<constraint>
Pick movies made close in time to the rated titles.  If all the rated titles are from the early 60's, pick other movies made then.
</constraint>

<constraint>
If most of the rated titles are from a given country, pick other movies from the same country.
</constraint>

<instruction>
For each recommendation, aim to be at most "two degrees of separation" from my rated films - recommend films that were influences on my favorites, or were influenced by them, rather than just similar films.
</instruction>

<constraint>
${titletypeInstruction}
${genresFilter}
</constraint>

<format>
Please provide recommendations in this exact JSON format. 

Do not include any text outside the JSON array.

Do not add any introductory text, do not wrap it in a single field named 'text', 
just give the response as a valid JSON array.

Do not start the response with a few backticks followed by "json".  Just give me the JSON itself.  Given your response, this should work:

  const json = JSON.parse(response)

<examples>
[
  {
  "year": 1962,
  "title": "The 400 Blows",
  "why_recommended": "Recommended because you enjoyed 'Breathless' and would appreciate this seminal French New Wave film aobut youth and alienation"
  }
]
</examples>

Before adding any movie to your recommendations, compare it character-by-character to each movie listed in the resources section to ensure there are NO matches.

For "why_recommended", provide a specific reference to a movie I have rated to explain why this new movie is recommended.
</format>

<constraint>
Try to find titles that are not well-known.  

Pick ${movies} with good ratings but low popularity.  

Do not pick highly popular ${movies}.

Similarity with ${movies} I have rated highly counts much more than popularity.

</constraint>

<verification>
After creating your list of recommendations, check each one against ALL movies mentioned in this prompt. 
Remove any recommendation that matches any movie title in this prompt.
This verification step must be completed before responding.
</verification>


`

  const not_see = user_ratings_recs.filter((r) => r.rating == -2).map((r, idx) => {
    return { "title": r.title, "year": r.year }
  })

  const want_see = user_ratings_recs.filter((r) => r.rating == -1).map((r, idx) => {
    return { "title": r.title, "year": r.year }
  })

  const rated = user_ratings_recs.filter((r) => r.rating > 0).map((r, idx) => {
    return { "title": r.title, "year": r.year, "rating": r.rating }
  })

  const resource = {
    do_not_want_to_see: not_see,
    want_to_see: want_see,
    rated: rated
  }

  const report = JSON.stringify(resource, null, 2)

  const prompt = `
${intro}
<resources>
Here are the rated ${movies} to Exclude (DO NOT RECOMMEND THESE):
 
${report}
</resources>
`
  console.log("prompt", prompt)
  return prompt
}

const usePrompt = async (prompt, aiModel) => {
  let recs
  if (aiModel == 'Claude') {
    recs = await getClaudeRecommendations(prompt)
  } else if (aiModel == 'ChatGPT') {
    recs = await getChatgptRecommendations(prompt)
  } else if (aiModel == 'DeepSeek') {
    recs = await getDeepseekRecommendations(prompt)
  } else if (aiModel == 'Gemini') {
    recs = await getGeminiRecommendations(prompt)
  }

  return recs
}

export const aiRecs = async (user_id, titletype, genres, aiModel, user_ratings_recs) => {
  const prompt = await aiRecsPrompt(user_id, titletype, genres, aiModel, user_ratings_recs)
  const recs = await usePrompt(prompt, aiModel)
  return recs
}

const populateUserRatings = async (recs, user_id, user_ratings_recs, code, aiModel) => {
  if (!recs)
    return null

  const existingTitle = {}
  user_ratings_recs.forEach((r, idx) => {
    existingTitle[r.title] = idx
  })

  let newRecs = []
  let nOld = 0
  let nNew = 0
  recs.forEach(r => {
    if (!existingTitle[r.title]) {
      newRecs.push(r)
      nNew++
    } else {
      nOld++
    }
  })

  console.log("===> already rated movies:", nOld, "new:", nNew)
  console.log("===> complete response from AI:", recs)


  const insertRecs = []
  for (let i = 0; i < newRecs.length; i++) {
    const r = newRecs[i]
    const why_recommended = r.why_recommended.replace(/'/g, "''")
      + ` (${aiModel})`
    const title = r.title.replace(/'/g, "''")
    const line = `(${r.year}, ${i + 1}, '${r.tconst}', '${title}', '${why_recommended}')`
    insertRecs.push(line)
  }

  // Clear out any previous recommendations
  //await db.performQuery(`delete from user_ratings where user_id=${user_id} and rating=-3`)

  let cmd = `  
  drop table if exists tmp;
  create table tmp (
    year int,
    source_order int,
    tconst text,
    title text,
    why_recommended text
  )
  ;
  `
  await db.performQuery(cmd)

  cmd = `
  insert into tmp (year, source_order, tconst, title, why_recommended) values
    ${insertRecs.join(',')}
  ;
  `
  await db.performQuery(cmd)

  cmd = `
  delete from user_ratings where user_id=${user_id} and rating=-3
  ;
  insert into user_ratings
  (source_order, user_id, tconst, rating, msg)
  select 
    source_order,
    ${user_id} as user_id, 
    tbe.tconst, 
    ${code}, 
    why_recommended as msg
  from tmp
  join title_basics_ex as tbe on 
  lower(tbe.primarytitle) = lower(tmp.title) 
  and abs(startyear - tmp.year) <= 2 
  on conflict (user_id, tconst) do nothing
  ;
    `
  await db.performQuery(cmd)

  return { nOld: nOld, nNew: nNew }
}

export const getAIRecsPrompt = async (user_id, titletype, genres, aiModel) => {
  const user_ratings_recs = await db.getUserRatings(user_id)

  const prompt = await aiRecsPrompt(user_id, titletype, genres, aiModel, user_ratings_recs)

  return { "prompt": prompt }
}

export const getAIRecs = async (user_id, titletype, genres, aiModel) => {
  const user_ratings_recs = await db.getUserRatings(user_id)

  const prompt = await aiRecsPrompt(user_id, titletype, genres, aiModel, user_ratings_recs)
  const recs = await usePrompt(prompt, aiModel)
  const json = await populateUserRatings(recs, user_id, user_ratings_recs, -3, aiModel)
  return json
}

export const getMovieAIRecs = async (user_id, tconst, _aiModel) => {
  const user_ratings_recs = await db.get_movie_tconst(tconst)
  const titletype = 'movie'

  let genres = ''
  if (user_ratings_recs.length > 0) {
    const movie = user_ratings_recs[0]
    movie.rating = 5
    genres = movie.genres
  }

  const aiModel = _aiModel ? _aiModel : 'Gemini'

  const prompt = await aiRecsPrompt(user_id, titletype, genres, aiModel, user_ratings_recs)
  const recs = await usePrompt(prompt, aiModel)
  const json = await populateUserRatings(recs, user_id, user_ratings_recs, -3, aiModel)
  return json
}

export const getSimpleRecs = async (user_id, titletype, genres) => {
  let actualTitletype
  let msg
  if (titletype == 'movie') {
    actualTitletype = 'movie'
    msg = " is a popular movie."
  } else {
    actualTitletype = 'tvSeries'
    msg = " is a popular tv series."
  }

  const addRecs = `
  insert into user_ratings
  (user_id, tconst, rating, msg)
  select ${user_id} as user_id, tbe.tconst, -3 as rating, concat(tbe.primarytitle,'${msg}') as msg
  from title_basics_ex as tbe
  left join user_ratings as ur on ur.tconst = tbe.tconst and ur.user_id=${user_id}
  where ur.tconst is null
  and tbe.titletype = '${actualTitletype}'
  and ('${genres}' in ('undefined', 'null') or string_to_array(tbe.genres::text, ',') @> string_to_array('${genres}'::text, ',') )
  order by tbe.popularity desc
  limit 4
`
  const json = await db.performQuery(addRecs)
  return json
}