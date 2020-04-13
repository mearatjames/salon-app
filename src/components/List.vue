<template>
  <div>
    <Transaction v-if="active" :transaction="tData" :modify="modify"></Transaction>
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
            <v-list-item-content>
              <v-list-item-title>{{Object.keys(transaction.service).join(', ')}}</v-list-item-title>
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
            <v-chip class="ma-2" color="success" outlined>Total: $240 | Tips: $40</v-chip>
            </div>
         
      </template>
    </v-list>

    <v-divider></v-divider>
  </div>
</template>

<script>
import Transaction from "./Transaction.vue";

export default {
  name: "List",
  props: {
    transactions: Object
  },
  components: {
    Transaction
  },
  data: () => ({
    settings: [],
    active: false,
    tData: null,
    modify: true
  }),
  methods: {
    edit: function(transaction) {
      console.log(transaction);
      this.tData = transaction;
      this.active = true;
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