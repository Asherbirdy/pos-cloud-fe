import config from "@/config"

const isDev = import.meta.env.MODE === 'dev'

const urlApi = isDev ? config.serverUrl : '/'

export { urlApi }