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
			firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
			lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
		});
	}

	register() {
		if (this.registerForm.valid) {
			let response = this.VoiceControlService.sendRegistrationInfo(this.registerForm.value);
			response.subscribe((res) => {
				console.log('completed.');
			});
		}
	}
}
