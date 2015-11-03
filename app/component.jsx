import React from 'react';
import { GoogleMap, Marker, SearchBox } from "react-google-maps";

export default class SimpleMap extends React.Component {
  /*
   * 1. Create a component that wraps all your map sub-components.
   */
  render () {
    /*
     * 2. Render GoogleMap component with containerProps
     */
    return (
      <GoogleMap containerProps={{
          style: {
            height: "100%",
          },
        }}
        /*
         * 3. config <GoogleMap> instance by properties
         */
        defaultZoom={8}
        defaultCenter={{lat: -34.397, lng: 150.644}} />
    );
  }
}
