<template>
	<v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="dates"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
		<template v-slot:activator="{ on, attrs }">
          <v-text-field
            class="px-5"
            v-model="dateRangeText"
            prepend-icon="event"
            v-bind="attrs"
            v-on="on"
            readonly
            color="teal"
          ></v-text-field>
        </template>
        <v-date-picker
			v-model="dates"
			range
			color="teal"
			no-title
			scrollable
          :max="new Date().toLocaleDateString('fr-CA')"
        ><v-spacer></v-spacer>
          <v-btn rounded color="warning" @click="menu = false">Cancel</v-btn>
          <v-btn rounded dark color="teal" @click="$refs.menu.save(dates), $emit('updateDates', dates)">OK</v-btn></v-date-picker>

	</v-menu>
</template>

<script>
export default {
	name: 'DateRangePicker',
	props: {
		initDates: {
			type: Array
		}
	},
     data() {
    return {
		dates: this.initDates,
		menu: false,
    };
  },
	mounted() {
	},
    computed: {
      dateRangeText () {
		if (this.dates == undefined || this.dates.length === 0) {
			return null
		} else if (this.dates.length == 1) {
			return new Date(this.dates[0]).toLocaleDateString('en-us', {timeZone: 'UTC'})
		} else {
			if (this.dates[0] === this.dates[1]) {
				return new Date(this.dates[0]).toLocaleDateString('en-us', {timeZone: 'UTC'})
			} else {
				let compareDate = this.dates
			compareDate.sort()
			let startDate = new Date(compareDate[0])
			let endDate = new Date(compareDate[1])
			return startDate.toLocaleDateString('en-us', {timeZone: 'UTC'}) + ' – ' + endDate.toLocaleDateString('en-us', {timeZone: 'UTC'})
			}	
		}
      },
    },
  }
</script>

<style>

</style>