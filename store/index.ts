import { Module } from 'vuex'
import { BraintreeState } from '../types/BraintreeState'
import { mutations } from './mutations'
import { getters } from './getters'
import { actions } from './actions'

export const module: Module<BraintreeState, any> = {
    namespaced: true,
    mutations,
    actions,
    getters
}