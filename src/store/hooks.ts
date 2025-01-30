'use client'
import {useDispatch, useSelector, useStore} from 'react-redux'
import type {AppDispatch, AppStore, StoreRootState} from '.'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<StoreRootState>()
export const useAppStore = useStore.withTypes<AppStore>()