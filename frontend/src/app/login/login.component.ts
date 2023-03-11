import { VoiceControlService } from './../voice-control.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent {
	selectedTabIndex = 0;
	loginForm!: FormGroup;
	registerForm!: FormGroup;

	constructor(private fb: FormBuilder, private VoiceControlService: VoiceControlService) {}

	ngOnInit() {
		this.loginForm = this.fb.group({
			username: ['', Validators.required],
			password: ['', Validators.required],
		});

		this.registerForm = this.fb.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]{5,}$/)]],
			password: [
				'',
				[
					Validators.required,
					Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
				],
			],
		});
	}

	login() {
		if (this.loginForm.valid) {
			this.VoiceControlService.sendLoginInfo(this.loginForm.value);
		}
	}

	register() {
		if (this.registerForm.valid) {
			this.VoiceControlService.sendRegistrationInfo(this.registerForm.value);
		}
	}
}
