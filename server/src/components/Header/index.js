import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { actions } from './store/index.js'

class Header extends React.Component {
	render() {
		const { login, handleLogin, handleLogout } = this.props
		return (
			<div>
				<Link to='/'>首页</Link><br/>
				<Link to='/translation/123'>前端跳转到一个不存在的页面</Link><br/>
				{
					login ?
						<Fragment>
							<Link to='/translation'>翻译列表</Link>
							<div onClick={handleLogout}>退出</div>
						</Fragment>:
						<div onClick={handleLogin}>登录</div>
				}
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	login: state.header.login
})

const mapDispatchToProps = (dispatch) => ({
	handleLogin() {
		dispatch(actions.login())
	},
	handleLogout() {
		dispatch(actions.logout())
	}
})

export default connect(mapStateToProps,mapDispatchToProps)(Header)