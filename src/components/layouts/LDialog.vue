<template>
  <v-dialog :value="show" v-bind="config.params" @click:outside="config.params.persistent || reject()">
    <component
      :is="config.component"
      :key="config.component"
      v-bind="config.props"
      @resolve="resolve"
      @reject="reject"
    />
  </v-dialog>
</template>

<script>
export default {
    name: 'LDialog',
    components: {
        confirmation: () => import(/* webpackChunkName: "confirmation" */ '../dialogs/Confirmation'),
    },
    data: () => ({
        show: false,
        timer: null,
        config: {
            component: '',
            params: {
                width: 600,
                persistent: true,
            },
            props: {},
        },
    }),
    methods: {
        resolve(params) {
            this.$eventBus.$emit(this.config.component, {success: true, data: params});
            this.close();
        },
        reject(params) {
            this.$eventBus.$emit(this.config.component, {success: false, data: params});
            this.close();
        },
        close() {
            this.show = false;
            this.timer = setTimeout(() => this.setDefaultParams(), 500);
        },
        setDefaultParams() {
            this.config = {
                component: '',
                params: {
                    width: 600,
                    persistent: true,
                },
                props: {},
            };
            clearInterval(this.timer);
            this.timer = null;
        },
    },
    mounted() {
        this.$eventBus.$on('open-dialog', config => {
            if (this.timer) this.setDefaultParams();

            this.config.props = config.props;
            this.config.component = config.component;
            Object.assign(this.config.params, config.params);

            this.show = true;
        });
        this.$eventBus.$on('close-dialog', () => this.close());
    },
};
</script>
