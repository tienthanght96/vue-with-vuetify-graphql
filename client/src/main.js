import Vue from 'vue'
import 'babel-polyfill'

import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";

import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import FormAlert from "./components/Shared/FormAlert";

Vue.use(VueApollo);
Vue.component("form-alert", FormAlert);

// Set up apollo client
export const defaultClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    operation.setContext({
      headers: {
        authorization: localStorage.getItem('token') || ''
      }
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if(networkError) {
      console.log('[networkError]', networkError);
    }
    if(graphQLErrors) {
      for (const err of graphQLErrors) {
        console.dir(err);
        if(err.name === 'AuthenticationError') {
          store.commit('SET_AUTHERROR', err);
        }
      }
    }
  }
});

// 
const apolloProvider = new VueApollo({ defaultClient });

Vue.config.productionTip = false

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App),
  created() {
    this.$store.dispatch('getCurrentUser');
  },
}).$mount('#app')
