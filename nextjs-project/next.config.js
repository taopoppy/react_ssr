const withCss = require('@zeit/next-css')
const config = require('./config.js')


if (typeof require !== 'undefined') {
	require.extensions['.css'] = file => {}
}

// github授权链接
const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
// 定义权限(当前只需要user，后续可以写成'user,repo,gits')
const SCOPE = 'user'

module.exports = withCss({
	// 在这里写所有的配置项
	publicRuntimeConfig: {
		GITHUB_OAUTH_URL,
		OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${config.github.client_id}&scope=${SCOPE}`
	}
})