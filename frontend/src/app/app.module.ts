import { VoiceControlService } from './voice-control.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { Test1Component } from './test1/test1.component';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';
import { SimonComponent } from './simon/simon.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { Test2Component } from './test2/test2.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/material.module';
import { RegisterComponent } from './register/register.component';
import { Instructions2Component } from './instructions2/instructions2.component';
import { EndgameComponent } from './endgame/endgame.component';

@NgModule({
	declarations: [
		AppComponent,
		ToolbarComponent,
		Test1Component,
		TicTacToeComponent,
		SimonComponent,
		InstructionsComponent,
		Test2Component,
		RegisterComponent,
		Instructions2Component,
		EndgameComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		AppRoutingModule,
		MaterialModule,
		HttpClientModule,
	],
	providers: [VoiceControlService],
	bootstrap: [AppComponent],
})
export class AppModule {}
