import  {configureStore} from '@reduxjs/toolkit'
import  recentScriptsReducer  from '../features/recentScripts'
import  scriptsReducer  from '../features/scriptsSlice'

export const store = configureStore({
    reducer:{
        recentScripts: recentScriptsReducer,
        scripts: scriptsReducer,

    }
})
