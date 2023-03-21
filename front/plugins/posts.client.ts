import axios from "axios"



const prod = {
  // origin: "https://proxy.cors.sh/" + "http://54.38.52.169:8080",
  origin: "https://yippie.webions.uk",
  headers: {
    "origin" : "https://yippieai.github.io"
  }
}

const local = {
  origin : "http://127.0.0.1:3300",
  headers : { }
}

const { origin, headers } = ['127.0.0.1', 'localhost'].includes(location.hostname) ? local : prod;

// export default {
//   get: async ( url: string ) => {
//     return ( await axios.get( origin + '/api/' + url, { headers } ) ).data
//   } 
// }

// export default defineNuxtPlugin((/* nuxtApp */) => {
export default (/* nuxtApp */) => {
  return { provide: {
    services: {
      get: async ( url: string ) => {
        return ( await axios.get( origin + '/api/' + url, { headers } ) ).data
      } 

    }

  }}
// })
}
