<template>
  <div>
    <v-form ref="form">
      <v-card max-width="450" :elevation="4" class="transaction-card">
        <v-img
          v-if="modify"
          class="white--text title-edit align-end"
          height="65px"
        >
          <div class="title-flex">
            <v-card-title>Modify Transaction</v-card-title>
            <v-card-actions>
              <v-btn @click="$emit('back')" icon color="white">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-actions>
          </div>
        </v-img>

        <div class="card-content">
          <div v-if="deleteProgress" class="text-center">
            <v-card class="progress">
              <p>Deleting the transaction</p>
              <v-progress-linear
                color="deep-purple accent-4"
                indeterminate
                rounded
                height="6"
              ></v-progress-linear>
            </v-card>
          </div>
          <template v-else>
            <v-menu
              ref="datePicker"
              color="teal"
              v-model="datePicker"
              :close-on-content-click="true"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  dense
                  v-model="dateFormatted"
                  color="teal"
                  label="Date"
                  persistent-hint
                  prepend-icon="event"
                  inputmode="none"
                  :disabled="modify == true"
                  @blur="date = parseDate(dateFormatted)"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                color="teal"
                v-model="date"
                :reactive="true"
                :max="new Date().toLocaleDateString('fr-CA')"
                no-title
              ></v-date-picker>
            </v-menu>
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  dense
                  v-model="description"
                  prepend-icon="mdi-comment-text-outline"
                  placeholder=" "
                  label="Description"
                  color="teal"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-text-field
              dense
              v-model="amount"
              color="teal"
              prepend-icon="mdi-cash-minus"
              label="Amount"
              placeholder=" "
              prefix="$"
              required
              type="number"
              maxlength="6"
              min="0"
              inputmode="decimal"
              >{{ amount }}</v-text-field
            >
            <v-row dense justify="center">
              <v-btn
                :disabled="validate == false"
                class="add"
                rounded
                color="teal"
                @click="add"
                >{{ this.modify ? 'Update' : 'Add Transaction' }}</v-btn
              >
              <v-btn
                v-if="modify"
                :disabled="validate == false"
                class="add"
                rounded
                color="red darken-4"
                @click="del"
                >Delete</v-btn
              >
              <v-dialog v-model="dialog" max-width="350">
                <div v-if="progress" class="text-center">
                  <v-card class="progress">
                    <p>Processing</p>
                    <v-progress-circular
                      indeterminate
                      :size="70"
                      :width="7"
                      color="teal"
                    ></v-progress-circular>
                  </v-card>
                </div>
                <v-card v-else>
                  <v-card-title class="headline">Is this correct?</v-card-title>
                  <v-card-text>
                    <strong>Date:</strong>
                    {{ dialogContent.date }}
                    <br />
                    <strong>Service:</strong>
                    {{ dialogContent.service }}
                    <br />
                    <strong>Customer:</strong>
                    {{ dialogContent.customer }}
                    <v-chip class="new-violator" v-if="dialogContent.newCust" color="orange" small outlined pill
                      >New</v-chip
                    >
                    <br />
                    <strong>Price:</strong>
                    ${{ dialogContent.price }}
                    <br />
                    <strong>Deposit:</strong>
                    ${{ dialogContent.deposit }}
                    <br />
                    <strong>Tips:</strong>
                    ${{ dialogContent.tips }}
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="warning" text @click="onCancel">Cancel</v-btn>
                    <v-btn color="teal" text @click="onConfirm">Ok</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
          </template>
        </div>
      </v-card>
    </v-form>
    <v-snackbar color="success" top v-model="snackbar" :timeout="3000">
      The transaction has been added!
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>

import db from './firebaseInit'

export default {
  name: 'ExpenseTransaction',
  components: {

  },
  props: {
    transaction: Object,
    modify: Boolean,
  },
  data: (vm) => ({
    snackbar: false,
	dialog: false,
	description: null,
	amount: null,
    datePicker: false,
    date: new Date().toLocaleDateString('fr-CA'),
    dateFormatted: vm.formatDate(new Date().toLocaleDateString('fr-CA')),
    active: false,
    value: null,
    progress: false,
    deleteProgress: false,
    user: JSON.parse(localStorage.getItem('user')).email,
  }),
  computed: {
    dialogContent: function () {
      return {
        date: this.dateFormatted,
      }
    },
    validate: function () {
      if (
        this.description !== null &&
        this.amount > 0
      ) {
        return true
      } else {
        return false
      }
    },
  },
  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date)
    },
  },
  created() {
    if (this.transaction !== undefined && this.transaction !== null) {
      this.amount = this.transaction.amount || null
      this.description = this.transaction.description || null
      this.date = this.transaction.date.toLocaleDateString('fr-CA', {
        timeZone: 'UTC',
      })
    }
  },
  methods: {
    cleanup() {
      this.progress = false
      this.dialog = false
      this.snackbar = true
      this.amount = null
      this.description = null
      this.date = new Date().toLocaleDateString('fr-CA')
      this.dateFormatted = this.formatDate(
        new Date().toLocaleDateString('fr-CA')
      )
    },
    add() {
      this.dialog = true
    },
    del() {
      this.deleteProgress = true
      let deleteItem = {
        id: this.transaction.id,
        date: new Intl.DateTimeFormat('en-US', { timeZone: 'UTC' }).format(
          this.transaction.date
        ),
      }
      db.collection('expenses')
        .doc(this.transaction.id)
        .delete()
        .then(() => {
          this.$emit('deleted', deleteItem)
        })
        .catch((error) => console.log('Error removing document: ', error))
    },
    onConfirm() {
      this.progress = true
      let data = {
        date: new Date(this.date),
        description: this.description,
        amount: parseFloat(this.amount) || 0,
        user: db.doc(`/users/${this.user}`),
      }
      if (this.modify) {
        db.collection('expenses')
          .doc(this.transaction.id)
          .set(data)
          .then(() => {
            this.cleanup()
            this.$emit('updated', { data: data, id: this.transaction.id })
          })
          .catch((error) => {
            this.progress = false
            this.dialog = false
            console.error('Error updating document: ', error)
          })
      } else {
        db.collection('expenses')
          .add(data)
          .then(() => {
            this.cleanup()
          })
          .catch((error) => {
            this.progress = false
            this.dialog = false
            console.error('Error adding document: ', error)
          })
      }
    },
    onCancel() {
      // Do nothing
      this.dialog = false
    },
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    parseDate(date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
  },
}
</script>

<style scoped>
.card-content {
  padding: 20px;
}
.title-edit {
  background-color: #1f7087;
}
.title-add {
  background-color: rgb(16, 172, 131);
}
.transaction-card {
  width: 90%;
  margin: 15px auto;
}

@media only screen and (max-width: 735px) {
  .transaction-card {
    width: 100%;
  }
}

.add {
  margin: 10px 10px 0px 10px;
  color: white;
}

.progress {
  padding: 40px 10px;
}

.title-flex {
  display: flex;
  justify-content: space-between;
}
</style>