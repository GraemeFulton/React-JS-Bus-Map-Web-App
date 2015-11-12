import React from 'react';
import ReactDOM from 'react-dom';

export default class LoadingGif extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'display':'none'
    };

  }

  componentDidUpdate(){

   this.state.display=='none'

  }

  componentWillReceiveProps(){
    if(this.props.show==true){
      this.state.display='inline'
    }else{this.state.display='none'}
  }

  render () {
    if(this.props.show==true){
      this.state.display='inline'
    }else{this.state.display='none'}
    var loadingStyle = {
      position: "fixed",
      width: "90%",
      height: "100%",
      background: "rgba(31, 31, 31, 0.58)",
      zIndex:" 1",
      float: "right",
      left: "0",
      display:this.state.display
    };

    return (
        <div className="loading">Loading</div>

    );

  }

}
