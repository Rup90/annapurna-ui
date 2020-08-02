import { InMemoryCache } from 'apollo-cache-inmemory';

import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';

import { ApolloModule, APOLLO_OPTIONS, Apollo } from 'apollo-angular';

import { NgModule, Injector } from '@angular/core';

import { ApolloLink, split, Observable, FetchResult, fromPromise } from 'apollo-link';

import gql from 'graphql-tag';

import { WebSocketLink } from 'apollo-link-ws';

import { getMainDefinition } from 'apollo-utilities';

import { onError } from "apollo-link-error";

import { ApolloClient } from "apollo-client";

import { DataService } from './shared/dataservices/dataService';




const uri = 'http://localhost:8000/graphql'; // <-- add the URL of the GraphQL server here

 

export function createApollo(httpLink: HttpLink) {

        const link = split(

        // split based on operation type

        ({ query }) => {

            const def = getMainDefinition(query);

            return def.kind === 'OperationDefinition' && def.operation === 'subscription';

        },

        ws,

        // authLink.concat(onErrorLink).concat(httpLink.create({ uri }))

        ApolloLink.from([

            authLink,

            onErrorLink,

            httpLink.create({ uri })

        ])

    );    

    return {

        link: link,

        cache: new InMemoryCache()

    };

}

 

const authLink = new ApolloLink((operation, forward) => {

    // get the authentication token from local storage if it exists

    const token = localStorage.getItem('TOKEN');

    const refreshToken = localStorage.getItem('x-refresh-token');

  

    operation.setContext({

      headers: {

        authorization: token ? `Bearer ${token}` : '',

        'x-refresh-token': refreshToken ? `Bearer ${refreshToken}` : ''

      }

    });

 

    return forward(operation).map(response => {

        console.log(response);

        return response;

    });

});

 

const onErrorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {

    const module = GraphQLModule; 

    const myService = AppInjector.get(Apollo);

    const dataServ = new DataService();

    if (graphQLErrors) {

        for (let err of graphQLErrors) {

            console.log(err['statusCode']);

            switch (err['statusCode']) {

            case 500:

                // modify the operation context with a new token

                const oldHeaders = operation.getContext().headers;

                return new Observable(

                    (observer) => {

                    module.prototype.getRefreshToken(myService)

                    .subscribe((response) => {

                            dataServ.saveIntoLocalStorage('TOKEN', response.data.refreshJwtToken.token);

                            dataServ.saveIntoLocalStorage('x-refresh-token', response.data.refreshJwtToken.refreshToken);

                            const token = localStorage.getItem('TOKEN');

                            const refreshToken = localStorage.getItem('x-refresh-token');

                            operation.setContext({

                                headers: {                 

                                    authorization: `Bearer ${token}`,

                                    'x-refresh-token': `Bearer ${refreshToken}`

                                },

                            });

                            // retry the request, returning the new observable

                            forward(operation).subscribe(

                                {

                                    next: observer.next.bind(observer),

                                    error: observer.error.bind(observer),

                                    complete: observer.complete.bind(observer)

                                }

                            );

                        });  

                    }

                )                              

            }

        }     

    }  

});

 

const ws = new WebSocketLink({

    uri: `ws://localhost:8000/subscriptions`,

    options: {

      reconnect: true,

      timeout: 30000

    }

});

 

export let AppInjector: Injector;

 

@NgModule({

    exports: [ApolloModule, HttpLinkModule],

    providers: [

        {

            provide: APOLLO_OPTIONS,

            useFactory: createApollo,

            deps: [HttpLink],

        },

    ],

})

 

export class GraphQLModule{  

   

    constructor(

        private injector : Injector

    ) { 

        AppInjector = this.injector;

    }

    

    public getRefreshToken(apollo: Apollo) { 

        return apollo.query<any>({

            query: gql`

                query {

                    refreshJwtToken(data: {token: "Bearer ${localStorage.getItem('x-refresh-token')}"}) {

                        token,

                        refreshToken

                    }

                }

            `

          });

    }

}

 