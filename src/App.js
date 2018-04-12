import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Provider } from 'react-redux'

import { Panel }  from 'react-bootstrap'

import Navigation from './Components/Nav'
import Home from "./Components/Home"
import AddUser from './Components/AddUser'
import ListEvents from './Components/ListEvents'
import ListUsers from './Components/ListUsers'
import NewEvent from './Components/AddEvent'
import Event from './Components/Event'
import Scanner from './Components/Scanner'
import User from './Components/User'
import SignAttendees from './Components/SignAttendees'

import getWeb3 from './utils/getWeb3'

import { createStore } from 'redux'
import ptokenApp from './reducers/index.js'
const store = createStore(ptokenApp)

import { addWeb3, addAccount } from './actions'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      account: null,
      isAdmin: false
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      store.dispatch(addWeb3(results.web3))

      // Instantiate contract once web3 provided.
      this.getAccount(results.web3)
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }
  
  getAccount(web3){
    web3.eth.getAccounts((err, accounts) => {
      if(err) console.log(err)
      store.dispatch(addAccount(accounts[0]))
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    //const contract = require('truffle-contract')
    // const simpleStorage = contract(SimpleStorageContract)
    // simpleStorage.setProvider(this.state.web3.currentProvider)


  }

  render() {
    return (
      <Provider className="App" store={store}>
        <div>
          <Router>
            <div>
              <Navigation/>
              <div className="container">
                <Route exact path="/"    component={Home}/>
                <Route exact path="/adduser"    component={AddUser}/>
                <Route exact path="/listevents" component={ListEvents}/>
                <Route exact path="/users"      component={ListUsers}/>
                <Route exact path="/user/:userId"  component={User}/>                    
                <Route exact path="/newevent"   component={NewEvent}/>
                <Route exact path="/event/:eventId"      component={Event}/>
                <Route exact path="/event/:eventId/scan" component={Scanner}/>
                <Route exact path="/unsignedAttendees/:eventId" component={SignAttendees}/>
              </div>
            </div>
          </Router>
        </div>
      </Provider>
    );
  }
}

export default App
