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
				// All requests have completed successfully
				console.log('All test data submitted successfully');
				console.log('Responses:', responses);

				// You can now navigate to a success page or show a success message to the user
			},
			(error) => {
				// At least one request has failed
				console.error('Error submitting test data:', error);
			}
		);
	}
}
