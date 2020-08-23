import { useEffect } from 'react'
import Repo from './Repo'
import Link from 'next/link'
import api from '../lib/api'
import { withRouter } from 'next/router'
import { get,cache } from '../lib/repo-basic-cache'

function makeQuery(queryObject) {
	const query = Object.entries(queryObject)
	.reduce((result, entry) => {
		result.push(entry.join('='))
		return result
	}, []).join('&')

	return `?${query}`
}

const isServer = typeof window === 'undefined'


export default function(Comp,type = 'index') {
	function withDetail({repoBasic, router, ...rest}) {
		const query = makeQuery(router.query)

		useEffect(()=> {
			if(!isServer) {
				cache(repoBasic)
			}
		})

		return (
			<div className="root">
				{/* 基础信息*/}
				<div className="repo-basic">
					<Repo repo={repoBasic}/>
					<div className="tabs">
						{
							type === 'index'? <span className="tab">Readme</span>:
							<Link href={`/detail${query}`}><a className="tab index">Readme</a></Link>
						}
						{
							type === 'issues'? <span className="tab">Issues</span>:
							<Link href={`/detail/issues${query}`}><a className="tab issues">Issues</a></Link>
						}
					</div>
				</div>

				{/* 具体Read页面*/}
				<div><Comp {...rest}/></div> {/* 除了withDetail本身的一些属性，其他全部要传入具体的组件Comp当中*/}
				<style jsx>{`
					.root {
						padding-top: 20px;
					}
					.repo-basic {
						padding: 20px;
						border: 1px solid #eee;
						margin-bottom: 20px;
						border-radius: 5px;
					}
					.tab + .tab {
						margin-left: 20px;
					}
				`}</style>
			</div>
		)
	}

	withDetail.getInitialProps = async (context) => {
		const { ctx } = context
		const { owner, name } = ctx.query

		const full_name = `${owner}/${name}`

		// 如果传入HOC的具体组件有getInitialProps方法就要执行
		// 然后拿到数据，作为withRepoBasic组件的getInitialProps方法返回数据的一部分
		let pageData = {}
		if (Comp.getInitialProps) {
			// 注意这里传入的是完整的context
			pageData = await Comp.getInitialProps(context)
		}

		if(get(full_name)) {
			return {
				repoBasic: get(full_name),
				...pageData
			}
		}
		const repoBasic = await api.request({
			url: `/repos/${owner}/${name}`
		},ctx.req, ctx.res)

		return {
			repoBasic: repoBasic.data,
			...pageData
		}
	}

	return withRouter(withDetail)
}