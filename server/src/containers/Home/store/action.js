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

export const getHomeList = () => {
	return (dispatch)=> {
		return axios.get('http://localhost:4000/newsList.json')
		.then((res)=>{
			const list = res.data
			dispatch(changeList(list))
		})
		.catch((err)=> {
			console.log(err)
		})
	}
}
