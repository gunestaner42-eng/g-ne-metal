"use client";
import {useEffect,useRef,useState} from "react";
export default function WhatsAppWidget(){
 const [open,setOpen]=useState(false);
 const ref=useRef(null);
 useEffect(()=>{if(!open)return;const onKey=e=>{if(e.key==="Escape")setOpen(false)};const onPointer=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};document.addEventListener("keydown",onKey);document.addEventListener("pointerdown",onPointer);return()=>{document.removeEventListener("keydown",onKey);document.removeEventListener("pointerdown",onPointer)}},[open]);
 return <div className="wa-floating" ref={ref}>
 {open&&<div className="wa-floating-panel" id="wa-branch-panel" role="group" aria-label="WhatsApp şube seçimi"><div className="wa-floating-heading"><strong>WhatsApp ile iletişim</strong><button type="button" onClick={()=>setOpen(false)} aria-label="Pencereyi kapat">×</button></div><p>Görüşmek istediğiniz şubeyi seçin.</p><a href="https://wa.me/905330186924" target="_blank" rel="noopener noreferrer" onClick={()=>setOpen(false)}>Tuzla Şubesi <span>↗</span></a><a href="https://wa.me/905395986558" target="_blank" rel="noopener noreferrer" onClick={()=>setOpen(false)}>İkitelli Şubesi <span>↗</span></a></div>}
 <button className="wa-floating-trigger" type="button" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-controls="wa-branch-panel" aria-label={open?"WhatsApp şube seçimini kapat":"WhatsApp şubesi seç"} title="WhatsApp ile iletişime geç">
 <svg viewBox="0 0 32 32" width="31" height="31" fill="currentColor" aria-hidden="true"><path d="M16 .8A15.15 15.15 0 0 0 3 23.8L.8 31.2l7.6-2A15.2 15.2 0 1 0 16 .8Zm0 27.5a12.2 12.2 0 0 1-6.2-1.7l-.45-.27-4.5 1.18 1.2-4.4-.3-.47A12.25 12.25 0 1 1 16 28.3Zm6.72-9.17c-.36-.18-2.13-1.05-2.46-1.17-.33-.12-.57-.18-.81.18-.24.36-.93 1.17-1.14 1.41-.21.24-.42.27-.78.09-.36-.18-1.52-.56-2.89-1.78-1.07-.96-1.79-2.14-2-2.5-.21-.36-.02-.55.16-.73.16-.16.36-.42.54-.63.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.81-1.95-1.11-2.67-.29-.7-.59-.6-.81-.61h-.69c-.24 0-.63.09-.96.45s-1.26 1.23-1.26 3 1.29 3.48 1.47 3.72c.18.24 2.54 3.87 6.15 5.43.86.37 1.53.59 2.05.75.86.27 1.64.23 2.26.14.69-.1 2.13-.87 2.43-1.71.3-.84.3-1.56.21-1.71-.09-.15-.33-.24-.69-.42Z"/></svg>
 </button></div>;
}
