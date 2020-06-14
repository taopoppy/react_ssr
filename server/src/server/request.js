import axios from 'axios'

const createInstance = (req) => axios.create({
	baseURL: 'http://localhost:4000/ssr',
	headers: {
		coodkie: req.get('cookie') || ''
	}
})

export default createInstance