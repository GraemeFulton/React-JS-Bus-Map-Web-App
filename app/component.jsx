import React from 'react';
import ReactDOM from 'react-dom';

import { GoogleMap, Marker, SearchBox, DirectionsRenderer } from "react-google-maps";

export default class Map extends React.Component {

  constructor(props) {
    super(props);

    this.changeContent = this.changeContent.bind(this);
    this.sendContent = this.sendContent.bind(this);
    this.setDirections = this.setDirections.bind(this);

    this.state = {
      origin: new google.maps.LatLng(41.8507300, -87.6512600),
      destination: new google.maps.LatLng(41.8525800, -87.6514100),
      directions: null,
      begin:"preston",
      end:"blackpool",
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
        console.log(result)
        this.setState({
          directions: result
        })
      }
      else {
        console.error(`error fetching directions ${ result }`);
      }
    });
  }

  sendContent(e) {

    this.state.begin = ReactDOM.findDOMNode(this.refs.begin).value
    this.state.end = ReactDOM.findDOMNode(this.refs.end).value
  //  this.calcRoute(e);
    console.log('begin: '+ this.state.begin+ '| end: '+this.state.end)
    this.setDirections()


  }

  changeContent(e) {
   this.state.begin=e.target.value
    console.log(e.target.value)
  }

  /*
   * 1. Create a component that wraps all your map sub-components.
   */
  render () {
    //const {origin, directions} = this.state;
    /*
     * 2. Render GoogleMap component with containerProps
     */
    return (

      <div>
        <h4>The input form is here:</h4>
        Title:
        <input type="text" ref="begin" value={this.inputContent}
          onChange={this.changeContent} />
        <input type="text" ref="end" value={this.inputContent}
            onChange={this.changeContent} />
        <button onClick={this.sendContent}>Submit</button>

          <div className="map">
            <GoogleMap containerProps={{
                style: {
                  height: "100%",
                },
              }}
              /*
               * 3. config <GoogleMap> instance by properties
               */
              defaultZoom={8}
              defaultCenter={this.state.origin}>

              {this.state.directions ? <DirectionsRenderer directions={this.state.directions} /> : null}

            </GoogleMap>
          </div>
      </div>

    );
  }
}
