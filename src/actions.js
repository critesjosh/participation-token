/*
 * action types
 */

export const ADD_WEB3 = 'ADD_WEB3'
export const ADD_ACCOUNT = 'ADD_ACCOUNT'

/*
 * other constants
 */

// export const VisibilityFilters = {
//   SHOW_ALL: 'SHOW_ALL',
//   SHOW_COMPLETED: 'SHOW_COMPLETED',
//   SHOW_ACTIVE: 'SHOW_ACTIVE'
// }

/*
 * action creators
 */

export function addWeb3(object) {
  return { type: ADD_WEB3, object }
}

export function addAccount(string) {
  return { type: ADD_ACCOUNT, string }
}
