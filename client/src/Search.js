import React, { Component } from 'react';
// import Fuse from 'fuse.js';

import './Search.css';

class Search extends Component {
  constructor(props){
    super(props);

    this.state = {
      counter: 1,
      list: []
    }

  }

  componentDidMount() {

    const route = 'bus_names';

    fetch("/api/"+route)
        .then(
          (response) => {
            response.json().then(function(data) {
              // console.log(data);
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
      <div className="Search">

      </div>
    )
  }
}
export default Search;
