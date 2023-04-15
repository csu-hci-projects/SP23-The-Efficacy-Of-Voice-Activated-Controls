import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructionsComponent } from './instructions/instructions.component';
import { Test1Component } from './test1/test1.component';
import { Test2Component } from './test2/test2.component';
import { RegisterComponent } from './register/register.component';

const appRoutes: Routes = [
	{ path: '', component: RegisterComponent },
	{ path: 'instructions', component: InstructionsComponent },
	{ path: 'test1', component: Test1Component },
	{ path: 'test2', component: Test2Component },
	{ path: 'register', component: RegisterComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(appRoutes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
