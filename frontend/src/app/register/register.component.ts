import { VoiceControlService } from './../voice-control.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
	registerForm!: FormGroup;

	constructor(private fb: FormBuilder, private VoiceControlService: VoiceControlService) {}

	ngOnInit() {
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

	register() {
		if (this.registerForm.valid) {
			this.VoiceControlService.sendRegistrationInfo(this.registerForm.value);
		}
	}
}
