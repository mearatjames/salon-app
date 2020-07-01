<template>
  <v-container>
    <v-row dense>
      <v-col cols="12">
        <v-card color="cyan darken-3" dark>
          <div v-if="update" class="d-flex flex-column align-center">
            <div>
              <v-file-input
                class="px-4"
                prepend-icon="mdi-camera"
                :clearable="false"
                type="file"
                label="File input"
                @change="croppie"
              ></v-file-input>
              <vue-croppie
                customClass="styleCrop"
                :enableResize="false"
                ref="croppieRef"
                :boundary="{ width: 350, height: 350}"
                :viewport="{ width:200, height:200, type:'circle' }"
              ></vue-croppie>
            </div>
            <v-card-actions>
              <v-btn class="px-4" color="warning" @click="update = false" rounded>Cancel</v-btn>
              <v-btn class="px-4" color="teal" @click="crop()" rounded>Update</v-btn>
            </v-card-actions>
          </div>
          <div v-else>
              <v-card-title class="headline">{{user.name}}'s Profile</v-card-title>
            <div  class="d-flex flex-no-wrap justify-space-between">

              <v-card-actions>
                <v-btn @click="update = true" text><v-icon class="pr-1">mdi-camera</v-icon>Edit</v-btn>
              </v-card-actions>
            <v-avatar class="ma-3" size="125">
              <v-img :src="cropped || ''"></v-img>
            </v-avatar>
            </div>
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
      update: false,
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
      if (!e) return;

      var reader = new FileReader();
      reader.readAsDataURL(e);
      reader.onload = () => {
        this.$refs.croppieRef.bind({
          url: reader.result
        });
      };
    },
    crop() {
		this.update = false
      let uploadRef = storageRef.child(this.user.uid + "/thumbnail.jpeg");
      let options = {
        type: "blob",
        size: { width: 400, height: 400 },
        format: "jpeg"
      };
      this.$refs.croppieRef.result(options, output => {
        uploadRef.put(output).then(snapshopt => {
          snapshopt.ref.getDownloadURL().then(url => {
            this.cropped = url;
            this.$emit("updateThumbnail", this.cropped);
          });
        });
      });
    }
  }
};
</script>

<style>
</style>