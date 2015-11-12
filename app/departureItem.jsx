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
      color: '#0D47A1',
      marginTop:"0px",
      fontSize:"16px"
    };
    var listItem= {
      background:'#fff',
      borderTop:"1px solid rgb(27,43,98)",
      marginBottom:"0px",
      padding:"12px"
    }
    var pStyle={
      marginBottom:'0px'
    }
    var buttonStyle={
    }

    var destination = (typeof this.props.destination === 'undefined') ? 'No destinations' :this.props.destination;
    return (
        <div style={listItem} onClick={this.listItemClick}>
        <p style={headerStyle}><i className="material-icons">directions</i>{destination}</p>
        <p style={pStyle}>Estimated arrival: {this.props.due}</p>
        <p style={pStyle}>Departure time: {this.props.departureTime}</p>
        <p style={pStyle}>Bus Number: {this.props.number}</p>
        <button style={buttonStyle}className="mdl-button mdl-js-button mdl-button--primary mdl-js-ripple-effect">Show Route</button>
        </div>
        );

  }

}
