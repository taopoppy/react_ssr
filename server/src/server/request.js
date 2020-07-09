import axios from 'axios'
import config from '../config'

const createInstance = (req) => axios.create({
	baseURL: 'http://localhost:4000/ssr',
	headers: {
		coodkie: req.get('cookie') || ''
	},
	params: {
		secret: config.secret
	}
})

export default createInstance