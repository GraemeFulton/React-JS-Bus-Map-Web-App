import React from 'react';
import ReactDOM from 'react-dom';

export default class DepartureItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      departureItem: ''
    };
  }



  render () {
    var headerStyle = {
      color: 'rgb(92,193,146)'
    };

    var destination = (typeof this.props.destination === 'undefined') ? 'No destinations' : 'Destination: '+this.props.destination;
    return (
        <div>
        <p style={headerStyle}>{destination}</p>
        <p>Estimated arrival: {this.props.due}</p>
        <p>Departure time: {this.props.departureTime}</p>
        <p>Bus Number: {this.props.number}</p>
        </div>
        );

  }

}
