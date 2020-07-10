import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { actions } from './store/index.js'
import style from './style.css'
import withStyles from '../../withStyle'

class Header extends React.Component {
	render() {
		const { login, handleLogin, handleLogout } = this.props
		return (
			<div className={style.container}>
				<Link to='/' className={style.item}>首页</Link>
				{/* <Link to='/translation/123' className={style.item}>前端跳转到一个不存在的页面</Link> */}
				{
					login ?
						<Fragment>
							<Link to='/translation' className={style.item}>翻译列表</Link>
							<div className={style.item} onClick={handleLogout}>退出</div>
						</Fragment>:
						<div onClick={handleLogin} className={style.item}>登录</div>
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

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(Header, style))