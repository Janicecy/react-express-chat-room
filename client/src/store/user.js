const SET_USER = 'SET_USER'

export const setUser = (user) => ({
  type: SET_USER,
  payload: user
})

const reducer = (state = {}, action) => {
  switch (action.type) {
    case SET_USER:
      return action.payload
    default:
      return state
  }
}

export default reducer