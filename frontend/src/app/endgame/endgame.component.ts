import { Component, OnInit } from '@angular/core';
import { VoiceControlService } from './../voice-control.service';

@Component({
	selector: 'app-endgame',
	templateUrl: './endgame.component.html',
	styleUrls: ['./endgame.component.css'],
})
export class EndgameComponent implements OnInit {
	constructor(public VoiceControlService: VoiceControlService) {}
	ngOnInit(): void {
		this.VoiceControlService.postClickTimes();
		this.VoiceControlService.submitTestData().subscribe(
			(responses) => {
				console.log('All test data submitted successfully');
				console.log('Responses:', responses);
			},
			(error) => {
				console.error('Error submitting test data:', error);
			}
		);
	}
}
