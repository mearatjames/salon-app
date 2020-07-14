<template>
  <div>
    <div class="d-flex justify-space-between align-top">
      <v-btn class="pl-0" @click="$emit('back')" text>
        <v-icon class="mr-1">mdi-arrow-left</v-icon>Back
      </v-btn>
      <div class="pr-3">
        <v-menu
          ref="datePicker"
          color="teal"
          v-model="datePicker"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              class="date pt-0"
              v-model="date"
              color="teal"
              readonly
              prepend-icon="event"
              inputmode="none"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            color="teal"
            v-model="date"
            :reactive="true"
            :max="new Date().toLocaleDateString('fr-CA')"
            no-title
          ></v-date-picker>
        </v-menu>
      </div>
    </div>
    <div v-for="product in selectedProducts" :key="product.sku">
      <v-row dense>
        <v-col cols="12">
          <v-card class="checkout-card">
            <div class="d-flex flex-no-wrap justify-space-between align-center">
              <div>
                <v-avatar size="150" tile>
                  <v-img class="product-image" :src="product.image">
                    <v-row align="end" class="white--text product-dsc">
                      <v-col class="pb-1">
                        <div class="subheading">{{product.name}}</div>
                        <div class="body-1">{{`$${product.price}`}}</div>
                      </v-col>
                    </v-row>
                  </v-img>
                </v-avatar>
              </div>
              <div>
                <v-text-field
                  class="qty"
                  v-model="qty"
                  color="teal"
                  label="QTY"
                  required
                  type="number"
                  inputmode="decimal"
                ></v-text-field>
              </div>
              <div>
                <div class="pr-5">$10</div>
              </div>
            </div>
            <div class="remove">
              <v-btn text x-small fab>
                <v-icon @click="remove">mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <v-row dense>
      <v-col cols="12">
        <v-card class="checkout-card">
          <div class="d-flex flex-no-wrap justify-space-between align-center">
            <div>
              <v-avatar size="150" tile>
                <v-img
                  class="product-image"
                  src="https://cdn.vuetifyjs.com/images/cards/halcyon.png"
                >
                  <v-row align="end" class="white--text product-dsc">
                    <v-col class="pb-1">
                      <div class="subheading">Removal Kit</div>
                      <div class="body-1">$10</div>
                    </v-col>
                  </v-row>
                </v-img>
              </v-avatar>
            </div>
            <div>
              <v-text-field
                class="qty"
                v-model="qty"
                color="teal"
                label="QTY"
                required
                type="number"
                inputmode="decimal"
              ></v-text-field>
            </div>
            <div>
              <div class="pr-5">$10</div>
            </div>
          </div>
          <div class="remove">
            <v-btn text x-small fab>
              <v-icon @click="remove">mdi-close</v-icon>
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <div class="pt-2">
      <v-divider></v-divider>
      <v-row justify="space-between">
        <v-col class="pl-5 py-1 text-caption" cols="4">Subtotal</v-col>
        <v-col class="text-right text-caption py-1 pr-8" cols="4">$20</v-col>
      </v-row>
      <v-row justify="space-between">
        <v-col class="pl-5 py-1 text-caption" cols="4">
          <a>Add discount</a>
        </v-col>
        <v-col class="text-right py-1 pr-8 text-caption" cols="4"></v-col>
      </v-row>
      <v-row justify="space-between">
        <v-col class="pl-5 py-1" cols="4">Total</v-col>
        <v-col class="text-right py-1 pr-8" cols="4">$20</v-col>
      </v-row>
    </div>
    <v-row>
      <v-col cols="12">
        <div class="text-center checkout-btn-container">
          <v-btn
            class="checkout-btn"
            width="80%"
            max-width="360px"
            rounded
            dark
            color="teal"
          >Confirm Sale</v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    selectedProducts: Array
  },
  data: () => ({
    qty: 1,
    datePicker: false,
    date: new Date().toLocaleDateString("fr-CA")
  }),
  methods: {
    remove() {
      console.log("click");
    }
  }
};
</script>

<style scoped>
div.v-card.checkout-card {
  border-radius: 18px;
  overflow: hidden;
}

.checkout-btn-container {
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 60px;
  margin-bottom: 40px;
}
.checkout-btn {
  position: fixed;
  bottom: 80px;
}
.product-image:before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 38%,
    rgba(0, 0, 0, 0.5942752100840336) 66%,
    rgba(0, 0, 0, 0.7931547619047619) 79%
  );
  opacity: 0.85;
}
.product-dsc {
  z-index: 1;
}
.remove {
  position: absolute;
  right: 5px;
  top: 5px;
}
.qty {
  width: 40px;
}
.date {
  width: 120px;
}
</style>