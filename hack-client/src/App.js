import Styled from 'styled-components';
import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
class App extends React.Component {
  @observable users = []

  componentDidMount() {
    fetch('http://localhost:3001')
    .then(res => {
      return res.json()
    })
    .then(users => {
      this.users = users
    });
  }

  getUserNames = () => {
    return this.users.map(user =>{
      return <li key={user.id}>{user.username}</li>
    })
  }

  render() {
    const result = this.getUserNames();
    return (
      <div className="App">
        <h1>Users</h1>
        <ul>
          { result }
        </ul>
      </div>
    );
  }
}

export default App;
