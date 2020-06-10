import axios from 'axios'
import {
	CHANGE_LIST
} from './constants'

const changeList = (list) => {
	return {
		type: CHANGE_LIST,
		list
	}
}

export const getHomeList = (server) => {
	let url = ''
	server ?
		url = 'http://localhost:4000/ssr/api/news.json?secret=abcd' :
	  url = '/api/news.json?secret=abcd'

	return (dispatch)=> {
		return axios.get(url)
		.then((res)=>{
			const list = res.data
			dispatch(changeList(list))
		})
		.catch((err)=> {
			console.log(err)
		})
	}
}
