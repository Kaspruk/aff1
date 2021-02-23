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
    <v-btn
      :to="{ name: 'RecursionFiles' }"
      class="mr-3 text-capitalize"
      text
      exact>
      {{ $t('menu.home') }}
    </v-btn>
    <v-btn
      :to="{ name: 'FileManager' }"
      class="mr-3 text-capitalize"
      text
      exact>
      {{ $t('menu.fileManager') }}
    </v-btn>
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
