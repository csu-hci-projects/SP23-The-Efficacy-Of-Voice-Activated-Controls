import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class VoiceControlService {
	constructor() {}

	sendLoginInfo(login: any) {
		//TODO write call here when complete
		console.log('sending login! ' + JSON.stringify(login));
	}

	sendRegistrationInfo(registration: any) {
		//TODO write call here when complete
		console.log('sending login! ' + JSON.stringify(registration));
	}
}
