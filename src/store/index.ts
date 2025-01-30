import { logout } from '@/store/actions/logout.action'
import {
  combineReducers,
  configureStore,
  StateFromReducersMapObject,
  type UnknownAction,
} from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import user from '@/store/features/user.slice'
import admin from '@/store/features/admin.slice'
import { adminApis } from '@/store/services/auth.service'
import { gymApis } from '@/store/services/gym.service'
import { rtkQueryErrorLogger } from '@/store/listeners'

const rootReducer = combineReducers({
  [adminApis.reducerPath]: adminApis.reducer,
  [gymApis.reducerPath]: gymApis.reducer,
  user,
  admin,
})
export type RootState = StateFromReducersMapObject<typeof rootReducer>

const appReducer = (state: RootState | undefined, action: UnknownAction) => {
  if (action.type === logout.type) {
    state = undefined
  }

  return rootReducer(state, action)
}

export const store = configureStore({
  reducer: appReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      adminApis.middleware,
      gymApis.middleware,
      rtkQueryErrorLogger,
    ),
  // .prepend(otherListenerMiddleware.middleware)
})

setupListeners(store.dispatch)
// Infer the type of store
export type AppStore = typeof store
export type StoreRootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
