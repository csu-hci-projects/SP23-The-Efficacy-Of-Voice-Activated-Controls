import { Component, OnInit } from '@angular/core';
import { VoiceControlService } from './../voice-control.service';

@Component({
	selector: 'app-instructions2',
	templateUrl: './instructions2.component.html',
	styleUrls: ['./instructions2.component.css'],
})
export class Instructions2Component {
	constructor(public VoiceControlService: VoiceControlService) {}

	continue() {
		console.log('Continuing to second test...');
	}
}
