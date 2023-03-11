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

const appRoutes: Routes = [{ path: '', component: LoginComponent }];

@NgModule({
	declarations: [AppComponent, LoginComponent, ToolbarComponent],
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
	],
	providers: [VoiceControlService],
	bootstrap: [AppComponent],
})
export class AppModule {}
