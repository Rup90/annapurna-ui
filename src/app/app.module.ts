import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { connectApiLink } from './app.graphql.module';
import {  SideNavBarComponent } from './shared/components/sideNavBar/side-nav-bar.component';
import { DatePipe } from '@angular/common';
import { NotificationService } from './shared/dataservices/notification.service';
import { GraphQLModule } from './graphql.module';


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
    BrowserAnimationsModule,
    ApolloModule,
    HttpClientModule,
    GraphQLModule
  ],
  providers: [
  // {
  //   provide: APOLLO_OPTIONS,
  //   useFactory: () => {
  //     return {
  //       cache: new InMemoryCache({fragmentMatcher}),
  //       link: connectApiLink,
  //       defaultOptions
  //     };
  //   },
  // }, 
  DatePipe, NotificationService],
  bootstrap: [AppComponent, SideNavBarComponent]
})
export class AppModule { }
