import React from 'react'
import Header from './components/Header'
import { renderRoutes } from 'react-router-config'

const App = (props) => {
	return (
		<div>
			<Header />{/*渲染一级路由*/}
			{renderRoutes(props.route.routes)} {/*渲染二级路由*/}
		</div>
	)
}

export default App