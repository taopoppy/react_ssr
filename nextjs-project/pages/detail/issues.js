import withRepoBasic from '../../components/with-repo-basic'
import { Avatar, Button, Select, Spin } from 'antd'
import api from '../../lib/api'
import { useState,useCallback,useEffect } from 'react'
import dynamic from 'next/dynamic'
import { getLastUpdated } from '../../lib/utils'
import SearchUser from '../../components/SearchUser'

const MdRenderer = dynamic(()=> import('../../components/MarkdownRenderer'))

const CACHE = {}

// issue具体信息的组件
function IssueDetail({ issue }) {
	return (
		<div className="root">
			<MdRenderer content={issue.body}/>
			<div className="actions">
				<Button href={issue.html_url} target="_blank">打开Issues讨论页面</Button>
			</div>
			<style jsx>{`
				.root {
					background: #fefefe;
					padding: 20px;
				}
				.actions {
					text-align: right;
				}
			`}</style>
		</div>
	)
}


// 每个issue组件
function IssueItem({issue}) {
	const [showDetail, setShowDetail] = useState(false)

	const toggleShowDetail = useCallback(() => {
		// 重点：使用useCallback的方式更新state,不依赖setShowDetail,逃过了闭包
		setShowDetail(detail => !detail)
	},[])

	return (
		<div>
			<div className="issue">
				<Button
					type="primary"
					size="small"
					style={{position: 'absolute',right:10,top:10}}
					onClick={toggleShowDetail}
				>
					{ showDetail ? '隐藏': '查看' }
				</Button>
				<div className="avatar">
					<Avatar src={issue.user.avatar_url} shape="square" size={50}/>
				</div>
				<div className="main-info">
					<h6>
						<span>{issue.title}</span>
						{
							issue.labels.map(label => {
								<Label label={label} key={label.id}/>
							})
						}
					</h6>
					<p className="sub-info">
						<span>Updated at {getLastUpdated(issue.updated_at)}</span>
					</p>
				</div>
				<style jsx>{`
					.issue {
						display: flex;
						position: relative;
						padding: 10px;
					}
					.issue:hover {
						background: #fafafa;
					}
					.issue + .issue {
						border-top: 1px solid #eee;
					}
					.main-info > h6 {
						max-width: 600px;
						font-size: 16px;
						padding-right: 40px;
					}
					.avatar {
						margin-right: 20px;
					}
					.sub-info {
						margin-bottom: 0;
					}
					.sub-info> span + span {
						display: inline-block;
						margin-left: 20px;
						font-size: 12px;
					}
				`}</style>
			</div>
		{ showDetail? <IssueDetail issue={issue}/>: null}
		</div>
	)
}

function Label({ label }) {
	return (
		<>
			<span className="label" style={{backgroundColor:`#${label.color}`}}>{label.name}</span>
			<style jsx>{`
				.label {
					display: inline-block;
					line-height: 20px;
					margin-left: 15px;
					padding: 3px 10px;
					border-radius:3px;
					font-size: 14px;
				}
			`}</style>
		</>
	)
}


const Option = Select.Option

// 拼装query的方法
function makeQuery(creator, state, labels) {
	let creatorStr = creator? `creator=${creator}`:''
	let stateStr = state? `state=${state}`:''
	let labelsStr = ''
	if (labels && labels.length > 0) {
		labelsStr = `labels=${labels.join(',')}`
	}
	const arr = []
	if (creatorStr) arr.push(creatorStr)
	if (stateStr) arr.push(stateStr)
	if (labelsStr) arr.push(labelsStr)

	return `?${arr.join('&')}`
}

const isServer = typeof window === 'undefined'
function Issues({initialIssues, labels,owner, name}){
	const [creator, setCreator ] = useState() // 查询条件creator
	const [state, setState ] = useState() 		// 查询条件state
	const [label, setLabel] = useState([])	  // 查询条件label

	const [issues, setIssues] = useState(initialIssues) // issues搜索结果数组

	const [fetching, setFetching] = useState(false) // 动画

	useEffect(()=> {
		if(!isServer){
			CACHE[`${owner}/${name}}`] = labels
		}
	},[labels,name,owner])


	const handleCreatorChange = useCallback((value) => {
		setCreator(value)
	}, [])

	const handleStateChange = useCallback((value) => {
		setState(value)
	}, [])

	const handleLabelChange = useCallback((value) => {
		setLabel(value)
	}, [])

	const handleSearch = useCallback(() => {
		setFetching(true)
		api.request({
			url: `/repos/${owner}/${name}/issues${makeQuery(creator,state,label)}`,
		})
		.then(resp => {
			setIssues(resp.data)
			setFetching(false)
		})
		.catch(err=> {
			console.error(err)
			setFetching(false)
		})
	},[owner,name,creator,state,label])


	return (
		<div className="root">
			<div className="search">
				{/*  用户搜索 */}
				<SearchUser onChange={handleCreatorChange} value={creator} />

				{/* Issues状态搜索 */}
				<Select
					placeholder="状态"
					onChange={handleStateChange}
					value={state}
					style={{width:200,marginLeft:20}}
				>
					<Option value="all">all</Option>
					<Option value="open">open</Option>
					<Option value="closed">closed</Option>
				</Select>

				{/* 仓库labels搜索 */}
				<Select
					mode="multiple"
					placeholder="Label"
					onChange={handleLabelChange}
					value={label}
					style={{flexGrow: 1,marginLeft:20, marginRight: 20}}
				>
					{
						labels.map(la => {<Option value={la.name} key={la.id}>{la.name}</Option>})
					}
				</Select>
				<Button type="primary" onClick={handleSearch} disabled={fetching}>搜索</Button>
			</div>

			{
				fetching ? <div className="loading"><Spin /></div> :
				<div className="issues">
					{
						issues.map(issue=> <IssueItem issue={issue} key={issue.id} />)
					}
				</div>
			}
			<style jsx>{`
				.issues {
					border: 1px solid #eee;
					border-radius: 5px;
					margin-bottom:20px;
					margin-top:20px;
				}
				.search {
					display: flex;
				}
				.loading {
					height: 400px;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			`}</style>
		</div>
	)
}

Issues.getInitialProps = async ({ctx}) => {
	const { owner,name } = ctx.query

	const full_name = `${owner}/${name}`

	const fetchs = await Promise.all([
		// 获取仓库所有的issues
		await api.request({
			url: `/repos/${owner}/${name}/issues`
		},ctx.req, ctx.res),

		// 获取仓库所有的label
		CACHE[full_name]? Promise.resolve({data:CACHE[full_name]}) :
		await api.request({
			url: `/repos/${owner}/${name}/labels`
		},ctx.req, ctx.res)
	])

	return {
		initialIssues: fetchs[0].data,
		labels: fetchs[1].data,
		owner,
		name
	}
}

export default withRepoBasic(Issues,'issues')