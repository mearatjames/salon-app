<template>
  <v-navigation-drawer color="teal" dark app :permanent="$vuetify.breakpoint.mdAndUp">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">Salon App</v-list-item-title>
        <v-list-item-subtitle></v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list nav>
      <v-list-item v-for="item in items" :key="item.title" link :to="item.link">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { title: "Dashboard", icon: "mdi-chart-line", link: "/" },
        {
          title: "Transaction",
          icon: "mdi-clipboard-plus-outline",
          link: "/add"
        },
        { title: "List", icon: "mdi-view-list", link: "/list" },
      ],
      right: null,
      user: JSON.parse(localStorage.getItem("user"))
    };
  },
  created() {
    this.user.sale ? this.items.push({ title: "Sales", icon: "mdi-basket-outline", link: "/sales" }) : ""
  }
};
</script>

<style>
</style>