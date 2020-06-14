import React from 'react'
import {  connect } from 'react-redux'
import { getTranslationList } from './store/action'
import { Redirect } from 'react-router-dom'

class Translation extends React.Component {
	componentDidMount() {
		if(!this.props.list.length) {
			this.props.getTranslationList()
		}
	}
	getList() {
		const { list } = this.props
		return list.map(item => <div key={item.id}>{item.title}</div>)
	}
	render() {
		if(this.props.login) {
			return (
				<div>
					{
						this.getList()
					}
					<button onClick={()=> {alert('click')}}>click</button>
				</div>
			)
		}else {
			return <Redirect to='/'/> // 跳转到首页
		}
	}
}
Translation.loadData = (store) => {
	return store.dispatch(getTranslationList())
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

export default connect(mapStateToProps,mapDispatchToProps)(Translation)