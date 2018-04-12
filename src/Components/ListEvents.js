import React, {Component} from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import { PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap'

import Event from './Event'

class ListEvents extends Component {
    
    constructor(props) {
      super(props);
      this.state = {
        events: []
      };
      this.getEvents()
    }
    
    
    getEvents(){
        var url = window.location.hostname

        axios.get('https://' + url + '/api/listevents')
        .then((res) => {
            this.setState({
                events: res.data
            })
        })
                

    }

    render() {
        var links = this.state.events.map((event, index) => {
            return(
                <ListGroupItem key={ index }>
                    <Link  to={"/event/" + event._id}>{event.title}</Link>
                </ListGroupItem>
                )

        })

        return(
              <div>
                <PageHeader>Events List</PageHeader>
                <div>
                    <ListGroup>
                        {links}
                    </ListGroup>
                </div>
              </div>
            )
    }
}


export default ListEvents