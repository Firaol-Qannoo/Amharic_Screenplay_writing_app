import { configureStore } from '@reduxjs/toolkit'
import scriptsReducer from '../features/ScriptsSlice'
import activeScriptReducer from '../features/ActiveScriptSlice'
import charactersReducer  from '../features/Characters'
import  TypeSliceReducer  from '../features/ScriptType'

export const store = configureStore({
    reducer: {
        activeScript: activeScriptReducer,
        scripts: scriptsReducer,
        characters: charactersReducer,
        type: TypeSliceReducer,

    }
})
