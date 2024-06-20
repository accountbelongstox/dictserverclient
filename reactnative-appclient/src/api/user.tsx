import graphQLClient from '../utils/graphql/GraphQLClient';
import { GraphQLResult } from '../constants/types';

export const register = async (registrationData: { username: string; email: string; password: string; }): Promise<GraphQLResult> => {
  const registrationQuery = `
    mutation Register($input: UsersPermissionsRegisterInput!) {
        register(input: $input) {
            jwt
            user {
                id
                username
                email
            }
        }
    }
  `;
  
  const variables = {
    input: {
      username: registrationData.username,
      email: registrationData.email,
      password: registrationData.password
    }
  };

  const result: GraphQLResult = await graphQLClient.exec(registrationQuery, variables);

  return result;
};
