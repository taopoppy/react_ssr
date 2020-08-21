import { withRouter } from "next/router";
import api from '../lib/api'
import { Row, Col,List, Pagination } from 'antd'
import { memo,isValidElement } from 'react'
import Link from 'next/link'
import Repo from '../components/Repo'


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

function noop() {}

const per_page = 20

const FilterLink = memo(({name, query, lang, sort, order,page}) => {
	let queryString = `?query=${query}`
	if (lang) queryString += `&lang=${lang}`
	if (sort) queryString += `&sort=${sort}&order=${order||'desc'}`
	if (page) queryString += `&page=${page}`
	queryString += `&per_page=${per_page}`

	return (
		<Link href={`/search${queryString}`}>
			{isValidElement(name) ? name: <a>{name}</a>}
		</Link>
	)
})


/**
 * sort:排序方式
 * order:排序顺序
 * lang：仓库的项目开发主语言
 * page：分页页面
 */
function Search({router,repos}) {
	const { ...querys } = router.query
	const { lang, sort, order,page } = router.query

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
									{ selected ? <span>{item}</span> :
										<FilterLink
											{...querys}
											lang={item}
											name={item}
										/>
									}
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
									{ selected ? <span>{item.name}</span> :
										<FilterLink
											{...querys}
											sort={item.value}
											order={item.order}
											name={item.name}
										/>
									}
								</List.Item>
							)
						}}
					/>
				</Col>
				<Col span={18}>
					<h3 className="repos-title">{repos.total_count} 条结果</h3>
					{
						repos.items.map(repo => <Repo repo={repo} key={repo.id} />)
					}
					<div className="pagination">
						<Pagination
							pageSize={per_page}
							current={Number(page) || 1}
							total={1000}
							onChange={noop}
							itemRender={(page, type ,ol) => {
								const p = type === 'page'? page: type ==='prev' ? page - 1 :page + 1
								const name = type === 'page'? page: ol
								return <FilterLink {...querys} page= {p} name={name}/>
							}}
						/>
					</div>
				</Col>
			</Row>
			<style jsx>{`
				.root {
					padding: 20px 0;
				}
				.list-header {
					font-weight: 800;
					font-size: 16px;
				}
				.repos-title {
					border-bottom: 1px solid #eee;
					font-size: 24px;
					line-height: 50px;
				}
				.pagination {
					padding: 20px;
					text-align:center;
				}
			`}</style>
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
	if (sort) queryString += `&sort=${sort}&order=${order||'desc'}`
	if (page) queryString += `&page=${page}`
	queryString += `&per_page=${per_page}`

	const result = await api.request({
		url:`/search/repositories${queryString}`,
	},ctx.req,ctx.res)

	return {
		repos: (result && result.data)? result.data: {}
	}
}


export default withRouter(Search)