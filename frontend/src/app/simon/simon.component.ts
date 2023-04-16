import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';

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
	gameOver: boolean = false;
	@Input() currentCommand: string[] = [];
	@Output() sendGameOver = new EventEmitter<boolean>();

	constructor(private cdr: ChangeDetectorRef) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['currentCommand'] && !changes['currentCommand'].firstChange) {
			console.log('command received: ' + changes['currentCommand'].currentValue);
			this.processVoiceCommand(changes['currentCommand'].currentValue);
		}
	}

	delay(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async processVoiceCommand(commands: string[]) {
		for (const command of commands) {
			console.log('processing command: ' + command);
			switch (command) {
				case 'green':
					await this.clickSquare(0);
					break;
				case 'red':
					await this.clickSquare(1);
					break;
				case 'yellow':
					await this.clickSquare(2);
					break;
				case 'blue':
					await this.clickSquare(3);
					break;
				default:
					break;
			}
			await this.delay(500);
		}
		this.cdr.detectChanges();
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
			await this.delay(500);
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
		console.log('color: ' + color);
		if (this.gameState !== 'awaitingInput') return;
		this.playerSequence.push(color);
		this.lightUpSquare(color, 250);

		if (this.sequence[this.playerSequence.length - 1] !== color) {
			await this.delay(1000);
			await this.incorrectInput();
		} else if (this.playerSequence.length === this.sequence.length) {
			this.userMessage = `Round ${this.counter} complete!`;
			await this.delay(1000);
			await this.nextRound();
		}
		// this.cdr.detectChanges();
	}

	async incorrectInput() {
		this.livesRemaining--;
		if (this.livesRemaining <= 0) {
			this.userMessage = 'Game Over!';
			this.gameInProgress = false;
			this.gameOver = true;
			this.sendGameOver.emit(true);
		} else {
			this.userMessage = `Incorrect input. Lives remaining: ${this.livesRemaining}`;
			this.sequence = []; // Reset the sequence
			this.counter = 0; // Reset the counter
			await this.nextRound(); // Generate a new sequence with one color
		}
	}

	// async incorrectInput() {
	// 	this.livesRemaining--;
	// 	if (this.livesRemaining <= 0) {
	// 		this.userMessage = 'You lost! Thank you for playing!';
	// 		this.gameInProgress = false;
	// 		this.gameOver = true;
	// 		this.sendGameOver.emit(true);
	// 	} else {
	// 		this.userMessage = `Incorrect input. Lives remaining: ${this.livesRemaining}`;
	// 		await this.nextRound();
	// 	}
	// }

	async lightUpSquare(color: number, duration: number) {
		this.activeColor = color;
		this.cdr.detectChanges();
		const audio = this.playTone(color);
		await this.delay(duration);
		this.activeColor = null;
		this.cdr.detectChanges();
		audio.pause();
		audio.currentTime = 0;
		// this.cdr.detectChanges();
	}

	playTone(color: number): HTMLAudioElement {
		const audio = new Audio(`../../assets/${color}.wav`);
		audio.play();
		return audio;
	}
}
