import { IApiState } from './common'
import { IProfile } from './profile/types';

// TYPES

export const enum SearchActionTypes {
    SEARCH_SIMPLE_FETCH_REQUEST = '@@search/SEARCH_SIMPLE_FETCH_REQUEST',
    SEARCH_SIMPLE_FETCH_SUCCESS = '@@search/SEARCH_SIMPLE_FETCH_SUCCESS',
    SEARCH_SIMPLE_FETCH_ERROR = '@@search/SEARCH_SIMPLE_FETCH_ERROR',
}

export interface ISimpleSearchRequest {
    term: string,
}

export interface ISimpleSearchResult extends ISimpleSearchRequest {
    profiles: IProfile[]
}

export interface ISimpleSearchState extends IApiState<ISimpleSearchRequest, ISimpleSearchResult> { 
}

// ACTIONS

import { action } from 'typesafe-actions'

const simpleSearchFetchRequest = (request: ISimpleSearchRequest) => action(SearchActionTypes.SEARCH_SIMPLE_FETCH_REQUEST, request)
const simpleSearchFetchSuccess = (data: ISimpleSearchResult) => action(SearchActionTypes.SEARCH_SIMPLE_FETCH_SUCCESS, data)
const simpleSearchFetchError = (error: string) => action(SearchActionTypes.SEARCH_SIMPLE_FETCH_ERROR, error)

export {
    simpleSearchFetchRequest,
    simpleSearchFetchError,
    simpleSearchFetchSuccess
}

// REDUCER

import { Reducer } from 'redux'
import { FetchErrorReducer, FetchRequestReducer, FetchSuccessReducer } from './common'

// Type-safe initialState!
const initialState: ISimpleSearchState = {
    data: undefined,
    error: undefined,
    loading: false,
    request: undefined,
}

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
const reducer: Reducer<ISimpleSearchState> = (state = initialState, act) => {
  switch (act.type) {
    case SearchActionTypes.SEARCH_SIMPLE_FETCH_REQUEST: return FetchRequestReducer(state, act)
    case SearchActionTypes.SEARCH_SIMPLE_FETCH_SUCCESS: return FetchSuccessReducer(state, act)
    case SearchActionTypes.SEARCH_SIMPLE_FETCH_ERROR: return FetchErrorReducer(state, act)
    default: return state
  }
}

// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.
export { 
  reducer as searchReducer,
  initialState as initialSearchState
}


// SAGA

import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects'
import { NotAuthorizedError } from '../components/errors';
import { signInRequest } from './auth/actions';
import { callApiWithAuth } from './effects'
import { IApplicationState } from './index';

const API_ENDPOINT = process.env.REACT_APP_API_URL || ''

function* handleFetch() {
  try {
    const state = (yield select<IApplicationState>((s) => s.simplesearch.request)) as ISimpleSearchRequest
    const path = `search?term=${state.term}`
    const response = yield call(callApiWithAuth, 'get', API_ENDPOINT, path)
    console.log ("in try block", response)
    if (response.errors) {
      yield put(simpleSearchFetchError(response.errors))
    } else {
      yield put(simpleSearchFetchSuccess(response))
    }
  } catch (err) {
    console.log ("in catch block", err)
    if (err instanceof NotAuthorizedError){
      yield put(signInRequest())
    }
    else if (err instanceof Error) {
      yield put(simpleSearchFetchError(err.stack!))
    } else {
      yield put(simpleSearchFetchError('An unknown error occured.'))
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchSimpleSearchFetch() {
  yield takeEvery(SearchActionTypes.SEARCH_SIMPLE_FETCH_REQUEST, handleFetch)
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* profileSaga() {
  yield all([fork(watchSimpleSearchFetch)])
}

export default profileSaga
