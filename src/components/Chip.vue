<template>
  <v-chip
    @click="select"
    class="ma-2"
    light
    :color="selected ? 'yellow darken-4' : null"
    :text-color="selected ? 'white' : null"
  >{{service}}</v-chip>
</template>

<script>
export default {
  name: "Chip",
  props: {
    service: String,
    selected: Boolean,
  },
  data() {
    return {
    };
  },
  methods: {
    select() {
      if (this.selected === false) {
        this.$emit("selectService", this.service);
      } else {
        this.$emit("deselectService", this.service);
      }
    },
  }
};
</script>

<style>
.v-application .ma-2 {
  margin: 4px 3px !important;
}
</style>