import { VoiceControlService } from './../voice-control.service';
import { Component, Input, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-test2',
	templateUrl: './test2.component.html',
	styleUrls: ['./test2.component.css'],
})
export class Test2Component implements OnInit, OnDestroy {
	command: string[] = [];
	subscription: Subscription | null = null;
	isRecording: boolean = false;
	continue: boolean = false;
	warmUpComplete: boolean = false;

	constructor(private voiceControlService: VoiceControlService, private cdr: ChangeDetectorRef) {}

	ngOnInit() {
		this.voiceControlService.initializeRecognition();
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}

	startWarmUp(): void {
		this.isRecording = true;
		this.subscription = this.voiceControlService.start().subscribe({
			next: (text: string) => {
				if (text.trim().toLowerCase() === 'test') {
					this.warmUpComplete = true;
					this.isRecording = false;
					this.cdr.detectChanges();
				} else {
					alert('Did not recognize "test", please try again.');
				}
			},
			error: (error: any) => {
				console.log(error);
				this.isRecording = false;
			},
			complete: () => {
				this.isRecording = false;
				this.subscription?.unsubscribe();
				this.voiceControlService.stop();
			},
		});
	}

	startListening(): void {
		this.isRecording = true;
		this.voiceControlService.startTimer();
		this.cdr.detectChanges();
		this.subscription = this.voiceControlService.start().subscribe({
			next: (text: string) => {
				text = text.toLowerCase();
				let words = text.trim().split(' ');
				let commands: string[] = [];
				words.forEach((word) => {
					if (/^\d{2,}$/.test(word)) {
						let digits = word.split('');
						commands.push(...digits);
					} else {
						commands.push(word);
					}
				});
				this.command = commands.filter((command) => ['1', '2', '3', '4'].includes(command));
			},
			error: (error: any) => {
				console.log(error);
				this.isRecording = false;
				this.cdr.detectChanges();
			},
			complete: () => {
				this.isRecording = false;
				this.subscription?.unsubscribe();
				this.voiceControlService.stop();
				this.voiceControlService.stopTimer('voice');
				this.cdr.detectChanges();
			},
		});
	}

	stopListening(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
		this.isRecording = false;
		this.voiceControlService.stop();
		this.voiceControlService.stopTimer('voice');
	}

	allowUserToContinue(event: any) {
		this.continue = true;
		this.cdr.detectChanges();
	}

	printVoiceScores() {
		this.voiceControlService.printVoiceTimes();
	}
}
