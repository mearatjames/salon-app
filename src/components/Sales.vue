<template>
    <v-container class="container" fluid>
      <v-row>
        <v-col cols="12">
          <v-card
            color="#1F7087"
            dark
          >
            <v-card-title class="headline">Product Sales</v-card-title>
            <v-card-subtitle>Total Sales so far</v-card-subtitle>
            <v-card-actions>
              <v-btn text>Update Products</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col lg="6" md="6" sm="6" xs="12" v-for="card in cards" :key="card.title">
          <ProductCard :card="card" />
        </v-col>
      </v-row>
	<v-card-text style="height: 100px; position: relative">
            <v-btn
              fixed
              dark
              fab
              right
              color="pink"
            >
              Sell
            </v-btn>
          </v-card-text>
    </v-container>
</template>

<script>
import ProductCard from './ProductCard.vue'

export default {
  components: {
    ProductCard
  },
  data: () => ({
    cards: [
      {
        title: "Nails Kit",
        price: 10,
        src: "https://cdn.vuetifyjs.com/images/cards/house.jpg"
      },
      {
        title: "Secon Item",
        price: 5,
        src: "https://cdn.vuetifyjs.com/images/cards/house.jpg"
      }
    ]
  })
};
</script>

<style>

</style>