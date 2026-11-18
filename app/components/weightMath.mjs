// Saf geometrik hesaplama: tüm ölçüler mm, yoğunluk g/cm³, sonuç kg.
export function parsePositive(value){
 const raw=String(value??"").trim().replace(",",".");
 if(!/^(?:\d+\.?\d*|\.\d+)$/.test(raw))return null;
 const n=Number(raw);
 return Number.isFinite(n)&&n>0?n:null;
}
export function calculateWeight({shape,diameter,inner,width,thickness,length,quantity,density,unit="mm",copperMode}){
 const L=parsePositive(length),Q=parsePositive(quantity),R=parsePositive(density);
 if(L===null||Q===null||!Number.isSafeInteger(Q)||R===null||!["mm","m"].includes(unit))return {kg:null,error:"Boy, yoğunluk ve adet pozitif olmalı; adet tam sayı olmalıdır."};
 const D=parsePositive(diameter),I=parsePositive(inner),W=parsePositive(width),T=parsePositive(thickness);
 let area;
 if(shape==="round"||shape==="hex"){
  if(D===null)return {kg:null,error:"Çap veya anahtar ağzı sıfırdan büyük olmalıdır."};
  area=shape==="round"?Math.PI*D**2/4:Math.sqrt(3)*D**2/2;
 }else if(shape==="flat"){
  if(W===null||T===null)return {kg:null,error:"En ve kalınlık sıfırdan büyük olmalıdır."};
  area=W*T;
 }else if(shape==="tube"){
  if(D===null)return {kg:null,error:"Dış çap sıfırdan büyük olmalıdır."};
  if(copperMode==="coil"){
   if(T===null||2*T>=D)return {kg:null,error:"Et kalınlığı sıfırdan büyük ve dış çapın yarısından küçük olmalıdır."};
   const inside=D-2*T;
   area=Math.PI*(D**2-inside**2)/4;
  }else{
   if(I===null||I>=D)return {kg:null,error:"İç çap sıfırdan büyük ve dış çaptan küçük olmalıdır."};
   area=Math.PI*(D**2-I**2)/4;
  }
 }else return {kg:null,error:"Geçerli bir ürün şekli seçin."};
 const kg=area*L*(unit==="m"?1000:1)*Q*R/1e6;
 if(!Number.isFinite(kg)||kg<=0)return {kg:null,error:"Ölçüler hesaplama sınırını aşıyor."};
 return {kg,error:null};
}
