import { CHANGE_LOGIN } from './constants'

export const changeLogin = (value) => ({
	type: CHANGE_LOGIN,
	value
})

export const login = () => {
	return (dispatch, getState, axiosInstance)=> {
		return axiosInstance.get('/api/login.json')
		.then((res)=>{
			dispatch(changeLogin(true))
		})
		.catch((err)=> {
			console.log(err)
		})
	}
}

export const logout = () => {
	return (dispatch, getState, axiosInstance)=> {
		return axiosInstance.get('/api/logout.json')
		.then((res)=>{
			dispatch(changeLogin(false))
		})
		.catch((err)=> {
			console.log(err)
		})
	}
}

export const getHeaderInfo = () => {
	return (dispatch, getState, axiosInstance)=> {
		return axiosInstance.get('/api/isLogin.json')
		.then((res)=>{
			const isLogin = res.data.data.login
			dispatch(changeLogin(isLogin))
		})
		.catch((err)=> {
			console.log(err)
		})
	}
}