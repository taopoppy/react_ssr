import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { renderRoutes } from 'react-router-config'

export const render = (store,routes,req) => {
		// 等到异步加载完毕，store中有数据再执行后面
		const content = renderToString((
			<Provider store={store}>
				<StaticRouter location={req.path} context={{}}>
					<div>
						{renderRoutes(routes)}
					</div>
				</StaticRouter>
			</Provider>
		))

		return `
			<html>
				<head>
					<title>ssr</title>
				</head>
				<body>
					<div id="root">${content}</div>
					<script>
							window.context = {
								state: ${JSON.stringify(store.getState())}
							}
					</script>
					<script src='/index.js'></script>
				</body>
			</html>
		`
}