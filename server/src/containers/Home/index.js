import React,{Fragment} from 'react'
import {  connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { getHomeList } from './store/action'
import style from './style.css'
import withStyles from '../../withStyle'

class Home extends React.Component {
	componentDidMount() {
		if(!this.props.list.length) {
			this.props.getHomeList()
		}
	}
	getHomeList() {
		const { list } = this.props
		return list.map(item => <div key={item.hash} className={style.item}>{item.title}</div>)
	}
	render() {
		return (
			<Fragment>
				<Helmet>
					<title>这是taopoppy的SSR的home页面-丰富多彩的资讯</title>
					<meta name="description" content="这是taopoppy的SSR的home页面-丰富多彩的资讯" ></meta>
				</Helmet>
				<div className={style.container}>
					{
						this.getHomeList()
					}
				</div>
			</Fragment>
		)
	}
}

const mapStateToProps = (state) => ({
	list: state.home.newsList,
})

const mapDispatchToProps = (dispatch) => ({
	getHomeList() {
		dispatch(getHomeList())
	}
})

const ExportHome = connect(mapStateToProps,mapDispatchToProps)(withStyles(Home, style))

ExportHome.loadData = (store) => {
	// 这个函数，负责在服务器渲染之前，把这个路由需要的数据提前加载好
	return store.dispatch(getHomeList())
}

export default ExportHome