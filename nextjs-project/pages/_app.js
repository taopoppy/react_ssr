import App, { Container } from 'next/app'
import Head from 'next/head'
import 'antd/dist/antd.css'
import Layout from '../components/layout'
import { Provider } from 'react-redux'
import testHoc from '../lib/with-redux.js'
import PageLoading from '../components/PageLoading'
import Router from 'next/router'
import axios from 'axios'

class MyApp extends App {
	state = {
		loading: false
	}

	startLoading = () => {
		this.setState({
			loading: true
		})
	}

	stopLoading = () => {
		this.setState({
			loading: false
		})
	}

	componentDidMount() {
		Router.events.on('routeChangeStart',this.startLoading)
		Router.events.on('routeChangeComplete',this.stopLoading)
		Router.events.on('routeChangeError',this.stopLoading)
	}

	componentWillUnmount() {
		Router.events.off('routeChangeStart',this.startLoading)
		Router.events.off('routeChangeComplete',this.stopLoading)
		Router.events.off('routeChangeError',this.stopLoading)
	}

	static async getInitialProps(ctx) {
		const { Component } = ctx
		// 1. MyApp.getInitialProps中能通过Component拿到具体要渲染页面的getInitialProps方法
		// 2. 执行具体页面的getInitialProps方法，将数据传入给render当中要渲染的具体页面
		let pageProps
		if(Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx)
		}
		return {
			pageProps
		}
	}

	// 重新定义render方法
	render(){
		const { Component, pageProps,reduxStore } = this.props // 3. Component实际就是要渲染的页面

		return (
			<Container>
				<Head>
					<title>Taopoppy</title>
				</Head>
				<Provider store={reduxStore}>
					{this.state.loading? <PageLoading />: null}
					<Layout>
							<Component {...pageProps}/> {/* 4. 将数据传入给要渲染的组件或者页面*/}
					</Layout>
				</Provider>
			</Container>
		)
	}
}

export default testHoc(MyApp)