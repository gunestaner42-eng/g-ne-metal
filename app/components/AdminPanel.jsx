"use client";
import {useEffect,useMemo,useState} from "react";
import QuotePricing from "./QuotePricing";
import OrderManagement from "./OrderManagement";
const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const statuses={new:"Yeni",reviewing:"İnceleniyor",quoted:"Teklif Verildi",approved:"Onaylandı",completed:"Tamamlandı",cancelled:"İptal"};
const branchName=v=>v==="tuzla"?"Tuzla":"İkitelli";
const dateText=v=>new Date(v).toLocaleString("tr-TR",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
async function request(path,token,options={}){
 const response=await fetch(url+"/rest/v1/"+path,{...options,headers:{apikey:key,Authorization:"Bearer "+token,...(options.body?{"Content-Type":"application/json"}:{}),...options.headers},cache:"no-store"});
 if(!response.ok)throw Error(response.status===401?"Oturum süresi dolmuş olabilir. Yeniden giriş yapın.":"İşlem gerçekleştirilemedi ("+response.status+").");
 return response.status===204?null:response.json();
}
function exportCsv(rows){
 const cols=["Teklif No","Tarih","Şube","Firma","İletişim","Ürün Sayısı","Durum","İç Not","Arşiv"];
 const clean=x=>'"'+String(x??"").replace(/"/g,'""')+'"';
 const data=rows.map(q=>[q.id,dateText(q.created_at),branchName(q.branch),q.company,q.contact,Array.isArray(q.items)?q.items.length:0,statuses[q.status]||q.status,q.internal_note,q.deleted_at?"Evet":"Hayır"]);
 const csv="\uFEFF"+[cols,...data].map(row=>row.map(clean).join(";")).join("\r\n");
 const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});const href=URL.createObjectURL(blob);const a=document.createElement("a");a.href=href;a.download="gunes-metal-teklifler.csv";a.click();URL.revokeObjectURL(href);
}
export default function AdminPanel(){
 const [pricing,setPricing]=useState(null);
 const [remember,setRemember]=useState(false),[restoring,setRestoring]=useState(true);
 const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[token,setToken]=useState(""),[profile,setProfile]=useState(null),[quotes,setQuotes]=useState([]),[error,setError]=useState(""),[busy,setBusy]=useState(false),[filter,setFilter]=useState("all"),[statusFilter,setStatusFilter]=useState("all"),[search,setSearch]=useState(""),[tab,setTab]=useState("overview"),[selected,setSelected]=useState(null),[note,setNote]=useState("");
 const configured=Boolean(url&&key);
 useEffect(()=>{let alive=true;async function restore(){
  try{
   const persistent=localStorage.getItem("gm-admin-session");
   const raw=persistent||sessionStorage.getItem("gm-admin-session");
   if(!raw)return;
   const saved=JSON.parse(raw);
   if(!saved.refresh_token)return;
   const res=await fetch(url+"/auth/v1/token?grant_type=refresh_token",{method:"POST",headers:{apikey:key,"Content-Type":"application/json"},body:JSON.stringify({refresh_token:saved.refresh_token})});
   if(!res.ok)throw Error("Oturum yenilenemedi.");
   const data=await res.json();
   const p=await request("staff_profiles?select=role,branch,full_name&id=eq."+encodeURIComponent(data.user.id),data.access_token);
   if(!p?.length)throw Error("Yetkisiz kullanıcı.");
   const rows=await request("quote_requests?select=id,branch,company,contact,items,status,internal_note,created_at,deleted_at&order=created_at.desc&limit=200",data.access_token);
   if(!alive)return;
   const store=persistent?localStorage:sessionStorage;
   store.setItem("gm-admin-session",JSON.stringify({refresh_token:data.refresh_token}));
   setRemember(Boolean(persistent));setToken(data.access_token);setProfile(p[0]);setQuotes(rows);
  }catch{localStorage.removeItem("gm-admin-session");sessionStorage.removeItem("gm-admin-session");}
  finally{if(alive)setRestoring(false);}
 }if(configured)restore();else setRestoring(false);return()=>{alive=false};},[configured]);
 useEffect(()=>{if(!token)return;const id=setInterval(async()=>{try{
  const store=localStorage.getItem("gm-admin-session")?localStorage:sessionStorage;
  const saved=JSON.parse(store.getItem("gm-admin-session")||"null");if(!saved?.refresh_token)return;
  const res=await fetch(url+"/auth/v1/token?grant_type=refresh_token",{method:"POST",headers:{apikey:key,"Content-Type":"application/json"},body:JSON.stringify({refresh_token:saved.refresh_token})});
  if(!res.ok)throw Error("Oturum yenilenemedi.");
  const data=await res.json();store.setItem("gm-admin-session",JSON.stringify({refresh_token:data.refresh_token}));setToken(data.access_token);
 }catch{setToken("");setProfile(null);setQuotes([]);localStorage.removeItem("gm-admin-session");sessionStorage.removeItem("gm-admin-session");}},40*60*1000);return()=>clearInterval(id);},[token]);
 const refresh=async t=>setQuotes(await request("quote_requests?select=id,branch,company,contact,items,status,internal_note,created_at,deleted_at&order=created_at.desc&limit=200",t));
 const login=async e=>{e.preventDefault();setBusy(true);setError("");try{
 const res=await fetch(url+"/auth/v1/token?grant_type=password",{method:"POST",headers:{apikey:key,"Content-Type":"application/json"},body:JSON.stringify({email,password})});
 if(!res.ok)throw Error("Giriş başarısız. E-posta veya şifrenizi kontrol edin.");
 const data=await res.json();const t=data.access_token;
 const p=await request("staff_profiles?select=role,branch,full_name&id=eq."+encodeURIComponent(data.user.id),t);
 if(!p?.length)throw Error("Bu hesaba yönetim paneli yetkisi tanımlanmamış.");
 await refresh(t);localStorage.removeItem("gm-admin-session");sessionStorage.removeItem("gm-admin-session");(remember?localStorage:sessionStorage).setItem("gm-admin-session",JSON.stringify({refresh_token:data.refresh_token}));setToken(t);setProfile(p[0]);setPassword("");
 }catch(e){setError(e.message);}finally{setBusy(false);}};
 const update=async (q,patch)=>{setBusy(true);setError("");try{await request("quote_requests?id=eq."+q.id,token,{method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify(patch)});await refresh(token);setSelected(old=>old?.id===q.id?{...old,...patch}:old);}catch(e){setError(e.message);}finally{setBusy(false);}};
 const logout=()=>{localStorage.removeItem("gm-admin-session");sessionStorage.removeItem("gm-admin-session");setToken("");setProfile(null);setQuotes([]);setSelected(null);setPassword("");};
 const isOwner=profile?.role==="owner";
 const scoped=useMemo(()=>quotes.filter(q=>filter==="all"||q.branch===filter),[quotes,filter]);
 const active=scoped.filter(q=>!q.deleted_at);
 const stats={total:active.length,new:active.filter(q=>q.status==="new").length,progress:active.filter(q=>q.status==="reviewing").length,quoted:active.filter(q=>q.status==="quoted").length,completed:active.filter(q=>q.status==="completed").length};
 const visible=useMemo(()=>scoped.filter(q=>{
  if(tab==="archive"?!q.deleted_at:!!q.deleted_at)return false;
  if(statusFilter!=="all"&&q.status!==statusFilter)return false;
  const term=search.trim().toLocaleLowerCase("tr-TR");
  return !term||[q.company,q.contact,q.id,branchName(q.branch),...(Array.isArray(q.items)?q.items.map(i=>[i.name,i.subcategory,i.dimensions].join(" ")):[])].join(" ").toLocaleLowerCase("tr-TR").includes(term);
 }),[scoped,tab,statusFilter,search]);
 const open=q=>{setSelected(q);setNote(q.internal_note||"");};
 if(!configured)return <div className="container admin-shell"><h1>Güneş Metal Yönetim Paneli</h1><p>Güvenli girişin açılması için Supabase bağlantı ayarları henüz tanımlanmadı.</p></div>;
 if(restoring)return <div className="admin-auth"><p>Güvenli oturum kontrol ediliyor...</p></div>;
 if(!token)return <div className="admin-auth"><div className="admin-auth-brand"><span>GM</span><strong>GÜNEŞ METAL</strong><small>YÖNETİM SİSTEMİ</small></div><form className="admin-login" onSubmit={login}><span className="section-kicker">YETKİLİ ERİŞİMİ</span><h1>Hoş geldiniz</h1><p>Teklif ve şube yönetimi için hesabınıza giriş yapın.</p><label>E-posta<input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Şifre<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}/></label><label className="admin-remember"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/> Oturumu açık tut (bu cihazda)</label><button className="admin-main-btn" disabled={busy}>{busy?"Giriş yapılıyor...":"Giriş Yap →"}</button>{error&&<p role="alert" className="admin-error">{error}</p>}</form></div>;
 return <div className="admin-app">
  <aside className="admin-sidebar"><div className="admin-logo"><span>GM</span><div><strong>GÜNEŞ METAL</strong><small>YÖNETİM PANELİ</small></div></div><p className="admin-nav-label">ÇALIŞMA ALANI</p><nav aria-label="Yönetim menüsü"><button className={tab==="overview"?"active":""} onClick={()=>{setTab("overview");setStatusFilter("all");}}>▦ <span>Genel Bakış</span></button><button className={tab==="requests"?"active":""} onClick={()=>{setTab("requests");setStatusFilter("all");}}>▤ <span>Teklif Talepleri</span><em>{active.length}</em></button><button className={tab==="orders"?"active":""} onClick={()=>setTab("orders")}>▣ <span>Sipariş ve Sevkiyat</span></button><button className={tab==="archive"?"active":""} onClick={()=>{setTab("archive");setStatusFilter("all");}}>▧ <span>Arşiv</span></button></nav><div className="admin-sidebar-bottom"><span className="admin-live-dot"/> Güvenli yönetim alanı <small>Güneş Metal © {new Date().getFullYear()}</small></div></aside>
  <div className="admin-workspace"><header className="admin-topbar"><div><span className="admin-top-eyebrow">GÜNEŞ METAL / {tab==="overview"?"GENEL BAKIŞ":tab==="requests"?"TEKLİF TALEPLERİ":tab==="orders"?"SİPARİŞ VE SEVKİYAT":"ARŞİV"}</span><strong>{isOwner?"Tüm Şubeler":branchName(profile.branch)} Yönetimi</strong></div><div className="admin-top-actions"><button onClick={()=>refresh(token).catch(e=>setError(e.message))} disabled={busy}>↻ Yenile</button><span className="admin-avatar">{(profile?.full_name||"Y").slice(0,1).toLocaleUpperCase("tr-TR")}</span><div className="admin-user"><strong>{profile?.full_name||"Yetkili"}</strong><small>{isOwner?"Ana Yönetici":branchName(profile.branch)+" Yetkilisi"}</small></div><button onClick={logout}>Çıkış</button></div></header>
   <main className="admin-content">{tab==="orders"?<OrderManagement token={token} profile={profile} quotes={quotes}/>:<><div className="admin-heading"><div><span className="section-kicker">OPERASYON MERKEZİ</span><h1>{tab==="overview"?"Genel Bakış":tab==="requests"?"Teklif Talepleri":"Teklif Arşivi"}</h1><p>{tab==="overview"?"Şubelerin teklif süreçlerini tek ekrandan takip edin.":tab==="requests"?"Müşteri taleplerini inceleyin ve süreçleri yönetin.":"Arşivlenen talepleri görüntüleyin veya geri alın."}</p></div><div className="admin-heading-actions"><button onClick={()=>exportCsv(visible)}>↓ CSV İndir</button></div></div>
   {tab==="overview"&&<><div className="admin-stat-grid">{[{label:"Toplam Aktif Talep",value:stats.total,icon:"▤",hint:"Arşiv hariç"},{label:"Yeni Talepler",value:stats.new,icon:"✦",hint:"İşlem bekliyor"},{label:"İncelenen",value:stats.progress,icon:"◷",hint:"Değerlendirme aşamasında"},{label:"Teklif Verilen",value:stats.quoted,icon:"↗",hint:"Müşteriye dönüş yapıldı"},{label:"Tamamlanan",value:stats.completed,icon:"✓",hint:"Süreci sonuçlanan"}].map(x=><div className="admin-stat" key={x.label}><div className="admin-stat-top"><span>{x.label}</span><b>{x.icon}</b></div><strong>{x.value}</strong><small>{x.hint}</small></div>)}</div><div className="admin-insight-grid"><section className="admin-panel"><div className="admin-panel-head"><h2>Şube Dağılımı</h2><small>Aktif talepler</small></div>{["tuzla","ikitelli"].filter(b=>isOwner||profile.branch===b).map(b=>{const count=active.filter(q=>q.branch===b).length;return <div className="admin-branch-line" key={b}><div><strong>{branchName(b)}</strong><span>{count} talep</span></div><div className="admin-bar"><span style={{width:stats.total?count/stats.total*100+"%":"0%"}}/></div></div>})}</section><section className="admin-panel"><div className="admin-panel-head"><h2>İş Akışı</h2><small>Durum özeti</small></div>{Object.entries(statuses).map(([k,v])=><div className="admin-status-line" key={k}><span className={"admin-status status-"+k}>{v}</span><strong>{active.filter(q=>q.status===k).length}</strong></div>)}</section></div></>}
   <section className="admin-panel admin-table-panel"><div className="admin-panel-head"><div><h2>{tab==="overview"?"Son Teklif Talepleri":tab==="requests"?"Tüm Teklif Talepleri":"Arşivlenen Talepler"}</h2><small>{visible.length} kayıt listeleniyor · Son 200 kayıt sorgulanır</small></div>{tab==="overview"&&<button className="admin-link" onClick={()=>setTab("requests")}>Tümünü Gör →</button>}</div><div className="admin-filters"><input aria-label="Teklif ara" placeholder="Firma, telefon, ürün veya teklif numarası ara..." value={search} onChange={e=>setSearch(e.target.value)}/><select aria-label="Şube" value={filter} onChange={e=>setFilter(e.target.value)}>{isOwner&&<option value="all">Tüm Şubeler</option>}<option value="tuzla" disabled={!isOwner&&profile.branch!=="tuzla"}>Tuzla</option><option value="ikitelli" disabled={!isOwner&&profile.branch!=="ikitelli"}>İkitelli</option></select><select aria-label="Durum" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="all">Tüm Durumlar</option>{Object.entries(statuses).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></div>
   {visible.length?<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>TEKLİF / TARİH</th><th>FİRMA / İLETİŞİM</th><th>ŞUBE</th><th>ÜRÜN</th><th>DURUM</th><th>İŞLEM</th></tr></thead><tbody>{(tab==="overview"?visible.slice(0,8):visible).map(q=><tr key={q.id}><td><strong>#{q.id.slice(0,8).toUpperCase()}</strong><small>{dateText(q.created_at)}</small></td><td><strong>{q.company}</strong><small>{q.contact}</small></td><td>{branchName(q.branch)}</td><td>{Array.isArray(q.items)?q.items.length:0} kalem</td><td><span className={"admin-status status-"+q.status}>{statuses[q.status]||q.status}</span></td><td><button className="admin-detail-btn" onClick={()=>open(q)}>Detay →</button></td></tr>)}</tbody></table></div>:<div className="admin-empty"><div>▤</div><h3>{search||statusFilter!=="all"?"Aramanıza uygun teklif bulunamadı":tab==="archive"?"Arşivde henüz teklif yok":"Henüz teklif talebi bulunmuyor"}</h3><p>{tab==="archive"?"Arşivlenen teklifler burada listelenir.":"Müşterilerin teklifleri veritabanına kaydedildiğinde burada görüntülenecek."}</p></div>}</section>
   {error&&<p className="admin-error" role="alert">{error}</p>}<p className="admin-disclaimer">Not: WhatsApp/e-posta teklifleri henüz otomatik kaydedilmiyor. Bu panel yalnızca veritabanına kaydedilen talepleri gösterir.</p></>}</main>
  </div>
  {pricing&&<div className="admin-modal-backdrop admin-pricing-overlay" onClick={()=>setPricing(null)}><section className="admin-detail" role="dialog" aria-modal="true" aria-label="Fiyat teklifi hazırlama" onClick={e=>e.stopPropagation()}><QuotePricing quote={pricing} token={token} onClose={()=>setPricing(null)}/></section></div>}
  {selected&&<div className="admin-modal-backdrop" onClick={()=>setSelected(null)}><section className="admin-detail" role="dialog" aria-modal="true" aria-label="Teklif detayı" onClick={e=>e.stopPropagation()}><header><div><small>TEKLİF DETAYI</small><h2>#{selected.id.slice(0,8).toUpperCase()}</h2></div><button onClick={()=>setSelected(null)} aria-label="Kapat">✕</button></header><div className="admin-detail-body"><div className="admin-detail-meta"><div><small>FİRMA</small><strong>{selected.company}</strong></div><div><small>ŞUBE</small><strong>{branchName(selected.branch)}</strong></div><div><small>İLETİŞİM</small><strong>{selected.contact}</strong></div><div><small>TALEP TARİHİ</small><strong>{dateText(selected.created_at)}</strong></div></div><h3>Talep Edilen Ürünler</h3>{Array.isArray(selected.items)&&selected.items.map((item,i)=><div className="admin-product" key={i}><strong>{i+1}. {item.subcategory||item.name}</strong><span>{item.name} · {item.dimensions} · {item.quantity} adet</span>{item.form&&<small>Form: {item.form}</small>}{item.notes&&<small>Not: {item.notes}</small>}</div>)}<label>Teklif Durumu<select disabled={busy||!!selected.deleted_at} value={selected.status} onChange={e=>update(selected,{status:e.target.value})}>{Object.entries(statuses).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select></label><label>İç Not<textarea rows={4} maxLength={5000} value={note} disabled={busy||!!selected.deleted_at} onChange={e=>setNote(e.target.value)} placeholder="Bu talep hakkında şube içi notlar..."/></label><div className="admin-detail-actions"><button type="button" onClick={()=>setPricing(selected)}>Fiyat Teklifi Hazırla</button><button disabled={busy||!!selected.deleted_at||note===selected.internal_note} onClick={()=>update(selected,{internal_note:note})}>Notu Kaydet</button><button disabled={busy} className="admin-danger-btn" onClick={()=>{if(selected.deleted_at||window.confirm("Bu teklif arşive taşınsın mı?"))update(selected,{deleted_at:selected.deleted_at?null:new Date().toISOString()});}}>{selected.deleted_at?"Arşivden Geri Al":"Arşive Taşı"}</button></div></div></section></div>}
 </div>;
}
