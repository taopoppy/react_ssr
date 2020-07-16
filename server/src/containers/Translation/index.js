import React, { Fragment } from 'react'
import {  connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { getTranslationList } from './store/action'
import { Redirect } from 'react-router-dom'
import style from './style.css'
import withStyle from '../../withStyle'

class Translation extends React.Component {
	componentDidMount() {
		if(!this.props.list.length) {
			this.props.getTranslationList()
		}
	}
	getList() {
		const { list } = this.props
		return list.map(item => <div key={item.id} className={style.item}>{item.title}</div>)
	}
	render() {
		if(this.props.login) {
			return (
				<Fragment>
					<Helmet>
						<title>这是taopoppy的SSR的Translation页面-丰富多彩的翻译</title>
						<meta name="description" content="这是taopoppy的SSR的home页面-丰富多彩的资讯" ></meta>
					</Helmet>
					<div className={style.container}>
						{
							this.getList()
						}
					</div>
				</Fragment>
			)
		}else {
			return <Redirect to='/'/> // 跳转到首页
		}
	}
}

const mapStateToProps = (state) => ({
	list: state.translation.translationList,
	login: state.header.login // 拿到登录状态
})

const mapDispatchToProps = (dispatch) => ({
	getTranslationList() {
		dispatch(getTranslationList())
	}
})

const ExportTranslation = connect(mapStateToProps,mapDispatchToProps)(withStyle(Translation,style))

ExportTranslation.loadData = (store) => {
	return store.dispatch(getTranslationList())
}

export default ExportTranslation