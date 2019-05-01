import Vue from 'vue';
import Vuex from 'vuex';
import router from './router';

import { defaultClient as apolloClient } from './main';
import { GET_POSTS_QUERY, SIGNIN_USER_MUTATION, GET_CURRENT_USER_QUERY, SIGNUP_USER_MUTATION, ADD_POST_MUTATION } from './graphql';

Vue.use(Vuex)

export const mutationTypes = {
  GET_POSTS_PENDING: 'GET_POSTS_PENDING',
  GET_POSTS_SUCCESSS: 'GET_POSTS_SUCCESSS',
  GET_POSTS_ERRORED: 'GET_POSTS_ERRORED',
  GET_CURRENT_USER_PENDING: 'GET_CURRENT_USER_PENDING',
  SET_CURRENT_USER: 'SET_CURRENT_USER',
  GET_CURRENT_USER_ERRORED: 'GET_CURRENT_USER_ERRORED',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
  SET_AUTHERROR: 'SET_AUTHERROR',
}

export const actionTypes = {
  'getPosts': 'getPosts',
  'signinUser': 'signinUser',
  'signupUser': 'signupUser',
  'getCurrentUser': 'getCurrentUser',
  'signoutUser': 'signoutUser',
  'addPost': 'addPost'
} 

export default new Vuex.Store({
  state: {
    posts: [],
    isLoadingPosts: false,
    isLoadingCurrentUser: false,
    user: null,
    authError: null,
    error: null,
    loading: false,
  },
  mutations: {
    [mutationTypes.GET_POSTS_PENDING]: (state) => {
      state.isLoadingPosts = true;
    },
    [mutationTypes.GET_POSTS_SUCCESSS]: (state, posts) => {
      state.isLoadingPosts = false;
      state.posts = posts;
    },
    [mutationTypes.GET_POSTS_ERRORED]: (state) => {
      state.isLoadingPosts = false;
      state.posts = [];
    },
    /* User */
    [mutationTypes.GET_CURRENT_USER_PENDING]: (state) => {
      state.isLoadingCurrentUser = true;
    },
    [mutationTypes.SET_CURRENT_USER]: (state, currentUser) => {
      state.isLoadingCurrentUser = false;
      state.user = currentUser;
    },
    [mutationTypes.GET_CURRENT_USER_ERRORED]: (state) => {
      state.isLoadingCurrentUser = false;
    },
    [mutationTypes.SET_AUTHERROR]: (state, authError) => {
      console.log('authError',authError)
      state.authError = authError;
    },
    [mutationTypes.SET_ERROR]: (state, error) => {
      state.error = error;
    },
    [mutationTypes.CLEAR_ERROR]: (state) => {
      state.error = null;
    },
    [mutationTypes.SET_LOADING]: (state, loading) => {
      state.loading = loading;
    },
  },
  actions: {
    [actionTypes.getPosts]: ({ commit }) => {
      commit(mutationTypes.GET_POSTS_PENDING);
      apolloClient
      .query({
        query: GET_POSTS_QUERY
      })
      .then(responsePosts => {
        const { data } = responsePosts;
        commit(mutationTypes.GET_POSTS_SUCCESSS, data.getPosts);
      })
      .catch(error => {
        commit(mutationTypes.GET_POSTS_ERRORED)
        console.error(error)
      })
    },
    [actionTypes.signinUser]: ({ commit },  { username, password }) => {
      commit(mutationTypes.CLEAR_ERROR);
      commit(mutationTypes.SET_LOADING, true);
      localStorage.removeItem('token');
      apolloClient.mutate({
        mutation: SIGNIN_USER_MUTATION,
        variables: { username, password }
      })
      .then(signinResponse => {
        const { token } = signinResponse.data.signinUser;
        localStorage.setItem("token",token);
        commit(mutationTypes.SET_LOADING, false);
        router.go();
      })
      .catch(error => {
        commit(mutationTypes.SET_ERROR, error)
        commit(mutationTypes.SET_LOADING, false);
        console.log(error)
      })
    },
    [actionTypes.signupUser]: ({ commit },  { username, email, password }) => {
      commit(mutationTypes.CLEAR_ERROR);
      commit(mutationTypes.SET_LOADING, true);
      localStorage.removeItem('token');
      apolloClient.mutate({
        mutation: SIGNUP_USER_MUTATION,
        variables: { username, email, password }
      })
      .then(signinResponse => {
        const { token } = signinResponse.data.signupUser;
        localStorage.setItem("token",token);
        commit(mutationTypes.SET_LOADING, false);
        router.go();
      })
      .catch(error => {
        commit(mutationTypes.SET_ERROR, error)
        commit(mutationTypes.SET_LOADING, false);
        console.log(error)
      })
    },
    [actionTypes.getCurrentUser]: ({ commit }) => {
      commit(mutationTypes.GET_CURRENT_USER_PENDING);
      apolloClient.query({
        query: GET_CURRENT_USER_QUERY
      })
      .then(({ data }) => {
        commit(mutationTypes.SET_CURRENT_USER, data.getCurrentUser);
      })
      .catch(error => {
        commit(mutationTypes.GET_CURRENT_USER_ERRORED);
        console.log('error get current User', error);
      })
    },
    [actionTypes.signoutUser]: async ({ commit }) => {
      commit(mutationTypes.SET_CURRENT_USER, null);
      localStorage.removeItem('token');
      await apolloClient.resetStore();
      router.push("/");
    },
    [actionTypes.addPost]: async ({ commit }, post) => {
      commit(mutationTypes.SET_LOADING, true);
      apolloClient.mutate({
        mutation: ADD_POST_MUTATION,
        variables: post
      })
      .then(({ data }) => {
        commit(mutationTypes.SET_LOADING, false);
        console.log('data', data)
      })
      .catch(error => {
        commit(mutationTypes.SET_LOADING, false);
        commit(mutationTypes.SET_ERROR, error);
      })
    },
  },
  getters: {
    posts: state => state.posts,
    isLoadingPosts: state => state.isLoadingPosts,
    user: state => state.user,
    authError: state => state.authError,
    error: state => state.error,
    loading: state => state.loading
  }
})
