<template>
  <div>
    <v-list two-line subheader>
      <v-subheader> <strong>Monday 04/06/2020</strong> </v-subheader>

      <v-list-item>
		<v-list-item-avatar>
          <v-avatar color="yellow darken-4" size="30">
      <span class="white--text title">1</span>
    </v-avatar>
        </v-list-item-avatar>
		<v-list-item-content>
          <v-list-item-title>Manicure, Pedicure</v-list-item-title>
		<v-list-item-subtitle><strong></strong> </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-content class="amount">
          <v-list-item-subtitle><strong>$60</strong></v-list-item-subtitle>
          <v-list-item-subtitle>Tips $5</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
		<v-list-item-avatar>
          <v-avatar color="yellow darken-4" size="30">
      <span class="white--text title">2</span>
    </v-avatar>
        </v-list-item-avatar>
		<v-list-item-content>
          <v-list-item-title>Manicure, Pedicure</v-list-item-title>
		<v-list-item-subtitle><strong></strong> </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-content class="amount">
          <v-list-item-subtitle><strong>$60</strong></v-list-item-subtitle>
          <v-list-item-subtitle>Tips $5</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
		<v-list-item-avatar>
          <v-avatar color="yellow darken-4" size="30">
      <span class="white--text title">3</span>
    </v-avatar>
        </v-list-item-avatar>
		<v-list-item-content class="service">
          <v-list-item-title class="service-text">Manicure, Pedicure sdfnsdkfj ksdjfksdj ksjdfkjs df</v-list-item-title>
		<v-list-item-subtitle><strong></strong> </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-content class="amount">
          <v-list-item-subtitle><strong>$60</strong></v-list-item-subtitle>
          <v-list-item-subtitle>Tips $5</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
		<v-list-item-avatar>
          <v-avatar color="yellow darken-4" size="30">
      <span class="white--text title">4</span>
    </v-avatar>
        </v-list-item-avatar>
		<v-list-item-content>
          <v-list-item-title>Manicure, Pedicure</v-list-item-title>
		<v-list-item-subtitle><strong></strong> </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-content class="amount">
          <v-list-item-subtitle><strong>$60</strong></v-list-item-subtitle>
          <v-list-item-subtitle>Tips $5</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
	<v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle></v-list-item-subtitle>
        </v-list-item-content>
		<v-list-item-icon>
          <v-chip
      class="ma-2"
      color="success"
      outlined
    >
      Total: $240 | Tips: $40
    </v-chip>
        </v-list-item-icon>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list two-line subheader>
      <v-subheader>General</v-subheader>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Profile photo</v-list-item-title>
          <v-list-item-subtitle>Change your Google+ profile photo</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Show your status</v-list-item-title>
          <v-list-item-subtitle>Your status is visible to everyone</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: "List",
  data: () => ({
    settings: []
  })
};
</script>

<style>
 .amount {
	text-align: right;
 }
 .service {
	flex-grow: 3;
 }
 .service-text {
	white-space:normal;
 }
</style>