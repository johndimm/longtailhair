import { getOMDB } from "@/util/omdb_fill"

export default async function handler (req, res) {
  const { tconst } = req.query
  const response = await getOMDB(tconst)
  res.status(200).json( response )
}