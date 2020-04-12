<template>
  <div>
    <div id="chart_div">Test</div>
    <List />
  </div>
</template>

<script>
import List from './List.vue'
// import db from "./firebaseInit";

export default {
  name: "Dashboard",
  components: {
    List,
  },
  data: () => ({
    transactions: [],
    user: JSON.parse(localStorage.getItem("user")).email
  }),
  // created() {
  //   db.collection("transactions")
  //     .where("user", "==", db.collection("users").doc("mearatjames@gmail.com"))
  //     .get()
  //     .then(querySnapshot => {
  //       querySnapshot.forEach(doc => {
  //         console.log(doc.id, " => ", doc.data());
  //       });
  //     })
  //     .then(err => console.log(err));
  // }
};
</script>

<style>
</style>