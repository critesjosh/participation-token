import { combineReducers } from 'redux'
import { ADD_WEB3, ADD_ACCOUNT } from '../actions'

const initialState = {
    web3: {},
    account: null
}

function addWeb3(state = {}, action) {
  switch (action.type) {
    case ADD_WEB3:
      return Object.assign({}, state, {
        web3: action.object
      })
    default:
      return state
  }
}

function addAccount(state = "", action) {
    switch (action.type) {
    case ADD_ACCOUNT:
      return Object.assign({}, state, {
        account: action.string
      })
    default:
      return state
  }
}

const ptokenApp = combineReducers({
  addWeb3,
  addAccount
})

export default ptokenApp