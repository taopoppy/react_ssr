import Document, { Html, Head, Main, NextScript} from 'next/document'
import { ServerStyleSheet } from 'styled-components'

function withLog(Comp) {
	return (props) => {
		console.log(props)
		return <Comp {...props} />
	}
}

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const sheet = new ServerStyleSheet()
		// 记录原始的renderPage方法
		const originalRenderPage = ctx.renderPage

		try {
			// 给ctx.renderPage定义新的方法
			ctx.renderPage = () => originalRenderPage({
				enhanceApp: App =>(props) => sheet.collectStyles(<App {...props}/>)
			})

			const props = await Document.getInitialProps(ctx)
			return {
				...props,
				styles: <>{props.styles}{sheet.getStyleElement()}</>
			}
		} finally {
			sheet.seal()
		}
	}

	render() {
		return (
			<Html>
				<Head>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}
export default MyDocument