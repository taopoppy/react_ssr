import Home from './containers/Home/index.js'
import Translation from './containers/Translation/index.js'
import App from './App'
import NotFound from './containers/NotFound/index'

export default [{
	path: '/',
	component: App,
	loadData: App.loadData,
	routes: [
		{
			path: '/',
			component: Home,
			exact: true,
			loadData: Home.loadData,
			key: 'home'
		},
		{
			path: '/translation',
			component: Translation,
			exact: true,
			loadData: Translation.loadData,
			key: 'translation'
		},
		{
			component:NotFound
		}
	]
}]