<template>
  <v-app class="override">
    <v-app-bar
      app
      color="teal"
      dark
    >
      <div v-if="isLoggedIn" class="d-flex align-center user">
        <v-avatar size="36" color='teal darken-3'>
      <v-icon dark>mdi-account-circle</v-icon>
    </v-avatar>
      <p class="title">{{this.user.name}} </p>
      </div>
      <v-spacer></v-spacer>

      <v-btn v-if="isLoggedIn" v-on:click="logout" depressed text medium>Logout</v-btn>
    </v-app-bar>
    <NavDrawer></NavDrawer>
      <div class="padding">
        <v-content>
          <router-view></router-view>
        </v-content>

      </div>

    <BottomNav />
  </v-app>
</template>

<script>
import firebase from 'firebase';
import db from "./components/firebaseInit";
import BottomNav from './components/BottomNav';
import NavDrawer from './components/NavDrawer'

export default {
  name: 'App',

  components: {
    BottomNav,
    NavDrawer
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
      if (localStorage.getItem("user")) {
        this.user = JSON.parse(localStorage.getItem("user"))
      } else {
        db.collection("users")
              .doc(this.currentUser)
              .get()
              .then(querySnapshot => {
                localStorage.setItem(
                  "user",
                  JSON.stringify({
                    email: this.currentUser,
                    name: querySnapshot.data().firstname,
                  })
                );
              });
      }
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
  @media only screen and (max-width: 1068px) {
    .padding {
      padding-bottom: 70px;
    }
  }
</style>