<template>
  <v-app class="override">
    <v-app-bar
      app
      color="yellow darken-4"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
      </div>
      <p class="title">Salon App</p>
      <v-spacer></v-spacer>

      <v-btn v-if="isLoggedIn" v-on:click="logout" depressed text medium>Logout</v-btn>
    </v-app-bar>
    <v-content>
      <router-view/>
    </v-content>
    <BottomNav/>
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
    currentUser: false
  }),
  created() {
    if (firebase.auth().currentUser) {
      this.isLoggedIn = true;
      this.currentUser = firebase.auth().currentUser.email;
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
  .title {
    margin-bottom: 0;
  }
</style>