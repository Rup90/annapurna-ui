import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';


@NgModule({
  declarations: [
    AppComponent
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
        link: createHttpLink({ uri: 'http://localhost:8000/graphql' }),
      };
    },
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
