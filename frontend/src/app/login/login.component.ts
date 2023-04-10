import { VoiceControlService } from './../voice-control.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent {
	loginForm!: FormGroup;

	constructor(private fb: FormBuilder, private VoiceControlService: VoiceControlService,
				private toastr:ToastrService) {}

	ngOnInit() {
		this.loginForm = this.fb.group({
			username: ['', Validators.required],
			password: ['', Validators.required],
		});
	}

	login() {
		if (this.loginForm.valid) {
			this.VoiceControlService.sendLoginInfo(this.loginForm.value);
		}else{
			this.toastr.warning('Please enter valid data');
		  }
	}
}
