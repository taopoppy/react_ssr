import { withRouter} from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
// import moment from 'moment'


const Comp = dynamic(import('../components/comp'))

// 一个带有样式的h1标签
const Title = styled.h1`
	color: yellow;
	font-size: 40px
`


const A = ({ router,name,time }) => (
	<>
		<Title>this is title { time}</Title>
		<Comp />
		<Link href="#AAA"><a>A {router.query.id} </a></Link>
		<Link href="#BBB"><a className="link">A {name} </a></Link>
		<style jsx>
			{`
				a { color: blue; }
				.link { color: red;}
			`}
		</style>
		<style jsx global>
			{`
				a { color: red;}
			`}
		</style>
	</>
)

A.getInitialProps = async (ctx) => {
	const moment = await import('moment')

	const promise = new Promise((resolve) => {
		setTimeout(()=>{
			resolve({
				name: 'Jokcy',
				time: moment.default(Date.now() - 60 * 1000).fromNow()
			})
		},1000)
	})

	return await promise
}


export default withRouter(A)