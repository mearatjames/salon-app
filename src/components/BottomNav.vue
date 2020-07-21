<template>
  <v-bottom-navigation class="d-flex d-md-none" height="70px" grow fixed color="teal">
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
    <v-btn v-if="user.sale" to="/sales" exact>
      <span>Sales</span>
      <v-icon>mdi-basket-outline</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  data: () => ({
    user: JSON.parse(localStorage.getItem("user"))
  }),
};
</script>

<style>
.v-item-group.v-bottom-navigation .v-btn.v-size--default {
  height: inherit;
  justify-content: flex-end;
  padding: 5px 0 0;
}
</style>