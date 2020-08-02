<template>
  <div>
    <v-form v-model="valid">
      <div class="d-flex justify-space-between align-top">
        <v-btn class="pl-0" @click="$emit('back')" text>
          <v-icon class="mr-1">mdi-arrow-left</v-icon>Back
        </v-btn>
        <div class="pr-3">
          <v-menu
            ref="datePicker"
            color="teal"
            v-model="datePicker"
            :close-on-content-click="true"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                dense
                class="date pt-0"
                v-model="formattedDate"
                color="teal"
                readonly
                prepend-icon="event"
                inputmode="none"
                required
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
      <v-row>
        <v-col cols="12" v-show="selectedProducts.length == 0">
          <v-alert
            color="teal"
            border="left"
            elevation="2"
            colored-border
            icon="mdi-cart-outline"
          >No items in the cart.</v-alert>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <v-text-field
              dense
              v-model="customer"
              prepend-icon="mdi-face-woman"
              placeholder=" "
              label="Customer"
              color="teal"
            ></v-text-field>
        </v-col>
      </v-row>
      <div v-for="(product, index) in selectedProducts" :key="product.sku">
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
                          <div class="body-1">
                            {{new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            }).format(product.price)}}
                          </div>
                        </v-col>
                      </v-row>
                    </v-img>
                  </v-avatar>
                </div>
                <div>
                  <v-text-field
                    class="qty"
                    v-model="product.qty"
                    color="teal"
                    min="1"
                    maxlength="3"
                    label="QTY"
                    placeholder=" "
                    :rules="qtyRules"
                    required
                    type="number"
                    inputmode="numeric"
                    onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                  ></v-text-field>
                </div>
                <div>
                  <div class="pr-5">
                    {{new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    }).format(product.price * product.qty)}}
                  </div>
                </div>
              </div>
              <div class="remove">
                <v-btn text x-small fab>
                  <v-icon @click="remove(index)">mdi-close</v-icon>
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
      <div class="pt-2">
        <v-divider></v-divider>
        <v-row justify="space-between">
          <v-col class="pl-5 pt-3" cols="4">Subtotal</v-col>
          <v-col class="text-right pt-3 pr-8" cols="4">
            {{new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            }).format(subtotal)}}
          </v-col>
        </v-row>
        <v-row justify="space-between">
          <v-col class="pl-5 py-1 text-caption" cols="4">
            <!-- <a>Add discount</a> -->
          </v-col>
          <v-col class="text-right py-1 pr-8 text-caption" cols="4"></v-col>
        </v-row>
        <v-row justify="space-between">
          <v-col class="pl-5 py-1" cols="4">
            <h3>Total</h3>
          </v-col>
          <v-col class="text-right py-1 pr-8" cols="4">
            <h3>
              {{new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              }).format(subtotal - discount)}}
            </h3>
          </v-col>
        </v-row>
      </div>
      <v-row>
        <v-col cols="12">
          <div class="text-center checkout-btn-container">
            <v-btn
              :disabled="!valid || selectedProducts.length == 0"
              class="checkout-btn"
              width="80%"
              max-width="340px"
              rounded
              :dark="valid"
              @click="submit"
              type="submit"
              color="teal"
            >Confirm Sale</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
    <v-dialog v-model="dialog" hide-overlay persistent width="300">
      <v-card color="teal" dark>
        <v-card-text>
          Submitting
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import db from "./firebaseInit";

export default {
  props: {
    selectedProducts: Array
  },
  data: () => ({
    dialog: false,
    valid: false,
    qty: 1,
    customer: null,
    datePicker: false,
    discount: 0,
    qtyRules: [
      v => !!v || "Qty is required",
      v => v > 0 || "Qty can't be 0",
      v => v < 500 || "Qty is too high"
    ],
    date: new Date().toLocaleDateString("fr-CA"),
    user: JSON.parse(localStorage.getItem("user")).email
  }),
  methods: {
    remove(index) {
      this.$emit("remove", index);
    },
    submit(e) {
      e.preventDefault();
      this.dialog = true;
      this.valid = false;
      let extracted = this.selectedProducts.map(item => {
        return { 'price': parseFloat(item.price), 'qty': parseInt(item.qty), 'id': item.id, 'name': item.name}
      }
        )
      let data = {
        date: new Date(this.date),
        customer: this.customer,
        discount: this.discount,
        user: db.doc(`/users/${this.user}`),
        items: extracted
      };
      db.collection("sales")
        .add(data)
        .then(() => {
          this.$emit('cleanup')
        })
        .catch(error => {
          console.error("Error adding document: ", error);
        });
    }
  },
  computed: {
    formattedDate() {
      return new Date(this.date).toLocaleDateString("en-US");
    },
    subtotal() {
      let total = 0;
      this.selectedProducts.forEach(e => {
        total += e.price * e.qty;
      });
      return total;
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
    rgba(255, 255, 255, 0) 0%,
    rgba(0, 0, 0, 0.6) 75%,
    rgba(0, 0, 0, 0.9) 100%
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
  width: 50px;
}
.date {
  width: 120px;
}
</style>