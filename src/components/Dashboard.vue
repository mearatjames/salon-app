<template>
  <div >
    <v-menu
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
            :value="formatMonth"
            prepend-icon="event"
            v-bind="attrs"
            v-on="on"
            readonly
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="date"
          type="month"
          no-title
          scrollable
          :max="new Date().toLocaleDateString('fr-CA')"
          @input="menu = false"
          @change="updateList()"
        >
        </v-date-picker>
      </v-menu>
    <!-- <div class="snapshot">

    <DoughnutChart>

    </DoughnutChart>
    <div class="total-snapshot">

    <p>Total: $600</p>
    </div>
    </div> -->
    
    <v-sheet color="grey lighten-3">
   <v-subheader >MONTHLY SNAPSHOT</v-subheader>
    <v-sheet >
       <v-list-item>
        <v-list-item-avatar>
          <v-icon
            class="amber white--text"
          >mdi-account-group</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-subtitle>Customers</v-list-item-subtitle>
          <v-list-item-title>{{total.customer}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-avatar>
          <v-icon
            class="green white--text"
          >mdi-cash-multiple</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-subtitle>My Split</v-list-item-subtitle>
          <v-list-item-title>{{new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(total.mySplit)}}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon>
            <v-icon color="grey lighten-1">mdi-information</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon
            class="blue white--text"
          >mdi-hand-heart</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-subtitle>Tips</v-list-item-subtitle>
          <v-list-item-title>{{new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(total.tips)}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon
            class="red white--text"
          >mdi-cash-100</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-subtitle>My Split + Tips</v-list-item-subtitle>
          <v-list-item-title>{{new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(total.mySplit + total.tips)}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
     
     </v-sheet>
     <!-- <v-subheader>WEEKLY TRENDS</v-subheader>
     <BarChart></BarChart> -->
     </v-sheet>
  </div>
</template>

<script>
import db from "./firebaseInit";
// import DoughnutChart from './DoughnutChart'


export default {
  name: "Dashboard",
  components: {
    // DoughnutChart
  },
  data: () => ({
    delivered: false,
    menu: false,
    date: new Date().toISOString().substr(0, 7),
    total: {
      tips: 0,
      beforeSplit: 0,
      mySplit: 0,
      salonSplit: 0,
      customer: 0
    },
    user: JSON.parse(localStorage.getItem("user")),
    items: [
        { icon: 'assignment', iconClass: 'blue white--text', title: '$400', subtitle: 'Tips' },
        { icon: 'call_to_action', iconClass: 'amber white--text', title: '20 Customers', subtitle: 'Count' },
        { icon: 'call_to_action', iconClass: 'amber white--text', title: '$4,500', subtitle: 'Gross Revenue' },
        { icon: 'call_to_action', iconClass: 'amber white--text', title: '$3,000', subtitle: 'Income After Split' },
      ],
  }),
  computed: {
    formatMonth() {
      return this.date ? new Intl.DateTimeFormat('en-US', {month: 'long', year: 'numeric'}).format(new Date(this.date)) : ''
    }
  },
  created() {
        db.collection("transactions")
          .where("user", "==", db.collection("users").doc(this.user.email))
          .where("date", ">=", new Date(this.date))
          .orderBy('date', 'desc')
          .get()
          .then(querySnapshot => {
           querySnapshot.forEach(doc => {
              let data = doc.data()
              this.total.tips += data.tips
              this.total.beforeSplit += data.price
              this.total.customer++
            })
            this.total.mySplit = Math.round(this.total.beforeSplit * 0.6)
            this.total.salonSplit = this.total.beforeSplit - this.total.mySplit
          }
          )
  },
  methods: {
  updateList() {
        this.total = {
      tips: 0,
      beforeSplit: 0,
      mySplit: 0,
      salonSplit: 0,
      customer: 0
    }
        let maxMonth = new Date(this.date)
        maxMonth.setMonth(maxMonth.getMonth() + 1)
      db.collection("transactions")
      .where("user", "==", db.collection("users").doc(this.user.email))
      .where("date", ">=", new Date(this.date))
      .where("date", "<", maxMonth)
      .orderBy("date", "desc")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
              let data = doc.data()
              this.total.tips += data.tips
              this.total.beforeSplit += data.price
              this.total.customer++
            })
            this.total.mySplit = Math.round(this.total.beforeSplit * 0.6)
            this.total.salonSplit = this.total.beforeSplit - this.total.mySplit
          });
    },
  }
};
</script>

<style scoped>
  .total-snapshot {
    position: relative; 
    text-align: center;
    bottom: 50%;
  }
  .snapshot {
    height: 420px;
  }
</style>