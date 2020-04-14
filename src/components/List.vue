<template>
  <div v-if="delivered">
    <Transaction
      v-if="active"
      :transaction="tData"
      :modify="modify"
      v-on:back="back"
      v-on:deleted="deleted"
      v-on:updated="updated"
    ></Transaction>
    <v-list v-else two-line subheader>
      <template v-for="(tdate, date) in transactions">
        <v-subheader :key="date">
          <strong>{{date}}</strong>
        </v-subheader>
        <template v-for="(transaction, index) in tdate">
          <v-list-item @click="edit(transaction)" :key="date + index">
            <v-list-item-avatar>
              <v-avatar color="yellow darken-4" size="30">
                <span class="white--text title">{{index + 1}}</span>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content class="service">
              <v-list-item-title class="service-text">{{Object.keys(transaction.service).join(', ')}}</v-list-item-title>
              <v-list-item-subtitle>
                <strong></strong>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-content class="amount">
              <v-list-item-subtitle>
                <strong>${{transaction.price}}</strong>
              </v-list-item-subtitle>
              <v-list-item-subtitle>Tips ${{transaction.tips}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
        <div :key="date + 'Total'" class="total">
          <v-chip
            class="ma-2"
            color="success"
            outlined
          >Total: ${{tdate.reduce((acc, current) => ({price: acc.price + current.price})).price}} | Tips: ${{tdate.reduce((acc, current) => ({tips: acc.tips + current.tips})).tips}}</v-chip>
        </div>
        <v-divider :key="'divider' + date"></v-divider>
      </template>
    </v-list>
    <v-snackbar color="success" top v-model="snackbar" :timeout="3000">
      The transaction has been {{snackbarText}}!
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
  <div v-else>
    <v-skeleton-loader ref="skeleton" :type="type" :tile="tile" class="mx-auto"></v-skeleton-loader>
    <v-skeleton-loader ref="skeleton" :type="type" :tile="tile" class="mx-auto"></v-skeleton-loader>
    <v-skeleton-loader ref="skeleton" :type="type" :tile="tile" class="mx-auto"></v-skeleton-loader>
  </div>
</template>

<script>
import Transaction from "./Transaction.vue";
import db from "./firebaseInit";

export default {
  name: "List",
  components: {
    Transaction
  },
  data: () => ({
    tile: false,
    type: "list-item-avatar-three-line",
    types: [],
    settings: [],
    active: false,
    tData: null,
    modify: true,
    snackbar: false,
    snackbarText: null,
    delivered: false,
    transactions: {},
    user: JSON.parse(localStorage.getItem("user"))
  }),
  mounted() {
    this.types = Object.keys(this.$refs.skeleton.rootTypes);
  },
  created() {
    db.collection("transactions")
      .where("user", "==", db.collection("users").doc(this.user.email))
      .where("date", ">=", new Date(this.dateQuery(30)))
      .orderBy("date", "desc")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let data = doc.data();
          let groupDate = data.date.toDate().toLocaleDateString();
          console.log(data.date.toDate(), groupDate)
          let transaction = {
            id: doc.id,
            date: data.date.toDate(),
            price: data.price,
            tips: data.tips,
            service: data.service
          };

          if (groupDate in this.transactions) {
            this.transactions[groupDate].unshift(transaction);
          } else {
            this.transactions[groupDate] = new Array(transaction);
          }
        });
        this.delivered = true;
      });
  },
  methods: {
    dateQuery(days) {
      let today = new Date();
      return new Date().setDate(today.getDate() - days);
    },
    edit: function(transaction) {
      this.tData = transaction;
      this.active = true;
    },
    deleted(deleteItem) {
      console.log(deleteItem);
      if (this.transactions[deleteItem.date].length == 1) {
        delete this.transactions[deleteItem.date];
      } else {
        this.transactions[deleteItem.date] = this.transactions[
          deleteItem.date
        ].filter(item => item.id !== deleteItem.id);
      }
      this.active = false;
      this.snackbarText = "deleted";
      this.snackbar = true;
    },
    back() {
      this.active = false;
    },
    updated(transaction) {
      this.transactions[transaction.data.date.toLocaleDateString()].forEach(item => {
        if (item.id === transaction.id) {
          item.id = transaction.id;
          item.price = transaction.data.price;
          item.tips = transaction.data.tips;
          item.service = transaction.data.service;
        }
      });

      this.active = false;
      this.snackbarText = "updated";
      this.snackbar = true;
    }
  }
};
</script>

<style>
.amount {
  text-align: right;
}
.service {
  flex-grow: 3;
}
.service-text {
  white-space: normal;
}
.total {
  display: flex;
  justify-content: flex-end;
  padding-right: 10px;
}
</style>