declare module 'vue-cli-plugin-apollo/graphql-client' {
  import { PersistedQueryLink } from '@apollo/client/link/persisted-queries'
  import { ApolloClient, ApolloClientOptions, Resolvers, DocumentNode } from '@apollo/client/core'
  import { InMemoryCacheConfig } from '@apollo/client/cache'
  import { Client } from 'graphql-ws'

  export interface ApolloClientClientConfig<TCacheShape> {
    // URL to the HTTP API
    httpEndpoint?: string
    // Url to the Websocket API
    wsEndpoint?: string
    // Token used in localstorage
    tokenName?: string
    // Enable this if you use Query persisting with Apollo Engine
    persisting?: boolean | PersistedQueryLink.Options
    // Is currently Server-Side Rendering or not
    ssr?: boolean
    // Only use Websocket for all requests (including queries and mutations)
    websocketsOnly?: boolean
    // Custom starting link.
    // If you want to replace the default HttpLink, set `defaultHttpLink` to false
    link?: string
    // If true, add the default HttpLink.
    // Disable it if you want to replace it with a terminating link using `link` option.
    defaultHttpLink?: boolean
    // Options for the default HttpLink
    httpLinkOptions?: object
    // Custom Apollo cache implementation (default is apollo-cache-inmemory)
    cache?: any | false
    // Options for the default cache
    inMemoryCacheOptions?: InMemoryCacheConfig
    // Additional Apollo client options
    apollo?: ApolloClientOptions<TCacheShape>
    // Function returning Authorization header token
    getAuth?: (tokenName: string) => string | void
    // Local Schema
    typeDefs?: string | string[] | DocumentNode | DocumentNode[]
    // Local Resolvers
    resolvers?: Resolvers | Resolvers[]
    // Hook called when you should write local state in the cache
    onCacheInit?: (cache: any) => void
  }

  export function createApolloClient<TCacheShape>(
    config: ApolloClientClientConfig<TCacheShape>
  ): {
    apolloClient: ApolloClient<TCacheShape>
    wsClient: Client
  }

  export function restartWebsockets(wsClient: Client): void
}

declare module 'vue-cli-plugin-apollo/graphql-server' {
  import { Resolvers, DocumentNode } from '@apollo/client/core'
  import { ContextFunction, Context } from 'apollo-server-core'
  import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
  import { DataSources } from 'apollo-server-core/dist/graphqlOptions'
  import { ApolloServerExpressConfig } from 'apollo-server-express'
  import { PubSubEngine } from 'graphql-subscriptions'
  import { Express } from 'express'

  export interface ApolloServerOption<TContext = Record<string, any>> {
    host?: string
    port: number
    graphqlPath: string
    subscriptionsPath: string
    // Enable automatic mocking
    enableMocks?: boolean
    // Enable Apollo Engine
    enableEngine?: boolean
    engineKey?: string
    // Base folder for the server source files
    serverFolder?: string
    // Cross-Origin options
    cors?: string
    // Requests timeout (ms)
    timeout?: number
    // Integrated apollo engine
    integratedEngine?: boolean
    // For enable typescript server files
    // if you don't have @vue/cli-plugin-typescript
    typescript?: boolean
    // Apollo server options (will be merged with the included default options)
    serverOptions: ApolloServerExpressConfig
    quiet?: boolean
    paths: {
      typeDefs: string | string[] | DocumentNode | DocumentNode[]
      resolvers: Resolvers | Resolvers[]
      context: ContextFunction<ExpressContext, Context> | Context
      pubsub?: PubSubEngine
      server?: (app: Express) => void
      directives: Record<string, any>
      dataSources?: () => DataSources<TContext>
    }
  }

  function ApolloServer<TContext>(
    options: ApolloServerOption<TContext>,
    cb?: () => void
  ): string | string[] | DocumentNode | DocumentNode[]

  export default ApolloServer
}
