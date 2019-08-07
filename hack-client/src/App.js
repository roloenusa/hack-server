import Styled from 'styled-components';
import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import Editor from 'react-medium-editor';


import Identicon from 'react-identicons';
import {
  Navbar,
  NavbarBrand,
  UncontrolledTooltip
} from 'reactstrap';
// import 'medium-editor/dist/css/medium-editor.css';
// import 'medium-editor/dist/css/themes/default.css';

import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://127.0.0.1:3001');

@observer
class App extends React.Component {
  @observable game = null
  @observable users = []

  logInUser = () => {
    const username = this.username.value;
    if (username.trim()) {
      this.username = username
      client.send(
        JSON.stringify({
          username: this.username,
          type: "userevent"
        })
      );
    }
  }

  onEditorStateChange = (event) => {
    console.log(event.target.value);
    client.send(JSON.stringify({
      type: "contentchange",
      username: this.username,
      content: event.target.value
    }));
  };


  componentDidMount() {
    client.send(JSON.stringify({
      type: "join",
      username: 'Bob smither',
    }));

    fetch('http://localhost:3001')
    .then(res => {
      return res.json()
    })
    .then(users => {
      this.users = users
    });
  }

  componentWillMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      console.log(message);
      const dataFromServer = JSON.parse(message.data);
      console.log(dataFromServer);
      if (dataFromServer.type === "userevent") {
        this.currentUsers = Object.values(dataFromServer.data.users);
      } else if (dataFromServer.type === "contentchange") {
        this.text = dataFromServer.data.editorContent || contentDefaultMessage;
      }
      console.log("== ")
      console.log(dataFromServer);
      this.userActivity = dataFromServer.data.userActivity;
      console.log("== ")
    };
  }

  showLoginSection = () => (
    <div className="account">
      <div className="account__wrapper">
        <div className="account__card">
          <div className="account__profile">
            <Identicon className="account__avatar" size={64} string="randomness" />
            <p className="account__name">Hello, user!</p>
            <p className="account__sub">Join to edit the document</p>
          </div>
          <input name="username" ref={(input) => { this.username = input; }} className="form-control" />
          <button type="button" onClick={() => this.logInUser()} className="btn btn-primary account__btn">Join</button>
        </div>
      </div>
    </div>
  )


  getUserNames = () => {
    return this.users.map(user =>{
      return <li key={user.id}>{user.username}</li>
    })
  }

  showEditorSection = () => (
    <div className="main-content">
      <div className="document-holder">
        <div className="currentusers">
          {this.currentUsers.map(user => (
            <React.Fragment>
              <span id={user.username} className="userInfo" key={user.username}>
                <Identicon className="account__avatar" style={{ backgroundColor: user.randomcolor }} size={40} string={user.username} />
              </span>
              <UncontrolledTooltip placement="top" target={user.username}>
                {user.username}
              </UncontrolledTooltip>
            </React.Fragment>
          ))}
        </div>
        {/* <Editor
          options={{
            placeholder: {
              text: this.text ? contentDefaultMessage : ""
            }
          }}
          className="body-editor"
          text={this.text}
          onChange={this.onEditorStateChange}
        /> */}

        <textarea value={this.text} onChange={this.onEditorStateChange} />
      </div>
      <div className="history-holder">
        <ul>
          {this.userActivity.map((activity, index) => <li key={`activity-${index}`}>{activity}</li>)}
        </ul>
      </div>
    </div>
  )

  // render() {
  //   const result = this.getUserNames();
  //   return (
  //     <div className="App">
  //       <h1>Users</h1>
  //       <ul>
  //         { result }
  //       </ul>
  //       <div>
  //         { this.showEditorSection() }
  //       </div>
  //     </div>
  //   );
  // }
  render() {
    const username = this.username;
    return (
      <React.Fragment>
        <div className="container-fluid">
          {this.showEditorSection()}
        </div>
      </React.Fragment>
    );
  }
}

export default App;
