import React, { Component } from 'react';
import withScriptjs from 'react-google-maps/lib/async/withScriptjs';
import { withGoogleMap, GoogleMap, DirectionsRenderer, Marker} from 'react-google-maps';
import { find, filter, isEmpty, minBy, maxBy, isEqual } from 'lodash';

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
      buses: [],
      currentRoutes: [],
      markers: [],
      center: { lat: 23.8103461, lng: 90.4124999 },
      zoom: 13,
      directions: false
    }

    // this.handleScroll = this.handleScroll.bind(this);
    this.mapRoute = this.mapRoute.bind(this);
    this.mapDirection = this.mapDirection.bind(this);
  }

  dataCheck(){
    const that = this;

    if(isEmpty(this.state.routes)){
      fetch('https://traffic-server-ehmassnwsa.now.sh/api/routes')
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
      fetch('https://traffic-server-ehmassnwsa.now.sh/api/stand_geocodes')
        .then(
          response => {
            response.json().then(
              data => {
                that.setState({stands: data});
              }
            )
        })
    }

    if(isEmpty(this.state.buses)){
      fetch('https://traffic-server-ehmassnwsa.now.sh/api/bus_names')
        .then(
          response => {
            response.json().then(
              data => {
                that.setState({buses: data});
              }
            )
          }
        );
    }
  }


  componentDidMount() {
    this.dataCheck()
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

  componentWillReceiveProps(nextProps){
    if(this.props.stand.id !== nextProps.stand.id){
      const that = this;

      this.dataCheck();

      if(!isEmpty(this.state.stands)){
          const stand = find(this.state.stands, stand => {
          return stand['stand_id'] === nextProps.stand.id
        })

        if(stand){
          this.setState({
            center: { lat: stand.lat, lng: stand.lng},
            zoom: 16
          })
        }
      }else{
        this.dataCheck();
      }

      if(!isEmpty(this.state.routes)){
        const routeMatch = filter(that.state.routes, route => {
          return route['stand_id'] === nextProps.stand.id
        });

        this.mapRoute(routeMatch);
      }else{
        this.dataCheck();
      }
    }

    if(!isEqual(this.props.route, nextProps.route)){
      this.mapDirection(nextProps.route);
    }
  }

  mapRoute(routeList){
    const stand = find(this.state.stands, stand => (stand['stand_id'] === routeList[0]['stand_id']))['stand_name'];

    const multiroute = routeList.map(
      route => {
        return {
          id: route['bus_id'],
          bus: find(this.state.buses, bus => (bus['bus_id'] === route['bus_id']))['bus_name'],
          routes: filter(this.state.routes, multiroute => (multiroute['bus_id'] === route['bus_id']))
                      .map(route => {
                        return find(this.state.stands, stand => (stand['stand_id'] === route['stand_id']))
                      })
        }
      }
    )

    this.setState({currentRoutes: multiroute});
    this.props.setRouteOptions(multiroute);
  }

  mapDirection(route){
    const routes = route.routes.filter(
      route => {
        return route !== undefined;
      }
    )

    const markers = routes.map(
      route => {
        const marker = {
          position: {lat: route.lat, lng: route.lng},
          id: route['stand_id']+route.lat+route.lng,
          defaultAnimation: 2
        }

        return marker;
      }
    )

    const DirectionsService = new window.google.maps.DirectionsService();

    const min = minBy(routes, route => route['stand_id']);
    const max = maxBy(routes, route => route['stand_id']);

    const origin = {lat: min.lat, lng: min.lng};

    const destination = {lat: max.lat, lng: max.lng};

    DirectionsService.route({
      origin: origin,
      destination: destination,
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
