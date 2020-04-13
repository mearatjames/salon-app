<template>
  <Transaction :modify="modify"></Transaction>
</template>

<script>
import Transaction from './Transaction.vue'
export default {
	name: 'Add',
	components: {
		Transaction
	},
	data() {
		return {
			modify: false,
		}
	}
}
</script>

<style>

</style>