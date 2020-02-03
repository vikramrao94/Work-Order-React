import React, { Component } from 'react';
import WorkOrderList from './components/WorkOrderList';
import './App.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <WorkOrderList />
      </div>
    );
  }
}

export default App;
