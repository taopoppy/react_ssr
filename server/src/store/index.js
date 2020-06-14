import { createStore, applyMiddleware,combineReducers,compose  } from 'redux'
import thunk from 'redux-thunk'
import { reducer as homeReducer } from '../containers/Home/store/index.js'
import { reducer as headerReducer } from '../components/Header/store/index.js'
import { reducer as translationReducer } from '../containers/Translation/store/index.js' 
import clientAxios from '../client/request'
import serverAxios from '../server/request'

const reducer = combineReducers({
	home: homeReducer,
	header: headerReducer,
	translation:translationReducer
})


export const getStore = (req)=> {
	return createStore(reducer,applyMiddleware(thunk.withExtraArgument(serverAxios(req))))
}

export const getClientStore = () => {
	const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

	const enhancer = composeEnhancers(
		applyMiddleware(thunk.withExtraArgument(clientAxios)),
	);


	const defaultState = window.context.state
	return createStore(reducer,defaultState,enhancer)
}
