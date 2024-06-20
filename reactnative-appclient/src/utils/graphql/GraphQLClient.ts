import { GRAPHQL_API_URL } from '../../constants';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { GraphQLResult } from '../../constants/types';

class GraphQLClient {
  private client: ApolloClient<any>;

  constructor() {
    this.client = new ApolloClient({
      uri: GRAPHQL_API_URL,
      cache: new InMemoryCache(),
    });
  }

  getClient(): ApolloClient<any> {
    return this.client;
  }

  async exec(graphqlStr: string, variables: any = {}): Promise<GraphQLResult> {
    return this.executeGraphQL(graphqlStr, variables);
  }

  async execWithJWT(graphqlStr: string, variables: any = {}, getJwt: () => string): Promise<GraphQLResult> {
    const jwt = getJwt();
    if (!jwt) {
      return {
        success: false,
        message: 'Unauthorized: No JWT provided',
      };
    }
    const context = {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };
    return this.executeGraphQL(graphqlStr, variables, context);
  }

  private async executeGraphQL(graphqlStr: string, variables: any = {}, context = {}): Promise<GraphQLResult> {
    const start = performance.now();
    try {
      const result = await this.client.query({
        query: gql`${graphqlStr}`,
        variables: variables,
        context: context, 
        fetchPolicy: 'network-only',
      });
      const end = performance.now();
      return {
        success: true,
        message: 'Operation successful',
        data: result.data,
        consumption_time: end - start,
      };
    } catch (error) {
      console.error("GraphQL query execution error:", error);
      const end = performance.now();
      return {
        success: false,
        message: error.message || 'Unknown error occurred',
        consumption_time: end - start,
      };
    }
  }
}

const graphQLClient = new GraphQLClient();
export default graphQLClient;