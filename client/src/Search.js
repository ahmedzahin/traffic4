import React, { Component } from 'react';
import { isEqual } from 'lodash';
import Fuse from 'fuse.js';

import './Search.css';

class Search extends Component {
  constructor(props){
    super(props);

    this.state = {
      counter: 1,
      list: new Fuse(this.props.places, {keys: ['stand_name']}),
      value: ''
    }

    this.handleOnChange = this.handleOnChange.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(!isEqual(this.props.places, nextProps.places)){
      this.setState({list: new Fuse(nextProps.places, {keys: ['stand_name']})})
    }
  }

  handleOnChange(event){
    this.props.setList(this.state.list.search(event.target.value));
    this.setState({
      value: event.target.value
    })
  }

  render() {
    return (
      <div className="Search">
        <input value={this.state.value} onChange={this.handleOnChange}/>
      </div>
    )
  }
}
export default Search;
