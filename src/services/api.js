import axios from 'axios'
import dotenv from 'dotenv'

const api = axios.create({
  baseURL:ProcessingInstruction.env.Port
})

export default api