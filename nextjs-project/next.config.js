const withCss = require('@zeit/next-css')
const config = require('./config.js')


if (typeof require !== 'undefined') {
	require.extensions['.css'] = file => {}
}

module.exports = withCss({
	// 在这里写所有的配置项
	publicRuntimeConfig: {
		GITHUB_OAUTH_URL:config.GITHUB_OAUTH_URL,
		OAUTH_URL: config.OAUTH_URL
	}
})