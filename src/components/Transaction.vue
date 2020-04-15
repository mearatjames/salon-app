<template>
  <div>
    <v-form ref="form">
      <v-card max-width="450" :elevation="12" class="transaction-card">
        <v-img v-if="modify" class="white--text title-edit align-end" height="80px">
          <div class="title-flex">
          <v-card-title>Modify Transaction</v-card-title>
          <v-card-actions>
          <v-btn @click="$emit('back')" icon color="white">
              <v-icon>mdi-close</v-icon>
          </v-btn>
          </v-card-actions>
          </div>
        </v-img>
        <v-img v-else class="white--text title-add align-end" height="80px">
          <v-card-title>Add New Transaction</v-card-title>
        </v-img>

        <div class="card-content">
          <div v-if="deleteProgress" class="text-center">
            <v-card class="progress">
              <p>Deleting the transaction</p>
              <v-progress-linear color="deep-purple accent-4" indeterminate rounded height="6"></v-progress-linear>
            </v-card>
          </div>
          <template v-else>
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
                :disabled="modify == true"
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
              v-for="(value, service) in services"
              ref="chips"
              :key="service + value"
              :service="service"
              :selected="value"
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
            >{{this.modify ? 'Update' : 'Add Transaction'}}</v-btn>
            <v-btn
              v-if="modify"
              :disabled="validate == false"
              class="add"
              rounded
              color="red darken-4"
              @click="del"
            >Delete</v-btn>
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
          </template>
        </div>
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
  props: {
    transaction: Object,
    modify: Boolean
  },
  data: vm => ({
    snackbar: false,
    dialog: false,
    datePicker: false,
    services: {
      "Regular Mani": false,
      "Gel Mani": false,
      "Regular Pedi": false,
      "Gel Pedi": false,
      "Deluxe Pedi": false,
      "Design": false,
      "Fullset": false,
      "Fullset Ombre": false,
      Fill: false,
      Extra: false,
      Other: false
    },
    price: null,
    tips: null,
    date: new Date().toLocaleDateString("fr-CA"),
    dateFormatted: vm.formatDate(new Date().toLocaleDateString("fr-CA")),
    active: false,
    value: null,
    progress: false,
    deleteProgress: false,
    user: JSON.parse(localStorage.getItem("user")).email
  }),
  computed: {
    dialogContent: function() {
      return {
        date: this.dateFormatted,
        price: this.price,
        tips: this.tips,
        service: Object.keys(this.services)
          .filter(key => this.services[key])
          .join(", ")
      };
    },
    validate: function() {
      if (
        Object.values(this.services).some(e => e === true) &&
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
  created() {
    if (this.transaction !== undefined && this.transaction !== null) {
      this.price = this.transaction.price;
      this.tips = this.transaction.tips;
      this.date = this.transaction.date.toLocaleDateString('fr-CA', {timeZone: 'UTC'});
      for (const service in this.transaction.service) {
        this.services[service] = this.transaction.service[service];
      }
    }
  },
  methods: {
    cleanup() {
      this.progress = false;
      this.dialog = false;
      this.snackbar = true;
      Object.keys(this.services).map(e => this.services[e] = false)
      this.price = null;
      this.tips = null;
      this.date = new Date().toLocaleDateString("fr-CA");
      this.dateFormatted = this.formatDate(
        new Date().toLocaleDateString("fr-CA")
      );
    },
    add() {
      this.dialog = true;
    },
    del() {
      this.deleteProgress = true;
      let deleteItem = {
        id: this.transaction.id,
        date: this.transaction.date.toLocaleDateString()
      }
      db.collection('transactions').doc(this.transaction.id).delete()
      .then(() => {
        this.$emit("deleted", deleteItem);
      })
      .catch((error) => console.log("Error removing document: ", error))
    },
    addService(service) {
      this.services[service] = true;
    },
    removeService(service) {
      this.services[service] = false;
    },
    onConfirm() {
      this.progress = true;
      let service = {};
      Object.keys(this.services)
        .filter(key => this.services[key])
        .forEach(e => (service[e] = true));
      let data = {
          date: new Date(this.date),
          price: parseFloat(this.price),
          tips: parseFloat(this.tips),
          user: db.doc(`/users/${this.user}`),
          service
      }
      if (this.modify) {
        db.collection("transactions").doc(this.transaction.id)
        .set(data)
        .then(() => {
          this.cleanup()
          this.$emit("updated", {data: data, id:this.transaction.id});
        })
        .catch(error => {
          this.progress = false;
          this.dialog = false;
          console.error("Error updating document: ", error);
        });
      } else {
        db.collection("transactions")
          .add(data)
          .then(() => {
            this.cleanup();
          })
          .catch(error => {
            this.progress = false;
            this.dialog = false;
            console.error("Error adding document: ", error);
          });
      }
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
.card-content {
  padding: 20px;
}
.title-edit {
  background-color: tomato;
}
.title-add {
  background-color: rgb(239, 163, 20);
}
.transaction-card {
  width: 90%;
  margin: 40px auto;
}
.add {
  margin: 20px 10px;
  color: white;
}

.progress {
  padding: 40px 10px;
}

.title-flex {
  display: flex;
  justify-content: space-between;
}
</style>