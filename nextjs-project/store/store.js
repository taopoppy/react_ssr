import { createStore,combineReducers,applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

const initialState = {
	count : 0
}

const ADD = 'ADD'

export function add(num) {
	return {
		type: ADD,
		num
	}
}

function addAsync(num) {
	return (dispatch) =>{
		setTimeout(() => {
			dispatch(add(num)) // 派发对象的action
		},500)
	}
}

function countReducer(state = initialState,action) {
	switch (action.type) {
		case ADD:
			return { count: state.count + (action.num || 1) }
		default:
			return state
	}
}



const userInitialState = {
	age :25,
	username: 'taopoppy'
}

const UPDATE_USERNAME = 'UPDATE_USERNAME'
function userReducer(state = userInitialState,action) {
	switch (action.type) {
		case UPDATE_USERNAME:
			return {
				...state,
				username: action.name
			}
		default:
			return state
	}
}


const allReducers = combineReducers({
	counter: countReducer,
	user: userReducer
})


// store.dispatch({ type: ADD })
// store.dispatch(add(4))
// store.dispatch(addAsync(9))

// store.dispatch({ type:UPDATE_USERNAME,name:'wanglu' })


// 返回一个创建store的函数
export default function initializeStore(state) {
	const store = createStore(
		allReducers,
		Object.assign({},{
			counter: initialState,
			user:userInitialState
		},state),
		composeWithDevTools(applyMiddleware(ReduxThunk))
	)
	return store
}