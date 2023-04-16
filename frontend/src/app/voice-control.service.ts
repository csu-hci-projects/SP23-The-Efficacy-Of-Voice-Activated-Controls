import { Injectable, Input } from '@angular/core';
import { SpeechRecognition, SpeechRecognitionEvent } from 'global';
import { Observable, catchError, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class VoiceControlService {
	private baseUrl = 'http://localhost:5000';
	recognition: SpeechRecognition | null = null;
	silenceTimeout: any = null;

	constructor(private http: HttpClient) {
		this.initializeRecognition();
	}

	sendRegistrationInfo(registration: any) {
		console.log('registering: ' + JSON.stringify(registration));
		const url = `${this.baseUrl}/add_user?first_name=${registration.firstName}&last_name=${registration.lastName}`;
		return this.http.post(url, null).pipe(
			catchError((error) => {
				alert('Error Registering. Please contact your test administrator. Detail: ' + error.error.detail);
				console.error(error);
				return of(error);
			})
		);
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
