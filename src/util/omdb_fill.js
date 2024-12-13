import axios from "axios"
import db from '@/util/db'

export const getOMDB = async (tconst) => {
    const key = process.env['OMDB_KEY']

    const url = `http://www.omdbapi.com/?i=${tconst}&apikey=${key}`

    var options = {
        method: 'GET',
        url: url,
        params: { api_key: key, language: 'en-US'}
    };

    const response = await axios.request(options)
    const jsonData = await response.data

    db.insertOMDB(tconst, jsonData)
    return jsonData
}
