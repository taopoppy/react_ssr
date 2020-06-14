import { CHANGE_LOGIN } from './constants'

export const changeLogin = (value) => ({
	type: CHANGE_LOGIN,
	value
})

export const login = () => {
	return (dispatch, getState, axiosInstance)=> {
		return axiosInstance.get('/api/login.json?secret=abcd')
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
		return axiosInstance.get('/api/logout.json?secret=abcd')
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
		return axiosInstance.get('/api/isLogin.json?secret=abcd')
		.then((res)=>{
			const isLogin = res.data.data.login
			dispatch(changeLogin(isLogin))
		})
		.catch((err)=> {
			console.log(err)
		})
	}
}