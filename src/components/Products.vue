<template>
  <div class="container">
    <template v-if="!edit">
      <div class="text-left">
        <v-btn class="pl-0" to="/sales" exact text>
          <v-icon class="mr-1">mdi-arrow-left</v-icon>Back
        </v-btn>
      </div>
      <div class="text-center">
        <ul class="switchers">
          <li>
            <v-btn
              :disabled="progress"
              :ripple="false"
              class="z-index"
              @click="switching(false)"
              text
              rounded
              width="140px"
              :color="switcher ? 'teal' : 'white'"
              dark
              >Active</v-btn
            >
          </li>
          <li>
            <v-btn
              :disabled="progress"
              :ripple="false"
              class="z-index"
              @click="switching(true)"
              text
              rounded
              width="140px"
              :color="switcher ? 'white' : 'teal'"
              dark
              >Inactive</v-btn
            >
          </li>
          <div
            class="animate"
            v-bind:class="{ 'animate-right': switcher }"
          ></div>
        </ul>
        <v-item-group>
          <v-row dense>
            <v-col
              cols="6"
              lg="3"
              md="6"
              sm="6"
              v-for="product in list"
              :key="product.id"
            >
              <product-card v-on:selected="selected" :product="product" />
            </v-col>
          </v-row>
        </v-item-group>
      </div>
      <v-card-text style="height: 60px; position: relative">
        <v-btn fixed dark fab right color="teal" class="add" @click="add">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-text>
    </template>
    <product-edit
      :product="product"
      :isNew="isNew"
      v-else
      v-on:cancel="cancel"
      v-on:refresh="refresh"
    ></product-edit>
  </div>
</template>

<script>
import db from './firebaseInit'
import ProductCard from './ProductCard.vue'
import ProductEdit from './ProductEdit.vue'

export default {
  name: 'Products',
  props: {
    products: Array,
  },
  components: {
    ProductCard,
    ProductEdit,
  },
  data: () => ({
    switcher: false,
    progress: false,
    product: null,
    activeProducts: [],
    inactiveProducts: [],
    edit: false,
    isNew: null,
    user: JSON.parse(localStorage.getItem('user')),
  }),
  created() {
    if (!this.products) {
      this.updateList()
    } else {
      this.activeProducts = this.products
    }
  },
  computed: {
    list() {
      if (this.switcher) {
        return this.inactiveProducts
      } else {
        return this.activeProducts
      }
    },
  },
  methods: {
    add() {
      this.product = {
        image: require('../assets/placeholder.jpg'),
        name: null,
        price: null,
        active: true,
      }
      this.isNew = true
      this.edit = true
    },
    cancel() {
      this.edit = false
    },
    refresh() {
      this.updateList()
      this.edit = false
    },
    selected(product) {
      this.product = product
      this.isNew = false
      this.edit = true
    },
    async switching(e) {
      if (this.switcher !== e) {
        this.switcher = !this.switcher
        this.updateList()
      }
    },
    updateList() {
      let temp = []
      db.collection('products')
        .where('active', '==', !this.switcher)
        .where(
          'users',
          'array-contains',
          db.collection('users').doc(this.user.email)
        )
        .orderBy('name')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            let data = doc.data()
            temp.push({
              name: data.name,
              price: data.price,
              qty: 1,
              active: data.active,
              sku: data['SKU'] || null,
              id: doc.id,
              image: data.image,
            })
          })
          this.switcher
            ? (this.inactiveProducts = temp)
            : (this.activeProducts = temp)
        })
    },
  },
}
</script>

<style scoped>
ul.switchers {
  height: 36px;
  list-style: none;
  display: inline-flex;
  position: relative;
  margin-bottom: 20px;
  padding: 0;
  border-radius: 28px;
  background-color: rgb(201, 227, 219);
}

.animate {
  position: absolute;
  transition: 600ms;
  top: 0;
  left: 0;
  z-index: 1;
  height: 100%;
  width: 140px;
  background-color: #009688;
  border-radius: 28px;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}

.animate-right {
  transition: 600ms;
  transform: translateX(140px);
}

.z-index {
  z-index: 2;
  color: white;
}
.add {
  bottom: 80px;
}
</style>
