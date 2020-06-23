<template>
  <div>
    <v-card class="mx-auto login" max-width="344" :elevation="12">
      <v-card-title class="headline">
        <v-avatar color="teal">
          <v-icon dark>mdi-account-circle</v-icon>
        </v-avatar>
      </v-card-title>
      <v-card-title class="headline">AiAi Salon App</v-card-title>
      <v-card-text>
        <div v-if="progress" class="text-center progress-card">
            <v-card height=250 class="progress">
              <p>Logging In</p>
              <v-progress-linear color="deep-purple accent-4" indeterminate rounded height="6"></v-progress-linear>
            </v-card>
        </div>
        <v-form v-else v-model="valid">
          <v-container>
            <v-row>
              <v-col>
                <v-text-field
                  color="teal"
                  v-model="email"
                  :rules="emailRules"
                  label="Email"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  @click:append="show1 = !show1"
                  color="teal"
                  v-model="password"
                  :rules="passwordRules"
                  label="Password"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-btn
                min-width="150"
                class="login-btn"
                v-on:click="login"
                rounded
                type='submit'
                color="teal"
                dark
              >Login</v-btn>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
    <v-snackbar color="error" v-model="snackbar" :timeout="3000">
      Email and/or Password is incorrect.
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import firebase from "firebase";
import db from "./firebaseInit";

export default {
  name: "login",
  data: function() {
    return {
      show1: false,
      snackbar: false,
      email: "",
      password: "",
      valid: false,
      progress: false,
      passwordRules: [v => !!v || "Password is required"],
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+/.test(v) || "E-mail must be valid"
      ]
    };
  },
  methods: {
    login: function(e) {
      e.preventDefault();
      this.progress = true
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          data => {
            db.collection("users")
              .doc(data.user.email)
              .get()
              .then(querySnapshot => {
                localStorage.setItem(
                  "user",
                  JSON.stringify({
                    email: data.user.email,
                    name: querySnapshot.data().firstname,
                  })
                );
                location.reload(true);
              });
          },
          () => {
            this.progress = false;
            this.snackbar = true;
          }
        );
    }
  }
};
</script>

<style scoped>
.login {
  margin-top: 50px;
  padding-top: 20px;
  margin-bottom: 50px;
}
.headline {
  justify-content: center;
  padding-bottom: 0;
}
.progress-card {
  margin-top: 20px;
}
.progress {
  padding: 80px 40px;
}
</style>