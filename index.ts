import { VueStorefrontModule, VueStorefrontModuleConfig } from '@vue-storefront/core/lib/module'
import { beforeRegistration } from './hooks/beforeRegistration'
import { module } from './store'
import { plugin } from './store/plugin'

const KEY = 'braintree'

const moduleConfig: VueStorefrontModuleConfig = {
  key: KEY,
  store: { modules: [{ key: KEY, module: module }], plugin },
  beforeRegistration
}

export const Braintree = new VueStorefrontModule(moduleConfig)