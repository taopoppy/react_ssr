import React from 'react'

class NotFound extends React.Component {
	componentWillMount() {
		const { staticContext } = this.props
		staticContext && (staticContext.NOT_FOUND = true)
		// 上面的代码和下面的代码效果一样
		// if(this.props.staticContext) {
		// 	this.props.staticContext.NOT_FOUND = true
		// }
	}

	render() {
		return <div>404，sorry，page not found</div>
	}
}


export default NotFound
