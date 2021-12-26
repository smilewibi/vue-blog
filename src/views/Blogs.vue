<template>
  <v-container class="ma-0 pa-0" grid-list-sm>
    <!-- Form Dialog -->
    <template>
      <v-row class="d-flex justify-space-between mt-3">
        <v-subheader> All Blogs </v-subheader>
        <v-dialog
          v-model="dialog"
          persistent
          max-width="600px"
          v-if="!guest"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mr-3"
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
            >
              Add new blog <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <v-card>
            <form @submit.prevent="submitForm()">
              <v-card-title>
                <span class="text-h5">New blog</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Title"
                        name="title"
                        :rules="rules"
                        ref="title"
                        v-model="title"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        outlined
                        name="description"
                        :rules="rules"
                        ref="description"
                        v-model="description"
                        label="Description"
                        required
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="red darken-1"
                  text
                  @click="dialog = false"
                >
                  Close
                </v-btn>
                <v-btn color="blue darken-1" text type="submit">
                  Save
                </v-btn>
              </v-card-actions>
            </form>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <!-- End Form Dialog -->

    <v-layout wrap class="mt-5">
      <blog-item-component
        v-for="blog in blogs"
        :key="`blog-${blog.id}`"
        :blog="blog"
      ></blog-item-component>
    </v-layout>
    <v-pagination
      class="mt-5"
      v-model="page"
      @input="go"
      :length="lengthPage"
      :total-visible="perPage"
    ></v-pagination>
  </v-container>
</template>

<script>
import axios from 'axios';
import BlogItemComponent from '../components/BlogItemComponent.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  data: () => ({
    apiDomain: 'http://demo-api-vue.sanbercloud.com',
    blogs: [],
    page: 0,
    lengthPage: 0,
    perPage: 0,
    dialog: false,
    title: '',
    description: '',
    rules: [(v) => !!v || 'Data is required'],
  }),
  components: {
    'blog-item-component': BlogItemComponent,
  },
  computed: {
    ...mapGetters({
      guest: 'auth/guest',
      user: 'auth/user',
      token: 'auth/token',
    }),
  },
  methods: {
    ...mapActions({
      setAlert: 'alert/set',
    }),
    //Get Data
    go() {
      const config = {
        method: 'get',
        url: this.apiDomain + '/api/v2/blog?page=' + this.page,
      };

      axios(config)
        .then((response) => {
          let { blogs } = response.data;
          this.blogs = blogs.data;
          this.page = blogs.current_page;
          this.lengthPage = blogs.last_page;
          this.perPage = blogs.perPage;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //Celar form data
    clearForm: function () {
      (this.title = ''),
        (this.description = ''),
        (this.dialog = false);
    },
    // submit form data
    submitForm: function () {
      let formData = new FormData();
      formData.append('title', this.title);
      formData.append('description', this.description);

      const config = {
        method: 'post',
        url: 'http://demo-api-vue.sanbercloud.com/api/v2/blog',
        headers: {
          Authorization: 'Bearer' + this.token,
        },
        data: formData,
      };

      axios(config)
        .then((response) => {
          this.clearForm();
          this.go();
          this.setAlert({
            status: true,
            color: 'success',
            text: 'Add data ' + response.data.message,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    this.go();
  },
};
</script>
