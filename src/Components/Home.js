import React, {Component} from 'react'
import { Image, PageHeader, Button } from 'react-bootstrap'

import logo from '../images/logo.png'

class Home extends Component {
    render() {
        return(
              <div className="homepage">
                <PageHeader>Aqui Token<Image className="logo" src={logo}/></PageHeader>
                <p>
                        This is an application to track the attendance of group members at events.
                </p>
                <p>The basic idea is that event attendees will get tokens for attending events. 
                Tokens are not useful for anything beyond signifying attendance.</p>
                <h2>How it works</h2>
                <p>When you first visit this site, you need to register an ethereum address and an email
                address. The ETH address allows us to issue you tokens. The email address allows us to 
                message you when action is needed on your end.</p>
                <p>Users that attend events will show event administrator a unique identifier,
                that the administrator will sign. Their attendance at the event is logged in a database.
                Attendance will later be verified by another group administrator, ver</p>
                <p>Using this applicaiton, user can check thier attendance at events. 
                    Group administrators can sign attendees into events as well as get 
                    attendees information that still need to be added.</p>
                <p>This applicaiton is building using Web 3.0 technologies, as such you will need access to tools popular in the Ethereum ecosystem.</p>
                <Button><a target="_blank" href="https://josh934.typeform.com/to/SwkV6k">Connect with us</a></Button>
              
              </div>
            )
    }
}


export default Home