import React, { Component } from 'react';
import Grid from './Components/Grid';
import './App.css';

const SLEEP_INTERVAL = 100;

const getNeighbours = (m, n) => {
  let neighbours = [];
  for (let i = m-1; i <= m+1; i++) {
    for (let j = n-1; j <= n+1; j++ ) {
      if (i >  0 && j > 0) {
        neighbours.push(`${i}__${j}`);
      }
    }
  }
  return neighbours;
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      step: 0,
      currentState: false,
      activeCell: {},
      rows: 10,
      columns: 10,
      interval: null,
      activeCellNeighbours: ''
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
      interval
    });
  }

  handleClick(i, j) {
    if (!this.state.currentState) {
      const activeState = this.state.activeCell;

  		if (activeState[`${i}__${j}`]) {
  			delete activeState[`${i}__${j}`];
  		} else {
  			activeState[`${i}__${j}`] = getNeighbours(i, j);
  		}
      console.log(activeState);
  		this.setState({
  			activeCell: activeState
  		});
    }
	}

  handleNext() {
    this.setState({
      step: this.state.step + 1
    });
    this.tick();
  }

  tick() {
    const activeState = this.state.activeCell;
    if (Object.keys(activeState).length > 0) {
      Object.keys(activeState).forEach(e => {
        const keyVal = e.split('__');
        let row = parseInt(keyVal[0], 10);
        let col = parseInt(keyVal[1], 10);

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
    } else {
      activeState['0__0'] = true;
    }
    this.setState({
      activeCell: activeState
    });
  }

  render() {
    return (
      <div>
        <h3 className="center-text"> {this.state.activeCellNeighbours} </h3>
        <Grid rows={this.state.rows} columns={this.state.columns} handleClick={this.handleClick.bind(this)} activeCell={this.state.activeCell}/>
        <div className="actions">
          {
            this.state.currentState
            ?
              <div>
                <button className="btn" onClick={this.handleStateClick.bind(this, true)}> Run </button>
                <button className="btn" onClick={this.handleStateClick.bind(this, false)}> Pause </button>
                <button className="btn" onClick={this.handleNext.bind(this)}>Next</button>
              </div>
            :
              ''
          }
          <button className="btn" onClick={()=>{this.setState({currentState: !this.state.currentState})}}>Toggle State</button>
        </div>
      </div>
    );
  }
}

export default App;
