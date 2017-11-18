import React, { Component } from 'react';

class Grid extends Component {

	handleClick(i, j) {
		this.props.handleClick(i, j);
	}

	render () {
		return (
				<div>
					{
						[...Array(this.props.rows)].map((r, i) => (
							<div className="row" key={i}>
								{
									[...Array(this.props.columns)].map((c, j) => (
										<div className={`col ${this.props.activeCell[`${i}__${j}`] ? 'active' : ''}`} key={j} onClick={this.handleClick.bind(this, i, j)}>

										</div>
									))
								}
							</div>
						))
					}
				</div>
			)
	}
}

export default Grid;
