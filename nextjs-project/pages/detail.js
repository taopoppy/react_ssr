import Link from 'next/link'


function Detail() {
	return (
		<Link href="/">
			<a>Detail</a>
		</Link>
	)
}

Detail.getInitialProps = () => {
	return new Promise(resolve => {
		setTimeout(()=> {
			resolve({})
		},2000)
	})
}


export default Detail