<template>
  <v-card :loading="loading" class="mx-auto my-2" width="320">
    <div v-if="update" class="d-flex flex-column align-center">
      <div>
        <v-file-input
          class="px-4"
          prepend-icon="mdi-camera"
          :clearable="false"
          type="file"
          label="Choose an image"
          @change="croppie"
        ></v-file-input>
        <vue-croppie
          customClass="styleCrop"
          :enableResize="false"
          ref="croppieRef"
          :boundary="{ width: 320, height: 320}"
          :viewport="{ width:300, height:300 }"
        ></vue-croppie>
      </div>
      <v-card-actions>
        <v-btn class="px-4" color="warning" @click="update = false" rounded>Cancel</v-btn>
        <v-btn class="px-4" color="teal" @click="crop()" rounded>Update</v-btn>
      </v-card-actions>
    </div>
	<template v-else>

    <v-img
      class="align-end text-right"
      height="320"
      :src="product.image"
    >
      <v-btn small class="ma-1" dark @click="update = true" rounded>
        <v-icon class="pr-1">mdi-camera</v-icon>Edit
      </v-btn>
    </v-img>

    <v-card-title>
      <v-row dense>
        <v-col cols="12" sm="12" md="12">
          <v-text-field color="teal" label="Product Name" :value="product.name" dense></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="12">
          <v-text-field color="teal" dense label="Price" type="number" :value="product.price" inputmode="decimal" prefix="$" min="0"></v-text-field>
        </v-col>
        <v-col cols="6" lg="6" sm="12" md="12">
          <v-switch
            color="teal"
            class="mt-1"
            inset
            dense
            v-model="active"
            :label="active ? 'Active' : 'Inactive'"
          ></v-switch>
        </v-col>
        <v-col cols="6" lg="6" sm="12" md="12">
          <v-btn small color="error" rounded>Delete</v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider class="mx-4"></v-divider>

    <v-card-actions class="justify-center">
      <v-btn color="warning" @click="$emit('cancel')" rounded>Cancel</v-btn>
      <v-btn color="teal" rounded dark>Add</v-btn>
    </v-card-actions>
	</template>
  </v-card>
</template>

<script>
import firebase from "firebase/app";
import "firebase/storage";

let storageRef = firebase.storage().ref();

export default {
	props: {
		product: Object
	},
  data: () => ({
    loading: false,
    active: true,
    update: false,
    croppieImage: "",
	cropped: null,
  }),
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
  },
};
</script>


<style>
</style>