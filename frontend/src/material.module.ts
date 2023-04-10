import { NgModule } from "@angular/core";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatRadioModule} from "@angular/material/radio";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table"
import {MatPaginatorModule} from "@angular/material/paginator"
import {MatSortModule} from "@angular/material/sort"
import {MatDialogModule} from "@angular/material/dialog"
import {MatSelectModule} from "@angular/material/select"
import {MatCheckboxModule} from "@angular/material/checkbox"
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';



@NgModule({
    exports: [
        MatInputModule,
        MatCardModule,
        MatRadioModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatDialogModule,
        MatSelectModule,
        MatCheckboxModule,
        MatToolbarModule,
		MatIconModule,
		MatFormFieldModule,
		MatTabsModule,
		MatGridListModule
    ]
})
export class MaterialModule { }