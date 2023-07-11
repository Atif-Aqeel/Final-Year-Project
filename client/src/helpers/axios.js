import axios from 'axios'
import configs from '../assests/config/configs'

const instance = axios.create({
  baseURL: configs.api_url,
  headers: {
    'content-type': 'application/json'
  }
})

instance.interceptors.request.use((config) => {
  config.headers.Authorization = 'bearer ' + localStorage.getItem('cmsToken')
  return config
}, (err) => {
  console.log(err)
  return Promise.reject(err)
})
export default instance
