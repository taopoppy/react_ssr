import withRepoBasic from '../../components/with-repo-basic'
import api from '../../lib/api'
import dynamic from 'next/dynamic'
import { Spin } from 'antd'

const MDRenderer = dynamic(
	()=> import('../../components/MarkdownRenderer'),
	{
		loading: () => <div>
			<Spin size="small" />
			<Spin />
			<Spin size="large" />
		</div>
	}
)

function Detail({readme}){
	return <MDRenderer content={readme.content}  isBase64={true}/>
}

Detail.getInitialProps = async ({ctx}) => {
	const { owner, name } = ctx.query

	const readmeResp = await api.request({
		url: `/repos/${owner}/${name}/readme`
	},ctx.req, ctx.res)

	return {
		readme: readmeResp.data
	}
}

export default withRepoBasic(Detail,'index')