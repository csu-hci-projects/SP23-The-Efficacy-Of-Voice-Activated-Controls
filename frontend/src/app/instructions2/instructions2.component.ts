import { Component } from '@angular/core';

@Component({
	selector: 'app-instructions2',
	templateUrl: './instructions2.component.html',
	styleUrls: ['./instructions2.component.css'],
})
export class Instructions2Component {
	continue() {
		console.log('Continuing to first test...');
	}
}
