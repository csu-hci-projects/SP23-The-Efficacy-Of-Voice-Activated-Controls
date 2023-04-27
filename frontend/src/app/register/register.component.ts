import { VoiceControlService } from './../voice-control.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
	registerForm!: FormGroup;

	constructor(private fb: FormBuilder, private VoiceControlService: VoiceControlService, private router: Router) {}

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
				if (!res.error) {
					console.log('completed: ' + JSON.stringify(res));
					this.VoiceControlService.setUserID(res.id);
					this.router.navigate(['/instructions']);
				}
			});
		}
	}
}
