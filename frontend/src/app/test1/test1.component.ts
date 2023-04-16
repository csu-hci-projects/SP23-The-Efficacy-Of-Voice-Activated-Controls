import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-test1',
	templateUrl: './test1.component.html',
	styleUrls: ['./test1.component.css'],
})
export class Test1Component {
	continue: boolean = false;

	allowUserToContinue(event: any) {
		console.log('game over in parent: ' + JSON.stringify(event));
		this.continue = true;
	}
}
