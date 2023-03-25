import { Component } from '@angular/core';

@Component({
	selector: 'app-tic-tac-toe',
	templateUrl: './tic-tac-toe.component.html',
	styleUrls: ['./tic-tac-toe.component.css'],
})
export class TicTacToeComponent {
	board: (string | null)[] = Array(9).fill(null);
	currentPlayer: 'X' | 'O' = 'X';
	gameOver = false;
	winner: 'X' | 'O' | null = null;
	lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	makeMove(index: number): void {
		if (!this.board[index] && !this.gameOver) {
			this.board[index] = this.currentPlayer;
			this.checkForGameOver();
			this.switchPlayers();
			if (!this.gameOver) {
				this.computerMove();
			}
		}
	}

	reset() {
		this.board = Array(9).fill(null);
		this.currentPlayer = 'X';
		this.gameOver = false;
		this.winner = null;
	}

	private switchPlayers(): void {
		this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
	}

	private getAvailableMoves(): number[] {
		return this.board.map((cell, index) => (cell === null ? index : -1)).filter((index) => index !== -1);
	}

	private getWinner(): 'X' | 'O' | null {
		for (let line of this.lines) {
			const [a, b, c] = line;
			if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
				return this.board[a] as 'X' | 'O';
			}
		}
		return null;
	}

	private checkForGameOver(): void {
		this.winner = this.getWinner();
		this.gameOver = this.winner !== null || this.board.every((cell) => cell !== null);
	}

	private minimax(depth: number, maximizingPlayer: boolean): number {
		const winner = this.getWinner();
		const isTerminal = winner !== null || this.getAvailableMoves().length === 0;

		if (isTerminal) {
			if (winner === 'O') {
				return 10 - depth;
			} else if (winner === 'X') {
				return depth - 10;
			} else {
				return 0;
			}
		}

		const availableMoves = this.getAvailableMoves();
		let bestValue = maximizingPlayer ? -Infinity : Infinity;

		for (let move of availableMoves) {
			this.board[move] = maximizingPlayer ? 'O' : 'X';
			const currentValue = this.minimax(depth + 1, !maximizingPlayer);
			this.board[move] = null;

			if (maximizingPlayer) {
				bestValue = Math.max(bestValue, currentValue);
			} else {
				bestValue = Math.min(bestValue, currentValue);
			}
		}

		return bestValue;
	}

	private computerMove(): void {
		const availableMoves = this.getAvailableMoves();
		let bestMove = -1;
		let bestValue = -Infinity;

		for (let move of availableMoves) {
			this.board[move] = this.currentPlayer;
			this.checkForGameOver();
			const currentValue = this.minimax(0, false);
			this.board[move] = null;
			this.gameOver = false;
			this.winner = null;

			if (currentValue > bestValue) {
				bestValue = currentValue;
				bestMove = move;
			}
		}

		if (bestMove !== -1) {
			this.board[bestMove] = this.currentPlayer;
			this.checkForGameOver();
			this.switchPlayers();
		}
	}

	// //dumb computer - moves at random in case minimax proves only draws
	// private computerMove(): void {
	// 	const availableMoves = this.getAvailableMoves()
	// 	if (availableMoves.length) {
	// 	  const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
	// 	  this.board[move] = this.currentPlayer;
	// 	  this.checkForGameOver();
	// 	  this.switchPlayers();
	// 	}
	//   }
	// }
}
