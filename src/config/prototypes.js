import Vue from 'vue'

Vue.prototype.$eventBus = new Vue();

Vue.prototype.$openDialog = params => {
    Vue.prototype.$eventBus.$emit('open-dialog', params);

    return new Promise((resolve, reject) => {
        Vue.prototype.$eventBus.$on(params.component, response => {
            Vue.prototype.$eventBus.$off(params.component);
            if (response.success) resolve(response.data);
            else if (params.returnReject || (!response.seccess && response.data)) reject(response.data);
        });
    });
};

Vue.prototype.$clearDialog = () => Vue.prototype.$eventBus.$emit('close-dialog');

Vue.prototype.$isDescendant = (parent, child) => {
    let node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}