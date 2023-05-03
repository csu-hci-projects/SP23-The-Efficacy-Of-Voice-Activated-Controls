import { Injectable, Input } from '@angular/core';
import { SpeechRecognition, SpeechRecognitionEvent } from 'global';
import { Observable, catchError, forkJoin, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class VoiceControlService {
	private baseUrl = 'http://localhost:5000';
	recognition: SpeechRecognition | null = null;
	silenceTimeout: any = null;
	startTime: number | null = null;
	userTimes: number[] | null = [];
	clickRoundTimes: Array<number[] | null> = new Array<number[] | null>();
	clickRoundsSurvived: number[] = [];
	voiceRoundTimes: Array<number[] | null> = new Array<number[] | null>();
	voiceRoundsSurvived: number[] = [];
	userID: number | null = null;

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

	submitTestData() {
		console.log('submitting test data');
		const numberOfLives = 2;
		const requests = [];

		for (let life = 0; life < numberOfLives; life++) {
			const testData = {
				user_id: this.userID,
				click_test_life_number: life,
				click_test_rounds_survived: this.clickRoundsSurvived[life],
				click_test_move_times: this.clickRoundTimes[life] || [],
				voice_test_life_number: life,
				voice_test_rounds_survived: this.voiceRoundsSurvived[life],
				voice_test_move_times: this.voiceRoundTimes[life] || [],
			};

			requests.push(
				this.http.post(`${this.baseUrl}/submit_test_data`, testData).pipe(
					catchError((error) => {
						alert('Error submitting test data. Please contact your test administrator.');
						console.error(error);
						return of(error);
					})
				)
			);
		}

		return forkJoin(requests);
	}

	setUserID(id: number) {
		console.log('setting user id: ' + id);
		this.userID = id;
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
				}, 1000);
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

	startTimer() {
		this.startTime = new Date().getTime();
	}

	stopTimer(type: string) {
		if (this.startTime && this.userTimes) {
			const endTime = new Date().getTime();
			let timeElapsed = null;
			if (type === 'voice') {
				timeElapsed = (endTime - this.startTime - 1000) / 1000;
			} else {
				timeElapsed = (endTime - this.startTime) / 1000;
			}
			this.userTimes.push(timeElapsed);
			this.startTime = null;
		}
	}

	removeLastTime() {
		if (this.userTimes) {
			this.userTimes.pop();
		}
	}

	pushRoundTimes(type: boolean, rounds: number) {
		if (type === false) {
			console.log('pushing click times');
			this.clickRoundTimes.push(this.userTimes);
			this.clickRoundsSurvived.push(rounds);
			this.userTimes = [];
		} else {
			console.log('pushing voice times');
			this.voiceRoundTimes.push(this.userTimes);
			this.voiceRoundsSurvived.push(rounds);
			this.userTimes = [];
		}
	}

	postClickTimes() {
		console.log('posting click times');
		this.userTimes = [];
		this.startTime = null;
	}

	printClickTimes() {
		console.log('Printing click times:');
		this.clickRoundTimes.forEach((round, index) => {
			console.log(`Round ${index + 1}: ${round}`);
		});
		this.clickRoundsSurvived.forEach((round, index) => {
			console.log(`Max Round ${index + 1}: ${round}`);
		});
	}

	printVoiceTimes() {
		console.log('printing voice times:');
		this.voiceRoundTimes.forEach((round, index) => {
			console.log(`Round ${index + 1}: ${round}`);
		});
		this.voiceRoundsSurvived.forEach((round, index) => {
			console.log(`Max Round ${index + 1}: ${round}`);
		});
	}
}
