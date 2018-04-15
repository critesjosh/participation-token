import React, {Component} from 'react'
import QrReader from 'react-qr-reader'
import axios from 'axios'
import Eth from 'ethjs'
import validate from '../../utils/validate'
import { connect } from 'react-redux';

import { PageHeader, Button, FormControl } from 'react-bootstrap'

const mapStateToProps = function(state){
  return {
    account: state.addAccount.account,
    web3: state.addWeb3.web3
  }
}

class Scanner extends Component {
    
    constructor(props) {
      super(props);
      this.state = {
        delay: 500,
        result: null,
        text: null
      }
    }
    
    scanAddress(){
      const web3 = this.props.web3
      
      web3.currentProvider.scanQRCode().then(data => {
        alert(data)
        this.setState({
          result: data
        })
        
        this.postData(data)
      })
      .catch(err => {
        console.log(err)
      })
    }
    
    textChanged(e){
      this.state.text = e.target.value
    }
    
    handleSubmit(e){
      const address = this.state.text
      const from = this.context.store.getState().addAccount.account
      
      console.log(validate.ethAddress(address))

      if(!validate.ethAddress(address)) return
      
      this.postData((address, from))
    }
    
    parseData(data){
        const web3 = this.context.store.getState().addWeb3.web3
        const from = this.context.store.getState().addAccount.account
        
        const startIndexOfAddress = data.indexOf("ethereum:") + 9
        const address = data.substr(startIndexOfAddress, 42)
        
        this.postData(address, from)
    }
    
    postData(ethAddress, admin){
        
        var url = window.location.hostname
        
        if(this.state.result == ethAddress) return
        
        axios.post('https://' + url + '/api/addattendee/' + this.props.match.params.eventId, {
            attendeeEthAddress: ethAddress
        })
        .then(res => {
            console.log(res)
            this.setState({
              result: ethAddress
            })
        })
        .catch(error => {
          console.log(error)
        })
    }
  
    render() {
        return(
              <div>
                <PageHeader>Scan a QR code</PageHeader>
                <Button bsStyle="primary" onClick={this.scanAddress.bind(this)}>Scan</Button>
                <p>{this.state.result}</p>
                
                <h2>Or...copy and paste</h2>
                <FormControl
                    type="text"
                    onChange={this.textChanged.bind(this)}
                    placeholder="Enter attendee eth address here..."
                  />
                <br/><br/>                  
                <Button bsStyle="primary" onClick={this.handleSubmit.bind(this)}>Submit text address</Button>

              </div>
            )
    }
}

export default connect(mapStateToProps)(Scanner)