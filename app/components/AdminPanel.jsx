"use client";
import {useState} from "react";
const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const statuses={new:"Yeni",reviewing:"İnceleniyor",quoted:"Teklif Verildi",approved:"Onaylandı",completed:"Tamamlandı",cancelled:"İptal"};
async function request(path,token,options={}){
 const response=await fetch(url+"/rest/v1/"+path,{...options,headers:{apikey:key,Authorization:"Bearer "+token,...(options.body?{"Content-Type":"application/json"}:{}),...options.headers},cache:"no-store"});
 if(!response.ok)throw Error("İşlem gerçekleştirilemedi ("+response.status+").");
 return response.status===204?null:response.json();
}
export default function AdminPanel(){
 const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[token,setToken]=useState(""),[profile,setProfile]=useState(null),[quotes,setQuotes]=useState([]),[error,setError]=useState(""),[busy,setBusy]=useState(false),[filter,setFilter]=useState("all");
 const configured=Boolean(url&&key);
 const refresh=async t=>setQuotes(await request("quote_requests?select=id,branch,company,contact,items,status,internal_note,created_at,deleted_at&order=created_at.desc&limit=200",t));
 const login=async e=>{e.preventDefault();setBusy(true);setError("");try{
 const res=await fetch(url+"/auth/v1/token?grant_type=password",{method:"POST",headers:{apikey:key,"Content-Type":"application/json"},body:JSON.stringify({email,password})});
 if(!res.ok)throw Error("Giriş başarısız. E-posta veya şifrenizi kontrol edin.");
 const data=await res.json();const t=data.access_token;
 const p=await request("staff_profiles?select=role,branch,full_name&id=eq."+encodeURIComponent(data.user.id),t);
 if(!p?.length)throw Error("Bu hesaba yönetim paneli yetkisi tanımlanmamış.");
 await refresh(t);setToken(t);setProfile(p[0]);setPassword("");
 }catch(e){setError(e.message);}finally{setBusy(false);}};
 const update=async (q,patch)=>{setBusy(true);setError("");try{await request("quote_requests?id=eq."+q.id,token,{method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify(patch)});await refresh(token);}catch(e){setError(e.message);}finally{setBusy(false);}};
 const logout=()=>{setToken("");setProfile(null);setQuotes([]);setPassword("");};
 if(!configured)return <div className="container admin-shell"><h1>Güneş Metal Yönetim Paneli</h1><p>Yönetim altyapısı hazır. Güvenli girişin açılması için Supabase bağlantı ayarları henüz tanımlanmadı. Bu sayfa müşteri verisi göstermez.</p></div>;
 return <div className="container admin-shell"><span className="section-kicker">GÜNEŞ METAL / YÖNETİM</span><h1>Teklif Yönetimi</h1>{!token?<form className="admin-login" onSubmit={login}><h2>Yetkili girişi</h2><label>E-posta<input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Şifre<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}/></label><button className="button primary" disabled={busy}>Giriş yap</button></form>:<><div className="admin-toolbar"><p>{profile?.full_name||"Yetkili"} · {profile?.role==="owner"?"Ana yönetici":profile?.branch==="tuzla"?"Tuzla":"İkitelli"}</p><button type="button" onClick={()=>refresh(token).catch(e=>setError(e.message))}>Yenile</button><button type="button" onClick={logout}>Çıkış</button></div><div className="admin-toolbar"><label>Şube filtresi <select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">Tüm yetkili talepler</option><option value="tuzla">Tuzla</option><option value="ikitelli">İkitelli</option></select></label><strong>{quotes.filter(q=>filter==="all"||q.branch===filter).length} talep</strong></div><div className="admin-quotes">{quotes.filter(q=>filter==="all"||q.branch===filter).map(q=><article className="quote-card" key={q.id}><small>{new Date(q.created_at).toLocaleString("tr-TR")} · {q.branch==="tuzla"?"Tuzla":"İkitelli"} · {q.id.slice(0,8)}</small><h2>{q.company}</h2><p>İletişim: {q.contact}</p><ul>{Array.isArray(q.items)&&q.items.map((item,i)=><li key={i}>{item.subcategory||item.name} · {item.dimensions} · {item.quantity} adet</li>)}</ul><label>Durum<select disabled={busy||Boolean(q.deleted_at)} value={q.status} onChange={e=>update(q,{status:e.target.value})}>{Object.entries(statuses).map(([v,label])=><option key={v} value={v}>{label}</option>)}</select></label><label>İç not<textarea disabled={busy||Boolean(q.deleted_at)} defaultValue={q.internal_note} key={q.id+q.internal_note} onBlur={e=>{if(e.target.value!==q.internal_note)update(q,{internal_note:e.target.value.slice(0,5000)});}}/></label><button type="button" disabled={busy} onClick={()=>update(q,{deleted_at:q.deleted_at?null:new Date().toISOString()})}>{q.deleted_at?"Silme işlemini geri al":"Arşivle / sil"}</button></article>)}</div></>}{error&&<p role="alert" className="quote-feedback">{error}</p>}</div>;
}
