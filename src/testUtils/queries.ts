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
      _id
    }
  }
`;

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const VERIFY_EMAIL = gql`
  mutation verifyEmail($token: String!) {
    verifyEmail(token: $token)
  }
`;

export const USER = gql`
  query user($id: String!) {
    user(id: $id) {
      username
      email
      confirmed
      _id
    }
  }
`;

export const USERS = gql`
  query {
    users {
      username
      email
      confirmed
      _id
    }
  }
`;
