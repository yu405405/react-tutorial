import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state =  {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true
        }
    }

    handleClick(i) {
        // 配列の1つ目の要素をコピー
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        // コピーした配列の1つ目の要素を取得、{squares: Array(9).fill(null)}（というオブジェクト）
        const current = history[history.length - 1];
        // さらに{squares: Array(9).fill(null)}をコピー
        const squares = current.squares.slice()
        if(calculateWinner(squares) || squares[i]) {
            return
        }
        // squares配列のi番目に'X' or 'O'を代入する（textContentは不要）
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            // history.concat([{squares: square]}) これはどうなる？ concatの使い方
            // 【質問】[squares: square]がなぜ[{[null, null, null, null, null, null, null, null, null]}]になるのか？
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        })
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
        // ?? calculateWinner関数に引数current.squareasを渡しているが、calculateWinner関数の動きは？
        const winner = calculateWinner(current.squares);
        // ?? 
        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            // これはReactの書き方？（return()）
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })

        let status;
        if(winner) {
            status = 'Winner' + winner
        } else {
            status = 'Next player' + (this.state.xIsNext ? 'X' : 'O')
        }

        return (
            <div className='game'>
                <div className='game-board'>
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className='game-info'>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}



class Board extends React.Component {
    renderSquare(i) {
        return <Square
                    // squares[i]はどこから来ている？
                    value={this.props.squares[i]}
                    // onClick(i)はどこから来ている？
                    onClick={() => this.props.onClick(i)}
                />;
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        )
    }
}



function Square(props) {
    return (
        <button className='square' onClick={props.onClick}>
            {props.value}
        </button>
    )
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

    for(let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        // squares[a]でnullでないことを確認。
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            // 'X' or 'O' の文字列をreturn
            return squares[a]
        }
    }
    return null
}


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<Game />)