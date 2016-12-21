import React, { Component } from 'react';
import withScriptjs from 'react-google-maps/lib/async/withScriptjs';
import { withGoogleMap, GoogleMap, DirectionsRenderer, Marker } from 'react-google-maps';
import { find, filter, isEmpty, minBy, maxBy } from 'lodash';

import './Map.css';

const Wrapper = withScriptjs(
  withGoogleMap(
    props => (
      <GoogleMap
        zoom={props.zoom}
        center={props.center} >
        {props.markers.map(
          marker => (
            <Marker
              {...marker}
              />
          )
        )}
        {props.directions && <DirectionsRenderer directions={props.directions} />}
      </GoogleMap>
    )
));

class Map extends Component {
  constructor(props) {
    super(props)

    this.state = {
      routes: [],
      stands: [],
      match: {},
      matchedRoutes: [],
      markers: [],
      center: { lat: 23.8103461, lng: 90.4124999 },
      zoom: 13,
      directions: false
    }

    // this.handleScroll = this.handleScroll.bind(this);
  }


  componentDidMount() {

    const that = this;

    if(isEmpty(this.state.routes)){
      fetch("https://traffic-server-wlwimimhdy.now.sh"+'/api/routes')
        .then(
          response => {
            response.json().then(
              data => {
                that.setState({routes: data});
              }
            )
          }
        );
    }

    if(isEmpty(this.state.stands)){
      fetch("https://traffic-server-wlwimimhdy.now.sh"+'/api/stand_geocodes')
        .then(
          response => {
            response.json().then(
              data => {
                that.setState({stands: data});
              }
            )
        })
    }

    // fetch('/api/stand_names')
    //   .then(
    //     (response) => {
    //       response.json().then(function(data) {
    //         data.forEach(
    //           stand => {
    //             let concat = stand['stand_id']+', '
    //
    //             const url = 'https://maps.googleapis.com/maps/api/geocode/json?address='
    //                               + stand['stand_name']
    //                               +'+Dhaka+Bangladesh&key=AIzaSyBrGCQCxJ01kfSgX4vE0x5xLpCRrotDWdA';
    //             fetch(url)
    //               .then(
    //                 (response) => {
    //                   response.json().then(function(data) {
    //                     console.log(concat+data.results[0].geometry.location.lat+', '+data.results[0].geometry.location.lng);
    //                     })
    //                   });
    //           });
    //         });
    //       });
  }

  componentWillReceiveProps(nextProps){
    if(this.props.stand.id !== nextProps.stand.id){
      const that = this;

      const stand = find(this.state.stands, stand => {
        return stand['stand_id'] === nextProps.stand.id
      })

      if(stand){
        this.setState({
          center: { lat: stand.lat, lng: stand.lng},
          zoom: 16
        })
      }

      const routeMatch = find(that.state.routes, route => {
        return route['stand_id'] === nextProps.stand.id
      });

      if(routeMatch){
        that.setState({match: routeMatch});

        setTimeout(
          () => {
            const routeList = filter(that.state.routes, route =>{
              return route['bus_id'] === that.state.match['bus_id'];
            });

            if(routeList){
              that.setState({matchedRoutes: routeList});
              this.mapRoute();
            }
          }, 1000
        )
      }
    }
  }

  mapRoute(){

    const markers = this.state.matchedRoutes.map(
      route => {
        const coordObj = find(this.state.stands,
          stand => (route['stand_id'] === stand['stand_id'])
        )
        return {
          position: { lat: coordObj.lat, lng: coordObj.lng},
          key: 'route'+route['route_id'],
          defaultAnimation: 2
        }
      }
    )

    const DirectionsService = new window.google.maps.DirectionsService();

    const min = minBy(this.state.matchedRoutes, route => route['route_id']);
    const max = maxBy(this.state.matchedRoutes, route => route['route_id']);

    const origin = find(this.state.stands,
      stand => {
        return (stand['stand_id'] === min['stand_id'])
      }
    );

    const destination = find(this.state.stands,
      stand => {
        return (stand['stand_id'] === max['stand_id'])
      }
    );
    console.log(origin);
    console.log(max);

    DirectionsService.route({
      origin: { lat: origin.lat, lng: origin.lng},
      destination: { lat: destination.lat, lng: destination.lng},
      travelMode: window.google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        this.setState({
          directions: result,
          markers: markers
        });
      } else {
        console.error(`error fetching directions ${result}`);
      }
    });
  }

  render() {
    return (
      <Wrapper
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyBGWC-0YWTB0eOwZnezM2Ke6wLVR1PRBjI"

        loadingElement={
          <div className="Map--loading">
            <div className="Map--loading-placeholder"></div>
          </div>
        }

        containerElement={
          <div className="Map" />
        }

        mapElement={
          <div className="Map--element" />
        }

        markers={this.state.markers}
        directions={this.state.directions}
        center={this.state.center}
        zoom={this.state.zoom}
      />)
  }
}

export default Map;
