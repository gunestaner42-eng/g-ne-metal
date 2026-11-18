import {NextResponse} from "next/server";
import {createHash} from "node:crypto";
export const runtime="nodejs";
const url=process.env.SUPABASE_URL||process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret=process.env.SUPABASE_SERVICE_ROLE_KEY;
const turnstile=process.env.TURNSTILE_SECRET_KEY;
const allowedBranches=new Set(["tuzla","ikitelli"]);
const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validContact(s){const digits=s.replace(/\D/g,"");return email.test(s)||(/^[+\d\s()-]+$/.test(s)&&digits.length>=10&&digits.length<=15);}
function fail(message,status=400){return NextResponse.json({error:message},{status,headers:{"Cache-Control":"no-store"}});}
export async function POST(request){
 if(!url||!secret||!turnstile)return fail("Teklif kayıt sistemi henüz yapılandırılmadı.",503);
 const origin=request.headers.get("origin");
 const expected=new URL(request.url).origin;
 if(!origin||origin!==expected)return fail("Geçersiz istek kaynağı.",403);
 const type=request.headers.get("content-type")||"";
 if(!type.includes("application/json"))return fail("JSON gerekli.",415);
 const size=Number(request.headers.get("content-length")||0);
 if(size>25000)return fail("Talep çok büyük.",413);
 let data;try{data=await request.json();}catch{return fail("Geçersiz JSON.");}
 const {branch,company,contact,items,turnstileToken,website}=data||{};
 if(website)return fail("Talep reddedildi.");
 if(!allowedBranches.has(branch)||typeof company!=="string"||!company.trim()||company.trim().length>120||typeof contact!=="string"||contact.trim().length>120||!validContact(contact.trim())||!Array.isArray(items)||items.length<1||items.length>50)return fail("Firma, iletişim veya ürün bilgileri geçersiz.");
 const clean=s=>typeof s==="string"?s.trim():"";
 const sanitized=[];
 for(const x of items){
  if(!x||typeof x!=="object"||!clean(x.name)||clean(x.name).length>120||!clean(x.dimensions)||clean(x.dimensions).length>180||!Number.isSafeInteger(x.quantity)||x.quantity<1||x.quantity>1000000||["slug","subcategory","form","notes"].some(k=>clean(x[k]).length>(k==="notes"?350:120)))return fail("Ürün bilgileri geçersiz.");
  sanitized.push({slug:clean(x.slug),name:clean(x.name),subcategory:clean(x.subcategory),form:clean(x.form),dimensions:clean(x.dimensions),quantity:x.quantity,notes:clean(x.notes)});
 }
 if(typeof turnstileToken!=="string"||turnstileToken.length<10||turnstileToken.length>2048)return fail("Güvenlik doğrulaması gerekli.");
 const verify=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({secret:turnstile,response:turnstileToken,remoteip:request.headers.get("cf-connecting-ip")||""}),cache:"no-store"}).catch(()=>null);
 if(!verify?.ok)return fail("Güvenlik doğrulaması şu anda kullanılamıyor.",503);
 const result=await verify.json().catch(()=>({success:false}));
 if(!result.success)return fail("Güvenlik doğrulaması başarısız. Yeniden deneyin.",403);
 const fingerprint=createHash("sha256").update(JSON.stringify({branch,company:company.trim(),contact:contact.trim(),items:sanitized})).digest("hex");
 // Duplicate requests in a short window can be checked in DB with a unique request fingerprint.
 const response=await fetch(url+"/rest/v1/quote_requests",{method:"POST",headers:{apikey:secret,Authorization:"Bearer "+secret,"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify({branch,company:company.trim(),contact:contact.trim(),items:sanitized,request_fingerprint:fingerprint}),cache:"no-store"}).catch(()=>null);
 if(!response)return fail("Kayıt servisine ulaşılamadı.",503);
 if(response.status===409)return fail("Bu teklif talebi zaten kaydedilmiş. Yeni talep için bilgileri güncelleyin.",409);
 if(!response.ok)return fail("Talep kaydedilemedi. Lütfen tekrar deneyin.",502);
 const rows=await response.json();return NextResponse.json({id:rows[0].id},{status:201,headers:{"Cache-Control":"no-store"}});
}
