import { gql } from "apollo-boost";

/* Posts queries */

export const GET_POSTS_QUERY = gql`
  query {
    getPosts {
      _id
      title
      createdDate
      categories
      description
      likes
      imageUrl
      createdBy {
        _id
        username
        email
        password
        joinDate
      }
    }
  }
`;

/* User Queries */
export const GET_CURRENT_USER_QUERY = gql`
  query {
    getCurrentUser {
      _id
      username
      email
      password
      avatar
      joinDate
      favorites {
        _id
        title
        imageUrl
      }
    }
  }
`;

/* User Mutation */
export const SIGNIN_USER_MUTATION = gql`
  mutation($username:String!, $password: String!) {
    signinUser(username:$username, password:$password) {
      token 
    }
  }
`;

export const SIGNUP_USER_MUTATION = gql`
  mutation($username:String!, $email: String!, $password: String!) {
    signupUser(username: $username, email: $email, password:$password) {
      token 
    }
  }
`;