import Router,{ withRouter } from "next/router";
import api from '../lib/api'
import { Row, Col,List } from 'antd'


const LANGUAGE = ['Javascript','HTML','CSS','Typescript','Java','Rust',]
const SORT_TYPES = [
	{ name: 'Best Match'}, // 综合排序
	{ name: 'Most Starts', value: 'stars', order: 'desc'}, // 最多的stars
	{ name: 'Fewest Starts', value: 'stars', order: 'asc'},// 最少的stars
	{ name: 'Most Forks', value: 'forks', order: 'desc'},  // 最多的forks
	{ name: 'Fewest Forks', value: 'forks', order: 'asc'} // 最少的forks
]



// 被选中的样式
const selectedItemStyle = {
	borderLeft: '2px solid #e36209',
	fontWeight: 100
}


/**
 * sort:排序方式
 * order:排序顺序
 * lang：仓库的项目开发主语言
 * page：分页页面
 */
function Search({router,repos}) {
	const { sort, order, lang, query} = router.query

	const handlelanguageChange = (language) => {
		Router.push({
			pathname: '/search',
			query: {
				query,
				lang:language,
				sort,
				order
			}
		})
	}

	const handleSortChange = (sort) => {
		Router.push({
			pathname: '/search',
			query: {
				query,
				lang,
				sort:sort.value,
				order:sort.order
			}
		})
	}


	return (
		<div className="root">
			<Row gutter={20}>
				<Col span={6}>
					<List
						bordered
						header={<span className="list-header">语言</span>}
						style={{marginBottom:20,marginTop:10}}
						dataSource={LANGUAGE}
						renderItem={item => {
							const selected = lang === item
							return (
								<List.Item key={item} style={selected? selectedItemStyle: null}>
									<a onClick={()=> handlelanguageChange(item)}>{item}</a>
								</List.Item>
							)
						}}
					/>
					<List
						bordered
						header={<span className="list-header">排序</span>}
						dataSource={SORT_TYPES}
						renderItem={item => {
							let selected = false
							if (item.name === 'Best Match' && !sort) {
								selected = true
							} else if (item.value === sort && item.order === order) {
								selected = true
							}
							return (
								<List.Item key={item.name} style={selected? selectedItemStyle: null}>
									<a onClick={()=> handleSortChange(item)}>{item&&item.name}</a>
								</List.Item>
							)
						}}
					/>
				</Col>
			</Row>
		</div>
	)
}

Search.getInitialProps = async ({ctx})=> {
	const { query, sort, lang, order, page } = ctx.query

	if(!query) {
		return {
			repos: {
				total_count: 0
			}
		}
	}

	let queryString = `?q=${query}`
	if (lang) queryString += `+language:${lang}`
	if (sort) queryString += `&sort=${sort}$order=${order||'desc'}`
	if (page) queryString += `&page=${page}`


	const result = await api.request({
		url:`/search/repositories${queryString}`,
	},ctx.req,ctx.res)

	return {
		repos: (result && result.data)? result.data: {}
	}
}


export default withRouter(Search)