import React, { Component } from 'react';

class Grid extends Component {

	handleClick(i, j) {
		this.props.handleClick(i, j);
	}

	render () {
		return (
				<div>
					<div className="columnCounter">
						{
							[...Array(this.props.rows)].map((r, i) => (
								<span key={i}>{i}</span>
							))
						}
					</div>
					{
						[...Array(this.props.rows)].map((r, i) => (
							<div className="row" key={i}>
								<span className="rowCounter">{i}</span>
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
