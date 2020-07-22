import App, { Container } from 'next/app'
import Head from 'next/head'
import 'antd/dist/antd.css'
import Layout from '../components/layout'
import MyContext from '../lib/my-context'
import { Provider } from 'react-redux'
import store from '../store/store.js'
import testHoc from '../lib/test-hoc.js'


class MyApp extends App {

	static async getInitialProps({Component, ctx}) {
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
		const { Component, pageProps } = this.props // 3. Component实际就是要渲染的页面

		return (
			<Container>
				<Head>
					<title>Taopoppy</title>
				</Head>
				<Layout>
					<Provider store={store}>
						<MyContext.Provider value="test context">
							<Component {...pageProps}/> {/* 4. 将数据传入给要渲染的组件或者页面*/}
						</MyContext.Provider>
					</Provider>
				</Layout>
			</Container>
		)
	}
}

export default testHoc(MyApp)