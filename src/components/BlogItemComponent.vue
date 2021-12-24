<template>
  <v-flex xs class="mt-3">
    <v-card class="mx-auto" max-width="344">
      <v-img
        :src="
          blog.photo
            ? apiDomain + blog.photo
            : 'https://picsum.photos/200/300'
        "
        height="200px"
      ></v-img>

      <v-card-title v-text="blog.title">
        Top western road trips
      </v-card-title>

      <v-card-subtitle>
        {{ blog.description.substring(0, 15) }}...
      </v-card-subtitle>

      <v-card-actions>
        <v-btn color="orange lighten-2" text :to="'/blog/' + blog.id">
          Readmore
        </v-btn>

        <v-spacer></v-spacer>

        <v-icon> mdi-chevron-right </v-icon>
      </v-card-actions>
    </v-card>
    <!-- <v-card :to="'/blog/' + blog.id">
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

      <v-card-actions>
        <v-progress-linear
          color="blue-grey"
          height="7"
        ></v-progress-linear>
      </v-card-actions>

      <v-card-actions>
        <span>{{ blog.title.substring(0, 15) }}...</span>
      </v-card-actions>
    </v-card> -->
  </v-flex>
</template>

<script>
export default {
  data: () => ({
    apiDomain: 'http://demo-api-vue.sanbercloud.com',
  }),
  props: ['blog'],
};
</script>
