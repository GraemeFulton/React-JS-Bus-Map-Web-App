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
    this.showTransitDirections = this.showTransitDirections.bind(this);
    this._searchButtonClick = this._searchButtonClick.bind(this);

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
    //this.state.markers= []
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
  _searchButtonClick(){

    this.state.directions=null
    this.state.markers=[]

    this.state.markers.push({
       position: this.state.begin[0].geometry.location
     });

    $('.loading').show();
    this.setCoordinates();
  }
  sendContent(e) {
    this.state.directions=null
    this.state.markers=[]
    this.state.begin = this.refs.searchBox.getPlaces();

    this.state.beginLng= this.state.begin[0].geometry.viewport.f.f
    this.state.beginLat = this.state.begin[0].geometry.viewport.b.b

    this.state.markers.push({
       position: this.state.begin[0].geometry.location
     });


    $('.loading').show();
    this.setCoordinates();

  }

  setCoordinates(){

          this.state.northEastLat = this.state.beginLng
          this.state.northEastLong =this.state.beginLat

          this.state.southWestLat = this.state.beginLng
          this.state.southWestLong =this.state.beginLat

          this.state.origin = new google.maps.LatLng(this.state.beginLng, this.state.beginLat),

          this.getNearestBusStops();

  }

  getNearestBusStops(){
//var url='https://api.tfl.gov.uk/journey/journeyresults/51.501,-0.123/to/1000013?api_key=497266f97f0dee17bfef93afaeec9cbd&app_id=1facb384'
  //  var url='http://digitaslbi-id-test.herokuapp.com/bus-stops?northEast='+ this.state.northEastLat +','+this.state.northEastLong+'&southWest='+this.state.southWestLat+','+this.state.southWestLong+''
var url = 'http://transportapi.com/v3/uk/bus/stops/near.json?lat='+this.state.northEastLat+'&lon='+this.state.southWestLong+'&app_key=1957236d66e8c0d991f59955ed52544b&app_id=cf5c2bbe'
    $.ajax({
       type: 'GET',
        url: url,
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
          //plot stops on map
          for (var i = 0; i < json.stops.length; i++) {
            var location = {lat:json.stops[i].latitude, lng: json.stops[i].longitude};
            var marker = new google.maps.Marker({
                position: location,
                title:json.stops[i].name,
                label:json.stops[i].name,
                data:json.stops[i].atcocode,
                icon:'./img/bus.png',
                selected:false,
                lat:json.stops[i].latitude,
                lng:json.stops[i].longitude,
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
    this.state.showTransit=false;
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
      activeMarkerName:marker.label,
      station: marker.data,
      markers:this.state.markers,
      getDepartures:true,
      origin:marker.position
    });
    this.forceUpdate()


  }
  _onMarkerMouseOver(marker, index) {
    if(this.state.showTransit==true){
      return false
    }
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
  if(this.state.showTransit==true){
    return false
  }
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

showTransitDirections(station, destination){
  this.setState({
    begin:station.origin,
    end:destination.destination+' London',
    departureTime:destination.departureTime,
    showTransit:true
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
      backgroundColor:"#fff",
      overflow:"hidden"
    }
    var inputStyle = {
   "border": "1px solid transparent",
   "borderRadius": "1px",
   "boxShadow": "0 2px 6px rgba(0, 0, 0, 0.3)",
   "boxSizing": "border-box",
   "MozBoxSizing": "border-box",
   "fontSize": "14px",
   "outline": "none",
   "padding": "0 12px",
   "textOverflow": "ellipses",
   "marginTop":"10px"
  }
  var headerStyle = {
    background:'#0D47A1',
    color: '#fff',
    marginTop:'0',
    padding:'10px',
    marginBottom:'0',
    minHeight: "24px"
  };
  var headerIcon = {
    fontSize:"24px",
    verticalAlign:"text-top",
    marginRight:"8px"
  }
  var busHeader={
    background:'#2962FF',
    color: '#fff',
    marginTop:'0',
    padding:'10px',
    marginBottom:'0',
    minHeight: "24px",
    fontSize:"18px"
  }
  var busIcon={
    marginRight:"5px"
  }
  var searchStyle={
    zIndex:"9999",
    left:"340px",
    top:"10px",
    background:"#2962FF",
    "position":"absolute"
  }
  var name = (typeof this.state.station === 'undefined') ? 'No bus selected' : this.state.activeMarkerName;
    return (

          <div style={container}>
            <GoogleMap containerProps={{
                className:"google-map"
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
              <button style={searchStyle} className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick={this._searchButtonClick}><i className="material-icons">search</i></button>


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

            <div style={leftPanel} className="left-panel mdl-card mdl-shadow--2dp">

              <h4 style={headerStyle}> Departure Board</h4>
                <p style={busHeader}><i style={busIcon} className="material-icons">directions_bus</i> {name}</p>

              <DepartureBoard onValueChange={this.showTransitDirections} station={this.state.station} origin={this.state.origin} getDepartures={this.state.getDepartures}/>
            </div>

          </div>

    );

  }

}
