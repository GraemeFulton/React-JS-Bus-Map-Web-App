import React from 'react';
import ReactDOM from 'react-dom';

import { GoogleMap, Marker, SearchBox, DirectionsRenderer } from "react-google-maps";

export default class Map extends React.Component {

  constructor(props) {
    super(props);

    this.changeContent = this.changeContent.bind(this);
    this.sendContent = this.sendContent.bind(this);
    this.setDirections = this.setDirections.bind(this);
    this.setCoordinates = this.setCoordinates.bind(this);

    this.state = {
      // origin: new google.maps.LatLng(41.8507300, -87.6512600),
      // destination: new google.maps.LatLng(41.8525800, -87.6514100),
      directions: null,
      begin:new google.maps.LatLng(51.52783450, -0.04076115),
      end:new google.maps.LatLng(51.51560467, -0.10225884),
      directionService: new google.maps.DirectionsService()

    };
  }

  componentDidMount () {
    this.setDirections()
  }

  setDirections(){
    this.state.directionService.route({
      origin: this.state.begin,
      destination: this.state.end,
      travelMode: google.maps.TravelMode.TRANSIT,
      transitOptions: {
        modes: [google.maps.TransitMode.BUS],
        routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS
      },
    }, (result, status) => {
      if(status == google.maps.DirectionsStatus.OK) {
        // console.log(result)
        this.setState({
          directions: result
        })
      }
      else {
        console.error(`error fetching directions ${ result }`);
        alert('There are no buses running on this route.')
      }
    });
  }

  sendContent(e) {

    this.state.begin = ReactDOM.findDOMNode(this.refs.begin).value
    this.state.end = ReactDOM.findDOMNode(this.refs.end).value

    this.setCoordinates();

    this.setDirections()

  }

  setCoordinates(){
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode( { 'address': this.state.begin}, function(results, status) {

      if (status == google.maps.GeocoderStatus.OK)
      {
          //set lat and long
          this.state.beginLatitude = results[0].geometry.location.A
          this.state.beginLongitude = results[0].geometry.location.F

          console.log(this.state.beginLatitude)
      }
    }.bind(this));
  }

  changeContent(e) {
   this.state.begin=e.target.value
    console.log(e.target.value)
  }

  render () {

    return (

      <div>
        <h4>Choose your location:</h4>
        From:
        <input type="text" ref="begin" value={this.inputContent}
          onChange={this.changeContent} />
        To:
        <input type="text" ref="end" value={this.inputContent}
            onChange={this.changeContent} />
        <button onClick={this.sendContent}>Submit</button>

          <div className="map">
            <GoogleMap containerProps={{
                style: {
                  height: "100%",
                },
              }}
              defaultZoom={8}
              defaultCenter={this.state.origin}>

              {this.state.directions ? <DirectionsRenderer directions={this.state.directions} /> : null}

            </GoogleMap>
          </div>
      </div>

    );
  }
}
