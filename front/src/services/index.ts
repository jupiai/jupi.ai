import axios from "axios"

const local = "http://127.0.0.1:3300"
const prod = "http://54.38.52.169:8080"
const host = import.meta.env.VITE_ENV === 'local' ? local : prod;

console.log('TOTOTO:', import.meta?.env?.VITE_ENV )

export default {
  get: async (url: string) => {
    return ( await axios.get( host + '/api/' + url ) ).data
  } 
}