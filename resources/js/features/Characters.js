import { createSlice } from '@reduxjs/toolkit'
import {nanoid} from 'nanoid'

let initialState = []
export const characterRelationshipSlice = createSlice({
  name: "characterRelationship",
  initialState,
  reducers: {
    addCharacter: (state, action) => {
      state.push({...action.payload, id: nanoid()})
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

export const selectCharacterRelationship = state => state.characterRelationship
export const selectCharacterById = (state, name) =>
  state.characterRelationship.find(character => character.name === name)

export const {
  addCharacter,
  updateCharacter,
  deleteCharacter,
  addRelationship,
  updateRelationship,
  removeRelationship
} = characterRelationshipSlice.actions

export default characterRelationshipSlice.reducer
