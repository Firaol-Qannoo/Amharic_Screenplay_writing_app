import { createSlice } from '@reduxjs/toolkit'
import {nanoid} from 'nanoid'

let initialState =  []
export const charactersSlice = createSlice({
  name: "characters",
  initialState,
  reducers: {
    initCharacter: (state,action) => {
      return action.payload
    },
    addCharacter: (state, action) => {
      state.push({...action.payload})
    },
    updateCharacter: (state, action) => {
      const { id, updates } = action.payload
      const index = state.findIndex(char => char.id === id)
      if (index !== -1) {
        state[index] = { ...state[index], ...updates }
      }
    },
    deleteCharacter: (state, action) => {
      const id = action.payload
      return state.filter(char => char.id !== id)
    },
    addRelationship: (state, action) => {
      const { fromId, toId, type, description } = action.payload
      const character = state.find(char => char.id === fromId)
      if (character) {
      if(!(character.relationships.some(r => r.to === toId))) {
        character.relationships.push({ to: toId, type, description })}
      }
    },
    updateRelationship: (state, action) => {
      const { fromId, toId, updates } = action.payload
      const character = state.find(char => char.id === fromId)
      if (character) {
        const rel = character.relationships.find(r => r.to === toId)
        if (rel) {
          Object.assign(rel, updates)
        }
      }
    },
    removeRelationship: (state, action) => {
      const { fromId, toId } = action.payload
      const character = state.find(char => char.id === fromId)
      if (character) {
        character.relationships = character.relationships.filter(r => r.to !== toId)
      }
    }
  }
})

export const selectcharacters = state => state.characters
export const selectCharacterByName = (state, name) =>
  state.characters.find(character => character.name === name)

export const {
  initCharacter,
  addCharacter,
  updateCharacter,
  deleteCharacter,
  addRelationship,
  updateRelationship,
  removeRelationship
} = charactersSlice.actions

export default charactersSlice.reducer
