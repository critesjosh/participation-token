import React, {Component} from 'react'
import { connect } from 'react-redux';

import axios from 'axios'

import { PageHeader, FormControl, FormGroup, Button } from 'react-bootstrap'

const mapStateToProps = function(state){
  return {
    account: state.addAccount.account,
    web3: state.addWeb3.web3
  }
}

class AddEvent extends Component {
    
    constructor(props) {
        super(props)
    
        this.state = {
            title: null,
            tokenAmount: null
        }
    }
    
    titleChanged(e) {
        this.setState({
            title: e.target.value
        })
    }
    
    tokenAmountChanged(e){
        const tokenAmount = e.target.value.trim()
        
        if(tokenAmount.match(/[^0-9]/)){
            alert("Token amount must be a numeric value.")
            return
        }
        
        this.setState({
            tokenAmount: tokenAmount
        })
    }
    
    handleSubmit (e) {

        var url = window.location.hostname
        
        axios.post('https://' + url + '/api/newevent', {
            title: this.state.title,
            creator: this.props.account,
            tokenAmount: this.state.tokenAmount
        })
        .then(res => {
            console.log(res)
        })
    }
    
    render() {
        return(
            
              <div>
                <PageHeader>Add a new event</PageHeader>
                
                <FormGroup
                  controlId="formBasicText"
                >
                    <p>Event Title</p>
                    <FormControl
                        type="text"
                        onChange={this.titleChanged.bind(this)}
                        placeholder="Enter event title here..."
                    />
                    <br></br>
                    <p>Token Amount</p>
                 <FormControl
                    type="text"
                    placeholder="Enter token amount"
                    onChange={this.tokenAmountChanged.bind(this)}
                 />
                </FormGroup>
                <Button bsStyle="primary" onClick={this.handleSubmit.bind(this)}>Submit</Button> 
                
              </div>
            
            )
    }
}

export default connect(mapStateToProps)(AddEvent)
