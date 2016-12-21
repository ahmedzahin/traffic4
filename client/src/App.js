import React, {Component} from 'react';
import { find } from 'lodash';

import Map from './Map';
import Sidebar from './Sidebar';

import './App.css';

class App extends Component{
  constructor(props){
    super(props);

    this.state = {
      selectedStand: '',
      selectedRoute: {},
      options: []
    };

    this.handleRoute = this.handleRoute.bind(this);
    this.handlesetRouteOptions = this.handlesetRouteOptions.bind(this);
    this.handleRouteSelect = this.handleRouteSelect.bind(this);
  }

  handleRoute(placeData){
    this.setState({
      selectedStand: {
        id: placeData['stand_id'],
        name: placeData['stand_name']
      }
    });
  }

  handlesetRouteOptions(routes){
    this.setState({
      options: routes
    })
  }

  handleRouteSelect(route){
    const selected = find(this.state.options, option => (option.id === route))
    this.setState({selectedRoute: selected})
  }

  render(){
    return (
      <div>
          <Map
            stand={this.state.selectedStand}
            route={this.state.selectedRoute}
            setRouteOptions={this.handlesetRouteOptions}
          />
          <Sidebar
            route={this.handleRoute}
            options={this.state.options}
            select={this.handleRouteSelect}
          />
      </div>)
  }

}

export default App;
