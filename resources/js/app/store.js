import { configureStore } from '@reduxjs/toolkit'
import scriptsReducer from '../features/ScriptsSlice'
import activeScriptReducer from '../features/activeScriptSlice'
import charactersReducer  from '../features/Characters'

export const store = configureStore({
    reducer: {
        activeScript: activeScriptReducer,
        scripts: scriptsReducer,
        characters: charactersReducer

    }
})
