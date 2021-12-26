<template>
  <div>
    <div class="text-left">
      <v-btn small text to="/" class="blue--text">
        <v-icon>mdi-chevron-left</v-icon> Back
      </v-btn>
    </div>
    <v-card v-if="blog.id" class="mt-3">
      <v-img
        :src="
          blog.photo
            ? apiDomain + blog.photo
            : 'https://picsum.photos/200/300'
        "
        class="white--text"
        height="200px"
      >
        <v-card-title
          class="fill-height align-end"
          v-text="blog.title"
        ></v-card-title>
      </v-img>

      <v-card-text>
        <v-simple-table dense>
          <tbody>
            <tr>
              <td><v-icon>mdi-format-title</v-icon>Judul</td>
              <td class="blue--text">{{ blog.title }}</td>
            </tr>
            <tr>
              <td><v-icon>mdi-note</v-icon>Deskripsi</td>
              <td>{{ blog.description }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>

      <v-card-actions
        ><v-dialog v-model="dialog" persistent max-width="600px">
          <template v-if="!guest" v-slot:activator="{ on, attrs }">
            <v-btn
              dark
              v-bind="attrs"
              v-on="on"
              color="blue lighten-3"
              @click="editData(blog)"
            >
              Edit
            </v-btn>
            <v-btn
              v-bind="attrs"
              v-on="on"
              color="blue-grey"
              class="ma-2 white--text"
              @click="uploadPhoto(blog)"
            >
              Upload
              <v-icon right dark> mdi-cloud-upload </v-icon>
            </v-btn>
          </template>
          <v-card>
            <form @submit.prevent="submitForm()">
              <v-card-title>
                <span class="text-h5">Edit blog</span>
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
                        :disabled="form == 'upload'"
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
                        :disabled="form == 'upload'"
                        required
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12">
                      <input
                        v-if="form == 'upload'"
                        label="File input"
                        type="file"
                        name="photo"
                        ref="photo"
                      />
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
                <v-btn
                  v-if="form == 'upload'"
                  color="blue darken-1"
                  text
                  @click="submitPhoto(idUpload)"
                >
                  Upload
                </v-btn>
                <v-btn
                  v-else
                  color="blue darken-1"
                  text
                  @click="updateData(idUpdate)"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </form>
          </v-card>
        </v-dialog>

        <v-btn
          v-if="!guest"
          class="ma-2"
          color="error"
          @click="removeData(blog.id)"
        >
          Hapus
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';

export default {
  data: () => ({
    blog: {},
    dialog: false,
    title: '',
    description: '',
    idUpdate: null,
    idUpload: null,
    form: '',
    photo: '',
    rules: [(v) => !!v || 'Data is required'],
    apiDomain: 'http://demo-api-vue.sanbercloud.com',
  }),
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
    go() {
      let { id } = this.$route.params;

      const config = {
        method: 'get',
        url: `${this.apiDomain}/api/v2/blog/${id}`,
      };

      axios(config)
        .then((response) => {
          let { blog } = response.data;
          this.blog = blog;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    clearForm: function () {
      (this.title = ''),
        (this.description = ''),
        (this.idUpdate = null),
        (this.idUpload = null),
        (this.form = ''),
        (this.dialog = false);
    },
    editData: function (blog) {
      this.title = blog.title;
      this.description = blog.description;

      this.idUpdate = blog.id;
    },
    updateData: function (id) {
      let formData = new FormData();
      formData.append('title', this.title);
      formData.append('description', this.description);

      const config = {
        method: 'post',
        url: `${this.apiDomain}/api/v2/blog/${id}`,
        params: { _method: 'PUT' },
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
            text: 'Update ' + response.data.message,
          });
        })
        .catch((response) => {
          this.setAlert({
            status: true,
            color: 'error',
            text: response.data.message,
          });
        });
    },
    uploadPhoto: function (blog) {
      this.title = blog.title;
      this.description = blog.description;

      this.idUpload = blog.id;
      this.form = 'upload';
    },
    submitPhoto: function (id) {
      let file = this.$refs.photo.files[0];

      let formData = new FormData();
      formData.append('photo', file);

      const config = {
        method: 'post',
        url: `${this.apiDomain}/api/v2/blog/${id}/upload-photo`,
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
            text: 'Upload foto ' + response.data.message,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    removeData: function (id) {
      let confirmation = confirm('Anda yakin ?');

      if (confirmation) {
        const config = {
          method: 'post',
          url: `${this.apiDomain}/api/v2/blog/${id}`,
          params: { _method: 'DELETE' },
          headers: {
            Authorization: 'Bearer' + this.token,
          },
        };

        axios(config)
          .then((response) => {
            this.$router.push({ name: 'Blogs' });
            this.setAlert({
              status: true,
              color: 'success',
              text: 'Delete ' + response.data.message,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
  created() {
    this.go();
  },
};
</script>
