import graphQLClient from '../utils/graphql/GraphQLClient';
import { GraphQLResult } from '../constants/types';
export const login = async (username: string, password: string): Promise<GraphQLResult> => {
    const query = `
      mutation Login($username: String!, $password: String!) {
          login(
              input: {
                  identifier: $username,
                  password: $password,
                  provider: "local"
              }
          ) {
              jwt
              user {
                  id
              }
          }
      }
    `;
    const variables = {
      username,
      password
    };
    const result: GraphQLResult = await graphQLClient.exec(query, variables);
    if (result && result.success) {
        if (result.data && result.data.login && result.data.login.jwt) {
            return {
                success: true,
                message: "Login successful",
                data: result.data.login,
                jwt: result.data.login.jwt,
            };
        } else {
            return {
                success: false,
                message: "Login failed. No JWT returned.",
            };
        }
    } else {
        return {
            success: false,
            message: `Login error: ${result.message}`,
        };
    }
};





