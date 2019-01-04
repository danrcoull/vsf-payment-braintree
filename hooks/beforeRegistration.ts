export function beforeRegistration(Vue, config, store, isServer) {

    store.dispatch('payment/addMethod', {
        'title': 'Braintree',
        'code': 'braintree',
        'cost': 0,
        'costInclTax': 0,
        'default': true,
        'offline': false
    })

    if (!Vue.prototype.$isServer) {

        store.watch((state) => state.checkout.paymentDetails, (prevMethodCode, newMethodCode) => {
            if (newMethodCode === 'braintree') {
                // Register the handler for what happens when they click the place order button.
                Vue.prototype.$bus.$on('checkout-before-placeOrder', () => {
                    Vue.prototype.$bus.$emit('checkout-do-placeOrder', {})
                })
            } else {
                // Unregister the extensions placeorder handler
                Vue.prototype.$bus.$off('checkout-before-placeOrder', () => {
                    Vue.prototype.$bus.$emit('checkout-do-placeOrder', {})
                })
            }
        })
    }
}