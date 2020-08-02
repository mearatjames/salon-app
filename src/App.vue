<template>
  <v-app class="override">
    <v-app-bar app color="teal" dark>
      <div v-if="isLoggedIn" class="d-flex align-center user">
        <v-btn class="pl-0" to="/user" text>
          <v-avatar size="48" color="teal darken-3">
            <img :src="thumbnail" alt="Aiai.91" />
          </v-avatar>
          <div class="username text-h6">{{this.user.name}}</div>
        </v-btn>
      </div>
      <v-spacer></v-spacer>
      <v-btn v-if="isLoggedIn" v-on:click="logout" depressed text medium>Logout</v-btn>
    </v-app-bar>
    <NavDrawer ></NavDrawer>
    <v-main >
        <div class="padding">
        <router-view :thumbnail="thumbnail" v-on:updateThumbnail="updateThumbnail"></router-view>
        </div>
    </v-main>
    <BottomNav />
  </v-app>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import db from "./components/firebaseInit";
import BottomNav from "./components/BottomNav";
import NavDrawer from "./components/NavDrawer";
import thumbnail from "./assets/icon.jpg";

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
    thumbnail: thumbnail
  }),
  created() {
    if (firebase.auth().currentUser) {
      this.isLoggedIn = true;
      this.currentUser = firebase.auth().currentUser.email;
      if (localStorage.getItem("user")) {
        this.user = JSON.parse(localStorage.getItem("user"));
        this.getThumbnail();
      } else {
        db.collection("users")
          .doc(this.currentUser)
          .get()
          .then(querySnapshot => {
            localStorage.setItem(
              "user",
              JSON.stringify({
                email: this.currentUser,
                uid: firebase.auth().currentUser.uid,
                name: querySnapshot.data().firstname
              })
            );
            this.user = JSON.parse(localStorage.getItem("user"));
            this.getThumbnail();
          });
      }
    }
  },
  methods: {
    getThumbnail() {
      let storageRef = firebase.storage().ref();
      storageRef
        .child(this.user.uid + "/thumbnail.jpeg")
        .getDownloadURL()
        .then(url => {
          this.thumbnail = url;
        })
        .catch(error => {
          console.log(error);
        });
    },
    logout: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          localStorage.removeItem("user");
          location.reload(true);
        });
    },
    updateThumbnail(url) {
      this.thumbnail = url;
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
  .v-main div.padding {
    padding-bottom: 70px;
  }
}

@media (hover: none) {
:hover::before {
      background-color: transparent
}
}
</style>