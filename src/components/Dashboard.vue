<template>
  <div>
    <div id="chart_div">Test</div>
    <List :transactions="transactions" />
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
    transactions: [],
    user: JSON.parse(localStorage.getItem("user")).email
  }),
  created() {
    db.collection("transactions")
      .where("user", "==", db.collection("users").doc("mearatjames@gmail.com"))
      .where("date", ">=", new Date(this.dateQuery(1)))
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let data = doc.data()
          let transaction = {
            date: data.date.toDate(),
            price: data.price,
            tips: data.tips,
            service: data.service
          }
          this.transactions.push(transaction)
        });
      })
      .then(err => console.log(err));
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