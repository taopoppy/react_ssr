module.exports = {
	module: {
		rules: [{
			test:/.\.js?$/,         // 所有的js文件
			loader: 'babel-loader', // 使用babel-loader编译
			exclude: /node_modules/,// 排除node_modules
			options: {
				presets: [            // 制定编译规则
					'react',            // 按照react代码编译，需要babel-preset-react
					'stage-0',          // 识别异步的语法，需要babel-preset-stage-0
					[
						'env',            // 根据环境做一些适配
						{
							targets: {
								browsers: ['last 2 versions'] // 打包时，babel会兼容所有主流浏览器最新的两个版本
							}
						}
					]
				]
			}
		}]
	}
}