<template>
  <div>
    <v-form>
      <v-card class="transaction-card">
      <v-menu
            ref="datePicker"
            v-model="datePicker"
            :close-on-content-click="true"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="dateFormatted"
                label="Date"
                persistent-hint
                prepend-icon="event"
                @blur="date = parseDate(dateFormatted)"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" no-title @input="datePicker = false"></v-date-picker>
          </v-menu>
        <div class="text-center">
      <Chip
        v-for="service in services" v-bind:key="service" :service="service" v-on:selectService="addService" v-on:deselectService="removeService"
      ></Chip>
    </div>
    <v-text-field
      v-model="price"
      prepend-icon="mdi-cash-100"
      label="Price"
      placeholder=" "
      required
      prefix="$"
      type='number'
    >{{price}}</v-text-field>
    <v-text-field
      v-model="tips"
      prepend-icon="mdi-hand-heart"
      label="Tips"
      placeholder=" "
      prefix="$"
      required
      type='number'
    >{{tips}}</v-text-field>
      </v-card>
    </v-form>
    <v-row justify="center">
    <v-dialog v-model="dialog" max-width="350">
      <template v-slot:activator="{ on }">
        <v-btn color="yellow darken-4" dark v-on="on">Add Transaction</v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">Is this correct?</v-card-title>
        <v-card-text>
          <strong>Date:</strong>  {{dialogContent.date}} <br>
          <strong>Service:</strong>  {{dialogContent.service}} <br>
          <strong>Price:</strong> ${{dialogContent.price}} <br>
          <strong>Tips:</strong> ${{dialogContent.tips}}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-4" text @click="dialog = false">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="dialog = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
  </div>
</template>

<script>
import Chip from './Chip.vue'

export default {
  name: 'Transaction',
  components: {
    Chip
  },
  data: vm => ({
    dialog: false,
    datePicker: false,
		services: ['Manicure', 'Pedicure', 'Gel', 'Fill', 'Design'],
		selectedServices: [],
		price: null,
		tips: null,
    date: new Date().toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
		active: false,
		value: null,
  }),
  computed: {
		dialogContent: function () {
			return {
        date: this.dateFormatted,
        price: this.price,
        tips: this.tips,
        service: this.selectedServices.join(', ')
      }
		}
  },
  watch: {
      date () {
        this.dateFormatted = this.formatDate(this.date)
      },
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
  },
  formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
  },
      parseDate (date) {
        if (!date) return null

        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
  }

}
</script>

<style scoped>

 .transaction-card {
   width: 90%;
   margin: 40px auto;
   padding: 60px 20px;
 }

</style>