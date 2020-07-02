import { withRouter} from 'next/router'
import Link from 'next/link'

const A = ({ router,name }) => <div>
	<Link href="#AAA"><a> AAA {router.query.id}</a></Link>
	<Link href="#BBB"><a> BBB {name}</a></Link>
</div>

A.getInitialProps = async () => {
	const promise = new Promise((resolve) => {
		setTimeout(()=>{
			resolve({
				name: 'Jokcy'
			})
		},1000)
	})

	return await promise
}


export default withRouter(A)