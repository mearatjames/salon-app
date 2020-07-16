<template>
  <div>
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
        color="teal"
        no-title
        scrollable
        :max="new Date().toLocaleDateString('fr-CA')"
        @input="menu = false"
        @change="updateList()"
      ></v-date-picker>
    </v-menu>
    <v-sheet color="teal lighten-5">
      <v-subheader
        class="teal--text text--darken-2"
      >{{switcher ? `DATE RANGE SNAPSHOT` : 'MONTHLY SNAPSHOT'}}</v-subheader>
      <v-sheet>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon class="amber white--text">mdi-account-group</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-subtitle>Customers</v-list-item-subtitle>
              <v-list-item-title>{{total.customer}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon class="teal white--text">mdi-cash-multiple</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-subtitle>Total</v-list-item-subtitle>
              <v-list-item-title>
                {{new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                }).format(total.beforeSplit)}}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-group no-action color="teal" @click="slider = split">
            <template v-slot:activator>
              <v-list-item-avatar>
                <v-icon class="green white--text">mdi-cash</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-subtitle>My Split ({{split}}%)</v-list-item-subtitle>
                <v-list-item-title>
                  {{new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  }).format(total.mySplit)}}
                </v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item class="padding">
              <v-list-item-content>
                <div class="my-2">
                  <v-btn
                    @click="updateSplit()"
                    :disabled="slider == split"
                    color="teal"
                    rounded
                    class="update"
                    small
                  >Update</v-btn>
                </div>
                <v-slider v-model="slider" thumb-label="always" track-color="amber" color="teal">
                  <template v-slot:thumb-label="{ value }">{{ value }}%</template>
                </v-slider>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon class="blue white--text">mdi-hand-heart</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-subtitle>Tips</v-list-item-subtitle>
              <v-list-item-title>
                {{new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                }).format(total.tips)}}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon class="red white--text">mdi-cash-plus</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-subtitle>My Split + Tips</v-list-item-subtitle>
              <v-list-item-title>
                {{new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                }).format(total.mySplit + total.tips)}}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
    <v-card color="teal lighten-5" class="mb-3 pa-3 rounded-lg">
      <div class="text-subtitle-1 text--primary">{{`Total Sales: ${new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                }).format(200)}`}}</div>
      <v-chip
      class="ma-2"
      color="teal"
      text-color="white"
    >
      50 Removal Kits 
    </v-chip>

    <v-chip
      class="ma-2"
      color="teal"
      text-color="white"
    >
      10 Acetones
    </v-chip>

    <v-chip
      class="ma-2"
      color="teal"
      text-color="white"
    >
      5 Cuticle Oils
    </v-chip>
    </v-card>
      </v-sheet>
      
    </v-sheet>
  </div>
</template>

<script>
import db from "./firebaseInit";
import DateRangePicker from "./DateRangePicker.vue";

export default {
  name: "Dashboard",
  components: {
    DateRangePicker
  },
  data: () => ({
    initDates: [],
    delivered: false,
    menu: false,
    split: 0,
    slider: 0,
    switcher: false,
    progress: false,
    date: new Date().toLocaleDateString("fr-CA").substr(0, 7),
    totalMonth: {
      tips: 0,
      beforeSplit: 0,
      mySplit: 0,
      salonSplit: 0,
      customer: 0
    },
    totalDateRange: {
      tips: 0,
      beforeSplit: 0,
      mySplit: 0,
      salonSplit: 0,
      customer: 0
    },
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
    total() {
      if (this.switcher) {
        this.splitCal(this.totalDateRange);
        return this.totalDateRange;
      } else {
        this.splitCal(this.totalMonth);
        return this.totalMonth;
      }
    }
  },
  created() {
    db.collection("users")
      .doc(this.user.email)
      .get()
      .then(querySnapshot => {
        this.split = querySnapshot.data().split;
        this.slider = querySnapshot.data().split;
      });
    db.collection("transactions")
      .where("user", "==", db.collection("users").doc(this.user.email))
      .where("date", ">=", new Date(this.date))
      .orderBy("date", "desc")
      .get()
      .then(querySnapshot => {
        this.aggregate(querySnapshot, this.totalMonth);
      });
  },
  methods: {
    
    splitCal(total) {
      total.mySplit = Math.round(total.beforeSplit * this.split * 0.01);
      total.salonSplit = total.beforeSplit - total.mySplit;
    },
    updateDates(dates) {
      if (dates.length < 1) {
        return;
      }
      if (dates.length == 1) {
        this.initDates = dates;
        this.listRange = []
        this.reset(this.totalDateRange);
        this.progress = true;
        db.collection("transactions")
          .where("user", "==", db.collection("users").doc(this.user.email))
          .where("date", "==", new Date(dates[0]))
          .get()
          .then(querySnapshot => {
            this.aggregate(querySnapshot, this.totalDateRange);
          });
      } else {
        this.initDates = dates;
        this.reset(this.totalDateRange);
        this.listRange = []
        this.progress = true;
        db.collection("transactions")
          .where("user", "==", db.collection("users").doc(this.user.email))
          .where("date", ">=", new Date(dates[0]))
          .where("date", "<=", new Date(dates[1]))
          .orderBy("date", "desc")
          .get()
          .then(querySnapshot => {
            this.aggregate(querySnapshot, this.totalDateRange);
          });
      }
    },
    updateSplit() {
      db.collection("users")
        .doc(this.user.email)
        .set({ split: this.slider }, { merge: true })
        .then(() => {
          this.split = this.slider;
        });
    },
    updateList() {
      this.reset(this.totalMonth);
      this.listMonth = []
      this.progress = true;
      let maxMonth = new Date(this.date);
      maxMonth.setMonth(maxMonth.getMonth() + 1);
      db.collection("transactions")
        .where("user", "==", db.collection("users").doc(this.user.email))
        .where("date", ">=", new Date(this.date))
        .where("date", "<", maxMonth)
        .orderBy("date", "desc")
        .get()
        .then(querySnapshot => {
          this.aggregate(querySnapshot, this.totalMonth);
        });
    },
    reset(total) {
      total.tips = 0;
      total.customer = 0;
      total.beforeSplit = 0;
      total.mySplit = 0;
      total.salonSplit = 0;
    },
    aggregate(querySnapshot, total) {
      querySnapshot.forEach(doc => {
        let data = doc.data();
        total.tips += data.tips;
        total.beforeSplit += data.price;
        total.customer++;
      });
      this.progress = false;
    }
  }
};
</script>

<style scoped>

.update {
  color: white;
}
@media only screen and (max-width: 1068px) {
  .v-application--is-ltr
    .v-list-group--no-action
    > .v-list-group__items
    > .v-list-item {
    padding: 0 10px;
  }
}
.switchers {
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
  min-width: 140px;
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