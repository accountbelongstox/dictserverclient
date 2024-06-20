export default {
  // ...
  "graphql": {
    enabled: true,
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: true,
      depthLimit: 1000,
      amountLimit: 1000000,
      apolloServer: {
        tracing: true,
        bodyParserConfig: {
          limit: "150mb",
          formLimit: "150mb", 
          jsonLimit: "150mb",
          textLimit: "150mb",
          xmlLimit: "150mb",
        },
      }
    }
  },
  "apollo-sandbox": {
    // enables the plugin only in development mode
    // if you also want to use it in production, set this to true
    // keep in mind that graphql playground has to be enabled
    //   enabled: process.env.NODE_ENV === "production" ? false : true,
    enabled: true,
    // endpoint: "https://tunneled-strapi.com/graphql", // OPTIONAL - endpoint has to be accessible from the browser
  },
  seo: {
    enabled: true,
  },
  // ...
};