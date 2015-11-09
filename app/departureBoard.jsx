import React from 'react';
import ReactDOM from 'react-dom';
import DepartureItem from './departureItem.jsx';

import { GoogleMap, Marker, SearchBox, DirectionsRenderer, Label } from "react-google-maps";


export default class DepartureBoard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      departures: [],
      noDepartures:''
    };
  }

  render () {
    var headerStyle = {
      color: 'rgb(92,193,146)',
      marginTop:'0px'
    };
    var departureBoardStyle = {
      overflowX:"scroll",
      height:"80%"
    };
    if(this.props.getDepartures==true){
      this.getDepartures()
    }
    var name = (typeof this.props.station.name === 'undefined') ? '' : 'Departures from '+this.props.station.name;
    return (
        <div style={departureBoardStyle}>
        <h4 style={headerStyle}>{name}</h4>
        <p>{this.state.noDepartures}</p>

          {this.state.departures.map((departure, index) => (
            <DepartureItem
              key={index}
              destination={departure.destination}
              due={departure.estimatedWait}
              routeName= {departure.routeName}
              departureTime={departure.scheduledTime}
              number={departure.routeId}
              />
         ))}

        </div>
        );

  }

  getDepartures(){
    if(this.props.getDepartures==true){

    var url='http://digitaslbi-id-test.herokuapp.com/bus-stops/'+this.props.station.id+'';

    $.ajax({
       type: 'GET',
        url: url,
        async: false,
        // jsonpCallback: 'jsonCallback',
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
          //plot stops on map
            this.state.departures=json.arrivals;
            console.log(this.state.departures)
            if (this.state.departures[0] == null) {
              this.state.noDepartures = 'No more departures'
            }
            else{
              this.state.noDepartures = ''
            }
            this.setState({
              departures:this.state.departures,
              noDepartures:this.state.noDepartures
            });
            console.log(this.state.departures)
        }.bind(this),
        error: function(e) {
           console.log(e.message);
        }.bind(this)
    });

  }
}

}
