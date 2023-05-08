import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { VoiceControlService } from './../voice-control.service';

@Component({
	selector: 'app-test1',
	templateUrl: './test1.component.html',
	styleUrls: ['./test1.component.css'],
})
export class Test1Component implements OnInit {
	continue: boolean = false;
	timerActive: boolean = false;

	constructor(public VoiceControlService: VoiceControlService) {}

	ngOnInit() {
		this.VoiceControlService.resetTimes(false);
	}

	allowUserToContinue(event: any) {
		console.log('game over in parent: ' + JSON.stringify(event));
		this.continue = true;
	}

	startTimer() {
		this.timerActive = true;
		this.VoiceControlService.startTimer();
	}

	onTimerStateChanged(value: boolean): void {
		if (!value) {
			this.VoiceControlService.stopTimer('click');
		}
	}

	printScores() {
		this.VoiceControlService.printClickTimes();
	}
}
