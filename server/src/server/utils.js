import React from 'react'
import { Helmet } from 'react-helmet'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { renderRoutes } from 'react-router-config'

export const render = (store,routes,req,context) => {
	// 等到异步加载完毕，store中有数据再执行后面
	const content = renderToString((
		<Provider store={store}>
			<StaticRouter location={req.path} context={context}>
				<div>
					{renderRoutes(routes)}
				</div>
			</StaticRouter>
		</Provider>
	))
	const helmet = Helmet.renderStatic();

	const cssStr = context.css.length ? context.css.join('\n') : ''

	return `
		<html>
			<head>
				${helmet.title.toString()}
				${helmet.meta.toString()}
				<style>${cssStr}</style>
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