<template>
  <v-app-bar
    clipped-left
    dense
    flat
    dark
    app
  >
    <v-toolbar-title>{{ $t('appTitle') }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <c-language-select />
  </v-app-bar>
</template>

<script>
import CLanguageSelect from '@/components/ui/CLanguageSelect';

export default {
    name: 'LHeader',
    components: {
        CLanguageSelect
    }
};
</script>
