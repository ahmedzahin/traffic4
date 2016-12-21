import React, { Component } from 'react';
import { isEqual, isEmpty } from 'lodash';

import Search from './Search';

import './Sidebar.css';


class Sidebar extends Component {
    constructor(props) {
        super(props)

        this.state = {
          places: [],
          current: '',
          options: []
        }

        this.handleSetList = this.handleSetList.bind(this);
    }

    componentDidMount(){
      const route = 'stand_names';

      fetch('https://traffic-server-ehmassnwsa.now.sh/api/'+route)
          .then(
            (response) => {
              response.json().then(
                data => {
                  console.log(data);
                  this.setState({
                    places: data,
                    all: data
                  });
                });
            }
          ).catch(function(err) {
            this.setState({
              placeFetchStatus: "ERROR"
            })
          });
    }

    componentWillReceiveProps(nextProps){
      if(!isEqual(this.props.options, nextProps.options)){
        this.setState({options: nextProps.options})
      }
    }

    handleSetList(list){
      if(isEmpty(list)){
        this.setState({places: this.state.all})
      }else{
        this.setState({places: list})        
      }
    }

    render() {
        return (
            <div className="Sidebar">
              <Search
                places={this.state.places}
                setList={this.handleSetList}
              />
              <ul className="Sidebar--list">
                {
                  this.state.places.map(
                    value =>
                      <li key={value['stand_id']}
                          onClick={() => {
                            this.setState({current: value['stand_id']})
                            return this.props.route(value)
                          }}>
                        <h2>{value['stand_name']}</h2>
                        <ul>
                          {
                            (this.state.current === value['stand_id']) &&
                              this.state.options.map(
                                option => <li key={option.id}
                                              onClick={() => {
                                                return this.props.select(option.id);
                                              }}>
                                              <h3>{option.bus}</h3></li>)
                          }
                        </ul>
                      </li>
                  )
                }
              </ul>
            </div>
        )
    }
}

export default Sidebar;
