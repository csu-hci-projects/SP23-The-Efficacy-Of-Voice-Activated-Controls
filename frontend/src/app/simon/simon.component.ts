import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
	selector: 'app-simon',
	templateUrl: './simon.component.html',
	styleUrls: ['./simon.component.css'],
})
export class SimonComponent implements OnChanges {
	sequence: number[] = [];
	playerSequence: number[] = [];
	activeColor: number | null = null;
	counter: number = 0;
	userMessage: string = '';
	gameState: 'idle' | 'playingSequence' | 'awaitingInput' = 'idle';
	livesRemaining: number = 3;
	gameInProgress: boolean = false;
	@Input() currentCommand: string[] = [];

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['currentCommand'] && !changes['currentCommand'].firstChange) {
			console.log('currentCommand changed:', changes['currentCommand'].currentValue);
			// Add any additional logic to handle the change in the currentCommand
		}
	}

	delay(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async startGame() {
		this.gameInProgress = true;
		this.livesRemaining = 3;
		this.sequence = [];
		this.counter = 0;
		this.userMessage = '';
		await this.nextRound();
	}

	async playSequence() {
		for (const color of this.sequence) {
			await this.lightUpSquare(color, 500);
			await this.delay(250);
		}
	}

	async nextRound() {
		this.playerSequence = [];
		this.gameState = 'playingSequence';
		this.counter++;
		this.sequence.push(Math.floor(Math.random() * 4));
		await this.playSequence();
		this.gameState = 'awaitingInput';
	}

	async clickSquare(color: number) {
		if (this.gameState !== 'awaitingInput') return;
		this.playerSequence.push(color);
		this.lightUpSquare(color, 250);

		if (this.sequence[this.playerSequence.length - 1] !== color) {
			await this.incorrectInput();
		} else if (this.playerSequence.length === this.sequence.length) {
			this.userMessage = `Round ${this.counter} complete!`;
			await this.delay(1000);
			await this.nextRound();
		}
	}

	async incorrectInput() {
		this.livesRemaining--;
		if (this.livesRemaining <= 0) {
			this.userMessage = 'You lost! Press Start to play again.';
			this.gameInProgress = false;
		} else {
			this.userMessage = `Incorrect input. Lives remaining: ${this.livesRemaining}`;
			await this.nextRound();
		}
	}

	async lightUpSquare(color: number, duration: number) {
		this.activeColor = color;
		const audio = this.playTone(color);
		await this.delay(duration);
		this.activeColor = null;
		audio.pause();
		audio.currentTime = 0;
	}

	playTone(color: number): HTMLAudioElement {
		const audio = new Audio(`../../assets/${color}.wav`);
		audio.play();
		return audio;
	}
}
