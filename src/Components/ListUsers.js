import React, {Component} from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import { ListGroup, ListGroupItem, PageHeader } from 'react-bootstrap'

class ListUsers extends Component {
    
    constructor(props) {
      super(props);
      this.state = {
        users: []
      };
      this.getUsers()
    }
    
    getUsers(){
       var url = window.location.hostname
        
        axios.get('https://' + url + '/api/users')
        .then((res) => {
            this.setState({
                users: res.data
            })
        })
    }

    render() {
        var users = this.state.users.map((user, index) => {
            return (
                <ListGroupItem key={ index }>
                    <Link  to={"/user/" + user._id}>{user.ethAddress}</Link>
                </ListGroupItem>
                )
        })            
        
        return(
              <div>
                  <PageHeader>Registered Users</PageHeader>
                  <ListGroup>
                    {users}
                  </ListGroup>
              </div>
            )
    }
}


export default ListUsers