import { Injectable, Input } from '@angular/core';
import { SpeechRecognition, SpeechRecognitionEvent } from 'global';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class VoiceControlService {
	recognition: SpeechRecognition | null = null;
	silenceTimeout: any = null;

	constructor() {
		this.initializeRecognition();
	}

	initializeRecognition(): void {
		if ('SpeechRecognition' in window) {
			this.recognition = new (window as any).SpeechRecognition();
		} else if ('webkitSpeechRecognition' in window) {
			this.recognition = new (window as any).webkitSpeechRecognition();
		}

		if (this.recognition) {
			this.recognition.interimResults = false;
			this.recognition.continuous = false;
		}

		// Interim mode and continuous
		// if (this.recognition) {
		// 	this.recognition.interimResults = false;
		// 	this.recognition.continuous = false;
		// }
	}

	sendLoginInfo(login: any) {
		//TODO write call here when complete
		console.log('sending login! ' + JSON.stringify(login));
	}

	sendRegistrationInfo(registration: any) {
		//TODO write call here when complete
		console.log('sending Registration! ' + JSON.stringify(registration));
	}

	start(): Observable<string> {
		return new Observable((observer) => {
			if (!this.recognition) {
				observer.error('SpeechRecognition not supported');
				alert('SpeechRecognition not supported by browser');
				return;
			}

			this.recognition.onresult = (event: SpeechRecognitionEvent) => {
				observer.next(event.results[0][0].transcript);
				if (this.silenceTimeout) {
					clearTimeout(this.silenceTimeout);
				}
				this.silenceTimeout = setTimeout(() => {
					this.stop();
					observer.complete();
				}, 2000);
			};

			this.recognition.onerror = (error: ErrorEvent) => {
				if (error.error === 'no-speech') {
					alert('No Speech Detected!');
				}
				observer.error(error);
			};

			this.recognition.start();
		});
	}

	stop(): void {
		if (this.recognition) {
			this.recognition.stop();
		}
	}
}
