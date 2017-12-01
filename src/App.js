import React, { Component } from 'react';
import Grid from './Components/Grid';
import './App.css';

const SLEEP_INTERVAL = 100;

const getNeighbours = (m, n) => {
  let neighbours = [];
  for (let i = m-1; i <= m+1; i++) {
    for (let j = n-1; j <= n+1; j++ ) {
      if (i >=  0 && j >= 0 && `${i}__${j}` !== `${m}__${n}`) {
        neighbours.push(`${i}__${j}`);
      }
    }
  }
  return neighbours;
}

const getLiveNeighbours = (neighbours, activeCells) => {
  let liveNeighbours = [];
  neighbours.forEach((n) => {
    if (activeCells[n]) {
      liveNeighbours.push(n);
    }
  });
  return liveNeighbours;
}

const getStatsForActiveCell = (grid, activeCells) => {
  Object.keys(grid).forEach((e) => {
    grid[e].liveNeighbours = getLiveNeighbours(grid[e].neighbours, activeCells);
  });
  return grid;
}

const canLive = (currentCell) => {
  if (currentCell.liveNeighbours.length >= 2 && currentCell.liveNeighbours.length <= 3) {
    return true;
  }
  return false;
}

const getGrid = (rows, columns) => {
  const res = {};
  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < columns; j++) {
      res[`${i}__${j}`] = {
        neighbours: getNeighbours(i, j),
        liveNeighbours: [],
        isLive: false,
      }
    }
  }
  return res;
}

const reproduce = (activeState, currentGrid) => {
  const grid = {...currentGrid};
  const activeCells = {...activeState};
  Object.keys(activeCells).forEach(e => {
    grid[e].neighbours.forEach(n => {
      if (grid[n] && !grid[n].isLive) {
        const liveNeighours = getLiveNeighbours(grid[n].neighbours, activeCells);

        if (liveNeighours.length === 3) {
          console.log('reproduced cell', n);
          grid[n].isLive = true;
          activeCells[n] = true;
        }
      }
    });
  });
  return {
    grid,
    activeCells
  };
}

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

class App extends Component {
  constructor() {
    super();
    this.state = {
      step: 0,
      currentState: false,
      activeCells: {},
      rows: 10,
      columns: 10,
      interval: null,
      activeCellNeighbours: '',
      grid: {}
    };

    this.tick = this.tick.bind(this);
  }
  componentDidMount() {
    this.setState({
      grid: getGrid(this.state.rows, this.state.columns)
    });
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
      const grid = {...this.state.grid};
      const activeCells = {...this.state.activeCells};
      const key = `${i}__${j}`
  		if (grid[key].isLive) {
  			grid[key].isLive = false;
  		} else {
  			grid[key].isLive = true;
        activeCells[key] = true;
  		}
  		this.setState({
  			grid: getStatsForActiveCell(grid, activeCells),
        activeCells: activeCells
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
    let activeState = {...this.state.activeCells};
    let grid = {...this.state.grid};

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

        if (grid[newKey] && !grid[newKey].isLive) {
          delete activeState[e];
          grid[e].isLive = false;
          activeState[newKey] = true;
          grid[newKey].isLive = true;
        }
      });

      let newGrid = getStatsForActiveCell(grid, activeState);

      Object.keys(activeState).forEach((e) => {

        if (canLive(newGrid[e])) {
          newGrid[e].isLive = true;
          newGrid[e].liveNeighbours = getLiveNeighbours(newGrid[e].neighbours, activeState);
        } else {
          newGrid[e].isLive = false;
          delete activeState[e]
        }
      });
      newGrid = getStatsForActiveCell(grid, activeState);

      const reproduction = reproduce(activeState, newGrid);
      grid = reproduction.grid;
      activeState = reproduction.activeCells;

    } else {
      for(let i = 0; i < this.state.rows; i++) {
        activeState[`${getRandomInt(0, this.state.rows-1)}__${getRandomInt(0, this.state.columns-1)}`] = true;
      }
    }

    this.setState({
      grid: getStatsForActiveCell(grid, activeState),
      activeCells: activeState
    }, () => console.log('New State after Tick', this.state.grid, this.state.activeCells));
  }

  render() {
    return (
      <div>
        <h3 className="center-text"> {this.state.activeCellNeighbours} </h3>
        <Grid
        rows={this.state.rows}
        columns={this.state.columns}
        handleClick={this.handleClick.bind(this)}
        activeCell={this.state.activeCells}/>
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
          <button
          className="btn"
          onClick={()=>{this.setState({currentState: !this.state.currentState})}}>
            Toggle State
          </button>
        </div>
      </div>
    );
  }
}

export default App;
