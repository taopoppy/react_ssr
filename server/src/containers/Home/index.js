import React from 'react'
import Header from '../../components/Header'
import {  connect } from 'react-redux'
import { getHomeList } from './store/action'

class Home extends React.Component {
	componentDidMount() {
		if(!this.props.list.length) {
			this.props.getHomeList(false)
		}
	}
	getHomeList() {
		const { list } = this.props
		return list.map(item => <div key={item.hash}>{item.title}</div>)
	}
	render() {
		return (
			<div>
				<Header />
				{
					this.getHomeList()
				}
				<button onClick={()=> {alert('click')}}>click</button>
			</div>
		)
	}
}

Home.loadData = (store) => {
	// 这个函数，负责在服务器渲染之前，把这个路由需要的数据提前加载好
	return store.dispatch(getHomeList(true))
}


const mapStateToProps = (state) => ({
	list: state.home.newsList,
})

const mapDispatchToProps = (dispatch) => ({
	getHomeList() {
		dispatch(getHomeList())
	}
})

export default connect(mapStateToProps,mapDispatchToProps)(Home)