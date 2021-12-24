<template>
  <v-container class="">
    <v-row justify="center">
      <v-col md="5">
        <v-card class="rounded-lg mt-3 elevation-13">
          <v-toolbar dark color="success">
            <v-toolbar-title>Register</v-toolbar-title>
          </v-toolbar>

          <v-container fluid>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              class="pa-3"
            >
              <v-text-field
                v-model="name"
                filled
                class="rounded-t-lg"
                :rules="nameRules"
                type="text"
                label="Name"
                hint="At least 6 characters"
                counter
              >
              </v-text-field>
              <v-text-field
                v-model="email"
                :rules="emailRules"
                filled
                class="rounded-t-lg"
                label="Email"
                required
                append-icon="mdi-email"
              >
              </v-text-field>
              <v-text-field
                v-model="password"
                filled
                class="rounded-t-lg"
                :append-icon="
                  showPassword ? 'mdi-eye' : 'mdi-eye-off'
                "
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                hint="At least 6 characters"
                counter
                @click:append="showPassword = !showPassword"
              >
              </v-text-field>
              <v-file-input
                label="Photo Profile"
                filled
                class="rounded-t-lg"
                append-icon="mdi-account-circle"
                :rules="photoRules"
                name="photo"
                ref="photo"
                accept="image/*"
              ></v-file-input>

              <div class="text-xs-center">
                <v-btn
                  @click.prevent="submit"
                  type="submit"
                  color="success"
                  :disabled="!valid"
                  class="white--text rounded-lg"
                  block
                >
                  Register
                  <v-icon right dark>mdi-lock-open</v-icon>
                </v-btn>
              </div>
            </v-form>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import axios from 'axios';
export default {
  data() {
    return {
      apiDomain: 'https://demo-api-vue.sanbercloud.com',
      valid: true,
      name: '',
      email: '',
      password: '',
      file: {},
      showPassword: false,

      nameRules: [
        (v) => !!v || 'Name Required',
        (v) => (v && v.length >= 4) || 'Min 4 Characters',
      ],
      emailRules: [
        (v) => !!v || 'Email is Required',
        (v) =>
          /([a-zA-Z0-9_]{1,})(@)([a-zA-Z0-9_]{2,})+/.test(v) ||
          'Email must be valid',
      ],
      passwordRules: [
        (v) => !!v || 'Password Required',
        (v) => (v && v.length >= 6) || 'Min 6 Characters',
      ],
      photoRules: [(v) => !!v || 'Photo Profile is Required'],
    };
  },
  methods: {
    ...mapActions({
      setAlert: 'alert/set',
      setToken: 'auth/setToken',
    }),
    async submit() {
      this.file = this.$refs.photo.$refs.input.files[0];

      if (this.$refs.form.validate) {
        let formData = new FormData();
        formData.append('name', this.name);
        formData.append('email', this.email);
        formData.append('password', this.password);
        formData.append('photo_profile', this.file);
        const config = {
          method: 'post',
          url: `${this.apiDomain}/api/v2/auth/register`,
          headers: {
            Accept: 'application/json',
          },
          data: formData,
        };

        try {
          const response = await axios(config);
          const { data } = response;
          this.setAlert({
            status: true,
            color: 'primary',
            text: data.message,
          });
          setTimeout(() => {
            this.login();
            setTimeout(() => {
              this.$router.push('/');
            }, 100);
          }, 250);
        } catch (error) {
          console.log(error);
          this.setAlert({
            status: true,
            color: 'error',
            text: 'Registrasi Gagal',
          });
        }
      }
    },
    async login() {
      const config = {
        method: 'post',
        url: `${this.apiDomain}/api/v2/auth/login`,
        data: {
          email: this.email,
          password: this.password,
        },
      };
      try {
        const response = await this.axios(config);
        const { data } = response;
        this.setToken(data);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped></style>
