import React from 'react'
import { Route } from 'react-router-dom'
import Home from './containers/Home/index.js'
import Login from './containers/Login/index.js'

export default [
	{
		path: '/',
		component: Home,
		exact: true,
		loadData: Home.loadData,
		key: 'home'
		// routes: [{
		// 	path: '/ttt',
		// 	component: Login,
		// 	exact: true,
		// 	key: 'ttt'
		// }]
	},
	{
		path: '/login',
		component: Login,
		exact:true,
		key: 'login'
	},
]