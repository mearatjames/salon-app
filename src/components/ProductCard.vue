<template>
  <v-card>
    <v-img
      :src="card.src"
      class="white--text align-end"
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
      height="200px"
    >
      <v-card-title v-text="card.title"></v-card-title>
      <v-card-subtitle class="white--text" v-text="`$${card.price}`"></v-card-subtitle>
    </v-img>
    <div class="text-center button-container">
      <v-btn class="minus" @click="subtract" rounded medium color="red lighten-5" dark>
        <v-icon color="red darken-2">mdi-minus</v-icon>
      </v-btn>
      <v-avatar class="qty elevation-2" color="#1F7087" size="62">
        <span class="white--text headline">{{counter}}</span>
      </v-avatar>
      <v-btn class="plus" @click="add" rounded medium color="teal lighten-5" dark>
        <v-icon color="teal darken-2">mdi-plus</v-icon>
      </v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "ProductCard",
  props: {
    card: Object
  },
  data: () => ({
	counter: 0
  }),
  methods: {
	add() {
		this.counter++
	},
	subtract() {
		this.counter > 0 ? this.counter-- : null
	}
  }
};
</script>

<style>
.button-container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 10px 0;
}

.qty {
  z-index: 2;
}

.minus {
  width: 90px;
  justify-content: left;
  margin-right: -40px;
  z-index: 1;
  margin-bottom: 5px;
}

.plus {
  width: 90px;
  justify-content: flex-end;
  margin-left: -40px;
  z-index: 1;
  margin-bottom: 5px;
}
</style>