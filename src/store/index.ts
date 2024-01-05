import {configureStore} from '@reduxjs/toolkit';
import {useDispatch, useSelector} from 'react-redux';
import type {TypedUseSelectorHook} from 'react-redux';
import servicesSlice from './features/servicesSlice';
import layoutSlice from './features/layoutSlice';
import turnsSlice from './features/turnsSlice';
import authSlice from './features/authSlice';
import {authApi} from '../api/authApi';
import {servicesApi} from '../api/servicesApi';
import {turnsApi} from '../api/turnsApi';
import {facebookApi} from '../api/facebookApi';
import {barbersApi} from '../api/barbersApi';
import {statApi} from '../api/statsApi';
import {reviewsApi} from '../api/reviewsApi';
import { galleryApi } from '../api/galleryApi';

export const store = configureStore({
  reducer: {
    services: servicesSlice,
    layout: layoutSlice,
    turns: turnsSlice,
    auth: authSlice,
    [authApi.reducerPath]: authApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    [turnsApi.reducerPath]: turnsApi.reducer,
    [barbersApi.reducerPath]: barbersApi.reducer,
    [facebookApi.reducerPath]: facebookApi.reducer,
    [statApi.reducerPath]: statApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
    [galleryApi.reducerPath]: galleryApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([
      authApi.middleware,
      servicesApi.middleware,
      turnsApi.middleware,
      barbersApi.middleware,
      facebookApi.middleware,
      statApi.middleware,
      reviewsApi.middleware,
      galleryApi.middleware,
    ]),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
