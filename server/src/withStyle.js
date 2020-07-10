import React from 'react'

// 这个函数，是生成高阶组件的函数
// 这个函数返回一个组件
export default (DecoratedComponent,style) => {
	// 返回的这个组件，叫做高阶组件
	return class NewComponent extends React.Component {
		componentWillMount() {
			if(this.props.staticContext){
				this.props.staticContext.css.push(style._getCss())
			}
		}

		render() {
			return <DecoratedComponent {...this.props}/>
		}
	}
}