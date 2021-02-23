<template>
  <v-menu offset-y>
    <template #activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>mdi-translate</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-list-item-group v-model="Language" color="primary">
        <v-list-item v-for="lang in languages" :key="lang.value" :value="lang.value">
          <v-list-item-title>{{ lang.name }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-card>
  </v-menu>
</template>

<script>
export default {
    name: 'CLanguageSelect',
    computed: {
        languages() {
            return [
                {name: 'English', value: 'en'},
                {name: 'Русский', value: 'ru'},
            ];
        },
        Language: {
            get() {
                return this.$i18n.locale;
            },
            set(lang) {
                localStorage.setItem('language', lang);

                this.$i18n.locale = lang;
                this.$vuetify.lang.current = lang;
            },
        },
    },
};
</script>
