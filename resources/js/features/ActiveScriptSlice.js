import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from "nanoid"
const initialState = {
  scenes: []
};

export const activeScript = createSlice({
  name: 'activeScript',
  initialState,
  reducers: {
  
    addScene: (state) => {
      state.scenes.push({
        sceneHead: '',
        id: nanoid(),
        sceneDesc: '',
        lines: []
      });
    },

   
    editSceneMeta: (state, action) => {
      const { index, sceneHead, sceneDesc } = action.payload;
      if (state.scenes[index]) {
        if (sceneHead !== undefined) state.scenes[index].sceneHead = sceneHead;
        if (sceneDesc !== undefined) state.scenes[index].sceneDesc = sceneDesc;
      }
    },

    addLine: (state, action) => {
      const { index, character, emotion, dialogue } = action.payload;
    
      if (action.payload.action) {
        state.scenes[index].lines.push({ action: action.payload.action });
      } else {
        if (state.scenes[index]) {
          state.scenes[index].lines.push({ character, emotion, dialogue });
        }
      }
    }
,    

  
    removeLine: (state, action) => {
      const { sceneIndex, lineIndex } = action.payload;
      if (state.scenes[sceneIndex]) {
        state.scenes[sceneIndex].lines.splice(lineIndex, 1);
      }
    },

    removeScene: (state, action) => {
      state.scenes.splice(action.payload, 1);
    },

    resetScript: (state) => {
      state.scenes = [];
    }
  }
});

export const selectActiveScript = state => state.activeScript;

export default activeScript.reducer;

export const {
  addScene,
  editSceneMeta,
  addLine,
  removeLine,
  removeScene,
  resetScript
} = activeScript.actions;
