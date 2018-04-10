import React, {Component} from 'react'
import axios from 'axios'

import { PageHeader, FormControl, FormGroup, Button } from 'react-bootstrap'

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
    
    handleSubmit (e) {

        var url = window.location.hostname
        
        axios.post('https://' + url + '/api/newevent', {
            title: this.state.title
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
                  <p>TODO: add token amount for the event</p>
                 <FormControl
                    type="text"
                    placeholder="Enter token amount"
                  />
                </FormGroup>
                <Button bsStyle="primary" onClick={this.handleSubmit.bind(this)}>Submit</Button> 
                
              </div>
            
            )
    }
}


export default AddEvent