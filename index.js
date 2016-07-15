import React from 'react'
import ReactDom from 'react-dom'
import { createStore, applyMiddleware } from 'redux' 
import { createEpicMiddleware } from 'redux-observable'
import { connect, Provider } from 'react-redux'

import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/delay'

const pingReducer = (state = { isPinging: false }, action) => {
  switch (action.type) {
    case 'PING':
      return { isPinging: true };
    case 'PONG':
      return { isPinging: false };
    default:
      return state;
  }
}

const pingEpic = action$ => action$.filter(action => action.type === 'PING')
  .delay(1000) 
  .mapTo({ type: 'PONG' })

const epicMiddleware = createEpicMiddleware(pingEpic);

const store = createStore(pingReducer, applyMiddleware(epicMiddleware))

const PingComponent = ({dispatch, isPinging}) => {
  return (
    <div>
      <div>isPinging: {isPinging.toString()}</div>
      <div>
        <button onClick={ (e) => dispatch({type: 'PING'}) }>Dispatch Ping</button>
      </div>
    </div>
  )
}

// Build App
const App = () => {
  let PingContainer = connect( state => state )(PingComponent)
  return (
    <Provider store={store}>
      <PingContainer />
    </Provider>
  )
}

// Render App
ReactDom.render(
  <App />,
  document.body.appendChild(document.createElement('div'))
)
