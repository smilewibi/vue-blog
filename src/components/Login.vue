<template>
  <v-card class="rounded-lg">
    <v-toolbar dark color="primary">
      <v-btn icon dark @click.native="close">
        <v-icon>mdi-close-circle</v-icon>
      </v-btn>
      <v-toolbar-title>Login</v-toolbar-title>
    </v-toolbar>

    <v-container fluid>
      <v-form ref="form" v-model="valid" lazy-validation class="pa-3">
        <v-text-field v-model="email" :rules="emailRules" filled class="rounded-t-lg"
                      label="Email" required append-icon="mdi-email">

        </v-text-field>
        <v-text-field v-model="password" filled class="rounded-t-lg"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="passwordRules" :type="showPassword ? 'text' : 'password'"
                      label="Password" hint="At least 6 characters" counter
                      @click:append="showPassword = !showPassword">

        </v-text-field>
        <div class="text-xs-center">
          <v-btn color="primary" :disabled="!valid" @click="submit" class="white--text rounded-lg" block>
            <v-icon left dark>mdi-lock-open</v-icon>
            Login
          </v-btn>
        </div>
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "Login",
  data: () => ({
    apiDomain: 'https://demo-api-vue.sanbercloud.com',
    valid: true,
    email: '',
    emailRules: [
      v => !!v || 'Email is Required',
      v => /([a-zA-Z0-9_]{1,})(@)([a-zA-Z0-9_]{2,})+/.test(v) || 'Email must be valid'
    ],
    showPassword: false,
    password: '',
    passwordRules: [
      v => !!v || 'Password Required',
      v => (v && v.length >= 6) || 'Min 6 Characters'
    ]
  }),
  methods: {
    ...mapActions({
      setAlert: 'alert/set',
      setToken: 'auth/setToken'
    }),
    async submit(){
      if(this.$refs.form.validate()){
        const config = {
          method: 'post',
          url: `${this.apiDomain}/api/v2/auth/login`,
          data: {
            email: this.email,
            password: this.password
          }
        };
        try {
          const response = await this.axios(config);
          const { data } = response
          this.setToken(data);
          this.setAlert({
            status: true,
            color: 'primary',
            text: 'Login Success'
          });
          this.close();
        } catch (error) {
          console.log(error);
          this.setAlert({
            status: true,
            color: 'error',
            text: 'Login Gagal'
          });
        }
      }
    },
    close(){
      this.$emit('closed', false);
    },
  },
  computed: {
    ...mapGetters({
      token: 'auth/token',
      user: 'auth/user'
    })
  }
}
</script>

<style scoped>

</style>