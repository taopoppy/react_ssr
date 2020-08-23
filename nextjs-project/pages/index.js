import api from '../lib/api.js'
import { Button, Icon,Tabs } from 'antd'
import getConfig from 'next/config'
import { connect } from 'react-redux'
import Repo from '../components/Repo'
import Router, { withRouter } from 'next/router'
import { useEffect } from 'react'
import LRU from 'lru-cache'
import { cacheArray } from '../lib/repo-basic-cache'

const { publicRuntimeConfig } = getConfig()

const cache = new LRU({
	maxAge:1000 * 60 * 2  // 2分钟
})

// let cachedUserRepos, cachedUserStatedRepos

const isServer = typeof window === 'undefined'

function Index({userRepos, userStaredRepos,user,router}) {

	const tabKey = router.query.key || "1"
	const handletabChange = (activeKey) => {
		Router.push(`/?key=${activeKey}`)
	}

	useEffect(()=> {
		if(!isServer) {
			// cachedUserRepos = userRepos
			// cachedUserStatedRepos = userStaredRepos
			// const timeout = setTimeout(()=> {
			// 	cachedUserRepos = null
			// 	cachedUserStatedRepos = null
			// }, 1000*10)
			if (userRepos) {
				cache.set('userRepos',userRepos)
			}
			if (userStaredRepos) {
				cache.set('userStaredRepos',userStaredRepos)
			}
		}
	}, [userRepos,userStaredRepos])

	useEffect(()=> {
		if(!isServer) {
			if (userRepos && userStaredRepos) {
				cacheArray(userRepos)
				cacheArray(userStaredRepos)
			}
		}
	})


	if (!user || !user.id) {
		return <div className="root">
			<p>还没有登录哦，请登录</p>
			<Button type="primary" href={publicRuntimeConfig.OAUTH_URL}>点击登录</Button>
			<style jsx>{`
				.root {
					height:400px;
					display:flex;
					flex-direction: column;
					justify-content:center;
					align-items: center;
				}
			`}</style>
		</div>
	}

	return (
		<div className="root">
			<div className="user-info">
				<img src={user.avatar_url} alt="user avatar" className="avatar"/>
				<span className="login">{user.login}</span>
				<span className="name">{user.name}</span>
				<span className="bio">{user.bio || '暂无'}</span>
				<p className="email">
					<Icon type="mail" style={{marginRight:10}}></Icon>
					<a href={`mailto:${user.email}`}>{user.email || '暂无'}</a>
				</p>
			</div>
			<div className="user-repos">
				<Tabs defaultActiveKey={tabKey} onChange={handletabChange} animated={false}>
					<Tabs.TabPane	tab="你的仓库" key="1">
						{
							(userRepos && userRepos.length)?userRepos.map(repo => <Repo key={repo.id} repo={repo}/>): null
						}
					</Tabs.TabPane>
					<Tabs.TabPane	tab="你关注的仓库" key="2">
						{
							(userStaredRepos && userStaredRepos.length)?userStaredRepos.map(repo => <Repo key={repo.id} repo={repo}/>): null
						}
					</Tabs.TabPane>
				</Tabs>
			</div>
			<style jsx>{`
				.root {
					display: flex;
					align-items: flex-start;
					padding: 20px;
				}
				.user-info {
					width: 200px;
					margin-right: 40px;
					flex-shrink: 0;
					display: flex;
					flex-direction: column;
				}
				.login {
					font-weight: 800;
					font-size: 20px;
					margin-top:20px;
				}
				.name {
					font-size: 16px;
					color: #777;
				}
				.bio {
					margin-top: 20px;
					color: #333;
				}
				.avatar {
					width: 100%;
					border-radius:5px;
				}
				.user-repos {
					flex-grow: 1;
				}
			`}</style>
		</div>
	)
}

Index.getInitialProps = async ({ctx, reduxStore}) => {

	const user = reduxStore.getState().user
	if (!user || !user.id) {
		return {}
	}

	// 只有客户端的时候才会复用
	if (!isServer) {
		// if (cachedUserRepos && cachedUserStatedRepos) {
		// 	return {
		// 		userRepos:cachedUserRepos,
		// 		userStaredRepos: cachedUserStatedRepos
		// 	}
		// }
		if (cache.get('userRepos') && cache.get('userStaredRepos')) {
			return {
				userRepos:cache.get('userRepos'),
				userStaredRepos: cache.get('userStaredRepos')
			}
		}
	}

	const userRepos = await api.request({
		url: '/user/repos'
	},ctx.req, ctx.res)

	const userStaredRepos = await api.request({
		url: '/user/starred'
	},ctx.req, ctx.res)


	return {
		userRepos: (userRepos && userRepos.data)? userRepos.data: {},
		userStaredRepos: (userStaredRepos && userStaredRepos.data)? userStaredRepos.data: {},
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.user
	}
}


export default withRouter(connect(mapStateToProps)(Index))