import config from "@/config"

const isDev = import.meta.env.MODE === 'development'
console.log(import.meta.env.MODE);

const urlApi = isDev ? config.serverUrl : '/'

export { urlApi }