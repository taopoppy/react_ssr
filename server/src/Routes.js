import Home from './containers/Home/index.js'
import Login from './containers/Login/index.js'
import App from './App'

export default [{
	path: '/',
	component: App,
	routes: [
		{
			path: '/',
			component: Home,
			exact: true,
			loadData: Home.loadData,
			key: 'home'
		},
		{
			path: '/login',
			component: Login,
			exact:true,
			key: 'login'
		},
	]
}]