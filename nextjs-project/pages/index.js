import Link from 'next/link'
import axios from 'axios'

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


Index.getInitialProps = async () => {
	const result = 	await axios
	.get('/github/search/repositories?q=react')
	.then(resp => console.log(resp))
	return {
		data: result.data
	}
}

export default Index