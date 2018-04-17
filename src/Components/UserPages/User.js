import React, {Component} from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'


class Event extends Component {
    
    constructor(props) {
      super(props);
      this.state = {
        user: {},
        userId: this.props.match.params.userId
      }
      this.getUser()
    }
    
    
    getUser(){
        var url = window.location.hostname
        axios.get('https://' + url + '/api/user/' + this.state.userId)
        .then((res) => {
            this.setState({
                user: res.data
            })
        })
    }

    render() {
        var admins = []
        if(this.state.user.admins){
            admins = this.state.user.admins.map((admin, index) => {
                            return <li key={index}>{admin}</li>
                        })
        }
        
        var events = []
        if(this.state.user.events){
            events = this.state.user.events.map((event, index) => {
                            return <li key={index}>{event}</li>
                        })
        }
        
        return(
              <div>
                <h1>This is the event page for User id: {this.state.user._id}</h1>
                <div>
                    <p>eth address: {this.state.user.ethAddress}</p>
                    <p>Admins:</p>
                    <ul>
                        {admins}
                    </ul>
                    <p>Events:</p>
                    <ul>
                        {events}
                    </ul>
                </div>
              </div>
            )
    }
}


export default Event