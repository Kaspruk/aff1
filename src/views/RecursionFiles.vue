<template>
  <v-container class="recursion-files">
    <recursion-file-list :items="files" />
    <recursion-file-table :items="files" />
  </v-container>
</template>

<script>
const FakeData = require('./../config/FakeData.json');
import { makeFilesTree } from '@/common/helpers/makeFilesTree';
import { cloneDeep } from 'lodash-es';

import RecursionFileList from '@/components/shared/RecursionFileList';
import RecursionFileTable from '@/components/shared/RecursionFileTable';

export default {
    name: 'RecursionFiles',
    components: {
        RecursionFileList,
        RecursionFileTable
    },
    data: () => ({
        files: [],
    }),
    created() {
        this.files = makeFilesTree(cloneDeep(FakeData));
    }
};
</script>

<style lang="scss">
  @import "src/assets/styles/views/RecursionFiles";
</style>
