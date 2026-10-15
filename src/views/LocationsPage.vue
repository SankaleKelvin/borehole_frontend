<template>
  <v-main>
    <v-sheet border rounded>
      <v-data-table
        :headers="headers"
        :hide-default-footer="locations.length < 11"
        :items="locations"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>
              <v-icon
                color="medium-emphasis"
                icon="mdi-location-multiple"
                size="x-small"
                start
              ></v-icon>

              Locations
            </v-toolbar-title>

            <v-btn
              class="me-2"
              prepend-icon="mdi-plus"
              rounded="lg"
              text="Add a Location"
              border
              @click="add"
            ></v-btn>
          </v-toolbar>
        </template>

        <template v-slot:item.title="{ value }">
          <v-chip :text="value" border="thin opacity-25" prepend-icon="mdi-location" label>
            <template v-slot:prepend>
              <v-icon color="medium-emphasis"></v-icon>
            </template>
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex ga-2 justify-end">
            <v-icon
              color="medium-emphasis"
              icon="mdi-pencil"
              size="small"
              @click="edit(item.id)"
            ></v-icon>

            <v-icon
              color="medium-emphasis"
              icon="mdi-delete"
              size="small"
              @click="remove(item.id)"
            ></v-icon>
          </div>
        </template>

        <template v-slot:no-data>
          <v-btn
            prepend-icon="mdi-backup-restore"
            rounded="lg"
            text="Reset data"
            variant="text"
            border
            @click="reset"
          ></v-btn>
        </template>
      </v-data-table>
    </v-sheet>

    <v-dialog v-model="dialog" max-width="500">
      <v-card
        :subtitle="`${isEditing ? 'Update' : 'Create'} your favorite location`"
        :title="`${isEditing ? 'Edit' : 'Add'} a Location`"
      >
        <template v-slot:text>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="formModel.name" label="Name"></v-text-field>
            </v-col>

            <v-col cols="12" md="12">
              <v-textarea v-model="formModel.description" label="Description"></v-textarea>
            </v-col>
          </v-row>
        </template>

        <v-divider></v-divider>

        <v-card-actions class="bg-surface-light">
          <v-btn text="Cancel" variant="plain" @click="dialog = false"></v-btn>

          <v-spacer></v-spacer>

          <v-btn text="Save" @click="save"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>
<script setup>
import { onMounted, ref, shallowRef, toRef } from 'vue'
import axios from 'axios'

const currentYear = new Date().getFullYear()

function createNewRecord() {
  return {
    name: '',
    description: '',
  }
}

const locations = ref([])
const formModel = ref(createNewRecord())
const dialog = shallowRef(false)
const isEditing = toRef(() => !!formModel.value.id)

const headers = [
  { title: 'ID', key: 'id', align: 'start' },
  { title: 'Name', key: 'name' },
  { title: 'Description', key: 'description' },
  { title: 'Actions', key: 'actions', align: 'end', sortable: false },
]

onMounted(() => {
  reset()
})

function add() {
  formModel.value = createNewRecord()
  dialog.value = true
}

function edit(id) {
  const found = locations.value.find((location) => location.id === id)

  formModel.value = {
    id: found.id,
    name: found.name,
    description: found.description,
  }

  dialog.value = true
}

async function remove(id) {
  const response = axios.delete(`http://127.0.0.1:8000/api/delete_location/${id}`)
  reset()
}

async function save() {
  if (isEditing.value) {
    const response = await axios.post(`http://127.0.0.1:8000/api/update_location/${formModel.value.id}`, {
      name: formModel.value.name,
      description: formModel.value.description,
    })
    reset()
  } else {
    const response = await axios.post('http://127.0.0.1:8000/api/save_location', {
      name: formModel.value.name,
      description: formModel.value.description,
    })
    reset()
  }

  dialog.value = false
}

function reset() {
  dialog.value = false
  formModel.value = createNewRecord()
  getLocations()
}

async function getLocations() {
  const response = await axios.get('http://127.0.0.1:8000/api/get_locations')
  locations.value = response.data.locations
}
</script>
