import React,{ useState, useEffect } from 'react'

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

function MyCountFunc() {
	const [count, setCount] = useState(0)
	const [name, setName] = useState('taopoppy')

	useEffect(()=> {
		const interval = setInterval(()=> {
			setCount(c=> c + 1)
			setName(c => c + '1')
		}, 1000)

		return () => clearInterval(interval)
	}, [])

	return(
		<>
			<span>{count}</span>
			<span>{name}</span>
		</>
	)
}


export default MyCountFunc