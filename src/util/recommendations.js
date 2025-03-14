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

  const response = completion.choices[0].message.content

  let json = {}
  try {
    json = JSON.parse(response)
  }
  catch (e) {
    console.log("Error parsing JSON from ai", e)
    console.log("response from ai:", response)
    json = {"response": response }
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
}

export const aiRecsPrompt = async (user_id, titletype, genres, aiModel, user_ratings_recs) => {

  // Clear out any previous recommendations
  //await db.performQuery(`delete from user_ratings where user_id=${user_id} and rating=-3`)

  let movies = 'movies'
  let titletypeInstruction = 'Respond only with movies, not tv series!'
  if (titletype != 'movie') {
    movies = 'tv series'
    titletypeInstruction = 'Respond only with tv series, not movies!'
  }
  let genresFilter = ''
  if (genres && genres != 'undefined' && genres != 'null') {
    genresFilter = `Return only movies in the genre ${genres}`
  }

  const intro = `

Hello ${aiModel}!

You are a movie and tv show recommendation expert.

Provide a JSON array of 30 recommendations based on my ratings below.  

The recommendations should not include any of the titles listed anywhere in this prompt,
(including "haven't seen," "would like to," or "rated" sections). 

Follow these rules:  

1. Every title listed in any section should be excluded.
(whether rated, to watch, or not to watch) 

2. Do not repeat any titles mentioned in the prompt, 
even if the model thinks they fit the recommendation criteria.

3. Double-check each recommendation against all provided lists before finalizing.

${titletypeInstruction}
${genresFilter}

Please provide recommendations in this exact JSON format. 

Do not include any text outside the JSON array.

Do not add any introductory text, do not wrap it in a single field named 'text', 
just give the response as a valid JSON array.

[
  {
  "year": 1962,
  "title": "The 400 Blows",
  "why_recommended": "Recommended because you like french new wave."
  }
]

For "why_recommended", provide a reference to a ${movies} I have seen 
to explan why this ${movies} is recommended.  

Try to find titles that are not well-known.  

Pick ${movies} with good ratings but low popularity.  

Do not pick highly popular ${movies}.

Similarity with ${movies} I have rated highly counts much more than popularity.

Here are the rated ${movies} to Exclude (DO NOT RECOMMEND THESE):

`

  const moviesRatedAs = {}
  user_ratings_recs.forEach((r, idx) => {
    if (!moviesRatedAs.hasOwnProperty(r.rating)) {
      moviesRatedAs[r.rating] = []
    }
    moviesRatedAs[r.rating].push(`"${r.title} (${r.year})"\n`)
    //moviesRatedAs[r.rating].push(`"${r.tconst}"\n`)
  })

  let ratingsConstants = [
    { "id": -2, "msg": "I haven't seen these and don't want to:\n" },
    { "id": -1, "msg": "I haven't seen these but want to:\n" }
  ]

  const ratings = [1, 2, 3, 4, 5]
  ratings.forEach((rating, idx) => [
    ratingsConstants.push({ "id": rating, "msg": `Rated ${rating}:\n` })
  ])

  let report = ''
  ratingsConstants.forEach((rating, idx) => {
    if (moviesRatedAs[rating.id])
      report += rating.msg + moviesRatedAs[rating.id] + ".\n"
  })

  const prompt = intro + report
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

const populateUserRatings = async (recs, user_id, user_ratings_recs, code) => {
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
    const title = r.title.replace(/'/g, "''")
    const line = `(${r.year}, '${r.tconst}', '${title}', '${why_recommended}')`
    insertRecs.push(line)
  }

    // Clear out any previous recommendations
  //await db.performQuery(`delete from user_ratings where user_id=${user_id} and rating=-3`)

  let cmd = `  
  drop table if exists tmp;
  create table tmp (
    year int,
    tconst text,
    title text,
    why_recommended text
  )
  ;
  `
  await db.performQuery(cmd)

  cmd = `
  insert into tmp (year, tconst, title, why_recommended) values
    ${insertRecs.join(',')}
  ;
  `
  await db.performQuery(cmd)

  cmd = `
  delete from user_ratings where user_id=${user_id} and rating=-3
  ;
  insert into user_ratings
  (user_id, tconst, rating, msg)
  select ${user_id} as user_id, tbe.tconst, ${code}, why_recommended as msg
  from tmp
  join title_basics_ex as tbe on lower(tbe.primarytitle) = lower(tmp.title) and startyear = tmp.year
  on conflict (user_id, tconst) do nothing
  ;
    `
  await db.performQuery(cmd)


return { nOld: nOld, nNew: nNew }
}

export const getAIRecsPrompt = async (user_id, titletype, genres, aiModel) => {
  const user_ratings_recs = await db.getUserRatings(user_id)

  const prompt = await aiRecsPrompt(user_id, titletype, genres, aiModel, user_ratings_recs)

  return {"prompt": prompt}
}

export const getAIRecs = async (user_id, titletype, genres, aiModel) => {
  const user_ratings_recs = await db.getUserRatings(user_id)

  const prompt = await aiRecsPrompt(user_id, titletype, genres, aiModel, user_ratings_recs)
  const recs = await usePrompt(prompt, aiModel)
  const json = await populateUserRatings(recs, user_id, user_ratings_recs, -3)
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
  const json = await populateUserRatings(recs, user_id, user_ratings_recs, -3)
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