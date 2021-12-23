<template>
    <v-card>
        <v-toolbar dark color="success">
            <v-btn icon dark @click.native="close">
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Login</v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
    </v-card>
</template>

<script>
export default {
    methods : {
        close() {
            this.$emit('closed', false)
        }
    }
}
</script>
