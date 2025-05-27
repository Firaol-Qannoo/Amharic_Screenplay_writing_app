import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

const initialState = {
  scenes: []
};

export const activeScript = createSlice({
  name: 'activeScript',
  initialState,
  reducers: {
    initScript: (state,action) => {
      return action.payload
    },
    addScene: (state, action) => {
      const { id, sceneHead, sceneDesc,user } = action.payload;
      state.scenes.push({
        id,
        user,
        sceneHead: { id: sceneHead?.id || null, text: sceneHead?.text || null },
        sceneDesc: { id: sceneDesc?.id|| null, text: sceneDesc?.text|| null },
        lines: []
      });
    },

    editSceneMeta: (state, action) => {
      const { sceneId, sceneHead, sceneDesc,comment,user } = action.payload;
  
      const scene = state.scenes.find(s =>  s.sceneHead.id === sceneId || s.id === sceneId);
    
      if (scene) {
       
        if (sceneHead) scene.sceneHead = { id: sceneHead?.id || null, text: sceneHead?.text|| null };
        if (comment) {
         scene.comments = scene.comments || []; 
          scene.comments.push({id:nanoid(), comment, user});
        }
        if (sceneDesc) scene.sceneDesc = { id: sceneDesc?.id|| null, text: sceneDesc?.text|| null };
      }
    },

    removeScene: (state, action) => {
      state.scenes = state.scenes.filter(scene => scene.id !== action.payload.sceneId);
    },

    addLine: (state, action) => {
      const { sceneId, line } = action.payload;
      const scene = state.scenes.find(s => s.id === sceneId);
      if (scene) {
        scene.lines.push(line);
      }
    },

    editLine: (state, action) => {
      const { sceneId, lineId, character, emotion, dialogue, actionLine } = action.payload;
      const scene = state.scenes.find(s => s.id === sceneId);
      if (scene) {
        const line = scene.lines.find(l => l.id === lineId);
        if (line) {
          if (actionLine !== undefined) {
            line.action = actionLine;
          }
          if (line.character) line.character = { ...line.character, text: character ?? line.character.text };
          if (line.emotion) line.emotion = { ...line.emotion, text: emotion ?? line.emotion.text };
          if (line.dialogue) line.dialogue = { ...line.dialogue, text: dialogue ?? line.dialogue.text };
        }
      }
    },

    removeLine: (state, action) => {
      const { sceneId, lineId } = action.payload;
      const scene = state.scenes.find(s => s.id === sceneId);
      if (scene) {
        scene.lines = scene.lines.filter(line => line.id !== lineId);
      }
    },

    resetScript: (state) => {
      state.scenes = [];
    }
  }
});

export const selectActiveScript = state => state.activeScript;

export default activeScript.reducer;

export const {
  initScript,
  addScene,
  editSceneMeta,
  editLine,
  addLine,
  removeLine,
  removeScene,
  resetScript
} = activeScript.actions;