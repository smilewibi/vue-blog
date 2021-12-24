<template>
  <!-- App.vue -->

  <v-app>
    <Alert />
    <Dialog />
    <v-navigation-drawer app v-model="drawer">
      <!-- -->
      <v-list>
        <v-list-item v-if="!guest">
          <v-list-item-avatar>
            <v-img
              :src="
                user.photo_profile
                  ? apiDomain + user.photo_profile
                  : 'https://randomuser.me/api/portraits/men/78.jpg'
              "
            ></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ user.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <div class="pa-2" v-if="guest">
          <v-btn class="mb-1" block color="primary" @click="login">
            <v-icon left color="blue">mdi-lock</v-icon>
            login
          </v-btn>
          <v-btn block color="success" to="/register" @click="drawer = !drawer">
            <v-icon left>mdi-account</v-icon>
            Register
          </v-btn>
        </div>

        <v-divider></v-divider>

        <v-list-item
          v-for="(item, index) in menus"
          :key="`menu-${index}`"
          :to="item.route"
        >
          <v-list-item-icon>
            <v-icon left>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append v-if="!guest">
        <div class="pa-2">
          <v-btn block color="red" dark @click="logout">
            <v-icon>mdi-lock</v-icon>
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app color="light-blue accent-2" dark>
      <!-- -->
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>Blog-App</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <v-slide-y-transition>
          <router-view></router-view>
        </v-slide-y-transition>
      </v-container>
    </v-main>

    <v-footer app> @My blog | VueJs </v-footer>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    Alert: () => import('./components/Alert.vue'),
    Dialog: () => import('./components/Dialog.vue'),
  },
  data: () => ({
    drawer: false,
    menus: [
      { title: 'Home', icon: 'mdi-home', route: '/' },
      { title: 'Blogs', icon: 'mdi-note', route: '/blogs' },
    ],
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
    logout() {
      // this.guest = true;
      // this.setAlert({
      //   status: true,
      //   color: 'success',
      //   text: 'Anda berhasil logout',
      // });
      let config = {
        method: 'post',
        url: this.apiDomain + '/api/v2/auth/logout',
        headers: {
          Authorization: 'Bearer' + this.token,
        },
      };

      axios(config)
        .then(() => {
          this.setToken('');
          this.setUser({});

          this.setAlert({
            status: true,
            color: 'success',
            text: 'Anda berhasil logout',
          });
        })
        .catch((response) => {
          this.setAlert({
            status: true,
            color: 'error',
            text: response.data.error,
          });
        });
    },

    login() {
      // this.guest = false;
      // this.setAlert({
      //   status: true,
      //   color: 'success',
      //   text: 'Anda berhasil login',
      // });
      this.setDialogComponent({ component: 'login' });
    },
    ...mapActions({
      setAlert: 'alert/set',
      setDialogComponent: 'dialog/setComponent',
      setToken: 'auth/setToken',
      setUser: 'auth/setUser',
      checkToken: 'auth/checkToken',
    }),
  },
  mounted() {
    if (this.token) {
      this.checkToken(this.token);
    }
  },
};
</script>
