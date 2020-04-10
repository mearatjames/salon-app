<template>
	<v-card
    class="mx-auto login"
    max-width="344"
  >
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
      <v-row>
        <div class="text-center">
          <v-btn v-on:click="login" rounded color="primary" dark>Login</v-btn>
        </div>
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
	}

</style>