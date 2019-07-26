import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FeatureHolderComponent } from './components/feature-holder/feature-holder.component';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';


@NgModule({
  declarations: [
    AppComponent,
    FeatureHolderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    Ng2FlatpickrModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
