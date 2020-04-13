<template>
  <div>
    <v-form ref="form">
      <v-card max-width="450" :elevation="12" class="transaction-card">
        <v-menu
          ref="datePicker"
          color="yellow darken-4"
          v-model="datePicker"
          :close-on-content-click="true"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="dateFormatted"
              color="yellow darken-4"
              label="Date"
              persistent-hint
              prepend-icon="event"
              inputmode="none"
              @blur="date = parseDate(dateFormatted)"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            color="yellow darken-4"
            v-model="date"
            :max="new Date().toLocaleDateString('fr-CA')"
            no-title
          ></v-date-picker>
        </v-menu>
        <div class="text-center">
          <Chip
            v-for="service in services"
            ref="chips"
            :key="service"
            :service="service"
            v-on:selectService="addService"
            v-on:deselectService="removeService"
          ></Chip>
        </div>
        <v-text-field
          v-model="price"
          color="yellow darken-4"
          prepend-icon="mdi-cash-100"
          label="Price"
          placeholder=" "
          required
          prefix="$"
          type="number"
          inputmode="decimal"
        >{{price}}</v-text-field>
        <v-text-field
          v-model="tips"
          color="yellow darken-4"
          prepend-icon="mdi-hand-heart"
          label="Tips"
          placeholder=" "
          prefix="$"
          required
          type="number"
          inputmode="decimal"
        >{{tips}}</v-text-field>
        <v-row justify="center">
          <v-btn
            :disabled="validate == false"
            class="add"
            rounded
            color="yellow darken-4"
            @click="add"
          >Add Transaction</v-btn>
          <v-dialog v-model="dialog" max-width="350">
            <div v-if="progress" class="text-center">
              <v-card class="progress">
                <p>Processing</p>
                <v-progress-circular indeterminate :size="70" :width="7" color="red"></v-progress-circular>
              </v-card>
            </div>
            <v-card v-else>
              <v-card-title class="headline">Is this correct?</v-card-title>
              <v-card-text>
                <strong>Date:</strong>
                {{dialogContent.date}}
                <br />
                <strong>Service:</strong>
                {{dialogContent.service}}
                <br />
                <strong>Price:</strong>
                ${{dialogContent.price}}
                <br />
                <strong>Tips:</strong>
                ${{dialogContent.tips}}
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-4" text @click="onCancel">Cancel</v-btn>
                <v-btn color="green darken-1" text @click="onConfirm">Ok</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-card>
    </v-form>
    <v-snackbar color="success" top v-model="snackbar" :timeout="3000">
      The transaction has been added!
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import Chip from "./Chip.vue";
import db from "./firebaseInit";

export default {
  name: "Transaction",
  components: {
    Chip
  },
  data: vm => ({
    snackbar: false,
    dialog: false,
    datePicker: false,
    services: [
      "Regular Mani",
      "Gel Mani",
      "Regular Pedi",
      "Gel Pedi",
      "Deluxe Pedi",
      "Design",
      "Fullset",
      "Fullset Ombre",
      "Fill",
      "Extra",
      "Other"
    ],
    selectedServices: [],
    price: null,
    tips: null,
    date: new Date().toLocaleDateString('fr-CA'),
    dateFormatted: vm.formatDate(new Date().toLocaleDateString('fr-CA')),
    active: false,
    value: null,
    progress: false,
    user: JSON.parse(localStorage.getItem("user")).email
  }),
  computed: {
    dialogContent: function() {
      return {
        date: this.dateFormatted,
        price: this.price,
        tips: this.tips,
        service: this.selectedServices.join(", ")
      };
    },
    validate: function() {
      if (
        this.selectedServices.length >= 1 &&
        this.price !== null &&
        this.price > 0
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date);
    }
  },
  methods: {
    cleanup() {
      this.progress = false;
      this.dialog = false;
      this.snackbar = true;
      this.selectedServices = [];
      this.price = null;
      this.tips = null;
      this.date = new Date().toLocaleDateString('fr-CA');
      this.dateFormatted = this.formatDate(
        new Date().toLocaleDateString('fr-CA')
      );
      this.$refs.chips.forEach(e => e.reset());
    },
    add() {
      this.dialog = true;
    },
    addService(service) {
      this.selectedServices.push(service);
    },
    removeService(service) {
      this.selectedServices = this.selectedServices.filter(
        el => el !== service
      );
    },
    onConfirm() {
      this.progress = true;
      let service = {};
      this.selectedServices.map(e => {
        service[e] = true;
      });
      db.collection("transactions")
        .add({
          date: new Date(this.date),
          price: parseFloat(this.price),
          tips: parseFloat(this.tips),
          user: db.doc(`/users/${this.user}`),
          service
        })
        .then(docRef => {
          this.cleanup();
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(error => {
          this.progress = false;
          this.dialog = false;
          console.error("Error adding document: ", error);
        });
    },
    onCancel() {
      // Do nothing
      this.dialog = false;
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }
};
</script>

<style scoped>
.transaction-card {
  width: 90%;
  margin: 40px auto;
  padding: 40px 20px;
}
.add {
  margin-top: 20px;
  color: white;
}

.progress {
  padding: 40px 10px;
}
</style>