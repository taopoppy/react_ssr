import Link from 'next/link'
import api from '../lib/api.js'

function Index() {

	return (
		<>
			<Link href="/detail">
				<a>Detail的链接</a>
			</Link>
			<p>Index</p>
		</>
	)
}


Index.getInitialProps = async ({ctx}) => {
	const result = await api.request({
		url: '/search/repositories?q=react'
	},ctx.req, ctx.res)


	return {
		data: (result && result.data)? result.data: {}
	}
}

export default Index