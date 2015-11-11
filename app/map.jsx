import React from 'react';
import ReactDOM from 'react-dom';

import { GoogleMap, Marker, SearchBox, DirectionsRenderer, Label } from "react-google-maps";

import DepartureBoard from './departureBoard.jsx';

export default class Map extends React.Component {

  constructor(props) {
    super(props);

    this.sendContent = this.sendContent.bind(this);
    this.setDirections = this.setDirections.bind(this);
    this.setCoordinates = this.setCoordinates.bind(this);
    this.getNearestBusStops = this.getNearestBusStops.bind(this);
    this._handle_marker_click = this._handle_marker_click.bind(this);
    this.changeInput = this.changeInput.bind(this);

    //set bounds to london town
    var bounds= new google.maps.LatLngBounds();
    var LondonNe= new google.maps.LatLng(51.22580742132281, -0.6591800781250186);
    var LondonSw = new google.maps.LatLng(51.73893493080538, 0.43945273437498145);
    bounds.extend(LondonNe);
    bounds.extend(LondonSw);

    this.state = {
      origin: new google.maps.LatLng(51.5073509,  -0.12775829999998223),
      // destination: new google.maps.LatLng(41.8525800, -87.6514100),
      directions: null,
      begin:new google.maps.LatLng(51.52783450, -0.04076115),
      beginLng:51.5073509,
      beginLat: -0.12775829999998223,
      end:new google.maps.LatLng(51.51560467, -0.10225884),
      directionService: new google.maps.DirectionsService(),
      markers: [],
      station:'no bus stop selected',
      getDepartures:false,
      bounds:bounds,
      zoom:15
    };

    $('.loading').show();
    this.setCoordinates();

  }

