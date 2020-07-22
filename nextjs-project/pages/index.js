import Router from 'next/router'
import store from '../store/store.js'
import { connect } from 'react-redux';


const events = [
	'routeChangeStart',
	'routeChangeComplete',
	'routeChangeError',
	'beforeHistoryChange',
	'hashChangeStart',
	'hashChangeComplete'
]

function makeEvent(type) {
	return (...args) => {
		console.log(type, ...args)
	}
}

events.forEach(event => {
	Router.events.on(event, makeEvent(event))
})

const Index = ({counter,username,rename,addcount}) => {
	return (
		<>
			<span>Index</span>
			<a>Class A</a>
			<p>Count: {counter}</p>
			<p>Username: {username}</p>
			<input value={username} onChange={(e) => rename(e.target.value)}/><br/>
			<button onClick={() => addcount(counter)}>add counter</button>
		</>
	)
}

// mapStateToProps是把redux中的state(mapStateToProps函数参数)变成组件当中的props
const mapStateToProps = (state) => {
	return {
		counter: state.counter.count,  // 把store当中counter模块中的count数据传入到了Index组件中的props.counter中
		username: state.user.username  // 把store当中user模块中的username数据传入到了Index组件中的props.username中
	}
}

// mapDispatchToProps是把store.dispatch方法挂载到组件的props上
const mapDispatchToProps  = (dispatch) => {
	return {
		addcount: (num)=> dispatch({type: 'ADD', num}),
		rename:(name) => dispatch({type: 'UPDATE_USERNAME',name})
	}
}


export default connect(mapStateToProps,mapDispatchToProps)(Index)