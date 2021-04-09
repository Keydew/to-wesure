import Confirm from './confirm.vue'

Confirm.install = Vue => {
    const VueComponent = Vue.extend(Confirm);
    const vm = new VueComponent().$mount();
    let init = false;

    const confirm = function (options) {
        let option = options;

        if (typeof options == 'string') {
            option = { message: options };
        }

        Object.assign(vm, option);

        if (!init) {
            document.body.appendChild(vm.$el);
            init = true;
        }

        return vm.confirm();
    }

    Vue.prototype.$confirm = confirm;
}


export default Confirm;