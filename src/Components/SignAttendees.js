import React, {Component} from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import { PageHeader, Button, ListGroup, ListGroupItem } from 'react-bootstrap'

class SignAttendees extends Component {
    
    constructor(props) {
      super(props);
      this.state = {
        unsignedAttendees: [],
        eventId: this.props.match.params.eventId
      }
      this.getAttendees()
    }
    
    
    getAttendees(){
        var url = window.location.hostname
        var numberSigsRequired = 2
        
        axios.get('https://' + url + '/api/unsignedAttendees/' + this.state.eventId + "/" + numberSigsRequired)
        .then((res) => {
            console.log(res)
            this.setState({
                unsignedAttendees: res.data
            })
        })
    }
    
    signAttendee(attendee){
        const url = window.location.hostname
        
        const signer = this.context.store.getState().addAccount.account
        const web3 = this.context.store.getState().addWeb3.web3
        
        console.log(web3)
        
        const msg = attendee.ethAddress
        const params = [msg, signer]
        const method = "personal_sign"

        web3.currentProvider.sendAsync({method, params, signer}, (err, result) => {
            if(err) console.log(err)
            
            axios.post('https://' + url + '/api/signAttendee/' + this.state.eventId, {
                signedData: result,
                msg: msg
            }).then(res => {
                console.log(res)
                
                // remove the address that got the signature from the display
                const index = this.state.unsignedAttendees.indexOf(msg)
                var newArray = this.state.unsignedAttendees.splice(index, 1)
                this.setState({
                    unsignedAttendees: newArray
                })
            })
        })
    }

    render() {
//        var attendees = []

        var attendees = this.state.unsignedAttendees.map((attendee, index) => {
                        return (
                            <ListGroupItem key={index}>
                                <Button onClick={this.signAttendee.bind(this, attendee)}>Sign {attendee.ethAddress}</Button>
                            </ListGroupItem>
                            )
                    })
        
        return(
              <div>
                <h1>Event Id: {this.state.eventId}</h1>
                <div>
                    <p>Attendees:</p>
                    <ListGroup>
                        {attendees}
                    </ListGroup>
                </div>
              </div>
            )
    }
}


SignAttendees.contextTypes = {
    store: React.PropTypes.object
}

export default SignAttendees