const axios = require('axios')

const github_base_url = 'https://api.github.com'

async function requestGithub(method, url, data,headers) {
	try {
		const result = await axios({
			method,
			url:`${github_base_url}${url}`,
			data,
			headers
		})
		return result
	} catch (error) {
		console.log('github请求失败')
	}
}


const isServer = typeof window === 'undefined'
async function request({method = 'GET', url, data={} }, req ,res) {
	if(!url) {
		throw Error('url must provide')
	}

	// 服务端的情况
	if (isServer) {
		const session  = req.session
		const githubAuth = session.githubAuth || {}
		const headers = {}
		if (githubAuth.access_token) {
			headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
		}
		return await requestGithub(method,url,data,headers)
	} else {
		// 客户端的情况
		return await axios({
			method,
			url: `/github${url}`,
			data,
		})
	}
}

module.exports = {
	request,
	requestGithub
}