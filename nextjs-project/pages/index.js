import Link from 'next/link'


function Index() {
	return (
		<Link href="/detail">
			<a>Index</a>
		</Link>
	)
}


Index.getInitialProps = () => {
	return new Promise(resolve => {
		setTimeout(()=> {
			resolve({})
		},1000)
	})
}

export default Index