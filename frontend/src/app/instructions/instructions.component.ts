import { Component } from '@angular/core';

@Component({
	selector: 'app-instructions',
	templateUrl: './instructions.component.html',
	styleUrls: ['./instructions.component.css'],
})
export class InstructionsComponent {
	continue() {
		console.log('Continuing to first test...');
	}
}