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
import { VoiceControlService } from './../voice-control.service';

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
	livesRemaining: number = 2;
	gameInProgress: boolean = false;
	gameOver: boolean = false;
	@Input() currentCommand: string[] = [];
	@Input() clickDisabled: boolean = false;
	@Output() sendGameOver = new EventEmitter<boolean>();
	@Input() timerActive: boolean = false;
	@Output() timerActiveChange = new EventEmitter<boolean>();
	voiceCommandInProgress!: boolean;
	incorrectClick: boolean = false;

	constructor(private cdr: ChangeDetectorRef, public VoiceControlService: VoiceControlService) {}

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
		this.voiceCommandInProgress = true;
		let continueProcessingCommands = true;

		for (const command of commands) {
			if (!continueProcessingCommands) {
				break;
			}
			console.log('processing command: ' + command);
			switch (command) {
				case '1':
					continueProcessingCommands = await this.clickSquare(0);
					break;
				case '2':
					continueProcessingCommands = await this.clickSquare(1);
					break;
				case '3':
					continueProcessingCommands = await this.clickSquare(2);
					break;
				case '4':
					continueProcessingCommands = await this.clickSquare(3);
					break;
				default:
					alert(
						'Invalid voice command detected: "' +
							command +
							'". If the issue persists be sure to articulate, enunciate between words, and cut down on background noise. Please record again.'
					);
					this.VoiceControlService.removeLastTime();
					break;
			}
			await this.delay(500); // Add a small delay between processing commands
		}

		this.voiceCommandInProgress = false;
		this.currentCommand = []; // Clear the current command after processing all commands
		this.cdr.detectChanges();
	}

	async startGame() {
		this.gameInProgress = true;
		this.livesRemaining = 2;
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

	async clickSquare(color: number): Promise<boolean> {
		if (this.gameState !== 'awaitingInput') return false;

		// Check if the player has already provided enough inputs for the current round
		if (this.playerSequence.length >= this.sequence.length && !this.voiceCommandInProgress) {
			console.log('Ignoring extra input');
			return false;
		}

		this.playerSequence.push(color);
		this.lightUpSquare(color, 250);

		if (this.sequence[this.playerSequence.length - 1] !== color) {
			await this.handleIncorrectInput();
			return false;
		} else if (this.playerSequence.length === this.sequence.length) {
			this.userMessage = `Round ${this.counter} complete!`;
			if (this.clickDisabled === false) {
				this.stopClickTimer();
			}
			await this.delay(2000);
			await this.nextRound();
			return false;
		}
		return true;
	}

	async handleIncorrectInput() {
		this.stopClickTimer();
		this.livesRemaining--;
		if (this.livesRemaining <= 0) {
			this.VoiceControlService.pushRoundTimes(this.clickDisabled, this.counter);
			this.userMessage = 'Game Over!';
			this.gameInProgress = false;
			this.gameOver = true;
			this.sendGameOver.emit(true);
		} else {
			this.userMessage = `Incorrect input. Lives remaining: ${this.livesRemaining}`;
			this.VoiceControlService.pushRoundTimes(this.clickDisabled, this.counter);
			this.sequence = [];
			this.counter = 0;
			await this.delay(2000);
			await this.nextRound();
		}
	}

	stopClickTimer() {
		console.log('stopping');
		this.timerActive = false;
		this.timerActiveChange.emit(this.timerActive);
	}

	async incorrectInput() {
		this.stopClickTimer();
		this.livesRemaining--;
		if (this.livesRemaining <= 0) {
			this.VoiceControlService.pushRoundTimes(this.clickDisabled, this.counter);
			this.userMessage = 'Game Over!';
			this.gameInProgress = false;
			this.gameOver = true;
			this.sendGameOver.emit(true);
		} else {
			this.userMessage = `Incorrect input. Lives remaining: ${this.livesRemaining}`;
			this.VoiceControlService.pushRoundTimes(this.clickDisabled, this.counter);
			this.sequence = [];
			this.counter = 0;
			await this.delay(2000);
			await this.nextRound();
		}
	}

	async lightUpSquare(color: number, duration: number) {
		this.activeColor = color;
		this.cdr.detectChanges();
		const audio = this.playTone(color);
		await this.delay(duration);
		this.activeColor = null;
		this.cdr.detectChanges();
		audio.pause();
		audio.currentTime = 0;
	}

	playTone(color: number): HTMLAudioElement {
		const audio = new Audio(`../../assets/${color}.wav`);
		audio.play();
		return audio;
	}
}
