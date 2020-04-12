<template>
  <div>
    <div id="chart_div">Test</div>
    <List v-if="delivered" :transactions="transactions" />
  </div>
</template>

<script>
import List from "./List.vue";
import db from "./firebaseInit";

export default {
  name: "Dashboard",
  components: {
    List
  },
  data: () => ({
    delivered: false,
    transactions: {},
    user: JSON.parse(localStorage.getItem("user")).email
  }),
  created() {
    db.collection("transactions")
      .where("user", "==", db.collection("users").doc("mearatjames@gmail.com"))
      .where("date", ">=", new Date(this.dateQuery(30)))
      .orderBy('date', 'desc')
      .get()
      .then(querySnapshot => {
       querySnapshot.forEach(doc => {
          let data = doc.data()
          let groupDate = data.date.toDate().toLocaleDateString()
          let transaction = {
            price: data.price,
            tips: data.tips,
            service: data.service
          }
          if (groupDate in this.transactions) {
            this.transactions[groupDate].unshift(transaction)
          } else {
            this.transactions[groupDate] = new Array(transaction)
          }
        });
        this.delivered = true
      });
  },
  methods: {
    dateQuery(days) {
      let today = new Date();
      return new Date().setDate(today.getDate()-days)
    }
  }
};
</script>

<style>
</style>