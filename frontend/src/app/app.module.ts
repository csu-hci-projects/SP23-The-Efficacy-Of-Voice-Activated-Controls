import { VoiceControlService } from './voice-control.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { Test1Component } from './test1/test1.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';
import { SimonComponent } from './simon/simon.component';
import { InstructionsComponent } from './instructions/instructions.component';

const appRoutes: Routes = [
	{ path: '', component: LoginComponent },
	{ path: 'instructions', component: InstructionsComponent },
	{ path: 'test1', component: Test1Component },
];

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		ToolbarComponent,
		Test1Component,
		TicTacToeComponent,
		SimonComponent,
		InstructionsComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		MatToolbarModule,
		MatIconModule,
		MatButtonModule,
		RouterModule,
		MatCardModule,
		MatFormFieldModule,
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
		RouterModule.forRoot(appRoutes),
		MatTabsModule,
		MatGridListModule,
	],
	providers: [VoiceControlService],
	bootstrap: [AppComponent],
})
export class AppModule {}
