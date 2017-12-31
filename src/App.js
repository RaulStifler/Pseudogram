import React, { Component } from 'react';
import firebase from 'firebase';
import FileUpload from './FileUpload';

import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      user: null,
      pictures: []
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.subirFoto = this.subirFoto.bind(this);
  }

  componentWillMount(){
    firebase.auth().onAuthStateChanged(user => {
      this.setState({
        user
      });
    });

    firebase.database().ref('pictures').on('child_added', snapshot => {
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      })
    })
  }

  login(){
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} ha iniciado sesión`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  subirFoto(event){
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`/Fotos/${file.name}`);
    const task = storageRef.put(file);

    task.on('state_changed', snapshot => {
      let percentage = String((snapshot.byteTransferred/snapshot.totalBytes) * 100);
      this.setState({
        uploadValue: percentage
      });
    }, error => { 
      console.log(error.message)
    }, () => {
      const record = {
        photoURL: this.state.user.photoURL,
        displayName: this.state.user.displayName,
        image: task.snapshot.downloadURL
      };

      const dbRef = firebase.database().ref('pictures');
      const newPicture = dbRef.push();
      newPicture.set(record);
    });
  }


  logout(){
    firebase.auth().signOut()
    .then(result => console.log(`${result.user.email} ha salido.`))
    .catch(error => console.log(`${error.code}: ${error.message}`));
  }

  renderLoginButton(){
    if(this.state.user){
      return(
        <div>
          <img src={this.state.user.photoURL} alt={this.state.user.displayName}/>
          <p>Hola, {this.state.user.displayName}</p>
          <button  onClick={this.logout}>Cerrar sesión</button>
          <FileUpload onUpload={this.subirFoto}/>

          {
            this.state.pictures.map( picture => (
              <div>
                <img src={picture.image} />
                <br/>
                <img src={picture.photoURL} alt={picture.displayName} />
                <br/>
                <span>{picture.displayName}</span>
              </div>
            )).reverse()
          }
        </div>
      );
    }else{
      return(
        <div>
          <button onClick={this.login}>Login con Google</button>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Pseudogram</h1>
        </header>
        <p className="App-intro">
          Bienvenido a <code>Pseudogram</code>.
        </p>
        {this.renderLoginButton()}
      </div>
    );
  }
}

export default App;
