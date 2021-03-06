<template>
  <v-container v-if="getPost" class="mt-3" flexbox center>
    <!-- Post card -->
    <v-layout row wrap>
      <v-flex xs12>
        <v-card hover>

          <v-card-title>
            <h1>{{getPost.title}}</h1>
            <v-btn @click="handleToggleLike" large icon v-if="user">
              <v-icon large :color="checkIfPostLiked(getPost._id) ? 'red' : 'grey'">favorite</v-icon>
            </v-btn>
            <h3 class="ml-3 font-weight-thin">{{getPost.likes}} LIKES</h3>
            <v-spacer></v-spacer>
            <v-icon @click="goToPreviousPage" color="info" large>arrow_back</v-icon>
          </v-card-title>

          <v-tooltip right>
            <span>Click to enlarge image</span>
            <v-img
              @click="toggleImageDialog"
              slot="activator"
              :src="getPost.imageUrl"
              id="post__image"
            />
          </v-tooltip>

          <!-- Post Image Dialog -->
          <v-dialog v-model="dialog">
            <v-card>
              <v-img :src="getPost.imageUrl" height="80vh"/>
            </v-card>
          </v-dialog>

          <v-card-text>
            <span v-for="(category, index) in getPost.categories" :key="index">
              <v-chip class="mb-3" color="accent" text-color="white">{{ category }}</v-chip>
            </span>
            <h3>{{ getPost.description }}</h3>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Message Section -->
    <div class="mt-3">
      <v-layout class="mb-3" v-if="user">
        <v-flex xs12>
          <v-form @submit.prevent="handleAddPostMessage">
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  v-model="messageBody"
                  clearable
                  :append-outer-icon="messageBody && 'send'"
                  label="Add Message"
                  type="text"
                  @click:append-outer="handleAddPostMessage"
                  prepend-icon="email"
                  required
                >
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>
    </div>

    <!-- Message -->

    <v-layout row wrap>
      <v-flex xs12>
        <v-list subheader two-line>
          <v-subheader>Messages ({{getPost.messages.length}})</v-subheader>

          <template v-for="message in getPost.messages">
            <v-divider :key="message._id"></v-divider>

            <v-list-tile avatar inset :key="message.title">
              <v-list-tile-avatar>
                <img :src="message.messageUser.avatar">
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>
                  {{message.messageBody}}
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  {{message.messageUser.username}}
                  <span class="grey--text text--lighten-1 hidden-xs-only">{{(message.messageDate)}}</span>
                </v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action class='hidden-xs-only'>
                <v-icon :color="checkIfOwnMessage(message) ? 'accent' : 'grey'">chat_bubble</v-icon>
              </v-list-tile-action>

            </v-list-tile>
          </template>
        </v-list>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import { GET_POST_QUERY, ADD_POST_MESSAGE_MUTATION, LIKE_POST_MUTATION, UNLIKE_POST_MUTATION } from "../graphql";
import { mapGetters } from "vuex";
export default {
  name: "post",
  props: {
    postId: { type: String, require: true }
  },
  data() {
    return {
      postLiked: false,
      dialog: false,
      messageBody: "",
    };
  },
  apollo: {
    getPost: {
      query: GET_POST_QUERY,
      variables() {
        return {
          postId: this.postId
        };
      }
    }
  },
  computed: {
    ...mapGetters(["user"]),
    
  },
  methods: {
    goToPreviousPage() {
      this.$router.go(-1);
    },
    toggleImageDialog() {
      if (window.innerWidth > 500) {
        this.dialog = !this.dialog;
      }
    },
    checkIfPostLiked(postId) {
      return false;
    },
    handleToggleLike() {
      if (this.postLiked) {
        this.handleUnlikePost();
      } else {
        this.handleLikePost();
      }
    },
    handleLikePost() {
      const variables = {
        postId: this.postId,
        username: this.user.username
      };
      this.$apollo
        .mutate({
          mutation: LIKE_POST_MUTATION,
          variables,
          update: (cache, { data: { likePost } }) => {
            const data = cache.readQuery({
              query: GET_POST_QUERY,
              variables: { postId: this.postId }
            });
            data.getPost.likes += 1;
            cache.writeQuery({
              query: GET_POST_QUERY,
              variables: { postId: this.postId },
              data
            });
          }
        })
        .then(({ data }) => {
          const updatedUser = {
            ...this.user,
            favorites: data.likePost.favorites
          };
          this.$store.commit("SET_USER", updatedUser);
        })
        .catch(err => console.error(err));
    },
    handleUnlikePost() {
      const variables = {
        postId: this.postId,
        username: this.user.username
      };
      this.$apollo
        .mutate({
          mutation: UNLIKE_POST_MUTATION,
          variables,
          update: (cache, { data: { unlikePost } }) => {
            const data = cache.readQuery({
              query: GET_POST_QUERY,
              variables: { postId: this.postId }
            });
            data.getPost.likes -= 1;
            cache.writeQuery({
              query: GET_POST_QUERY,
              variables: { postId: this.postId },
              data
            });
          }
        })
        .then(({ data }) => {
          const updatedUser = {
            ...this.user,
            favorites: data.unlikePost.favorites
          };
          this.$store.commit("SET_USER", updatedUser);
        })
        .catch(err => console.error(err));
    },
    handleAddPostMessage() {
      const variables = {
        messageBody: this.messageBody,
        userId: this.user._id,
        postId: this.postId
      };
      this.$apollo
        .mutate({
          mutation: ADD_POST_MESSAGE_MUTATION,
          variables,
          update: (cache, { data: { addPostMessage } }) => {
            const data = cache.readQuery({
              query: GET_POST_QUERY,
              variables: { postId: this.postId }
            });
            data.getPost.messages.unshift(addPostMessage);
            cache.writeQuery({
              query: GET_POST_QUERY,
              variables: { postId: this.postId },
              data
            });
          }
        })
        .then(({ data }) => {
          this.messageBody = '';
        })
        .catch(err => console.error(err));
    },
    checkIfOwnMessage(message) {
      return this.user && this.user._id === message.messageUser._id;
    }
  }
};
</script>

<style lang="scss" scoped>
#post__image {
  height: 400px !important;
}
</style>