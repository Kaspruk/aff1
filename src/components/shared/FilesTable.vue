<template>
  <v-data-table
    :items="items"
    :headers="headers"
    disable-pagination
    hide-default-footer
  >
    <template v-for="h in headers" #[`header.${h.value}`]="{ header }">
      {{ $t(header.text) }}
    </template>
    <template v-if="showReturn" #body.prepend>
      <tr @dblclick="$emit('onReturn')">
        <td :colspan="6" style="user-select: none">...</td>
      </tr>
    </template>
    <template #item="{ item }">
      <tr
        :class="{ 'grey lighten-1': item.isSelected }"
        :style="item.isWaitingForCut && 'opacity: .5'"
        draggable="true"
        @dragend="onDragEnd($event, item)"
        @keyup.enter="$emit('openFile', item)"
        @dblclick="$emit('openFile', item)"
        @click.ctrl="$emit('itemCtrlClick', item)"
        @click.exact="$emit('selectFile', item)"
      >
        <td>{{ item.name }}</td>
        <td>{{ item.size }}</td>
        <td>{{ item.mime }}</td>
        <td>{{ item.created }}</td>
        <td>{{ item.permissions }}</td>
        <td>
          <v-btn color="error" small icon @click="$emit('removeFiles', [item])">
            <v-icon small>mdi-trash-can-outline</v-icon>
          </v-btn>
        </td>
      </tr>
    </template>
    <template #footer>
      <v-divider/>
    </template>
  </v-data-table>
</template>

<script>

export default {
    name: 'FilesTable',
    props: {
        items: {type: Array, default: () => ([])},
        showReturn: {type: Boolean, default: false},
    },
    data: () => ({
        headers: [
            {text: 'table.name', value: 'name'},
            {text: 'table.size', value: 'size'},
            {text: 'table.mime', value: 'mime'},
            {text: 'table.date', value: 'created'},
            {text: 'table.permissions', value: 'permissions', sortable: false},
            {text: 'table.actions', value: 'actions', sortable: false},
        ],
    }),
    methods: {
        onDragEnd(e, item) {
            if (!item.isSelected) {
                this.$emit('itemClick', item);
            }

            this.$emit('itemDragEnd', document.elementFromPoint(e.clientX, e.clientY));
        },
    },
};
</script>
