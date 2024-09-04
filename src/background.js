'use strict'
import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'


import axios from 'axios'
import open from 'open';
const path = require("path")
const movier = require("movier")
const fs = require("node:fs")
const isDevelopment = process.env.NODE_ENV !== 'production'
const imdbId =async (name)=>{
  let data = await movier.searchTitleByName(name,{exactMatch:false});
  if (data.length!=0){
  return data[0].source.sourceId
  }
  else{
    console.log(name)
    if (name.split(" ")[0]=="JoJo"){ // костыль. в базе не имеются JoJo по частям, самая первая "вбирает" в себя все остальные части
      let data = await movier.searchTitleByName("Невероятные приключения ДжоДжо",{exactMatch:false});
      if (data.length!=0){
        return data[0].source.sourceId
      }
    }
    
    return -1;
  }
}
class CustomPageProvider extends require("rutracker-api-with-proxy/lib/page-provider")
{
  getListOfFiles(id)
  {
    if (this.authorized){
    const body = new URLSearchParams();
    body.append("t",id);
    return this.request(
  {
      url:'https://rutracker.org/forum/viewtorrent.php?t=5021107',
      method:"POST",
      data:body.toString(),
      headers: {
      Cookie: this.cookie,
    }
  }
)
  .then((res)=> {
    return res.data
  })
    }
  }
}
class my_rutracker_api extends require("rutracker-api-with-proxy")
{
  pageProvider=new CustomPageProvider()
  getListOfFiles(id)
  {
    return this.pageProvider.getListOfFiles(id);
  }
}
const rutrackerapi = my_rutracker_api;
const client = new rutrackerapi()


async function rutracker_handler(event,data)
{return new Promise(function(resolve,reject){
  if (data.event == "search")
  {
    client.login({username:data.login,password:data.password})
    .then(()=>
    {
    client.search({query:data.text}).then((res)=>
    {
      resolve(res)
    })
    }
    ).catch((err)=>{
      reject("Неверный пароль или отсутствует подключение к интернету")
    })
  
  }
  else if (data.event=="getmagnet"){
    client.login({username:data.login,password:data.password})
    .then(()=>
    {
    client.getMagnetLink(data.text).then((res)=>
    {
      resolve(res)
    })
    }
    ).catch((err)=>{
      reject("Неверный пароль или отсутствует подключение к интернету")
    })
  }
  else if (data.event=="getlist"){
    client.login({username:data.login,password:data.password})
    .then(()=>
    {
    client.getListOfFiles(data.text).then((res)=>
    {
      resolve(res)
    })
    }
    ).catch((err)=>{
      reject("Неверный пароль или отсутствует подключение к интернету")
    })
  }
})
}
function open_window(event,url){
  // let win = new BrowserWindow({
  //   width: 1280,
  //   height: 1024,
  //   icon: path.join(__static, 'favicon.ico'),
  //   webPreferences: {
  //     nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
  //     contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
  //     preload: path.join(__dirname,"preload.js")
  //   }
  // })
  // win.loadURL(url.url)
  // win.setMenu(null)
  open(url.url);

}
function read_user(){
  try {
    const data = fs.readFileSync('config.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {login:"",password:""}
  }
}
function write_user(event,data){
  return client.login({username:data.login,password:data.password}).then(()=>{
    fs.writeFileSync('config.json', JSON.stringify(data));
    return;
  })
}
async function get_raw_player_html(event,name){
  const id = await imdbId(name);
  console.log(name,id)
  if (id==-1) return "Аниме отсутствует в базе";
  let res = await axios.get("https://api.alloha.tv/?token=fac0bd7232ff0009ea14c8bf3df165&imdb="+id);
  if (res.data.status!="error"){
  let data = res.data.data;
  let iframe_content; 
  if (data.seasons)
    {
      iframe_content=data["seasons"][1]["iframe"]
    }
  else
  {
    if (data.translation_iframe)iframe_content=data["translation_iframe"][Object.keys(data["translation_iframe"])[0]]["iframe"]
    else iframe_content=data["iframe"]
  }
  let html = `<html lang="ru" dir="ltr">    <head>        <meta charset="utf-8">        <title>alloha-player</title>        <meta name="description" content="alloha-player">        <style>        html, body {        	height: 100%;            width: 100%;            margin: 0px;            padding: 0px;        }        </style><meta name="robots" content="noindex,nofollow" />    </head>    <body>                <iframe src="${iframe_content}" frameborder="0" scrolling="no" allowfullscreen="" width="100%" height="100%"></iframe>                    </body></html>`

  return html
}
else{
  return "Аниме отсутствует в базе"
}
}
ipcMain.handle("write_user",write_user);
ipcMain.handle("read_user",read_user);
ipcMain.handle("rutracker",rutracker_handler);
ipcMain.handle("open_window",open_window);
ipcMain.handle("get_player",get_raw_player_html);
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])
async function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 1024,
    icon: path.join(__static, 'favicon.ico'),
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname,"preload.js")
    }
  })
  
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }
  win.setMenu(null)
}

app.on('window-all-closed', () => {
 
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
 
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})


app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
