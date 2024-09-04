import { contextBridge,ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("api",{
    invoke:(channel,data)=>
    {
        return ipcRenderer.invoke(channel,data)
    }
})
