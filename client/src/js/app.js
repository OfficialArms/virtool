/**
 * Created by igboyes on 03/03/15.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var Start = require('./components/Start.jsx');

document.write(require('../css/bootstrap.css'));
document.write(require('../css/font.css'));
document.write(require('../css/graphics.css'));
document.write(require('../css/style.css'));
document.write(require('../css/transitions.css'));

ReactDOM.render(React.createElement(Start), document.getElementById('app-container'));