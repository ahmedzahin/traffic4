import React, {Component} from 'react';

import Map from './Map';
import Sidebar from './Sidebar';

import './App.css';

class App extends Component{
  constructor(props){
    super(props);

    this.state = {
      selected: ''
    };

    this.handleRoute = this.handleRoute.bind(this);
  }

  handleRoute(placeData){
    this.setState({
      selected: {
        id: placeData['stand_id'],
        name: placeData['stand_name']
      }
    });
  }

  render(){
    return (
      <div>
          <Map stand={this.state.selected}/>
          <Sidebar route={this.handleRoute}/>
      </div>)
  }

}

export default App;
