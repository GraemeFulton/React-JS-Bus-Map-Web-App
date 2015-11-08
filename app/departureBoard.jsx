import React from 'react';
import ReactDOM from 'react-dom';

import { GoogleMap, Marker, SearchBox, DirectionsRenderer, Label } from "react-google-maps";


export default class DepartureBoard extends React.Component {


  render () {
    var headerStyle = {
      color: 'rgb(92,193,146)',
      WebkitTransition: 'all', // note the capital 'W' here
      msTransition: 'all' // 'ms' is the only lowercase vendor prefix
    };
      return (  <h4 style={headerStyle}>Departures: {this.props.station}</h4> );

  }

  getDepartures(){



  }

}
