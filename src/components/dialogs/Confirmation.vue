<template>
  <div class="c-dialog c-dialog--confirmation" :class="type && `c-dialog--${type}`">
    <div class="c-dialog__body">
      <span v-if="title" class="c-dialog__title">{{ title }}</span>
      <span v-if="text" class="c-dialog__text">{{ text }}</span>
      <v-checkbox v-if="checkbox" v-model="checkboxValue" :label="checkbox" hide-details/>
    </div>
    <div class="c-dialog__bottom" :class="{'c-dialog__bottom--with-cancel': showReject}">
      <v-btn
        v-if="showReject"
        color="grey-dark-100"
        text
        large
        @click="$emit('reject')"
      >
        {{ rejectText || $t('buttons.no') }}
      </v-btn>
      <v-btn
        :disabled="!!checkbox && !checkboxValue"
        :block="!showReject"
        color="primary"
        depressed
        large
        @click="$emit('resolve')"
      >
        {{ resolveText || $t('buttons.yes') }}
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Confirmation',
    props: {
        type: {type: String, default: ''},
        text: {type: String, default: ''},
        title: {type: String, default: ''},
        checkbox: {type: String, default: ''},
        rejectText: {type: String, default: 'buttons.no'},
        resolveText: {type: String, default: ''},
        showReject: {type: Boolean, default: false},
    },
    data: () => ({
        checkboxValue: false,
    }),
};
</script>
