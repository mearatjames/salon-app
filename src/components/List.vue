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
      <div class="text-center">
      <ul class="switchers">
        <li>
          <v-btn
            :disabled="progress"
            :ripple="false"
            class="z-index"
            @click="switcher=false"
            text
            rounded
            width="140px"
            :color="switcher ? 'teal' : 'white'"
            dark
          >Monthly</v-btn>
        </li>
        <li>
          <v-btn
            :disabled="progress"
            :ripple="false"
            class="z-index"
            @click="switcher=true"
            text
            rounded
            width="140px"
            :color="switcher ? 'white' : 'teal'"
            dark
          >Date Range</v-btn>
        </li>
        <div class="animate" v-bind:class="{'animate-right': switcher}"></div>
      </ul>
    </div>
    <DateRangePicker v-on:updateDates="updateDates" v-bind:initDates="initDates" v-if="switcher"></DateRangePicker>
      <v-menu
        v-else
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            class="px-5"
            :value="formatMonth"
            prepend-icon="event"
            v-bind="attrs"
            v-on="on"
            readonly
            color="teal"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="date"
          type="month"
          no-title
          scrollable
          color="teal"
          :max="new Date().toLocaleDateString('fr-CA')"
          @input="menu = false"
          @change="updateList()"
        ></v-date-picker>
      </v-menu>
      <div v-if="Object.keys(transactions).length !== 0" class="text-center pb-4">
       <v-btn @click="generateReport" color="teal" rounded dark>Generate Report</v-btn>
      </div>
      <div class="px-5">
        <v-alert color="teal" outlined icon="mdi-google-downasaur" prominent border="left" v-show="Object.keys(transactions).length === 0">
          <div class="title">No Transaction Found</div>
        </v-alert>
      </div>
      <template v-for="(tdate, date) in transactions">
        <v-subheader class="subheader" :key="date">
          <strong>{{date}}</strong>
        </v-subheader>
        <template v-for="(transaction, index) in tdate">
          <v-list-item @click="edit(transaction)" :key="date + index">
            <v-list-item-avatar>
              <v-avatar color="teal" size="30">
                <span class="white--text title">{{index + 1}}</span>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content class="service">
              <v-list-item-title
                class="service-text"
              >{{Object.keys(transaction.service).join(', ')}}</v-list-item-title>
              <v-list-item-subtitle>
                {{transaction.customer}} <v-chip class="new-violator" v-if="transaction.newCust" color="orange" filter x-small outlined pill
                      >New</v-chip
                    >
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-content class="amount">
              <v-list-item-subtitle>
                <strong>${{transaction.price}}</strong> <template v-if="transaction.deposit"> (Deposit ${{transaction.deposit}})</template>
              </v-list-item-subtitle>
              <v-list-item-subtitle>Tips ${{transaction.tips}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
        <div :key="date + 'Total'" class="total">
          <v-chip
            class="ma-2"
            color="teal"
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
import DateRangePicker from "./DateRangePicker.vue";
import createWorkbook from "./createWorkbook";
import db from "./firebaseInit";

export default {
  name: "List",
  components: {
    Transaction,
    DateRangePicker
  },
  data: () => ({
    initDates: [],
    switcher: false,
    progress: false,
    date: new Date().toLocaleDateString("fr-CA").substr(0, 7),
    menu: false,
    modal: false,
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
    empty: null,
    monthTr: {},
    rangeTr: {},
    user: JSON.parse(localStorage.getItem("user"))
  }),
  computed: {
    formatMonth() {
      return this.date
        ? new Intl.DateTimeFormat("en-US", {
            month: "long",
            year: "numeric",
            timeZone: "UTC"
          }).format(new Date(this.date))
        : "";
    },
    transactions() {
      if (this.switcher) {
        return this.rangeTr
      } else {
        return this.monthTr
      }
    }
  },
  mounted() {
    this.types = Object.keys(this.$refs.skeleton.rootTypes);
  },
  created() {
    db.collection("transactions")
      .where("user", "==", db.collection("users").doc(this.user.email))
      .where("date", ">=", new Date(this.date))
      .orderBy("date", "desc")
      .get()
      .then(querySnapshot => {
        this.listData(querySnapshot)
      })
      .catch(error => {
        console.error(error);
      });
  },
  methods: {
    generateReport: async function() {
      let columnsHeader = [
        {name: 'Date', key: 'date' },
        {name: 'Customer', key: 'customer' },
        {name: 'Service', key: 'service' },
        {name: 'Price', key: 'price', totalsRowFunction: 'sum', style: { numFmt: '"$"#,##0.00' }},
        {name: 'After Split', key: 'split', totalsRowFunction: 'sum', style: { numFmt: '"$"#,##0.00' }},
        {name: 'Deposit', key: 'deposit', totalsRowFunction: 'sum', style: { numFmt: '"$"#,##0.00' }},
        {name: 'Net Payout', key: 'payout', totalsRowFunction: 'sum', style: { numFmt: '"$"#,##0.00' }}
      ]
      let fileName
      let data
      if (this.switcher) {
        data = this.rangeTr
        fileName = this.initDates.join('-').replace('/', '') + 'Report'
      } else {
        data = this.monthTr
        fileName = this.formatMonth.replace(' ', '') + 'Report'
      }
      let rows = await this.translateRows(data)
      createWorkbook(rows, columnsHeader, fileName)
    },
    getSplit(){
      return db.collection("users")
      .doc(this.user.email)
      .get()
      .then((querySnapshot) => {
        return querySnapshot.data().split;
      });
    },
    async translateRows(data) {
      let split = await this.getSplit()
      console.log(split)
      let rows = []
      for (let date in data) {
        data[date].forEach(row => {
          rows.unshift([
            new Intl.DateTimeFormat("en-US", {
                timeZone: "UTC"
              }).format(row.date),
            row.customer,
            Object.keys(row.service).join(', '),
            row.price,
            Math.ceil(row.price * split) / 100,
            row.deposit,
            (Math.ceil(row.price * split) / 100) - row.deposit
          ])
        })
      }
      return rows
    },
    edit: function(transaction) {
      this.tData = transaction;
      this.active = true;
    },
    deleted(deleteItem) {
      if (this.rangeTr[deleteItem.date]) {
        if (this.rangeTr[deleteItem.date].length == 1) {
          delete this.rangeTr[deleteItem.date];
        } else {
          this.rangeTr[deleteItem.date] = this.rangeTr[
            deleteItem.date
          ].filter(item => item.id !== deleteItem.id);
        }
      }
      if (this.monthTr[deleteItem.date]) {
        if (this.monthTr[deleteItem.date].length == 1) {
          delete this.monthTr[deleteItem.date];
        } else {
          this.monthTr[deleteItem.date] = this.monthTr[
            deleteItem.date
          ].filter(item => item.id !== deleteItem.id);
        }
      }
      this.active = false;
      this.snackbarText = "deleted";
      this.snackbar = true;
    },
    back() {
      this.active = false;
    },
    updateList() {
      this.delivered = false;
      let maxMonth = new Date(this.date);
      maxMonth.setMonth(maxMonth.getMonth() + 1);
      db.collection("transactions")
        .where("user", "==", db.collection("users").doc(this.user.email))
        .where("date", ">=", new Date(this.date))
        .where("date", "<", maxMonth)
        .orderBy("date", "desc")
        .get()
        .then(querySnapshot => {
          this.listData(querySnapshot)
        })
        .catch(error => {
          console.error(error);
        });
    },
    listData(querySnapshot) {
          let transactions = {}
          if (!querySnapshot.empty) {
            querySnapshot.forEach(doc => {
              let data = doc.data();
              let groupDate = new Intl.DateTimeFormat("en-US", {
                timeZone: "UTC"
              }).format(data.date.toDate());
              let transaction = {
                id: doc.id,
                date: data.date.toDate(),
                customer: data.customer || null,
                newCust: data.newCust || null,
                price: data.price,
                deposit: data.deposit || null,
                tips: data.tips || 0,
                service: data.service
              };
              if (groupDate in transactions) {
                transactions[groupDate].unshift(transaction);
              } else {
                transactions[groupDate] = new Array(transaction);
              }
            });
          }
          this.delivered = true;
          this.progress = false;
          this.switcher ? this.rangeTr = transactions : this.monthTr = transactions
    },
    updated(transaction) {
      if (this.rangeTr[
        new Intl.DateTimeFormat("en-US", { timeZone: "UTC" }).format(
          transaction.data.date
        )
      ]) {
        this.rangeTr[
          new Intl.DateTimeFormat("en-US", { timeZone: "UTC" }).format(
            transaction.data.date
          )
        ].forEach(item => {
          if (item.id === transaction.id) {
            item.id = transaction.id;
            item.price = transaction.data.price;
            item.tips = transaction.data.tips;
            item.service = transaction.data.service;
            item.customer = transaction.data.customer;
            item.newCust = transaction.data.newCust;
            item.deposit = transaction.data.deposit;
          }
        });
      }
      if (this.monthTr[
        new Intl.DateTimeFormat("en-US", { timeZone: "UTC" }).format(
          transaction.data.date
        )
      ]) {
        this.monthTr[
          new Intl.DateTimeFormat("en-US", { timeZone: "UTC" }).format(
            transaction.data.date
          )
        ].forEach(item => {
          if (item.id === transaction.id) {
            item.id = transaction.id;
            item.price = transaction.data.price;
            item.tips = transaction.data.tips;
            item.service = transaction.data.service;
            item.customer = transaction.data.customer;
            item.newCust = transaction.data.newCust;
            item.deposit = transaction.data.deposit;
          }
        });
      }
      this.active = false;
      this.snackbarText = "updated";
      this.snackbar = true;
    },
    updateDates(dates) {
      if (dates.length < 1) {
        return;
      }
      if (dates.length == 1) {
        this.initDates = dates;
        this.progress = true;
        db.collection("transactions")
          .where("user", "==", db.collection("users").doc(this.user.email))
          .where("date", "==", new Date(dates[0]))
          .get()
          .then(querySnapshot => {
            this.listData(querySnapshot)
          });
      } else {
        this.initDates = dates;
        this.progress = true;
        db.collection("transactions")
          .where("user", "==", db.collection("users").doc(this.user.email))
          .where("date", ">=", new Date(dates[0]))
          .where("date", "<=", new Date(dates[1]))
          .orderBy("date", "desc")
          .get()
          .then(querySnapshot => {
            this.listData(querySnapshot)
          });
      }
    },
  }
};
</script>

<style scoped>
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
.subheader {
  height: 30px;
  align-items: flex-end;
}

ul.switchers {
  height: 36px;
  margin-top: 20px;
  list-style: none;
  display: inline-flex;
  position: relative;
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
</style>