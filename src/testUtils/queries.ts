import gql from "graphql-tag";

export const REGISTER = gql`
  mutation register($email: String!, $password: String!, $username: String!) {
    register(email: $email, password: $password, username: $username)
  }
`;

export const ME = gql`
  query {
    me {
      username
      email
      id
    }
  }
`;
