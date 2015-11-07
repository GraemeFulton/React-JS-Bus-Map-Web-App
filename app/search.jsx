import React from 'react';
import ReactDOM from 'react-dom';

import SimpleMap from './component.jsx';


export default class Search extends React.Component {

  constructor(props) {
     super(props)
     this.changeContent = this.changeContent.bind(this);
     this.sendContent = this.sendContent.bind(this);

   }

   sendContent(e) {
     this.refs.begin = ReactDOM.findDOMNode(this.refs.startLocation).value
     this.refs.end = ReactDOM.findDOMNode(this.refs.endLocation).value

     console.log('sending input content '+ this.refs.begin)
     var map = document.getElementsByClassName('map');
     ReactDOM.render(<SimpleMap start={this.refs.begin} end={this.refs.end}/>, document.getElementsByClassName('map'));
   }

   changeContent(e) {
     this.setState({inputContent: e.target.value})
     console.log(e.target.value)
   }

   calcRoute(e){
     var start = "Blackpool";
     var end = "Preston";
      var request = {
        origin:start,
        destination:end,
        travelMode: google.maps.TravelMode.BUS
      };
      directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(result);
        }
      });
   }

   render() {
     return (
       <div>
         <h4>The input form is here:</h4>
         Title:
         <input type="text" ref="startLocation" value={this.inputContent}
           onChange={this.changeContent} />
         <input type="text" ref="endLocation" value={this.inputContent}
             onChange={this.changeContent} />
         <button onClick={this.sendContent}>Submit</button>

           <div className="map">
           <SimpleMap start={this.refs.begin} end={this.refs.end}/>
           </div>
       </div>
     )
   }

};
