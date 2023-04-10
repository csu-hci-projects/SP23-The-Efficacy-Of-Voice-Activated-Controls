import { VoiceControlService } from './../voice-control.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    registerForm!: FormGroup;
  
    constructor(private fb: FormBuilder, private VoiceControlService: VoiceControlService, 
                private toastr:ToastrService, private service:AuthService,
                private router:Router) {}
  
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
        this.service.Registeruser(this.registerForm.value).subscribe(result => {
        this.toastr.success('Please contact admin for enable access.','Registered successfully')
        this.router.navigate([''])
        this.VoiceControlService.sendRegistrationInfo(this.registerForm.value);
      });

      }else{
        this.toastr.warning('Please enter valid data');
      }
    }

}
