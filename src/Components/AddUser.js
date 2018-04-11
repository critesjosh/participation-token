import React, {Component} from 'react'
import axios from 'axios'
var ethUtil = require('ethereumjs-util')
import { connect } from 'react-redux';

import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'

const mapStateToProps = function(state){
  return {
    account: state.addAccount.account,
    web3: state.addWeb3.web3
  }
}

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
        var emailAddress = this.state.emailAddress
        
        var url = window.location.hostname
        
        const signer = this.props.account
        const web3 = this.props.web3 
        
        const text = "This is a verification message for the server to validate your address."
        const msg = ethUtil.bufferToHex(new Buffer(text, 'utf8'))
        const params = [msg, signer]
        const method = 'personal_sign'
        
        web3.currentProvider.sendAsync({
          method,
          params,
          signer,
        }, function (err, result) {
          if(err) console.log(err)
          if (result.error) return console.error(result.error)
          
          axios.post('https://' + url + '/api/newuser', {
              ethAddress: signer,
              emailAddress: emailAddress,
              sig: result.result
          })
          .then(res => {
              console.log(res)
          })
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
                    value={this.props.account}
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

export default connect(mapStateToProps)(AddUser)