  setDirections(departureTime){
    var d = new Date();
    var time = departureTime
    time=time.split(':');
    d.setHours(time[0]);
    d.setMinutes(time[1]);
    this.state.markers= []
    this.state.directionService.route({
      origin: this.state.begin,
      destination: this.state.end,
      travelMode: google.maps.TravelMode.TRANSIT,
      transitOptions: {
        modes: [google.maps.TransitMode.BUS],
        departureTime: d,
        routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS,
        routingPreference: google.maps.TransitRoutePreference.LESS_WALKING
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
    this.state.directions=null
    this.state.markers=[]
    this.state.begin = this.refs.searchBox.getPlaces();
    this.state.beginLng= this.state.begin[0].geometry.location.A
    this.state.beginLat = this.state.begin[0].geometry.location.F
    console.log(  this.state.begin)
    $('.loading').show();
    this.setCoordinates();

  }

  setCoordinates(){

          this.state.northEastLat = this.state.beginLng+0.01
          this.state.northEastLong =this.state.beginLat+0.01

          this.state.southWestLat = this.state.beginLng-0.01
          this.state.southWestLong =this.state.beginLat-0.01

          this.state.origin = new google.maps.LatLng(this.state.beginLng, this.state.beginLat),

          this.getNearestBusStops();

  }

  getNearestBusStops(){

    var url='http://digitaslbi-id-test.herokuapp.com/bus-stops?northEast='+ this.state.northEastLat +','+this.state.northEastLong+'&southWest='+this.state.southWestLat+','+this.state.southWestLong+''

    $.ajax({
       type: 'GET',
        url: url,
        async: false,
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
                lng:json.markers[i].lng,
                animation:2
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

  _handle_marker_click (marker, index) {
    //clear all highlighted markers
    for (var i = 0; i < this.state.markers.length; i++) {
      this.state.markers[i].icon='./img/bus.png'
      this.state.markers[i].selected=false
      this.state.markers[i].animation=null
    }
    //highlight selected marker
    if(marker.selected==false){
      marker.selected = true
    }
    else{
      marker.selected=false
    }
    marker.icon='./img/bus3.png'
    marker.animation=null
    this.state.markers[index] = marker
    this.setState({
      directions:null,
      station: marker.data,
      markers:this.state.markers,
      getDepartures:true
    });


  }
  _onMarkerMouseOver(marker, index) {
    if(marker.selected==false){
      this.state.origin=null
  marker.icon='./img/bus2.png'
  marker.animation=null
  this.state.markers[index] = marker
  this.setState({
    markers:this.state.markers,
    getDepartures:null,
  });
}

}
_onMarkerMouseOut(marker, index) {
  if(marker.selected==false){
    this.state.origin=null
  marker.icon='./img/bus.png'
  marker.animation=null
  this.state.markers[index] = marker
  this.setState({
    markers:this.state.markers,
    getDepartures:null

  });
}
}

changeInput(station, destination){
  this.setState({
    begin:new google.maps.LatLng(station.lat, station.lng),
    end:destination.destination+', London',
    departureTime:destination.departureTime
  });
  setTimeout(function(){  this.setDirections(destination.departureTime);
}.bind(this), 400)

}

componentDidUpdate(){
  $('.loading').hide()

}

  render () {
    var container={
      height:window.innerHeight-15
    }
    var leftPanel = {
      height:"100%",
      width:"22%",
      float:"right",
      backgroundColor:"#fff",
      overflow:"hidden"
    }
    var searchStyle={
      backgroundColor:"#283593",
      color:"#fff"
    }
    var padding={
      padding:"10px",
    }
    var fullWidth={width:"98%"}
    var inputStyle = {
   "border": "1px solid transparent",
   "borderRadius": "1px",
   "boxShadow": "0 2px 6px rgba(0, 0, 0, 0.3)",
   "boxSizing": "border-box",
   "MozBoxSizing": "border-box",
   "fontSize": "14px",
   "height": "36px",
   "marginTop": "25px",
   "outline": "none",
   "padding": "0 12px",
   "textOverflow": "ellipses",
   "width": "216px"
  }
  var headerStyle = {
    background:'#3949AB',
    color: '#fff',
    marginTop:'0',
    padding:'10px',
    marginBottom:'0',
    minHeight: "24px"
  };
  var headerIcon = {
    fontSize:"25px",
    verticalAlign:"text-top",
    marginRight:"8px"
  }
  var busIcon={
    marginRight:"5px"
  }
  var searchStyle={
    zIndex:"9999",
    left:"305px",
    top:"25px"
  }

  var name = (typeof this.state.station.name === 'undefined') ? 'No bus selected' : this.state.station.name;

    return (

      <div>

          <div style={container}>
            <div style={leftPanel} className="mdl-card mdl-shadow--2dp">

              <h4 style={headerStyle}> Departure Board</h4>
                <p style={headerStyle}><i style={busIcon} className="material-icons">directions_bus</i> {name}</p>

              <DepartureBoard onValueChange={this.changeInput} station={this.state.station} getDepartures={this.state.getDepartures}/>
            </div>

            <GoogleMap containerProps={{
                style: {
                  height: "100%",
                  width:"78%",
                  float:"left",
                  position:"relative"
                },
              }}
              defaultZoom={15}
              zoom={this.state.zoom}
              defaultCenter={this.state.origin}
              center={this.state.origin}
              draggable={true}
              >

              {this.state.directions ? <DirectionsRenderer directions={this.state.directions} /> : null}
              <SearchBox
                       bounds={this.state.bounds}
                       controlPosition={google.maps.ControlPosition.TOP_LEFT}
                       ref="searchBox"
                       onPlacesChanged={this.sendContent}
                       types= '(cities)'
                       style={inputStyle} />
                     <button style={searchStyle} className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick={this.sendContent}><i className="material-icons">search</i></button>


              {this.state.markers.map((marker, index) => (
               <Marker
                 icon={marker.icon}
                 title={marker.title}
                 onClick={this._handle_marker_click.bind(this, marker, index)}
                 position={marker.position}
                 key={index}
                 onMouseover={this._onMarkerMouseOver.bind(this, marker, index)}
                 onMouseout={this._onMarkerMouseOut.bind(this, marker, index)}
                 draggable={true}
                 animation={marker.animation}
                 />
             ))}

            </GoogleMap>

          </div>
      </div>

    );

  }

}
