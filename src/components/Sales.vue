<template>
    <v-container class="container" fluid>
      <v-row>
        <v-col cols="12">
          <v-card
            color="#1F7087"
            dark
          >
            <v-card-title class="headline">Unlimited music now</v-card-title>

            <v-card-subtitle>Listen to your favorite artists and albums whenever and wherever, online and offline.</v-card-subtitle>

            <v-card-actions>
              <v-btn text>Listen Now</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col lg="6" md="6" sm="6" xs="12" v-for="card in cards" :key="card.title">
          <v-card>
            <v-img
              :src="card.src"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="200px"
            >
              <v-card-title v-text="card.title"></v-card-title>
            </v-img>
            <div class="text-center button-container">
              <v-btn class="minus" rounded medium color="red lighten-5" dark>
                <v-icon color="red darken-2">mdi-minus</v-icon>
              </v-btn>
              <v-avatar class="qty elevation-2" color="#1F7087" size="62">
                <span class="white--text headline">0</span>
              </v-avatar>
              <v-btn class="plus" rounded medium color="teal lighten-5" dark>
                <v-icon color="teal darken-2">mdi-plus</v-icon>
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
	<v-card-text style="height: 100px; position: relative">
            <v-btn
              fixed
              dark
              fab
              right
              color="pink"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-card-text>
    </v-container>
</template>

<script>
export default {
  data: () => ({
    cards: [
      {
        title: "Nails Kit",
        src: "https://cdn.vuetifyjs.com/images/cards/house.jpg"
      }
    ]
  })
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