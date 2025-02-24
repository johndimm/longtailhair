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
  // You'll implement this using Anthropic's API client
  // This is a placeholder showing the expected structure
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const message = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
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

const aiRecs = async (user_id, titletype) => {

  let movies = 'movies'
  let instruction = 'Respond only with movies, not tv series!'
  if (titletype != 'movie') {
    movies = 'tv series'
    instruction = 'Respond only with tv series, not movies!'
  }

  const intro = `
Here are some ${movies} I liked and some I didn't like.  

What are your top 20 recommendations for ${movies} I have NOT yet seen and are NOT listed below.  

${instruction}

I want to hear about ${movies} I have not reviewed.

Put a blank line between each recommendation.

Respond with json like this, so I can parse it using JSON.parse in javascript.  Do not begin your response with "json".  
Please provide recommendations in this exact JSON format.  Do not add any introductory text, do not wrap it in a single field named 'text', just give the response as a valid JSON array.;

[
  {
  "year": 1962,
  "tconst": "tt0053198",
  "why_recommended": "because you like french new wave"
  }
]

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

  //return await getClaudeRecommendations(prompt)
  return await getChatgptRecommendations(prompt)
}

const populateUserRatings = async (recs) => {
  if (!recs)
    return null

  console.log("ai recs len:", recs.length)

  const user_id = 1
  const rowList = recs.map ( (r, idx) => {
    const msg = r.why_recommended.replace(/'/g, "''")
    return `(${user_id}, '${r.tconst}', -3, '${msg}')`
  })

  const cmd = `
   INSERT INTO user_ratings 
     (user_id, tconst, rating, msg) 
   values ${rowList.join(',')}
   on conflict (user_id, tconst) do nothing
   `

  return await db.performQuery(cmd)
}

export default async function handler(req, res) {
  const {
    query: { user_id, titletype }
  } = req

  const recs = await aiRecs(user_id, titletype)
  const json = await populateUserRatings(recs)

  res.status(200).json(json)
}