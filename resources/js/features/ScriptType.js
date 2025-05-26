import { createSlice } from '@reduxjs/toolkit'

let initialState =  null
export const TypeSlice = createSlice({
  name: "type",
  initialState,
  reducers: {
    changeType: (state,action) => {
      return action.payload
    },
    
  }
})


export const { initType } = TypeSlice.actions

export default TypeSlice.reducer
