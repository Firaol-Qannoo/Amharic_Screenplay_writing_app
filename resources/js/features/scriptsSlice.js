import  { createSlice} from '@reduxjs/toolkit'
import { film1pr, film2pr, film3pr, film8pr, theatre1pr, theatre2pr } from '../assets/posters'

let initialState = [
  {
    id: "1",
    title: "የሰማይ ልጆች",
    description: "Drama about family reconciliation",
    lastEdited: "2 hours ago",
    thumbnail: film1pr,
    pages: 42,
    category: "Film",
  },
  {
    id: "2",
    title: "ጉዞ ወደ ዋልድያ",
    description: "Adventure comedy",
    lastEdited: "Yesterday",
    thumbnail: film2pr,
    pages: 78,
    category: "Film",
  },
  {
    id: "3",
    title: "የአዲስ አበባ ምሽት",
    description: "Romance in the city theatre",
    lastEdited: "3 days ago",
    thumbnail: theatre1pr,
    pages: 65,
    category: "Theatre",
  },
  {
    id: "4",
    title: "ታሪካዊ ጀግና",
    description: "Historical drama",
    lastEdited: "1 week ago",
    thumbnail: film3pr,
    pages: 92,
    category: "Film",
  },
  {
    id: "5",
    title: "ታሪካዊ ጀግና",
    description: "Historical theatre",
    lastEdited: "1 week ago",
    thumbnail: theatre2pr,
    pages: 92,
    category: "Theatre",
  },
  {
    id: "5",
    title: "ታሪካዊ ጀግና",
    description: "Historical drama",
    lastEdited: "1 week ago",
    thumbnail: film8pr,
    pages: 92,
    category: "Film",
  },
]

export const scriptsSlice = createSlice({
    name: "scripts",
    initialState,
    reducers: {

    }

})

export const selectAllscripts = state=> state.scripts

export default scriptsSlice.reducer
