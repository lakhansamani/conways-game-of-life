import React, { Component } from 'react';
import Grid from './Components/Grid';
import './App.css';

const SLEEP_INTERVAL = 100;

class App extends Component {
  constructor() {
    super();
    this.state = {
      step: 0,
      currentState: false,
      activeCell: {},
      rows: 10,
      columns: 10,
      interval: null
    };

    this.tick = this.tick.bind(this);
  }

  handleStateClick(state) {
    let interval = this.state.interval;
    if (state) {
      interval = setInterval(() => {
        this.tick();
      }, SLEEP_INTERVAL);
    } else {
      clearInterval(this.state.interval);
    }
    this.setState({
      currentState: state,
      interval
    });
  }

  handleClick(i, j) {
		const activeState = this.state.activeCell;

		if (activeState[`${i}__${j}`]) {
			delete activeState[`${i}__${j}`];
		} else {
			activeState[`${i}__${j}`] = true;
		}

		this.setState({
			activeCell: activeState
		});
	}

  handleNext() {
    this.setState({
      step: this.state.step + 1
    });
    this.tick();
  }

  tick() {
    const activeState = this.state.activeCell;
    Object.keys(activeState).forEach(e => {
      const keyVal = e.split('__');
      let row = parseInt(keyVal[0]);
      let col = parseInt(keyVal[1]);

      if (col < this.state.columns - 1) {
        col++;
      } else {
        col = 0;
        if (row < this.state.rows - 1) {
          row++;
        } else {
          row = 0
        }
      }
      const newKey = `${row}__${col}`;
      delete activeState[e];
      activeState[newKey] = true;
    });

    this.setState({
      activeCell: activeState
    });
  }

  render() {
    return (
      <div>
        <Grid rows={10} columns={10} handleClick={this.handleClick.bind(this)} activeCell={this.state.activeCell}/>
        <button onClick={this.handleStateClick.bind(this, true)}> Run </button>
        <button onClick={this.handleStateClick.bind(this, false)}> Pause </button>
        <button onClick={this.handleNext.bind(this)}>Next</button>
        <h4> Current State: {`${this.state.currentState}`} </h4>
        <h4> Current Step: {this.state.step} </h4>
      </div>
    );
  }
}

export default App;
