import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={props.highlight ? { fontStyle: 'italic' } : null}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={this.props.location === i || (this.props.solution && this.props.solution.includes(i))}
      />
    );
  }

  // render() {
  //   return (
  //     <div>
  //       <div className="board-row">
  //         {this.renderSquare(0)}
  //         {this.renderSquare(1)}
  //         {this.renderSquare(2)}
  //       </div>
  //       <div className="board-row">
  //         {this.renderSquare(3)}
  //         {this.renderSquare(4)}
  //         {this.renderSquare(5)}
  //       </div>
  //       <div className="board-row">
  //         {this.renderSquare(6)}
  //         {this.renderSquare(7)}
  //         {this.renderSquare(8)}
  //       </div>
  //     </div>
  //   );
  // }

  render() {
    let rows = []
    for (const rowIndex of [0, 1, 2]) {
      let row = []
      for (const colIndex of [0, 1, 2]) {
        const i = 3 * rowIndex + colIndex;
        row.push(this.renderSquare(i));
      }
      rows.push(<div className='board-row'>{row}</div>);
    }

    return (
      <div>{rows}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: null,
      }],
      stepNumber: 0,
      movesAreOrderedAsc: true,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const [winner, _] = calculateWinner(squares)
    if (winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const [winner, solution] = calculateWinner(current.squares);
    const draw = this.state.stepNumber === 9;

    let moves = history.map((step, move) => {
      const location = step.location;
      const row = Math.floor(location / 3) + 1;
      const col = location % 3 + 1;

      const desc = move ?
        'Go to move #' + move + ' (' + row + ',' + col + ')' :
        'Go to game start';
      const bold = this.state.stepNumber === move;
      return (
        <li key={'move' + move}>
          <button
            onClick={() => this.jumpTo(move)}
            style={bold ? { fontWeight: 'bold' } : null}
          >
            {desc}
          </button>
        </li>
      );
    });
    if (!this.state.movesAreOrderedAsc) {
      moves = moves.reverse();
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else if (draw) {
      status = 'Draw!';
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            location={current.location}
            solution={solution}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button onClick={() => this.setState({ movesAreOrderedAsc: !this.state.movesAreOrderedAsc })}>
            {this.state.movesAreOrderedAsc ? 'Descending order' : 'Ascending order'}
          </button>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return [null, null];
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
