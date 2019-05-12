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

export const INFINITE_SCROLL_POSTS_QUERY = gql`
  query($pageNum: Int!, $pageSize: Int!) {
    infiniteScrollPosts(pageNum: $pageNum, pageSize: $pageSize) {
      hasMore
      posts {
        _id
        title
        imageUrl
        categories
        description
        likes
        createdDate
        messages {
          _id
        }
        createdBy {
          _id
          username
          avatar
        }
      }
    }
  }
`;

/* Post mutation */

export const ADD_POST_MUTATION = gql`
  mutation (
    $title: String!
    $imageUrl: String!
    $categories: [String]!
    $description: String!
    $creatorId: ID!
  ) {
    addPost(title: $title, imageUrl: $imageUrl, categories: $categories, description: $description, creatorId: $creatorId) {
      _id
      title
      imageUrl
      categories
      description
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