import { VoiceControlService } from './../voice-control.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/material.module';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent {
	loginForm!: FormGroup;

	constructor(private fb: FormBuilder, private VoiceControlService: VoiceControlService,
				private toastr: ToastrService, private service: AuthService,
				private route: Router) {
					sessionStorage.clear();
				}

	result: any;

	ngOnInit() {
		this.loginForm = this.fb.group({
			username: ['', Validators.required],
			password: ['', Validators.required],
		});
	}

	login(data:any) {
		if (this.loginForm.valid) {
			this.service.GetID(this.loginForm.value.id).subscribe(item => {
				this.result = item;
		if (this.result.password === this.loginForm.value.password){
			sessionStorage.setItem('username',this.result.id);
			this.VoiceControlService.sendLoginInfo(this.loginForm.value);
			this.route.navigate(['instructions']);
		} else {
			this.toastr.error('Invalid credentials');
		}
	});
		}else{
			this.toastr.warning('Please enter valid data');
		  }
	}
}
