import {useState} from "react";
export default function App(){
const [x] = useState("ARB BOT LIVE");
return <div style={{background:"#04030a",color:"#00d4ff",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"monospace",fontSize:24}}>{x}</div>
}
