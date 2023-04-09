import { VoiceControlService } from './../voice-control.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-test2',
	templateUrl: './test2.component.html',
	styleUrls: ['./test2.component.css'],
})
export class Test2Component implements OnInit, OnDestroy {
	command: string[] = [];
	subscription: Subscription | null = null;

	constructor(private voiceControlService: VoiceControlService) {}

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
		// this.command = [];
		this.subscription = this.voiceControlService.start().subscribe({
			next: (text: string) => {
				this.command = text.trim().split(' ');
				console.log(this.command);
			},
			error: (error: any) => console.log(error),
			complete: () => {
				this.subscription?.unsubscribe();
				this.voiceControlService.stop();
			},
		});
	}

	stopListening(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
		this.voiceControlService.stop();
	}
}
