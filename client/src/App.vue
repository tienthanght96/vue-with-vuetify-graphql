<template>
  <v-app style="background: #e3e3e3">

    <!-- Side Navbar -->
    <V-navigation-drawer app temporary fixed v-model="sideNav">
      <v-toolbar color="accent" dark flat>
        <v-toolbar-side-icon @click="toggleSideNav"/>
        <router-link to="/" tag="span" style="cursor:pointer">
          <span class="font-weight-bold  white--text">VueShare</span>
        </router-link>
      </v-toolbar>

      <v-divider />

      <!-- Side Navbar Links -->
      <v-list>
        <v-list-tile v-for="(item) in sideNavItems" :key="item.link" :to="item.link" ripple>
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            {{ item.title }}
          </v-list-tile-content>
        </v-list-tile>
        <!-- Signout Button -->
        <v-list-tile v-if="user" @click="handleSignoutUser">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Signout</v-list-tile-content>
        </v-list-tile>
      </v-list>

    </V-navigation-drawer>

    <!-- Horizontal Navbar -->
    <v-toolbar fixed app color="primary" dark>
      <!-- App Title -->
      <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
      <v-toolbar-title class="hidden-xs-only">
        <router-link to="/" tag="span" style="cursor: pointer">
          VueShare
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Search Input -->
      <v-text-field v-model="searchTerm" flex prepend-icon="search" placeholder="Search posts" color="accent" single-line hide-details></v-text-field>

      <v-spacer></v-spacer>

      <!-- Horizontal Navbar Links -->
      <v-toolbar-items class="hidden-xs-only">
        
        <v-btn flat v-for="item in horizontalNavItems" :key="item.title" :to="item.link">
          <v-icon class="hidden-sm-only" left>{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>

         <!-- Profile Button -->
        <v-btn flat to="/profile" v-if="user">
          <v-icon class="hidden-sm-only" left>account_box</v-icon>
          <v-badge right color="blue darken-2" :class="{ 'bounce': badgeAnimated }">
            <span slot="badge" v-if="userFavorites.length">{{userFavorites.length}}</span>
            Profile
          </v-badge>
        </v-btn>

        <!-- Signout Button -->
        <v-btn flat v-if="user" @click="handleSignoutUser">
          <v-icon class="hidden-sm-only" left>exit_to_app</v-icon>
          Signout
        </v-btn>

      </v-toolbar-items>
    </v-toolbar>

    <!-- App Content -->
    <v-content>
      <main>
        <v-container>
          
          <transition name="fade">
            <router-view/>
          </transition>

          <!-- Auth Snackbar -->
        <v-snackbar v-model="authSnackbar" color="success" :timeout='5000' bottom left>
          <v-icon class="mr-3">check_circle</v-icon>
          <h3>You are now signed in!</h3>
          <v-btn dark flat @click="authSnackbar = false">Close</v-btn>
        </v-snackbar>

        <!-- Auth Error Snackbar -->
        <v-snackbar v-if="authError" v-model="authErrorSnackbar" color="info" :timeout='5000' bottom left>
          <v-icon class="mr-3">cancel</v-icon>
          <h3>{{authError.message}}</h3>
          <v-btn dark flat to="/signin">Sign in</v-btn>
        </v-snackbar>
          
        </v-container>
      </main>
    </v-content>
  </v-app>
</template>

<script>
  import { mapGetters } from 'vuex';
  import HelloWorld from './components/HelloWorld'
  export default {
    name: 'App',
    components: {
      HelloWorld
    },
    data () {
      return {
        sideNav: false,
        searchTerm: '',
        badgeAnimated: false,
        userFavorites: [1],
        authSnackbar: false,
        authErrorSnackbar: false,
      }
    },
    computed: {
      ...mapGetters(['user', 'authError']),
      horizontalNavItems() {
        
        if(this.user) {
          return [
            { icon: 'chat', title: 'Posts', link: '/posts' },
          ];
        }

        return [
          { icon: 'chat', title: 'Posts', link: '/posts' },
          { icon: 'lock_open', title: 'Sign In', link: '/signin' },
          { icon: 'create', title: 'Sign Up', link: '/signup' },
        ];
      },
      sideNavItems() {
        
        if(this.user) {
          return [
            { icon: 'chat', title: 'Posts', link: '/posts' },
            { icon: 'stars', title: 'Create Post', link: '/post/add' },
            { icon: 'account_box', title: 'Profile', link: '/profile' },
          ];
        }

        return [
          { icon: 'chat', title: 'Posts', link: '/posts' },
          { icon: 'lock_open', title: 'Sign In', link: '/signin' },
          { icon: 'create', title: 'Sign Up', link: '/signup' },
        ];
      }
    },
    watch: {
      user(newValue, oldValue) {
        // if we had no value for user before, show snackbar
        if (oldValue === null) {
          this.authSnackbar = true;
        }
      },
      authError(value) {
        // if auth error is not null, show auth error snackbar
        if (value !== null) {
          this.authErrorSnackbar = true;
        }
      },
    },
    methods: {
      toggleSideNav() {
        this.sideNav = !this.sideNav;
      },
      handleSignoutUser() {
        this.$store.dispatch('signoutUser');
      }
    },
  }
</script>
<style lang="scss" scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition-property: opacity;
    transition-duration: 0.25s;
  }

  .fade-enter-active {
    transition-delay: 0.25s;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }
</style>
