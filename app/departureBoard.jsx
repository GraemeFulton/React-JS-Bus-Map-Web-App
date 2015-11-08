import React from 'react';
import ReactDOM from 'react-dom';

import { GoogleMap, Marker, SearchBox, DirectionsRenderer, Label } from "react-google-maps";


export default class DepartureBoard extends React.Component {


  render () {
      return (  <h4>Departures: {this.props.station}</h4> );

  }

  getDepartures(){

    

  }

}
