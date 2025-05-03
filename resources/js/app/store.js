import { configureStore } from '@reduxjs/toolkit'
import scriptsReducer from '../features/ScriptsSlice'
import activeScriptReducer from '../features/activeScriptSlice'

export const store = configureStore({
    reducer: {
        activeScript: activeScriptReducer,
        scripts: scriptsReducer,

    }
})
