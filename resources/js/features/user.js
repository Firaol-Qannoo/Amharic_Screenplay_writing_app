import { createSlice } from '@reduxjs/toolkit'

let initialState =  null
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    initUser: (state,action) => {
      return action.payload
    },
    
  }
})


export const { initUser } = userSlice.actions

export default userSlice.reducer
