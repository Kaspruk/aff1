<template>
  <div class="recursion-file-list">
    <div v-for="item in items" :key="item.id" class="recursion-file-list__item">
      <div class="recursion-file-list__item__row" @click="toggleShow(item)">
        <div class="recursion-file-list__item__col">
          {{ item.name }}
        </div>
        <div class="recursion-file-list__item__col">
          {{ item.mime }}
        </div>
        <div class="recursion-file-list__item__col">
          {{ item.size }}
        </div>
        <div class="recursion-file-list__item__col">
          {{ item.created }}
        </div>
        <div class="recursion-file-list__item__col">
          {{ item.permissions }}
        </div>
      </div>
      <div v-if="item.children && item.children.length && activeItems.includes(item.id)" class="recursion-file-list__item__content">
        <recursion-file-list :items="item.children" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'RecursionFileList',
    props: {
        items: { type: Array, default: () => ([]) }
    },
    data: () => ({
        activeItems: [],
    }),
    methods: {
        toggleShow(item) {
            if (item.children && item.children.length) {
                if (this.activeItems.includes(item.id)) {
                    this.activeItems.splice(this.activeItems.indexOf(item.id), 1);
                } else {
                    this.activeItems.push(item.id);
                }
            }
        }
    }
};
</script>

<style lang="scss">
  @import "src/assets/styles/shared/RecursionFileList";
</style>
