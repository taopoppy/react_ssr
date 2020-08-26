import { useState,useCallback,useRef } from 'react'
import { Select,Spin } from 'antd' // 1. 引入Select组件
import api from '../lib/api'
import debounce from 'lodash/debounce'

// 2. 创建选择器的下拉组件
const Option = Select.Option

// 10.外部传入的获取value的onChange方法
function SearchUser({onChange,value}) {
	const lastFetchIdRef = useRef(0) // 7. {current: 0}这样一个对象
	const [ fetching, setFetching ] = useState(false)
	const [ options, setOptions ] = useState([])

	// 4. fetchUser不依赖fetching和options，只依赖他们对应的修改方法，所以第二个参数不用传
	// 4. 使用debounce在用户输入反馈超过500毫秒才去执行，否则每输入一个字母都要请求数据
	const fetchUser = useCallback(debounce(value => {
		lastFetchIdRef.current += 1
		const fetchId = lastFetchIdRef.current

		setFetching(true)
		setOptions([])

		api.request({
			url: `/search/users?q=${value}`
		}) // 5. 这里不需要传递ctx.req和ctx.res，因为一定是在浏览器中用户点击才会触发的
		.then(resp => {
			// 6. 这里说明一下，因为每次请求的时候是异步的，所以当网速比较慢的时候，在请求的过程中有可能
			// 6. 又发了一个新的请求，所以要把每次闭包中的fetchId和lastFetchIdRef.current进行对比
			// 6. 如果不一样，说明第一次请求还没返回的时候又有了新请求，此时的第一次的请求就可以废弃
			if (fetchId !== lastFetchIdRef.current) {
				return
			}
			const data = resp.data.items.map(user => ({
				text: user.login,
				value: user.login
			}))

			setFetching(false)
			setOptions(data)
		})
	}, 500),[])

	// 9. 你在给出的下拉选择列表中选择了某个value
	const handleChange = (value) => {
		setOptions([])
		setFetching(false)
		onChange(value)
	}

	return (
		<Select
			style={{ width:200 }}
			showSearch={true}
			notFoundContent={fetching ? <Spin size="small" />: <span>nothing</span>}
			filterOption={false}
			placeholder="创建者"
			allowClear={true}
			value={value} // 11. 外部传入的value要显示在这里
			onChange={handleChange}  // 8. 在下拉框中选择了某个数据
			onSearch={fetchUser} // 3. 输入的时候请求服务端的数据
		>
			{
				// 2.1 下拉展示的部分
				options.map(op => (
					<Option value={op.value} key={op.value}>{op.text}</Option>
				))
			}
		</Select>
	)
}

export default SearchUser