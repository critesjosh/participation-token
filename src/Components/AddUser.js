import React, {Component} from 'react'
import axios from 'axios'

import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'

class AddUser extends Component {
    
      constructor(props) {
        super(props)
    
        this.state = {
            ethAddress: null,
            emailAddress: null
        }
      }
    
     emailChanged(e) {
        this.setState({ emailAddress: e.target.value })
      }
      
      ethAddressChanged(e){
          this.setState({ ethAddress: e.target.value })
      }

    
    handleSubmit (e) {
        var ethAddress = this.state.ethAddress
        var emailAddress = this.state.emailAddress
        var url = window.location.hostname
        
        axios.post('https://' + url + '/api/newuser', {
            ethAddress: ethAddress,
            emailAddress: emailAddress
        })
        .then(res => {
            console.log(res)
        })
    }
    
    render() {
        return(
            
              <div>
                <h1>Add yourself</h1>

                <FormGroup
                  controlId="formBasicText"
                >
                  <ControlLabel>Enter the Ethereum address at which you would like to receive Aqui Tokens</ControlLabel>
                  <p>Enter Eth Address</p>
                  <FormControl
                    type="text"
                    onChange={this.ethAddressChanged.bind(this)}
                    placeholder="Enter ETH Address here"
                  />
                  <br></br>
                  <p>Enter Email Address:</p>
                 <FormControl
                    type="text"
                    onChange={this.emailChanged.bind(this)}
                    placeholder="Enter email address here"
                  />
                </FormGroup>
                <Button bsStyle="primary" onClick={this.handleSubmit.bind(this)}>Submit</Button> 

              </div>
            
            )
    }
}


export default AddUser