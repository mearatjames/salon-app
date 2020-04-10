<template>
  <v-bottom-navigation
	app
	grow
	fixed
	hide-on-scroll
	color="yellow darken-4"
  >
		<v-btn to="/" exact>
			<span>Dashboard</span>
			<v-icon>mdi-chart-line</v-icon>
		</v-btn>
		<v-btn to='/transaction' exact>
			<span >Transaction</span>
			<v-icon>mdi-clipboard-plus-outline</v-icon>
		</v-btn>
		<v-btn to='/modify' exact>
			<span >Modify</span>
			<v-icon>mdi-border-color</v-icon>
		</v-btn>
    
  </v-bottom-navigation>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
  }
</script>

<style>
    .v-item-group.v-bottom-navigation .v-btn.v-size--default {
        height: inherit;
    }
</style>