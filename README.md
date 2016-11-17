# Transport API Bus Departure Board (React.js + Google Maps)
![transportapi](http://www.transportapi.com/wp-content/uploads/home_hero@2x.png)
##About
* Built with React + Webpack + Babel, see here for [starter repo](https://github.com/GraemeFulton/react-webpack-babel-starter), and [this tutorial by SurviveJS](http://survivejs.com/webpack/developing-with-webpack/automatic-browser-refresh/), which I used to get started.
* Uses [React Google Maps](https://github.com/tomchentw/react-google-maps) by [Tom Chen](https://github.com/tomchentw) for Google Map + React integration
* Also using the [Transport API](http://www.transportapi.com/) for bus time information - note that there are daily limits on this API, so if the demo is not working, it has hit API limits.

* Find Routes
![demo](https://github.com/GraemeFulton/sagacious-octo-chainsaw/blob/master/docs/tfl02.gif)

* Search Locations
![search](https://github.com/GraemeFulton/sagacious-octo-chainsaw/blob/master/docs/tfl03.gif)

##Run this:
1. npm install
2. node server.js

Make sure [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html) is installed. For hotloading, you can run this:

`webpack-dev-server --devtool eval --progress --colors --hot --content-base build`
