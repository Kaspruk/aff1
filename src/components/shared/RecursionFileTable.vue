<template>
  <v-data-table
    :items="files"
    :headers="headers"
    disable-pagination
    hide-default-footer>
    <template v-for="h in headers" #[`header.${h.value}`]="{ header }">
      {{ $t(header.text) }}
    </template>
    <template v-if="showReturn" #body.prepend>
      <tr @click="getParentFile">
        <td :colspan="5" style="user-select: none">...</td>
      </tr>
    </template>
    <template #item="{ item }">
      <tr @click="openChild(item)">
        <td>{{ item.name }}</td>
        <td>{{ item.size }}</td>
        <td>{{ item.mime }}</td>
        <td>{{ item.created }}</td>
        <td>{{ item.permissions }}</td>
      </tr>
    </template>
    <template #footer>
      <v-divider/>
    </template>
  </v-data-table>
</template>

<script>
import { getTreeNodeById } from '@/common/helpers/getTreeNodeById';

export default {
    name: 'FilesTable',
    props: {
        items: {type: Array, default: () => ([])},
    },
    data: () => ({
        headers: [
            {text: 'table.name', value: 'name'},
            {text: 'table.size', value: 'size'},
            {text: 'table.mime', value: 'mime'},
            {text: 'table.date', value: 'created'},
            {text: 'table.permissions', value: 'permissions', sortable: false},
        ],
        activeFolder: null,
        showReturn: false,
    }),
    computed: {
        files() {
            return this.activeFolder && this.activeFolder.children || this.items;
        }
    },
    methods: {
        openChild(item) {
            if (item.children && item.children.length) {
                this.showReturn = true;
                this.activeFolder = item;
            }
        },
        getParentFile() {
            this.activeFolder = this.activeFolder.parentId ? getTreeNodeById(this.items, this.activeFolder.parentId) : null;
            if (!this.activeFolder) {
                this.showReturn = false;
            }
        }
    }
};
</script>
