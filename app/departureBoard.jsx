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
    this.changeInput = this.changeInput.bind(this);

  }

  changeInput(destination){
    this.props.onValueChange(this.props.station, destination)

  }

  render () {
    var departureBoardStyle = {
      overflowX:"scroll",
      height:"100%"
    };
    if(this.props.getDepartures==true){
      this.getDepartures()
    }
    return (
        <div style={departureBoardStyle}>
          {this.state.noDepartures}
          {this.state.departures.map((departure, index) => (
            <DepartureItem
              onValueChange={this.changeInput}
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
