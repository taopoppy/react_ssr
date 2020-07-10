const path = require('path')
const nodeExternals = require('webpack-node-externals')
const merge = require('webpack-merge')
const config = require('./webpack.base.js')

const serverConfig = {
	mode: 'development',
	target:'node', // 需要设置这一项，服务端和客户端的打包结果不同
	entry: './src/server/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname,'build')
	},
	externals:[
		nodeExternals(), // node当中引入的包（比如express）不会被打包进入bundle.js
	],
	module: {
		rules: [{
			test: /\.css?$/,
			use: [
				'isomorphic-style-loader',
				{
					loader:'css-loader',
					options: {
						importLoaders:1,
						modules: true,
						localIdentName: '[name]_[local]_[hash:base64:5]'
					}
				}
			]
		}]
	}
}

module.exports = merge(config, serverConfig)