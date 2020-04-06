<template>
  <div class="container">
	<span class="md-headline">Transaction</span>
	<md-datepicker v-model="selectedDate" md-immediately>
      <label>Select date</label>
    </md-datepicker>
	<div>
    <Chip v-for="service in services" v-bind:key="service" :service="service" v-on:selectService="addService" v-on:deselectService="removeService" />
	</div>
	<md-field>
    <label>Price</label>
	<span class="md-prefix">$</span>
    <md-input v-model="price" type="number">{{price}}</md-input>
    </md-field>
	<md-field>
    <label>Tips</label>
	<span class="md-prefix">$</span>
    <md-input v-model="tips" type="number">{{tips}}</md-input>
    </md-field>
	<div>
    <md-dialog-confirm
      :md-active.sync="active"
      md-title="Is this correct?"	
	:md-content="dialogContent"
      md-confirm-text="Ok"
      md-cancel-text="Cancel"
      @md-cancel="onCancel"
      @md-confirm="onConfirm">
	</md-dialog-confirm>
    <md-button class="md-primary md-raised" @click="active = true">Add</md-button>
  </div>
  </div>
</template>

<script>

import Chip from './Chip.vue'

export default {
  name: 'Chips',
  components: {
    Chip
  },
  data() {
	return {
		services: ['Manicure', 'Pedicure', 'Gel', 'Fill', 'Design'],
		selectedServices: [],
		price: null,
		tips: null,
		selectedDate: new Date(),
		active: false,
		value: null,
	}
  },
  computed: {
		dialogContent: function () {
			return `<strong>Date:</strong> ${this.selectedDate.toDateString()} <br /> <strong>Service:</strong> ${this.selectedServices.join(', ')} <br /> <strong>Price:</strong> $${this.price} <br /> <strong>Tips:</strong> $${this.tips} <br />`
		}
  },
  methods: {
	addService(service) {
		this.selectedServices.push(service)
	},
	removeService(service) {
	this.selectedServices = this.selectedServices.filter(el => el !== service )
	},
	onConfirm () {
		// Do something
		this.value = 'Agreed'
	},
	onCancel () {
		// Do nothing
		this.value = 'Disagreed'
	}
  }
}
</script>

<style scoped>
	.container {
		width: 85%;
		display: flex;
		flex-direction: column;
		margin: 0 auto;
	}

	.md-button {
		border-radius: 40px;
	}
</style>