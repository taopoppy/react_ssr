import express from 'express'
import proxy from 'express-http-proxy'
import { render } from './utils'
import { getStore } from '../store/index.js'
import routes from '../Routes'
import { matchRoutes } from 'react-router-config'


const app = express()
app.use(express.static('public'))

app.use('/api',proxy('http://localhost:4000', {
	proxyReqPathResolver: function (req) {
		return '/ssr/api'+ req.url
	}
}));

app.get('*',function (req,res) {
	const store = getStore(req)
	const matchedRoutes = matchRoutes(routes, req.path)
	const promises = []

	matchedRoutes.forEach(item => {
		if (item.route.loadData) {
			const promise = new Promise((resolve,reject)=> {
				item.route.loadData(store).then(resolve).catch(resolve)
			})
			promises.push(promise)
		}
	});

	Promise.all(promises).then(()=> {
		const context = {}
		const html = render(store,routes,req,context)

		if(context.action === 'REPLACE') {
			res.redirect(301, context.url)
		} else if(context.NOT_FOUND) {// 404 页面
			res.status(404)
			res.send(html)
		} else {// 普通页面
			res.send(html)
		}
	})
})

var server = app.listen(3000, function() {
	var host = server.address().address
	var port = server.address().port
	console.log('Example app listening at http://%s:%s', host, port)
})