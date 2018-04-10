import React, {Component} from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import { Navbar, Nav, NavItem } from 'react-bootstrap'

class Navigation extends Component {
  
    constructor(props) {
      super(props);
      this.state = {
      }
    }
    
    render() {
        return(
          <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/">Aqui Token</Link>
              </Navbar.Brand>
            </Navbar.Header>
            <Link to="/adduser">Register</Link>
            <Link to="/listevents">List Events</Link>
            <Link to="/users">List Users</Link>
            <Link to="/newevent">New Event</Link>
          </Navbar>
        )
    }
}


export default Navigation