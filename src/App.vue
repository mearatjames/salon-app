<template>
  <v-app class="override">
    <v-app-bar app color="teal" dark>
      <div v-if="isLoggedIn" class="d-flex align-center user">
        <v-btn to='/user' text>
        <v-avatar size="48" color="teal darken-3">
          <img src="./assets/icon.jpg" alt="Aiai.91" />
        </v-avatar>
        <div class="username text-h3">{{this.user.name}}</div>
        </v-btn>
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
import firebase from "firebase/app";
import "firebase/auth";
import db from "./components/firebaseInit";
import BottomNav from "./components/BottomNav";
import NavDrawer from "./components/NavDrawer";

export default {
  name: "App",

  components: {
    BottomNav,
    NavDrawer
  },

  data: () => ({
    isLoggedIn: false,
    currentUser: false,
    user: null,
    test: null
  }),
  created() {
    if (firebase.auth().currentUser) {
      this.isLoggedIn = true;
      this.currentUser = firebase.auth().currentUser.email;
      if (localStorage.getItem("user")) {
        this.user = JSON.parse(localStorage.getItem("user"));
      } else {
        db.collection("users")
          .doc(this.currentUser)
          .get()
          .then(querySnapshot => {
            localStorage.setItem(
              "user",
              JSON.stringify({
                email: this.currentUser,
                name: querySnapshot.data().firstname
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
          localStorage.removeItem("user");
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
.user div.username {
  margin-bottom: 0;
  padding-left: 5px;
  text-transform: none;
  font-size: 18px;
}
@media only screen and (max-width: 1068px) {
  .padding {
    padding-bottom: 70px;
  }
}
</style>