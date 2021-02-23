<template>
  <div class="c-address-line">
    <div class="c-address-line-item">
      <span v-if="prefix" class="c-address-line-item__prefix">{{ prefix }}</span>
      <div class="c-address-line-item__slot">
        <template v-for="(file, index) in items">
          <a :key="file.id" @click.stop="$emit('openFile', file)">{{ file.name }}</a>
          <span v-if="index < items.length-1" :key="`${file.id}-divider`">/</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'CAddressLine',
    props: {
        prefix: {type: String, default: ''},
        items: {type: Array, default: () => ([])},
    },
};
</script>
