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

	constructor(private voiceControlService: VoiceControlService, private cdr: ChangeDetectorRef) {}

	ngOnInit() {
		this.resetSpeechRecognition();
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}

	resetSpeechRecognition(): void {
		this.voiceControlService.initializeRecognition();
	}

	startListening(): void {
		console.log('is recording: ' + this.isRecording);
		this.isRecording = true;
		this.cdr.detectChanges();
		this.subscription = this.voiceControlService.start().subscribe({
			next: (text: string) => {
				this.command = text.trim().split(' ');
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
	}

	allowUserToContinue(event: any) {
		console.log('game over in parent: ' + JSON.stringify(event));
		this.continue = true;
	}
}
