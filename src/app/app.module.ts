import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { connectApiLink } from './app.graphql.module';
import {  SideNavBarComponent } from './shared/components/sideNavBar/side-nav-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    SideNavBarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ApolloModule,
    HttpClientModule
  ],
  providers: [{
    provide: APOLLO_OPTIONS,
    useFactory: () => {
      return {
        cache: new InMemoryCache(),
        link: connectApiLink,
      };
    },
  }],
  bootstrap: [AppComponent, SideNavBarComponent]
})
export class AppModule { }
