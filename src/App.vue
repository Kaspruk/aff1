<template>
  <v-app>
    <l-header/>
    <v-main>
      <router-view :key="$route.name" />
    </v-main>
    <l-dialog/>
  </v-app>
</template>

<script>
import LDialog from '@/components/layouts/LDialog';
import LHeader from '@/components/layouts/LHeader';

export default {
    components: {
        LHeader,
        LDialog,
    },
};
</script>