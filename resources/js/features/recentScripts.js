import  { createSlice} from '@reduxjs/toolkit'
import { film10pr, film12pr, theatre4pr } from '../assets/posters'

let initialState = [
  {
    id: "1",
    title: "የሰማይ ልጆች",
    description: "Drama about family reconciliation",
    lastEdited: "2 hours ago",
    thumbnail: film10pr,
    pages: 42,
    category: "Film",
  },
  {
    id: "2",
    title: "ጉዞ ወደ ዋልድያ",
    description: "Adventure comedy",
    lastEdited: "Yesterday",
    thumbnail: film12pr,
    pages: 78,
    category: "Film",
  },
  {
    id: "3",
    title: "የአዲስ አበባ ምሽት",
    description: "Romance in the city theatre",
    lastEdited: "3 days ago",
    thumbnail: theatre4pr,
    pages: 65,
    category: "Theatre",
  }
]

export const recentScriptsSlice = createSlice({
    name: "recentScripts",
    initialState,
    reducers: {

    }

})

export const selectAllRecentScripts = state=> state.recentScripts

export default recentScriptsSlice.reducer
