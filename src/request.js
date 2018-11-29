import axios from 'axios'

const service = axios.create({
  baseURL: 'https://api.cnibd.com/site'
})

export default service
