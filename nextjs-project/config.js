// github授权链接
const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
// 定义权限(当前只需要user，后续可以写成'user,repo,gits')
const SCOPE = 'user'
const client_id = 'bc3225e59db1965fbeb4'

module.exports = {
	github: {
		request_token_url: 'https://github.com/login/oauth/access_token',
		client_id,
		client_secret: 'a2e086590fc4233f71bcf069d6d89818bc23185a'
	},
	GITHUB_OAUTH_URL,
	OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${SCOPE}`
}

// 2429eeb510c604997db54f251c3f88152d81f4b0