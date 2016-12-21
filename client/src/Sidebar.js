import React, { Component } from 'react';

import Search from './Search';

import './Sidebar.css';


class Sidebar extends Component {
    constructor(props) {
        super(props)

        this.state = {
          places: []
        }
    }

    componentDidMount(){
      const route = 'stand_names';

      fetch("https://traffic-server-wlwimimhdy.now.sh"+"/api/"+route)
          .then(
            (response) => {
              response.json().then(
                data => {
                  this.setState({places: data});
                });
            }
          ).catch(function(err) {
            this.setState({
              placeFetchStatus: "ERROR"
            })
          });
    }

    render() {
        return (
            <div className="Sidebar">
              <Search />
              <ul className="Sidebar--list">
                {
                  this.state.places.map(
                    value =>
                      <li key={value['stand_id']} onClick={() => {return this.props.route(value)}}>
                        {value['stand_name']}
                      </li>
                  )
                }
              </ul>
            </div>
        )
    }
}

export default Sidebar;
