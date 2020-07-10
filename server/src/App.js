import React from 'react'
import Header from './components/Header/index.js'
import { renderRoutes } from 'react-router-config'
import { actions } from './components/Header/store/index.js'

const App = (props) => {
	return (
		<div>
			<Header staticContext={props.staticContext}/>{/*渲染一级路由*/}
			{renderRoutes(props.route.routes)} {/*渲染二级路由*/}
		</div>
	)
}

App.loadData = (store) => {
	return store.dispatch(actions.getHeaderInfo())
}

export default App