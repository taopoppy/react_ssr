import React,{ useState, useEffect, useLayoutEffect, useReducer } from 'react'

class MyCount extends React.Component {
	state = {
		count : 0
	}

	componentDidMount() {
		this.interval = setInterval(()=> {
			this.setState({
				count: this.state.count + 1
			})
		}, 1000)
	}

	componentWillUnmount() {
		if(this.interval) {
			clearInterval(this.interval)
		}
	}

	render() {
		return(
			<span>{this.state.count}</span>
		)
	}
}


function countReducer(state, action) {
	switch (action.type) {
		case 'add':
			return state + 1
		case 'minus':
			return state - 1
		default:
			return state
	}
}


function MyCountFunc() {
	// const [count, setCount] = useState(0)
	const [count, dispatchCounter] = useReducer(countReducer, 0)
	const [name, setName] = useState('taopoppy')

	// useEffect(()=> {
	// 	const interval = setInterval(()=> {
	// 		// setCount(c=> c + 1)
	// 		dispatchCounter({type: 'add'})
	// 	}, 1000)

	// 	return () => clearInterval(interval)
	// }, [])


	// useLayoutEffect(()=>{
	// 	console.log('layout effect invoked')
	// 	return ()=> console.log('layout effect deteched')
	// },[count])

	useEffect(()=>{
		console.log('effect invoked')
		return ()=> console.log('effect deteched')
	},[count])

	return(
		<>
			<button onClick={()=> dispatchCounter({type: 'add'})}>{count}</button>
			<input value={name} onChange={(e)=>setName(e.target.value)}></input>
		</>
	)
}


export default MyCountFunc