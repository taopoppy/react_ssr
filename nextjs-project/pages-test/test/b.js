import React, {
	useReducer,
	useState,
	memo,
	useMemo,
	useCallback,
	useRef,
} from 'react'

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


function TextB() {
	const [count, dispatchCounter] = useReducer(countReducer, 0)
	const [name, setName] = useState('taopoppy')

	const config = useMemo(()=> ({
		text: `count is ${count}`,
		color: count > 3 ? 'red' : 'blue',
	}), [count])

	// 第一种写法
	const handleButtonClick = useCallback(
		()=>dispatchCounter({type:'add'}),
		[dispatchCounter]
	)

	const countRef = useRef() // useRef()每次返回的都是同一个对象
	countRef.current = count

	const handleAlertButtonClick = function(){
		setTimeout(() => {
			alert(countRef.current)
		}, 2000);
	}

	return(
		<div>
			<input value={name} onChange={e => setName(e.target.value)} />
			<Child
				config={config}
				onButtonClick={handleButtonClick}
			/>
			<button onClick={handleAlertButtonClick}>alert count</button>
		</div>
	)
}

const Child = memo(function Child({onButtonClick, config}) {
	console.log('child render')
	return (
		<button onClick={onButtonClick} style={{color:config.color}}>
			{config.text}
		</button>
	)
})

export default TextB