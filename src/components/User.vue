<template>
  <v-container>
    <v-row dense>
      <v-col cols="12">
        <v-card color="#385F73" dark>
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="headline">AiAi's Profile</v-card-title>

              <v-card-subtitle>Listen to your favorite artists and albums whenever and wherever, online and offline.</v-card-subtitle>

              <v-card-actions>
                <v-btn text>Update Profile Pic</v-btn>
              </v-card-actions>
            </div>
            <v-avatar class="ma-3" size="125">
              <v-img :src="cropped || ''"></v-img>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12">
        <v-card color="#385F73" dark>
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <input type="file" @change="croppie" />
              <vue-croppie
                customClass="styleCrop"
                :enableResize="false"
                ref="croppieRef"
                :boundary="{ width: 350, height: 350}"
                :viewport="{ width:200, height:200, type:'circle' }"
              ></vue-croppie>
            </div>
            <v-card-actions>
              <v-btn @click="crop()" text>Crop</v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import "firebase/storage";

let storageRef = firebase.storage().ref();

export default {
  name: "User",
  data() {
    return {
      croppieImage: "",
      cropped: null,
      user: JSON.parse(localStorage.getItem("user"))
    };
  },
  created() {
    storageRef
      .child(this.user.uid + "/thumbnail.jpeg")
      .getDownloadURL()
      .then(url => {
        this.cropped = url;
      })
      .catch(error => {
        this.cropped = "";
        console.log(error);
      });
  },
  methods: {
    croppie(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;

      var reader = new FileReader();
      reader.onload = e => {
        this.$refs.croppieRef.bind({
          url: e.target.result
        });
      };

      reader.readAsDataURL(files[0]);
    },
    crop() {
      let uploadRef = storageRef.child(this.user.uid + "/thumbnail.jpeg");
      let options = {
        type: "blob",
        size: { width: 400, height: 400 },
        format: "jpeg"
      };
      this.$refs.croppieRef.result(options, output => {
        uploadRef.put(output).then((snapshopt) => {
          snapshopt.ref.getDownloadURL().then(url => {
			this.cropped = url;
			this.$emit('updateThumbnail', this.cropped)
          });
          //   location.reload();
        });
      });
    }
  }
};
</script>

<style>
</style>