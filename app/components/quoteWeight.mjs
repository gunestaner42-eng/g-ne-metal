import {calculateWeight} from "./weightMath.mjs";
const densities={bakir:8.96,pirinc:8.5,bronz:8.8,aluminyum:2.7,"muhendislik-plastik":1.41,"ozel-bakir-urunler":8.96,"kaynak-telleri":8.96,"kursun-cinko":11.34};
export function getDensity(item){
 const s=[item.subcategory,item.name].join(" ").toLocaleLowerCase("tr-TR");
 if(/6013/.test(s))return 2.72;
 if(/7075/.test(s))return 2.81;
 if(/5083/.test(s))return 2.66;
 if(/6061|6082/.test(s))return 2.70;
 if(/pe\s?1000/.test(s))return .93;
 if(/pe\s?500/.test(s))return .95;
 if(/teflon|ptfe/.test(s))return 2.17;
 if(/kestamid|pa6g/.test(s))return 1.15;
 if(/delrin|pom/.test(s))return 1.41;
 if(/çinko/.test(s))return 7.14;
 return densities[item.slug]??null;
}
const number=s=>Number(String(s).replace(",","."));
export function estimateWeight(item,quantity){
 const raw=String(item.dimensions||"").toLocaleLowerCase("tr-TR");
 const form=String(item.form||"").toLocaleLowerCase("tr-TR");
 const title=[item.name,item.subcategory,form].join(" ").toLocaleLowerCase("tr-TR");
 const density=getDensity(item);
 if(!density)return null;
 const qty=Number(quantity);
 if(!Number.isSafeInteger(qty)||qty<1)return null;
 const nums=raw.match(/\d+(?:[.,]\d+)?/g)?.map(number)||[];
 let shape=null,diameter,inner,width,thickness,length,unit="mm",copperMode;
 const lengthMatch=raw.match(/(?:boy|uzunluk)\s*[:=]?\s*(\d+(?:[.,]\d+)?)\s*(mm|m)\b/i);
 if(lengthMatch){length=number(lengthMatch[1]);unit=lengthMatch[2].toLowerCase();}
 const isTube=/boru|kangal/.test(title);
 const isHex=/altıköşe|anahtar ağzı/.test(title+" "+raw);
 const isFlat=/lama|levha|plaka/.test(title);
 const outer=raw.match(/(?:dış\s*ø?|dış\s*çap|ø)\s*(\d+(?:[.,]\d+)?)/i);
 const innerMatch=raw.match(/(?:iç\s*ø?|iç\s*çap)\s*(\d+(?:[.,]\d+)?)/i);
 const thickMatch=raw.match(/(?:et|kalınlık)\s*(\d+(?:[.,]\d+)?)/i);
 const widthMatch=raw.match(/en\s*(\d+(?:[.,]\d+)?)/i);
 if(isTube){
  shape="tube";diameter=outer?number(outer[1]):null;inner=innerMatch?number(innerMatch[1]):null;
  if(!diameter&&nums.length>=3&&/^[\d.,]+\s*[x×*]\s*[\d.,]+\s*[x×*]/.test(raw))diameter=nums[0];
  if(!length&&nums.length>=3)length=nums[2];
  if(inner){copperMode="tube";}else if(thickMatch){thickness=number(thickMatch[1]);copperMode="coil";}else return null;
 }else if(isHex){
  shape="hex";diameter=nums[0];if(!length&&nums.length===2)length=nums[1];
 }else if(isFlat){
  shape="flat";
  if(widthMatch&&thickMatch){width=number(widthMatch[1]);thickness=number(thickMatch[1]);}
  else if(nums.length===3){thickness=nums[0];width=nums[1];}
  else return null;
  if(!length&&nums.length===3)length=nums[2];
 }else{
  shape="round";diameter=outer?number(outer[1]):nums[0];if(!length&&nums.length===2)length=nums[1];
 }
 if(!length||!Number.isFinite(length))return null;
 const result=calculateWeight({shape,diameter,inner,width,thickness,length,quantity:qty,density,unit,copperMode});
 return result.kg&&Number.isFinite(result.kg)?result.kg:null;
}
