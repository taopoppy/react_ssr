const withCss = require('@zeit/next-css')

if (typeof require !== 'undefined') {
	require.extensions['.css'] = file => {}
}

module.exports = withCss({
	// 在这里写所有的配置项
})