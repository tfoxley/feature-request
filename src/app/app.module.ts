import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { FeatureHolderComponent } from './components/feature-holder/feature-holder.component';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import {
  ButtonModule,
  FormFieldModule,
  InputModule,
  SelectModule,
  IconModule
} from '@wcf-insurance/cashmere';
import { TypeaheadComponent } from './components/typeahead/typeahead.component';
import { TypeaheadItemComponent } from './components/typeahead-item/typeahead-item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    FeatureHolderComponent,
    TypeaheadComponent,
    TypeaheadItemComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    ButtonModule,
    FormFieldModule,
    InputModule,
    SelectModule,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
    Ng2FlatpickrModule,
    BrowserAnimationsModule
  ],
  exports: [ButtonModule, InputModule, SelectModule, IconModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
