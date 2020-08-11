<template>
  <div class="text-center">
    <div class="text-left ma-2">
      <v-btn class="pl-0" to="/sales" exact text>
        <v-icon class="mr-1">mdi-chevron-left</v-icon>Back
      </v-btn>
    </div>
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
    <date-range-picker v-on:updateDates="updateDates" v-bind:initDates="initDates" v-if="switcher"></date-range-picker>
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
    <div class="px-5">
      <v-alert
        color="teal"
        outlined
        icon="mdi-google-downasaur"
        prominent
        border="left"
        v-if="list.length < 1"
      >
        <div class="title">No Transaction Found</div>
      </v-alert>
    </div>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card v-if="dialogMsg">
        <v-card-title class="headline">Delete Confirmation</v-card-title>
        <v-card-text>
          {{new Intl.DateTimeFormat("en-US", {
              timeZone: "UTC"
              }).format(dialogMsg.date)}}
          <br />
          <template v-for="(item, index) in dialogMsg.items">
            <div :key="index">{{`${item.name}: ${item.qty} @ ${new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          }).format(item.price)} each`}}</div>
          </template>
          <v-icon small>mdi-face-woman</v-icon> {{dialogMsg.customer || 'N/A'}}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warning" text @click="dialog = false">Cancel</v-btn>
          <v-btn color="red" text @click="deleteSale(dialogMsg.id)">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-divider v-if="list.length >= 1"></v-divider>
    <template v-for="(item, index) in list">
      <div :key="index">
        <div class="list">
          <div class="list-item">
            <span>
              {{new Intl.DateTimeFormat("en-US", {
              timeZone: "UTC"
              }).format(item.date)}}
            </span>
            <template v-for="(product) in item.items">
              <p :key="product.id">
                {{product.name}}: {{product.qty}}
                <span style=" white-space: nowrap;">
                  @ {{new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  }).format(product.price)}} each
                </span>
              </p>
            </template>
            <div>
              <v-icon small>mdi-face-woman</v-icon>
              <span> {{item.customer || "N/A"}}</span>
            </div>
          </div>
          <div class="list-total">
            <p>
              <strong>{{total(item.items)}}</strong>
            </p>
            <v-btn @click="deleteDialog(item)" icon x-small color="teal">
              <v-icon size="14px">mdi-delete</v-icon>
            </v-btn>
          </div>
        </div>
        <v-divider></v-divider>
      </div>
    </template>
  </div>
</template>

<script>
import DateRangePicker from "./DateRangePicker.vue";
import db from "./firebaseInit";

export default {
  name: "SalesList",
  components: {
    DateRangePicker,
  },
  data: () => ({
    initDates: [],
    switcher: false,
    progress: false,
    dialog: false,
    dialogMsg: [],
    menu: false,
    mlist: [],
    rlist: [],
    date: new Date().toLocaleDateString("fr-CA").substr(0, 7),
    user: JSON.parse(localStorage.getItem("user")),
  }),
  computed: {
    formatMonth() {
      return this.date
        ? new Intl.DateTimeFormat("en-US", {
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          }).format(new Date(this.date))
        : "";
    },
    list() {
      if (this.switcher) {
        return this.rlist;
      } else {
        return this.mlist;
      }
    },
  },
  created() {
    db.collection("sales")
      .where("user", "==", db.collection("users").doc(this.user.email))
      .where("date", ">=", new Date(this.date))
      .orderBy("date", "desc")
      .get()
      .then((querySnapshot) => {
        this.listData(querySnapshot);
      });
  },
  methods: {
    total(e) {
      let sum = 0;
      e.forEach((i) => {
        sum += i.qty * i.price;
      });
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(sum);
    },
    updateDates(dates) {
      if (dates.length < 1) {
        return;
      }
      if (dates.length == 1) {
        this.initDates = dates;
        this.progress = true;
        db.collection("sales")
          .where("user", "==", db.collection("users").doc(this.user.email))
          .where("date", "==", new Date(dates[0]))
          .get()
          .then((querySnapshot) => {
            this.listData(querySnapshot);
          });
        // db.collection("transactions")
        //   .where("user", "==", db.collection("users").doc(this.user.email))
        //   .where("date", "==", new Date(dates[0]))
        //   .get()
        //   .then(querySnapshot => {
        //     this.aggregate(querySnapshot, this.totalDateRange);
        //   });
      } else {
        this.initDates = dates;
        this.progress = true;
        db.collection("sales")
          .where("user", "==", db.collection("users").doc(this.user.email))
          .where("date", ">=", new Date(dates[0]))
          .where("date", "<=", new Date(dates[1]))
          .orderBy("date", "desc")
          .get()
          .then((querySnapshot) => {
            this.listData(querySnapshot);
          });
      }
    },
    updateList() {
      this.progress = true;
      this.mlist = [];
      let maxMonth = new Date(this.date);
      maxMonth.setMonth(maxMonth.getMonth() + 1);
      db.collection("sales")
        .where("user", "==", db.collection("users").doc(this.user.email))
        .where("date", ">=", new Date(this.date))
        .where("date", "<", maxMonth)
        .orderBy("date", "desc")
        .get()
        .then((querySnapshot) => {
          this.listData(querySnapshot);
        });
    },
    listData(querySnapshot) {
      let list = [];
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          list.push({
            id: doc.id,
            customer: data.customer || null,
            date: data.date.toDate(),
            discount: data.discount || null,
            items: data.items,
            user: data.user,
          });
        });
      } else {
        return
      }
      this.progress = false;
      this.switcher ? (this.rlist = list) : (this.mlist = list);
    },
    deleteDialog(item) {
      this.dialog = true;
      this.dialogMsg = item;
    },
    deleteSale(id) {
      db.collection("sales")
        .doc(id)
        .delete()
        .then(() => {
          this.mlist = this.mlist.filter(el => el.id !== id)
          this.rlist = this.rlist.filter(el => el.id !== id)
          this.dialog = false
        })
        .catch(error => console.log("Error removing document: ", error));
    }
  },
};
</script>

<style scoped>
ul.switchers {
  height: 36px;
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

.list {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
}
.list-total {
  display: flex;
  align-items: center;
}

.list-total p {
  margin: 0;
  padding-right: 5px;
}

.list-item {
  text-align: left;
  padding-right: 10px;
}

.list-item p {
  margin: 0;
}

.list-item span {
  color: rgba(0, 0, 0, 0.6);
}

i.v-icon.v-icon {
  vertical-align: baseline;
}
</style>