import { useState, useCallback } from 'react'
import { Layout, Icon, Input, Avatar,Tooltip,Dropdown, Menu } from 'antd'
import Container from './Container.jsx'
import Link from "next/link";
const {Header, Content, Footer} = Layout

import { connect } from 'react-redux'
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

import { logout } from '../store/store.js'
import axios from 'axios'
import { withRouter } from 'next/router'

const githubIconStyle = {
	color: 'white',
	fontSize: 40,
	display: 'block',
	paddingTop: 10,
	marginRight: 20
}

const footerStyle = {
	textAlign: 'center'
}

function MyLayout ({children, user, logout, router}) {
	const urlQuery = router.query && router.query.query
	const [search, setSearch] = useState(urlQuery || '')

	const handleSearchChange = useCallback((event)=> {
		setSearch(event.target.value)
	}, [setSearch])

	const handleOnSearch = useCallback(() => {
		router.push(`/search?query=${search}`)
	}, [search])

	const handleLogout = useCallback(() => {
		logout()
	}, [logout])

	const handleGotoOAuth = useCallback((e)=> {
		e.preventDefault()
		axios.get(`/prepare-auth?url=${router.asPath}`)
			.then(resp=> {
				if(resp.status === 200) {
					location.href = publicRuntimeConfig.OAUTH_URL
				} else {
					console.log('prepare auth failed', resp)
				}
			})
			.catch(err=> {
				console.log('prepare auth failed', err)
			})
	},[])


	const userDropDown = (
		<Menu>
			<Menu.Item>
				<a href="javascript:void(0)" onClick={handleLogout}>
					登出
				</a>
			</Menu.Item>
		</Menu>
	)

	return (
		<Layout>
			<Header>
				<Container renderer={<div className="header-inner" />}>
					<div className="header-left">
						<div className="logo">
							<Link href="/">
								<Icon type="github" style={githubIconStyle}></Icon>
							</Link>
						</div>
						<div>
							<Input.Search
								placeholder="搜索仓库"
								value={search}
								onChange={handleSearchChange}
								onSearch={handleOnSearch}
							></Input.Search>
						</div>
					</div>
					<div className="header-right">
						<div className="user">
							{
								user && user.id ? (
									<Dropdown overlay={userDropDown}>
										<a href="/">
											<Avatar size={40} src={user.avatar_url}/>
										</a>
									</Dropdown>
								) : (
									<Tooltip title="登录">
										{/* <a href={publicRuntimeConfig.OAUTH_URL} onClick={handleGotoOAuth}> */}
										<a href={`/prepare-auth?url=${router.asPath}`}>
											<Avatar size={40} icon="user"/>
										</a>
									</Tooltip>
								)
							}
						</div>
					</div>
				</Container>
			</Header>
			<Content>
				<Container>
					{children}
				</Container>
			</Content>
			<Footer style={footerStyle}>
				Develop by Taopoppy @<a href="mailto:taopoppy@163.com">taopoppy@163.com</a>
			</Footer>
			<style jsx>{`
				.header-inner {
					display: flex;
					justify-content: space-between;
				}
				.header-left {
					display: flex;
					justify-content: flex-start;
				}
			`}</style>
			<style jsx global>{`
				#__next {
					height: 100%;
				}
				.ant-layout {
					min-height: 100%;
				}
				.ant-layout-header {
					padding-left: 0;
					padding-right: 0;
				}
				.ant-layout-content {
					background: #fff
				}
			`}</style>
		</Layout>
	)
}

const mapStateToProps = (state) => {
	return {
		user: state.user
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		logout: () => {
			dispatch(logout())
		}
	}
}


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(MyLayout))