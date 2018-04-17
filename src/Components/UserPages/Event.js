import React, {Component} from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import { PageHeader, Button, ListGroup, ListGroupItem } from 'react-bootstrap'

class Event extends Component {
    
    constructor(props) {
      super(props);
      this.state = {
        event: {},
        eventId: this.props.match.params.eventId
      }
      this.getEvent()
    }
    
    
    getEvent(){
        var url = window.location.hostname
        axios.get('https://' + url + '/api/event/' + this.state.eventId)
        .then((res) => {
            this.setState({
                event: res.data
            })
            console.log(res.data)
        })
    }

    render() {
        var attendees = []
        if(this.state.event.attendees){
            attendees = this.state.event.attendees.map((attendee, index) => {
                            var link
                            if(attendee.userId){
                                link = "/user/" +attendee.userId
                            } else {
                                link = "/listusers"
                            }
                            return (
                                <ListGroupItem key={index}>
                                    <Link to={link}>{attendee.ethAddress}</Link>
                                </ListGroupItem>
                                )
                        })
        }
        
        var admins = []
        if(this.state.event.admins){
            admins = this.state.event.admins.map((admin, index) => {
                            return <ListGroupItem key={index}>{admin}</ListGroupItem>
                        })
        }
        
        return(
              <div>
                <h1>Event Id: {this.state.eventId}</h1>
                <div>
                    <p>Title: {this.state.event.title}</p>
                    <p>Attendees:</p>
                    <ListGroup>
                        {attendees}
                    </ListGroup>
                    <p>Admins:</p>
                    <ListGroup>
                        {admins}
                    </ListGroup>
                    <p>Created At: {this.state.event.eventCreated}</p>
                    <p>Token Amount: {this.state.event.tokenAmount}</p>
                    <Button bsStyle="primary">
                        <Link to={"/event/" + this.state.eventId + "/scan"} style={{color: 'white'}}>Scan people</Link>
                    </Button>
                    <Button bsStyle="primary">
                        <Link to={"/unsignedAttendees/" + this.state.eventId} style={{color: 'white'}}>Get Attendees to sign</Link>
                    </Button>                    
                </div>
              </div>
            )
    }
}


export default Event