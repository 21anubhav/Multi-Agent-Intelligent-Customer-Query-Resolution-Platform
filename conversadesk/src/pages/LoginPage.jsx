import { useState } from "react";
export default function LoginPage({onLogin}) {
  const [email,setEmail]=useState("admin@company.com");
  const [pass,setPass]=useState("password");
  const [role,setRole]=useState("employee");
  const [loading,setLoading]=useState(false);
  const submit = async () => {

  try {

    setLoading(true);

    const response = await fetch(
      "http://127.0.0.1:8000/login",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: email,
          password: pass,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail || "Login failed");
      setLoading(false);
      return;
    }

    console.log(data);

    // Save user data
    localStorage.setItem(
      "user",
      JSON.stringify(data)
    );

    // Login success
    onLogin(data.role);

  } catch (error) {

    console.log(error);

    alert("Server connection error");

  } finally {

    setLoading(false);

  }
};
  return (
    <div style={{display:"flex",height:"100vh",fontFamily:"system-ui,sans-serif"}}>
      {/* Left */}
      <div style={{flex:1,background:"linear-gradient(135deg,#4338ca 0%,#6366f1 50%,#8b5cf6 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-60,left:-60,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,.06)"}} />
        <div style={{position:"absolute",bottom:-80,right:-80,width:300,height:300,borderRadius:"50%",background:"rgba(255,255,255,.04)"}} />
        <div style={{textAlign:"center",zIndex:1}}>
          <div style={{width:64,height:64,borderRadius:16,background:"rgba(255,255,255,.15)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",border:"1px solid rgba(255,255,255,.2)"}}>
            <span style={{color:"#fff",fontSize:28,fontWeight:700}}>C</span>
          </div>
          <h1 style={{color:"#fff",fontSize:28,fontWeight:700,margin:"0 0 8px"}}>ConversaDesk AI</h1>
          <p style={{color:"rgba(255,255,255,.7)",fontSize:14,margin:"0 0 40px",lineHeight:1.5}}>AI-Powered Enterprise Ticket Intelligence Platform</p>
          {["⚡ Real-time ticket intelligence","◈ AI-powered summaries & insights","📊 Enterprise analytics dashboard"].map((f,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,.1)",borderRadius:10,padding:"10px 16px",marginBottom:8,color:"rgba(255,255,255,.9)",fontSize:13,textAlign:"left",border:"1px solid rgba(255,255,255,.15)"}}>{f}</div>
          ))}
        </div>
      </div>
      {/* Right */}
      <div style={{width:480,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",padding:48}}>
        <div style={{width:"100%",maxWidth:360}}>
          <h2 style={{fontSize:24,fontWeight:700,color:"#1e293b",margin:"0 0 6px"}}>Welcome back</h2>
          <p style={{color:"#64748b",fontSize:14,margin:"0 0 28px"}}>Sign in to your ConversaDesk account</p>
          <div style={{marginBottom:16}}>
            <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:6}}>Email address</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%",border:"1px solid #e2e8f0",borderRadius:8,padding:"10px 12px",fontSize:14,outline:"none",boxSizing:"border-box"}} />
          </div>
          <div style={{marginBottom:16}}>
            <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:6}}>Password</label>
            <input type="password" value={pass} onChange={e=>setPass(e.target.value)} style={{width:"100%",border:"1px solid #e2e8f0",borderRadius:8,padding:"10px 12px",fontSize:14,outline:"none",boxSizing:"border-box"}} />
          </div>
          <div style={{marginBottom:20}}>
            <label style={{fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:8}}>Sign in as</label>
            <div style={{display:"flex",gap:10}}>
              {["employee","manager"].map(r=>(
                <button key={r} onClick={()=>setRole(r)} style={{flex:1,padding:"10px",border:`2px solid ${role===r?"#6366f1":"#e2e8f0"}`,borderRadius:8,background:role===r?"#ede9fe":"#fff",color:role===r?"#6366f1":"#64748b",cursor:"pointer",fontWeight:600,fontSize:13,textTransform:"capitalize"}}>{r}</button>
              ))}
            </div>
          </div>
          <button onClick={submit} disabled={loading} style={{width:"100%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:10,padding:"13px",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",opacity:loading?.7:1}}>
            {loading?"Signing in...":"Sign in to ConversaDesk"}
          </button>
          <p style={{textAlign:"center",fontSize:12,color:"#94a3b8",marginTop:16}}>Secured by enterprise-grade encryption</p>
        </div>
      </div>
    </div>
  );
}