export function beforeRegistration(Vue, config, store, isServer) {
    const CURRENT_METHOD_CODE = 'braintree'

    store.dispatch('payment/addMethod', {
        'title': 'Braintree',
        'code': CURRENT_METHOD_CODE,
        'cost': 0,
        'costInclTax': 0,
        'default': true,
        'offline': false
    })

    if (!Vue.prototype.$isServer) {

        let isCurrentPaymentMethod = false
        store.watch((state) => state.checkout.paymentDetails, (prevMethodCode, newMethodCode) => {
            isCurrentPaymentMethod = newMethodCode === CURRENT_METHOD_CODE
        })

        const invokePlaceOrder = () => {
            if (isCurrentPaymentMethod) {
                Vue.prototype.$bus.$emit('checkout-do-placeOrder', {})
            }
        }
        Vue.prototype.$bus.$on('checkout-before-placeOrder', invokePlaceOrder)
    }
}