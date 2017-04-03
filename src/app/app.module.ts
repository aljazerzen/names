import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule}   from '@angular/forms';

import {AppComponent}  from './app.component';
import {AppRoutingModule} from './app.routing.module';
import {NameComponent} from './name.component';
import {HttpModule, JsonpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  imports: [BrowserModule, FormsModule, AppRoutingModule, HttpModule, JsonpModule, BrowserAnimationsModule],
  declarations: [AppComponent, NameComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
