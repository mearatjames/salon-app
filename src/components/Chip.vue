<template>
    <md-chip v-bind:class="[{ 'md-accent': selected }, '']" @click="select" md-clickable>{{service}}</md-chip>
</template>

<script>


export default {
  name: 'Chip',
  props: {
    service: String
  },
  data() {
	return {
		selected : false
	}
  },
  methods: {
		select() {
			if (this.selected === false) {
				this.$emit('selectService', this.service)
				this.selected = true
			} else {
				this.$emit('deselectService', this.service)
				this.selected = false
			}
		}
  }
}
</script>

<style scoped>
	.md-chip {
	height: 40px;
    border-radius: 40px;
    font-size: 16px;
	line-height: 40px;
	margin-top: 10px;
}

</style>