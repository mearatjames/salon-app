<template>
    <v-container class="container" fluid>
      <!-- <v-row>
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
      </v-row> -->
      <v-row dense>
        <v-col cols="6" lg="3" md="6" sm="6" v-for="card in cards" :key="card.title">
          <ProductCard :card="card" />
        </v-col>
      </v-row>
	<v-card-text style="height: 60px; position: relative">
            <v-btn
              fixed
              dark
              fab
              right
              color="teal"
              class="sell"
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
        title: "Removal Kit",
        price: 10,
        sku: '91KT001A',
        src: "https://firebasestorage.googleapis.com/v0/b/salon-app-d6c37.appspot.com/o/DANhxvXrLhYQzbtjwab21G1GfrQ2%2Fthumbnail.jpeg?alt=media&token=0794db28-8df8-463d-9ee1-4a805d7ba24a"
      },
      {
        title: "Acetone",
        price: 5,
        sku: '91KT002A',
        src: "https://cdn.vuetifyjs.com/images/cards/house.jpg"
      },
      {
        title: "Cuticle Oil",
        price: 5,
        sku: '91KT003A',
        src: "https://cdn.vuetifyjs.com/images/cards/house.jpg"
      }
    ],
    productSale: []
  })
};
</script>

<style>
 .sell {
   bottom: 80px;
 }
</style>