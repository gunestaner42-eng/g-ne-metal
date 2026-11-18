// Katalog kategorilerine ait arama etiketleri; stok veya ölçü garantisi değildir.
export const productSearchMeta={
 bakir:{group:"metal",forms:["Çubuk","Lama","Levha","Boru","Tel"],grades:["Elektrolitik bakır"],keywords:["bakır","bakir","yuvarlak","kangal"]},
 aluminyum:{group:"metal",forms:["Çubuk","Levha","Boru","Profil"],grades:["7075","6061","6082","6013","5083"],keywords:["alüminyum","aluminyum","alu","alaşım"]},
 bronz:{group:"metal",forms:["Çubuk","Burç","Döküm"],grades:["RG5","CuSn12"],keywords:["bronz","12 kalay","kalay bronz"]},
 pirinc:{group:"metal",forms:["Profil","Boru","Özel imalat"],grades:[],keywords:["pirinç","pirinc","sarı","altıköşe"]},
 "muhendislik-plastik":{group:"plastik",forms:["Çubuk","Levha","Blok"],grades:["Delrin / POM","PE1000","PE500","PTFE / Teflon","Kestamid / PA6G"],keywords:["plastik","polietilen","pom","teflon","kestamid","delrin","pa6g"]},
 "ozel-bakir-urunler":{group:"metal",forms:["Boru","Profil"],grades:["Bakır"],keywords:["özel bakır","ozel bakir","kangal","bakır boru"]},
 "kaynak-telleri":{group:"metal",forms:["Tel"],grades:[],keywords:["kaynak","lehim","sarı kaynak","gümüş"]},
 "kursun-cinko":{group:"metal",forms:["Levha"],grades:["Kurşun","Çinko"],keywords:["kurşun","kursun","çinko","cinko"]}
};
export const normalizeSearch=value=>String(value??"").toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ı/g,"i").replace(/[^a-z0-9]+/g," ").trim();
export function filterProducts(items,{search="",group="all",form="all",grade="all"}={}){
 const terms=normalizeSearch(search).split(" ").filter(Boolean);
 return items.filter(p=>{
  const m=productSearchMeta[p.slug]||{group:"metal",forms:[],grades:[],keywords:[]};
  if(group!=="all"&&m.group!==group)return false;
  if(form!=="all"&&!m.forms.includes(form))return false;
  if(grade!=="all"&&!m.grades.includes(grade))return false;
  const haystack=normalizeSearch([p.name,p.desc,p.description,p.forms,p.uses,...m.forms,...m.grades,...m.keywords].join(" "));
  return terms.every(t=>haystack.includes(t));
 });
}
