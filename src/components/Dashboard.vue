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
            class="px-5"
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
      <v-list>
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
            class="teal white--text"
          >mdi-cash-multiple</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-subtitle>Total</v-list-item-subtitle>
          <v-list-item-title>{{new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(total.beforeSplit)}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-group
        no-action
        color='teal'
        @click="slider = split"
      >
        <template v-slot:activator>
          <v-list-item-avatar>
          <v-icon
            class="green white--text"
          >mdi-cash</v-icon>
        </v-list-item-avatar>
         <v-list-item-content>
          <v-list-item-subtitle>My Split ({{split}}%)</v-list-item-subtitle>
          <v-list-item-title>{{new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(total.mySplit)}}</v-list-item-title>
        </v-list-item-content>
        </template>

        <v-list-item class="padding"
        >
          <v-list-item-content>
        <div class="my-2">
        <v-btn @click="updateSplit()" :disabled="slider == split" color='teal' class="update" small>Update</v-btn>
      </div>
            <v-slider
          v-model="slider"
          thumb-label="always"
          track-color="amber"
          color='teal'
        >
        <template v-slot:thumb-label="{ value }">
            {{ value }}%
          </template>
        </v-slider>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
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
          >mdi-cash-plus</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-subtitle>My Split + Tips</v-list-item-subtitle>
          <v-list-item-title>{{new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(total.mySplit + total.tips)}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      </v-list>
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
    split: 0,
    slider: 0,
    date: new Date().toISOString().substr(0, 7),
    total: {
      tips: 0,
      beforeSplit: 0,
      mySplit: 0,
      salonSplit: 0,
      customer: 0
    },
    user: JSON.parse(localStorage.getItem("user")),
  }),
  computed: {
    formatMonth() {
      return this.date ? new Intl.DateTimeFormat('en-US', {month: 'long', year: 'numeric'}).format(new Date(this.date)) : ''
    }
  },
  created() {
        db.collection('users').doc(this.user.email)
          .get()
          .then(querySnapshot => {
            this.split = querySnapshot.data().split
            this.slider = querySnapshot.data().split
          })
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
            this.total.mySplit = Math.round(this.total.beforeSplit * this.split * 0.01)
            this.total.salonSplit = this.total.beforeSplit - this.total.mySplit
          }
          )
  },
  methods: {
    updateSplit() {
      db.collection('users').doc(this.user.email)
        .set({split: this.slider}, { merge: true })
        .then(() => {
          this.split = this.slider
          this.total.mySplit = Math.round(this.total.beforeSplit * this.split * 0.01)
        })
    },
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
              this.total.mySplit = Math.round(this.total.beforeSplit * this.split * 0.01)
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
  .update {
    color: white;
  }
  @media only screen and (max-width: 1068px) {
  .v-application--is-ltr .v-list-group--no-action > .v-list-group__items > .v-list-item {
    padding: 0 10px;
  }
  }
</style>