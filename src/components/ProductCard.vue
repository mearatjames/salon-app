<template>
  <v-item v-slot:default="{ active, toggle }">
  <v-card :outlined="active" :ripple="false" :class="active ? 'selected' : ''" class="product-card text-center" @click="toggle(), update()" min-height="100%">
    <v-img
      :src="product.image"
      class="white--text align-end product-image"
      gradient="to bottom, rgba(0,0,0,.01), rgba(0,0,0,.08)"
      cover
    >
    </v-img>
     <v-card-title class="pt-1 justify-center text-subtitle-1" v-text="product.name"></v-card-title>
      <v-card-subtitle class="pb-0" v-text="new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  }).format(product.price)"></v-card-subtitle>
    <div class="text-center button-container">
    </div>
  </v-card>
  </v-item>
</template>

<script>
export default {
  name: "ProductCard",
  props: {
    product: Object,
  },
  data: () => ({
	counter: 0
  }),
  methods: {
    update() {
      this.product.qty = 1
    },
  }
};
</script>

<style scoped>

div.product-card.v-card {
  border-radius: 18px;
}

.v-card--link:focus:before {
   opacity: 0;
}

.selected {
  /* box-shadow: 0 0 0 2px teal; */
  background-color: rgba(6, 247, 247, 0.084);
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 0 0 8px;
}

.qty {
  z-index: 2;
}

.minus {
  width: 90px;
  justify-content: left;
  margin-right: -40px;
  z-index: 1;
  margin-bottom: 5px;
}

.plus {
  width: 90px;
  justify-content: flex-end;
  margin-left: -40px;
  z-index: 1;
  margin-bottom: 5px;
}

.product-image {
  height: 200px;
}

@media only screen and (max-width: 735px) {
  .product-image {
    height: 140px;
  }
}
</style>