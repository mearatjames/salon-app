<template>
  <v-bottom-navigation app grow fixed color="yellow darken-4">
    <v-btn to="/" exact>
      <span>Dashboard</span>
      <v-icon>mdi-chart-line</v-icon>
    </v-btn>
    <v-btn to="/add" exact>
      <span>Transaction</span>
      <v-icon>mdi-clipboard-plus-outline</v-icon>
    </v-btn>
    <v-btn to="/list" exact>
      <span>List</span>
      <v-icon>mdi-view-list</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style>
.v-item-group.v-bottom-navigation .v-btn.v-size--default {
  height: inherit;
}
</style>