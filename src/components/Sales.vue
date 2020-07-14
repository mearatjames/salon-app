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
    </v-row>-->
    <div v-if="!checkout">
      <v-item-group v-model="selected" multiple>
        <v-row dense>
          <v-col cols="6" lg="3" md="6" sm="6" v-for="product in products" :key="product.sku">
            <ProductCard :product="product" />
          </v-col>
        </v-row>
      </v-item-group>
      <v-card-text style="height: 60px; position: relative">
        <v-btn
          v-show="selected.length > 0"
          fixed
          dark
          fab
          right
          color="teal"
          class="sell"
          @click="add"
        >
          <v-badge color="amber darken-3" :value="selected.length > 0" :content="selected.length">
            <v-icon>mdi-cart-plus</v-icon>
          </v-badge>
        </v-btn>
      </v-card-text>
      <!-- <div>{{items}}</div> -->
    </div>
    <div v-else>
      <Checkout :selectedProducts="items" v-on:back="back" />
    </div>
  </v-container>
</template>

<script>
import db from "./firebaseInit";
import ProductCard from "./ProductCard.vue";
import Checkout from "./Checkout.vue";

export default {
  components: {
    ProductCard,
    Checkout
  },
  data: () => ({
    products: [],
    selected: [],
    checkout: false
  }),
  created() {
    db.collection("products")
      .where("active", "==", true)
      .orderBy("name")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let data = doc.data();
          this.products.push({
            name: data.name,
            price: data.price,
            sku: data["SKU"],
            image: `https://firebasestorage.googleapis.com/v0/b/salon-app-d6c37.appspot.com/o/products%2F${doc.id}%2Fcard.jpg?alt=media`
          });
        });
      });
  },
  computed: {
    items() {
      let selectedProducts = []
      this.selected.forEach((e) => {
        selectedProducts.push(this.products[e])
      })
      return selectedProducts
    }
  },
  methods: {
    add() {
      this.checkout = true;
    },
    back() {
      this.checkout = false;
    }
  }
};
</script>

<style>
.sell {
  bottom: 80px;
}
</style>