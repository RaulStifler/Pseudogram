import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

firebase.initializeApp({
	apiKey: "AIzaSyC1B44iZCDit9kuiwWIpzuQz2BFz0QXoVg",
    authDomain: "pseudogram-1c743.firebaseapp.com",
    databaseURL: "https://pseudogram-1c743.firebaseio.com",
    projectId: "pseudogram-1c743",
    storageBucket: "pseudogram-1c743.appspot.com",
    messagingSenderId: "464013494344"
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
