<template>
	<v-card
    class="mx-auto login"
    max-width="344"
    :elevation="12"
  >
    <v-card-title class="headline"><v-avatar color="yellow darken-4">
      <v-icon dark>mdi-account-circle</v-icon>
    </v-avatar></v-card-title>
    <v-card-title class="headline">AiAi Salon App</v-card-title>
    <v-card-text>
    <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col>
          <v-text-field v-model="email" :rules="emailRules" label="Email" required></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field v-model="password" :rules="passwordRules" label="Password" required></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
          <v-btn min-width="150" class="login-btn" v-on:click="login" rounded color="yellow darken-4" dark>Login</v-btn>
      </v-row>
    </v-container>
  </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import firebase from "firebase";
export default {
  name: "login",
  data: function() {
    return {
      email: "",
      password: "",
      valid: false,
      passwordRules: [v => !!v || "Name is required"],
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+/.test(v) || "E-mail must be valid"
      ]
    };
  },
  methods: {
    login: function(e) {
	e.preventDefault();
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          () => {
            location.reload(true);
          },
          err => {
            alert(err.message);
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
	}
  .headline {
    justify-content: center;
    padding-bottom: 0;
  }

</style>