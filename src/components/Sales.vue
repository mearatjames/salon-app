<template>
  <v-container class="container" fluid>
    <div v-if="!checkout">
    <v-row>
        <v-col cols="12">
          <v-expansion-panels dark >
          <v-expansion-panel >
        <v-expansion-panel-header color="teal darken-1" class="text-h6 white--text">{{`Today Sales: ${new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  }).format(today.total)}`}}</v-expansion-panel-header>
        <v-expansion-panel-content color="teal darken-1">
          <ul class="today-list">
                <li v-for="item in today.items" :key="item.name">{{`${item.name}: ${item.qty} `}}</li>
          </ul>
          <div class="mt-4 text-right d-flex justify-space-between">
           <v-btn :to="{name: 'Products', params: {products}}" rounded small light>Products</v-btn>
           <v-btn to="/sales/list" rounded small light>Details</v-btn>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
      </v-expansion-panels>
        </v-col>
    </v-row>
      <v-item-group v-model="selected" multiple>
        <v-row dense>
          <v-col cols="6" lg="3" md="6" sm="6" v-for="product in products" :key="product.sku">
            <product-card :product="product" />
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
    </div>
    <div v-else>
      <checkout v-on:remove="remove" v-on:cleanup="cleanup" :selectedProducts="items" v-on:back="back" />
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
    checkout: false,
    today: {total: 0, items: {}},
    date: new Date().toLocaleDateString("fr-CA"),
    user: JSON.parse(localStorage.getItem("user"))
  }),
  created() {
    this.getSnapshot()
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
            qty: 1,
            sku: data["SKU"],
            id: doc.id,
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
    },
  },
  methods: {
    add() {
      this.checkout = true;
    },
    back() {
      this.checkout = false;
      this.today = {total: 0, items: {}},
      this.getSnapshot()
    },
    remove(index) {
      this.items[index].qty = 1
      this.selected.splice(index, 1)
    },
    cleanup() {
      this.selected = []
      this.back()
    },
    getSnapshot() {
      db.collection("sales")
      .where("user", "==", db.collection("users").doc(this.user.email))
      .where("date", ">=", new Date(this.date))
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let data = doc.data();
         data.items.forEach(e => {
           this.today.total += parseInt(e.qty) * parseInt(e.price)
           !this.today.items[e.id] ? this.today.items[e.id] = { name: e.name, qty: e.qty } : this.today.items[e.id].qty += e.qty           
         })
          data.discount ? this.today.total - data.discount : this.today.total
        });
      });
    },
  }
};
</script>

<style scoped>
.sell {
  bottom: 80px;
}
.today-list {
  list-style: none;
}
</style>