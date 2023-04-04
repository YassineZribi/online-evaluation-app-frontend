import axios from 'axios'

// Create an instance of axios
const api = axios.create({
    baseURL: `${import.meta.env.VITE_REACT_APP_API_URL}/api`,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default api