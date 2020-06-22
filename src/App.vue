<template>
  <v-app class="override">
    <v-app-bar
      app
      color="yellow darken-4"
      dark
    >
      <div v-if="isLoggedIn" class="d-flex align-center user">
        <v-avatar size="36" color='blue darken-2'>
      <v-icon dark>mdi-account-circle</v-icon>
    </v-avatar>
      <p class="title">{{this.user.name}} </p>
      </div>
      <v-spacer></v-spacer>

      <v-btn v-if="isLoggedIn" v-on:click="logout" depressed text medium>Logout</v-btn>
    </v-app-bar>
    <v-content>
      <router-view/>
    </v-content>
    <BottomNav />
  </v-app>
</template>

<script>
import firebase from 'firebase';
import BottomNav from './components/BottomNav';

export default {
  name: 'App',

  components: {
    BottomNav,
  },

  data: () => ({
    isLoggedIn: false ,
    currentUser: false,
    user: null,
    test: null
  }),
  created() {
    if (firebase.auth().currentUser) {
      this.isLoggedIn = true;
      this.currentUser = firebase.auth().currentUser.email;
      this.user = JSON.parse(localStorage.getItem("user"))
    }
  },
  methods: {
    logout: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          localStorage.removeItem('user');
          location.reload(true);
        });
    }
  }
};
</script>

<style>
  .override .v-application--wrap {
    min-height: 100%;
  }
  body {
    overflow-x: hidden;
  }
  .user p.title {
    margin-bottom: 0;
    padding-left: 5px;
  }
</style>