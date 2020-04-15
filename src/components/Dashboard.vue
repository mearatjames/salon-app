<template>
  <div >
    <div class="snapshot">

    <DoughnutChart>

    </DoughnutChart>
    <div class="total-snapshot">

    <p >Total: $600</p>
    </div>
    </div>
    <v-sheet color="grey lighten-3">
   <v-subheader >MONTHLY SNAPSHOT</v-subheader>
    <v-sheet >
      <v-list-item
        v-for="item in items2"
        :key="item.title"
      >
        <v-list-item-avatar>
          <v-icon
            :class="[item.iconClass]"
            v-text="item.icon"
          ></v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <v-btn icon>
            <v-icon color="grey lighten-1">mdi-information</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
     </v-sheet>
     <v-subheader>WEEKLY TRENDS</v-subheader>
     <BarChart></BarChart>
     </v-sheet>
  </div>
</template>

<script>
// import db from "./firebaseInit";
import BarChart from './BarChart'
import DoughnutChart from './DoughnutChart'

export default {
  name: "Dashboard",
  components: {
    BarChart,
    DoughnutChart
  },
  data: () => ({
    delivered: false,
    transactions: {},
    user: JSON.parse(localStorage.getItem("user")),
    items2: [
        { icon: 'assignment', iconClass: 'blue white--text', title: '$400', subtitle: 'Tips' },
        { icon: 'call_to_action', iconClass: 'amber white--text', title: '20 Customers', subtitle: 'Count' },
        { icon: 'call_to_action', iconClass: 'amber white--text', title: '$4,500', subtitle: 'Gross Revenue' },
        { icon: 'call_to_action', iconClass: 'amber white--text', title: '$3,000', subtitle: 'Income After Split' },
      ],
  }),
  created() {
    // db.collection("transactions")
    //   .where("user", "==", db.collection("users").doc(this.user))
    //   .where("date", ">=", new Date(this.dateQuery(30)))
    //   .orderBy('date', 'desc')
    //   .get()
    //   .then(querySnapshot => {
    //    querySnapshot.forEach(doc => {
    //       let data = doc.data()
    //       let groupDate = data.date.toDate().toLocaleDateString()
    //       let transaction = {
    //         id: doc.id,
    //         date: data.date.toDate(),
    //         price: data.price,
    //         tips: data.tips,
    //         service: data.service
    //       }
    //       if (groupDate in this.transactions) {
    //         this.transactions[groupDate].unshift(transaction)
    //       } else {
    //         this.transactions[groupDate] = new Array(transaction)
    //       }
    //     });
    //     this.delivered = true
      // });
  },
  methods: {
    dateQuery(days) {
      let today = new Date();
      return new Date().setDate(today.getDate()-days)
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