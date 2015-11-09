import React from 'react';
import ReactDOM from 'react-dom';

import { GoogleMap, Marker, SearchBox, DirectionsRenderer, Label } from "react-google-maps";

import DepartureBoard from './departureBoard.jsx';

export default class Map extends React.Component {

  constructor(props) {
    super(props);

    this.changeContent = this.changeContent.bind(this);
    this.sendContent = this.sendContent.bind(this);
    this.setDirections = this.setDirections.bind(this);
    this.setCoordinates = this.setCoordinates.bind(this);
    this.getNearestBusStops = this.getNearestBusStops.bind(this);
    this._handle_marker_click = this._handle_marker_click.bind(this);

    this.state = {
      origin: new google.maps.LatLng(51.5072, 0.1275),
      // destination: new google.maps.LatLng(41.8525800, -87.6514100),
      directions: null,
      begin:new google.maps.LatLng(51.52783450, -0.04076115),
      end:new google.maps.LatLng(51.51560467, -0.10225884),
      directionService: new google.maps.DirectionsService(),
      markers: [],
      station:'no bus stop selected',
      getDepartures:false
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
    //$('.search_button').click();
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
          this.state.northEastLat = results[0].geometry.location.A+0.01
          this.state.northEastLong = results[0].geometry.location.F+0.01

          this.state.southWestLat = results[0].geometry.location.A-0.01
          this.state.southWestLong = results[0].geometry.location.F-0.01

          this.state.origin = new google.maps.LatLng(results[0].geometry.location.A, results[0].geometry.location.F),

          this.getNearestBusStops();

      }
    }.bind(this));
  }

  getNearestBusStops(){

    var url='http://digitaslbi-id-test.herokuapp.com/bus-stops?northEast='+ this.state.northEastLat +','+this.state.northEastLong+'&southWest='+this.state.southWestLat+','+this.state.southWestLong+''

    $.ajax({
       type: 'GET',
        url: url,
        async: false,
        // jsonpCallback: 'jsonCallback',
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
          //plot stops on map
          for (var i = 0; i < json.markers.length; i++) {
            var location = {lat:json.markers[i].lat, lng: json.markers[i].lng};

            var marker = new google.maps.Marker({
                position: location,
                title:json.markers[i].name,
                label:json.markers[i].name,
                data:json.markers[i],
                icon:'./img/bus.png',
                selected:false,
                lat:json.markers[i].lat,
                lng:json.markers[i].lng
              });
              this.state.markers.push(marker);

              this.setState({
                markers: this.state.markers
              });
          }

        }.bind(this),
        error: function(e) {
           console.log(e.message);
        }.bind(this)
    });

  }

  changeContent(e) {
  //  this.state.begin=e.target.value
  //   console.log(e.target.value)
  }

  _handle_marker_click (marker, index) {
    //clear all highlighted markers
    for (var i = 0; i < this.state.markers.length; i++) {
      this.state.markers[i].icon='./img/bus.png'
      this.state.markers[i].selected=false

    }
    //highlight selected marker
    if(marker.selected==false){
      marker.selected = true
    }
    else{
      marker.selected=false
    }
    marker.icon='./img/bus3.png'
    this.state.markers[index] = marker
    this.setState({
      station: marker.data,
      markers:this.state.markers,
      getDepartures:true
    });


  }
  _onMarkerMouseOver(marker, index) {

    if(marker.selected==false){
    //  this.state.origin=new google.maps.LatLng(marker.lat, marker.lng)
  marker.icon='./img/bus2.png'
  this.state.markers[index] = marker
  this.setState({
    markers:this.state.markers,
    getDepartures:false

  });
}

}
_onMarkerMouseOut(marker, index) {
  if(marker.selected==false){
  marker.icon='./img/bus.png'
  this.state.markers[index] = marker
  this.setState({
    markers:this.state.markers,
    getDepartures:false

  });
}
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
          <button className='search_button' onClick={this.sendContent}>Submit</button>

          <div className="map">
            <GoogleMap containerProps={{
                style: {
                  height: "100%",
                  width:"500px",
                  float:"left",
                  position:"relative"
                },
              }}
              defaultZoom={15}
              defaultCenter={this.state.origin}
              center={this.state.origin}
              >

              {/*this.state.directions ? <DirectionsRenderer directions={this.state.directions} /> : null*/}


              {this.state.markers.map((marker, index) => (
               <Marker
                 icon={marker.icon}
                 title={marker.title}
                 onClick={this._handle_marker_click.bind(this, marker, index)}
                 position={marker.position}
                 key={index}
                 onMouseover={this._onMarkerMouseOver.bind(this, marker, index)}
                 onMouseout={this._onMarkerMouseOut.bind(this, marker, index)}
                 />
             ))}

            </GoogleMap>

            <DepartureBoard station={this.state.station} getDepartures={this.state.getDepartures}/>

          </div>
      </div>

    );
  }
}
