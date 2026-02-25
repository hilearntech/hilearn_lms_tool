import React from 'react'
import * as ReactDOM from 'react-dom'
import * as ReactDOMClient from 'react-dom/client'
import _ from 'lodash' 
import './index.css'
import App from './App.jsx'


window.React = React;
window.ReactDOM = ReactDOM;
window._ = _; 

const container = document.getElementById('root');
const root = ReactDOMClient.createRoot(container);

root.render(<App />);