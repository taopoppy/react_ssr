import React from 'react'
import createStore from '../store/store.js' // 引入创建store的函数


const isServer = typeof window ==='undefined' // 判断是否是服务端
const _NEXT_REDUX_STORE_ = '_NEXT_REDUX_STORE_'

function getOrCreateStore(initialState) {
	if(isServer) {
		return createStore(initialState) // 
	}

	if (!window[_NEXT_REDUX_STORE_]) {
		window[_NEXT_REDUX_STORE_] = createStore(initialState)
	}

	return window[_NEXT_REDUX_STORE_]
}

export default (Comp) => {
	// 将WithReduxApp变为一个class的组件
	class WithReduxApp extends React.Component {
		constructor(props) {
			super(props)
			this.reduxStore = getOrCreateStore(props.initialReduxState)
		}

		render() {
			const {Component, pageProps, ...rest} = this.props
			if (pageProps) {
				pageProps.test = '123'
			}

			return <Comp
				Component={Component}
				pageProps={pageProps}
				{...rest}
				reduxStore={this.reduxStore} // 把store中的数据传给组件
			/>
		}
	}


	WithReduxApp.getInitialProps = async (ctx) => {
		const reduxStore = getOrCreateStore()

		ctx.reduxStore = reduxStore

		let appProps = {}
		// 如果Comp下面的getInitialProps方法存在
		if (typeof Comp.getInitialProps === 'function') {
			appProps = await Comp.getInitialProps(ctx)
		}

		return {
			...appProps,
			initialReduxState: reduxStore.getState()
		}

	}


	return WithReduxApp

}