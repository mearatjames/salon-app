<template>
    <v-chip
		@click="select"
		class="ma-2"
		color="yellow darken-4"
		active-class="selectedChip"
		outlined
    >
	{{service}}
    </v-chip>
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

<style>
	.selectedChip {
		background-color: orange;
	}
</style>