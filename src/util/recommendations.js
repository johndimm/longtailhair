import db from '@/util/db'
import OpenAI from "openai";
import Anthropic from '@anthropic-ai/sdk';

async function getChatgptRecommendations(prompt) {

  const key = process.env.CHATGPT_API_KEY

  const openai = new OpenAI({
    apiKey: key,
  });

  const completion = await openai.chat.completions.create({
    // model: "gpt-4o-mini",
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

const aiRecs = async (user_id, titletype, genres) => {

  let movies = 'movies'
  let titletypeInstruction = 'Respond only with movies, not tv series!'
  if (titletype != 'movie') {
    movies = 'tv series'
    titletypeInstruction = 'Respond only with tv series, not movies!'
  }
  let genresFilter = ''
  if (genres) {
    genresFilter = `Return only movies in the genre ${genres}`
  }

  const intro = `
Here are some ${movies} I liked and some I didn't like.  

What are your top 20 recommendations for ${movies} I have NOT yet seen and are NOT listed below.  I want to hear about ${movies} I have not rated.  

${titletypeInstruction}
${genresFilter}

Put a blank line between each recommendation.

Respond with json like this, so I can parse it using JSON.parse in javascript.  Do not begin your response with "json".  
Please provide recommendations in this exact JSON format.  Do not add any introductory text, do not wrap it in a single field named 'text', just give the response as a valid JSON array.;

[
  {
  "year": 1962,
  "tconst": "tt0053198",
  "title": "The 400 Blows",
  "why_recommended": "Recommended because you like french new wave."
  }
]

Please double-check the tconst to make sure it is correct for the films you have picked.

Here are the ${movies}.  If there are none, respond by giving an assortment of different kinds of ${movies} from different eras.  

Above all, do NOT return any of the ${movies} listed in this prompt!
`

  const data = await db.getUserRatings(user_id)
  const existingTitle = {}
  data.forEach((r, idx) => {
    existingTitle[r.title] = idx
  })

  const moviesRatedAs = {}
  data.forEach((r, idx) => {
    if (!moviesRatedAs.hasOwnProperty(r.rating)) {
      moviesRatedAs[r.rating] = []
    }
    moviesRatedAs[r.rating].push(`"${r.title}"\n`)
  })

  let ratingsConstants = [
    {"id": -2, "msg": "I haven't seen these movies and I don't want to:\n"},
    {"id": -1, "msg": "I haven't seen these movies but I would like to:\n"}
  ]
  
  const ratings = [1, 2, 3, 4, 5]
  ratings.forEach ( (rating, idx) => [
    ratingsConstants.push({"id": rating, "msg": `I give these movies a rating of ${rating}:\n`})
  ])
  let report = ''
  ratingsConstants.forEach ( ( rating, idx) => {
    if (moviesRatedAs[rating.id])
       report += rating.msg + moviesRatedAs[rating.id] + ".\n"
  })

  const prompt = intro + report
  console.log("prompt", prompt)

  return await getClaudeRecommendations(prompt)
  //return await getChatgptRecommendations(prompt)
}

const populateUserRatings = async (recs) => {
  if (!recs)
    return null

  console.log("ai recs len:", recs.length)

  const user_id = 1

  for (let i=0; i<recs.length; i++) {
    const r = recs[i]
    const msg = r.why_recommended.replace(/'/g, "''")
    const cmd = `  
    insert into user_ratings
    (user_id, tconst, rating, msg)
    select ${user_id}, tbe.tconst, -3, '${msg}'
    from title_basics_ex as tbe
    where lower(tbe.primarytitle) = lower('${r.title}')
    and startyear = ${r.year}
    on conflict (user_id, tconst) do nothing
    `
    await db.performQuery(cmd)
  }

  return {result: true}
}

export const getAIRecs = async (user_id, titletype, genres) => {
    const recs = await aiRecs(user_id, titletype, genres)
    const json = await populateUserRatings(recs)
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