// pm2配置文件

module.exports = {
	apps: [
		{
			name: 'next-project', // 启动在pm2的项目名称
			script: './server.js', // 启动文件
			instance: 1, // 1个实例
			autorestart: true, // 自动重启
			watch: false,
			max_memory_restart: '1G', // 使用内存超过1G就重启
			env: {
				NODE_ENV: 'production' // 启动server.js携带环境变量
			}
		}
	]
}