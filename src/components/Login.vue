<template>
  <div>
    <v-card class="mx-auto login" max-width="344" :elevation="12">
      <v-card-title class="headline">
        <v-avatar size="62" color="teal">
          <img src="../assets/icon.jpg" alt="Aiai.91" />
        </v-avatar>
      </v-card-title>
      <v-card-title class="headline">AiAi Salon App</v-card-title>
      <v-card-text>
        <div v-if="progress" class="text-center progress-card">
          <v-card height="250" class="progress">
            <p>Logging In</p>
            <v-progress-linear color="teal" indeterminate rounded height="6"></v-progress-linear>
          </v-card>
        </div>
        <v-form v-else v-model="valid">
          <v-container>
            <v-row>
              <v-col class="pb-1">
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
              <v-col class="pt-0 pb-1">
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
            <v-row>
              <v-col class="pt-0">
                <v-dialog v-model="dialog" width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <a
                      v-bind="attrs"
                      v-on="on"
                      class="forgot teal--text"
                      target="_blank"
                      rel="noopener noreferrer"
                    >Forgot Password</a>
                  </template>

                  <v-card>
                    <v-card-title class="headline teal white--text" primary-title>Forgot Password</v-card-title>

                    <v-card-text class="pt-4">
                      <div v-if="sending" class="text-center progress-card">
                          <p>Sending Email</p>
                          <v-progress-linear color="teal" indeterminate rounded height="6"></v-progress-linear>
                      </div>
                      <div v-else>
                      Please enter your email
                      <v-text-field
                        color="teal"
                        v-model="email"
                        :rules="emailRules"
                        label="Email"
                        required
                      ></v-text-field>
                      </div>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="error" text @click="dialog = false">Cancel</v-btn>
                      <v-btn color="teal" text @click="resetPassword">Reset Password</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
            <v-row class="mt-4 pb-3" justify="center">
              <v-btn
                min-width="150"
                class="login-btn"
                v-on:click="login"
                rounded
                type="submit"
                color="teal"
                dark
              >Login</v-btn>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
    <v-snackbar class="mb-4" :color="message.error ? 'error' : 'success'" v-model="snackbar" :timeout="3500">
      {{message.text}}
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import db from "./firebaseInit";

export default {
  name: "login",
  data: function() {
    return {
      show1: false,
      dialog: false,
      snackbar: false,
      message: {},
      email: "",
      password: "",
      valid: false,
      progress: false,
      sending: false,
      passwordRules: [v => !!v || "Password is required"],
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+/.test(v) || "E-mail must be valid"
      ]
    };
  },
  methods: {
    resetPassword: function() {
      this.sending = true;
      firebase
        .auth()
        .sendPasswordResetEmail(this.email)
        .then(() => {
          this.sending = false;
          this.dialog = false;
          this.message = {
            error: false,
            text: "Password reset link has been sent, please check your email!",
            }
          this.snackbar = true;
        })
        .catch(() => {
          this.sending = false;
          this.message = {
            error: true,
            text: "The email you've entered is not registered for this App.",
            }
          this.snackbar = true;
        });
    },
    login: function(e) {
      e.preventDefault();
      this.progress = true;
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
                    uid: firebase.auth().currentUser.uid,
                    name: querySnapshot.data().firstname
                  })
                );
                location.reload(true);
              });
          },
          () => {
            this.progress = false;
            this.message = {
              error: true,
              text: "Email and/or Password is incorrect."
            }
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