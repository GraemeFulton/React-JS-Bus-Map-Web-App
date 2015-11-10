import React from 'react';
import ReactDOM from 'react-dom';
import Map from './map.jsx';

export default class DepartureItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      departureItem: '',

    };
    this.listItemClick = this.listItemClick.bind(this);

  }

  listItemClick(){

    this.props.onValueChange(this.props)
  }

  render () {
    var headerStyle = {
      color: 'rgb(69,79,179)',
      marginTop:"0px"
    };
    var listItem= {
      background:'#fff',
      borderTop:"1px solid rgb(27,43,98)",
      marginBottom:"0px",
      padding:"8px"
    }
    var pStyle={
      marginBottom:'0px'
    }

    var destination = (typeof this.props.destination === 'undefined') ? 'No destinations' :this.props.destination;
    return (
        <div style={listItem} onClick={this.listItemClick}>
        <p style={headerStyle}><i className="material-icons">directions</i>{destination}</p>
        <p style={pStyle}>Estimated arrival: {this.props.due}</p>
        <p style={pStyle}>Departure time: {this.props.departureTime}</p>
        <p style={pStyle}>Bus Number: {this.props.number}</p>
        <button className="mdl-button mdl-js-button mdl-js-ripple-effect">Show Route</button>
        </div>
        );

  }

}
