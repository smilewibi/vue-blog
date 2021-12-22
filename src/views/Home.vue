<template>
  <v-container class="ma-0 pa-0" grid-list-sm>
    <div class="text-right">
      <v-btn small text to="/blogs" class="blue--text">
        All Blogs <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
    <v-layout wrap>
      <blog-item-component
        v-for="blog in blogs"
        :key="`blog-${blog.id}`"
        :blog="blog"
      ></blog-item-component>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios';
import BlogItemComponent from '../components/BlogItemComponent.vue';

export default {
  data: () => ({
    apiDomain: 'http://demo-api-vue.sanbercloud.com',
    blogs: [],
  }),
  components: {
    'blog-item-component': BlogItemComponent,
  },
  methods: {
    go() {
      const config = {
        method: 'get',
        url: this.apiDomain + '/api/v2/blog/random/4',
      };

      axios(config)
        .then((response) => {
          let { blogs } = response.data;
          this.blogs = blogs;
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
