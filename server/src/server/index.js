import express from 'express'
import { render } from './utils'
import { getStore } from '../store/index.js'
import routes from '../Routes'
import { matchRoutes } from 'react-router-config'


const app = express()
app.use(express.static('public'))

app.get('*',function (req,res) {
	const store = getStore()
	const matchedRoutes = matchRoutes(routes, req.path)
	const promises = []

	matchedRoutes.forEach(item => {
		if (item.route.loadData) {
			promises.push(item.route.loadData(store))
		}
	});

	Promise.all(promises).then(()=> {
		res.send(render(store,routes,req))
	})
})

var server = app.listen(4000, function() {
	var host = server.address().address
	var port = server.address().port
	console.log('Example app listening at http://%s:%s', host, port)
})