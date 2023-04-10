import { VoiceControlService } from './voice-control.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {enableProdMode} from '@angular/core';

import { LoginComponent } from './login/login.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { Test1Component } from './test1/test1.component';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';
import { SimonComponent } from './simon/simon.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { Test2Component } from './test2/test2.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { MaterialModule } from 'src/material.module';
import { RegisterComponent } from './register/register.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		ToolbarComponent,
		Test1Component,
		TicTacToeComponent,
		SimonComponent,
		InstructionsComponent,
		Test2Component,
  		RegisterComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		AppRoutingModule,
		MaterialModule,
		HttpClientModule,
    	ToastrModule.forRoot()
	],
	providers: [VoiceControlService],
	bootstrap: [AppComponent],
})
export class AppModule {}
