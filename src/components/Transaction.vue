<template>
<div>
  <div class="text-center">
    <ul class="switchers">
      <li>
        <v-btn
          :disabled="progress"
          :ripple="false"
          class="z-index"
          @click="switcher = false"
          text
          rounded
          width="140px"
          :color="switcher ? 'teal' : 'white'"
          dark
          >Services</v-btn
        >
      </li>
      <li>
        <v-btn
          :disabled="progress"
          :ripple="false"
          class="z-index"
          @click="switcher = true"
          text
          rounded
          width="140px"
          :color="switcher ? 'white' : 'teal'"
          dark
          >Expenses</v-btn
        >
      </li>
      <div class="animate" v-bind:class="{ 'animate-right': switcher }"></div>
    </ul>
  </div>
  <template v-if="switcher">
    <expense-transaction />
  </template>
  <template v-else>
    <service-transaction />
  </template>
</div>
</template>

<script>
import ServiceTransaction from './ServiceTransaction.vue'
import ExpenseTransaction from './ExpenseTransaction.vue'

export default {
  components: {
    ServiceTransaction,
    ExpenseTransaction,
  },
  data: () => ({
    switcher: false,
    progress: false,
    user: JSON.parse(localStorage.getItem('user')),
  }),
}
</script>

<style scoped>
ul.switchers {
  height: 36px;
  margin-top: 15px;
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