<template>
  <v-card :loading="loading" class="mx-auto my-2" width="320">
    <v-form v-model="valid">
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
            :boundary="{ width: 320, height: 320 }"
            :viewport="{ width: 300, height: 300 }"
          ></vue-croppie>
        </div>
        <v-card-actions>
          <v-btn class="px-4" color="warning" @click="update = false" rounded>Cancel</v-btn>
          <v-btn class="px-4" dark color="teal" @click="crop()" rounded>Update</v-btn>
        </v-card-actions>
      </div>
      <template v-else>
        <v-img class="align-end text-right" height="320" :src="currentProduct.image">
          <v-btn small class="ma-1" dark @click="update = true" rounded>
            <v-icon class="pr-1">mdi-camera</v-icon>Edit
          </v-btn>
        </v-img>

        <v-card-title>
          <v-row dense>
            <v-col cols="12" sm="12" md="12">
              <v-text-field
                color="teal"
                label="Product Name"
                v-model="currentProduct.name"
                dense
                :rules="nameRules"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-text-field
                color="teal"
                dense
                label="Price"
                type="number"
                v-model="currentProduct.price"
                inputmode="decimal"
                prefix="$"
                min="0"
                :rules="priceRules"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6" lg="6" sm="12" md="12">
              <v-switch
                color="teal"
                class="mt-1"
                inset
                dense
                v-model="currentProduct.active"
                :label="currentProduct.active ? 'Active' : 'Inactive'"
              ></v-switch>
            </v-col>
            <v-col v-if="!isNew" cols="6" lg="6" sm="12" md="12">
              <v-btn small color="error" @click="dialog = true" rounded>Delete</v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <v-divider class="mx-4"></v-divider>

        <v-card-actions class="justify-center">
          <v-btn color="warning" @click="$emit('cancel')" rounded>Cancel</v-btn>
          <v-btn
            class="white--text"
            :disabled="!updateValidate"
            color="teal"
            @click="add"
            rounded
          >{{ isNew ? 'Add' : 'Update' }}</v-btn>
        </v-card-actions>
      </template>
    </v-form>
    <v-dialog v-model="dialog" persistent max-width="320">
      <v-card>
        <v-card-title class="headline">Delete Confirmation</v-card-title>
        <v-card-text>
          <strong>Are you sure you want delete this product?</strong>
          <br />This will permanently delete the item.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warning" text @click="dialog = false">Cancel</v-btn>
          <v-btn color="red" text @click="del">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="processing" persistent width="300">
      <v-card color="teal" dark>
        <v-card-text>
          Processing
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/storage'
import db from './firebaseInit'

let storageRef = firebase.storage().ref()

export default {
  props: {
    product: Object,
    isNew: Boolean,
  },
  data: function () {
    return {
      currentProduct: Object.assign({}, this.product),
      loading: false,
      update: false,
      croppieImage: '',
      cropped: null,
      valid: false,
      imageUpdated: false,
      processing: false,
      dialog: false,
      user: JSON.parse(localStorage.getItem('user')),
      nameRules: [(v) => !!v || 'Name is required'],
      priceRules: [(v) => !!v || 'Price is required'],
    }
  },
  computed: {
    updateValidate() {
      if (!this.isNew) {
        if (
          this.product.name == this.currentProduct.name &&
          this.product.price == this.currentProduct.price &&
          this.product.active == this.currentProduct.active &&
          !this.imageUpdated
        ) {
          return false
        } else {
          return this.valid
        }
      } else {
        return this.valid
      }
    },
  },
  methods: {
    croppie(e) {
      if (!e) return
      var reader = new FileReader()
      reader.readAsDataURL(e)
      reader.onload = () => {
        this.$refs.croppieRef.bind({
          url: reader.result,
        })
      }
    },
    crop() {
      this.update = false
      let options = {
        type: 'base64',
        size: { width: 600, height: 600 },
        quality: 0.7,
        format: 'jpeg',
      }
      this.$refs.croppieRef.result(options, (output) => {
        this.currentProduct.image = output
        this.imageUpdated = true
      })
    },
    add() {
      this.processing = true
      if (this.isNew) {
        let data = this.currentProduct

        db.collection('products')
          .add({
            active: data.active,
            name: data.name,
            price: data.price,
            users: [db.collection('users').doc(this.user.email)],
          })
          .then((doc) => {
            let uploadRef = storageRef.child(`products/${doc.id}/card.jpg`)
            if (this.imageUpdated) {
              uploadRef
                .putString(this.currentProduct.image, 'data_url')
                .then((snapshot) => {
                  snapshot.ref.getDownloadURL().then((url) => {
                    db.collection('products')
                      .doc(doc.id)
                      .set({ image: url }, { merge: true })
                      .then(() => this.$emit('refresh'))
                      .catch((error) => console.log(error))
                  })
                })
                .catch((error) => console.log(error))
            } else {
              fetch(require('../assets/placeholder.jpg'))
                .then((res) => res.blob())
                .then((imageBlob) => {
                  uploadRef.put(imageBlob).then((snapshot) => {
                    snapshot.ref.getDownloadURL().then((url) => {
                      db.collection('products')
                        .doc(doc.id)
                        .set({ image: url }, { merge: true })
                        .then(() => this.$emit('refresh'))
                    })
                  })
                })
            }
          })
          .catch((error) => {
            console.error('Error adding document: ', error)
          })
      } else {
        this.edit()
      }
    },
    del() {
      this.processing = true
      let imageRef = storageRef.child(
        `products/${this.currentProduct.id}/card.jpg`
      )
      imageRef
        .delete()
        .then(() => {
          db.collection('products')
            .doc(this.currentProduct.id)
            .delete()
            .then(() => {
              this.dialog = false
              this.$emit('refresh')
            })
            .catch((error) => console.log('Error removing document: ', error))
        })
        .catch((error) => {
          console.log('Error deleting the image', error)
        })
    },
    edit() {
      let data = this.currentProduct

      if (this.imageUpdated) {
        let uploadRef = storageRef.child(
          `products/${this.currentProduct.id}/card.jpg`
        )
        uploadRef
          .putString(this.currentProduct.image, 'data_url')
          .then((snapshot) => {
            snapshot.ref.getDownloadURL().then((url) => {
              db.collection('products')
                .doc(this.currentProduct.id)
                .set( {
              active: data.active,
              name: data.name,
              price: data.price,
              image: url
            },
            { merge: true })
                .then(() => this.$emit('refresh'))
                .catch((error) => console.log(error))
            })
          })
          .catch((error) => console.log(error))
      } else {
        db.collection('products')
                .doc(this.currentProduct.id)
                .set( {
              active: data.active,
              name: data.name,
              price: data.price,
            },
            { merge: true })
                .then(() => this.$emit('refresh'))
                .catch((error) => console.log(error))
      }
    },
  },
}
</script>

<style></style>
