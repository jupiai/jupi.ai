import axios from "axios"

const proxy = "https://proxy.cors.sh/"

// const proxy = "https://thingproxy.freeboard.io/fetch/"
// const local = proxy + "http://127.0.0.1:3300"
const local = "http://127.0.0.1:3300"
const prod = proxy + "http://54.38.52.169:8080"
// const host = import.meta.env.VITE_ENV === 'local' ? local : prod;
const host = ['127.0.0.1', 'localhost'].includes(location.hostname) ? local : prod;
// const host = prod;

console.log( { host } )

export default {
  get: async ( url: string ) => {
    return ( await axios.get( host + '/api/' + url, {
      headers : {
        "origin" : "https://yippieai.github.io"
      }
    } ) ).data
  } 
}