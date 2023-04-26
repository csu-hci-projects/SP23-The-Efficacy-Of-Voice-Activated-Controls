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
	}
}
