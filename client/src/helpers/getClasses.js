import axios from './axios'

const getClasses = () => {
  return axios.get('/getClasses')
    .then(r => {
      return r.data
    })
    .catch(error => {
      return error.response
    })
}

export default getClasses
