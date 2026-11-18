"use client";
import {useMemo,useState} from "react";
import {calculateWeight} from "./weightMath.mjs";
import {useQuoteCart} from "./QuoteCartContext";
const materials={
bakir:{name:"Bakır",density:8.96},pirinc:{name:"Pirinç",density:8.5},
bronz:{name:"Bronz",density:8.8},aluminyum:{name:"Alüminyum",density:2.7},
"muhendislik-plastik":{name:"Mühendislik plastik",density:1.41},
"ozel-bakir-urunler":{name:"Özel bakır",density:8.96},
"kaynak-telleri":{name:"Kaynak teli (bakır varsayımı)",density:8.96},
"kursun-cinko":{name:"Kurşun",density:11.34}
};
const variants={
bakir:[["Elektrolitik bakır",8.96]],
"ozel-bakir-urunler":[["Bakır",8.96]],
aluminyum:[["Alüminyum (genel)",2.70],["Alüminyum 7075",2.81],["Alüminyum 6061",2.70],["Alüminyum 6082",2.70],["Alüminyum 6013",2.72],["Alüminyum 5083",2.66]],
bronz:[["Bronz (genel)",8.80],["12 kalay bronz (CuSn12)",8.80],["RG5 / CuSn5Zn5Pb5",8.80]],
pirinc:[["Pirinç (genel)",8.50]],
"muhendislik-plastik":[["Delrin / POM",1.41],["PE1000",0.93],["PE500",0.95],["PTFE / Teflon",2.17],["Kestamid / PA6G",1.15]],
"kaynak-telleri":[["Sarı kaynak çubuğu (yoğunluk teyit edilmeli)",8.50]],
"kursun-cinko":[["Kurşun",11.34],["Çinko",7.14]]
};
const aluminumShapes={
"Alüminyum 7075":["round","flat"],
"Alüminyum 6082":["round","flat"],
"Alüminyum 6013":["round","tube","flat","hex"],
"Alüminyum 5083":["flat"],
"Alüminyum 6061":["round","tube","flat","hex"]
};
const fmt=n=>new Intl.NumberFormat("tr-TR",{maximumFractionDigits:3}).format(n);
function ShapeDiagram({shape,copperMode,unit}){
const title={round:"Yuvarlak çubuk",tube:copperMode==="coil"?"Kangal boru (kesit)":"Boru",flat:"Lama / levha",hex:"Altıköşe"}[shape];
return <div className="weight-diagram"><div className="weight-diagram-title"><strong>{title}</strong><small>ÖLÇÜ KILAVUZU · ŞEMATİK</small></div><svg viewBox="0 0 340 190" role="img" aria-label={title+" ölçü şeması"} xmlns="http://www.w3.org/2000/svg">
<g stroke="#38352F" strokeWidth="1.7" strokeLinejoin="round" fill="#E7D9BB">
{shape==="flat"?<><path d="M65 75 L215 35 L275 65 L125 105 Z" fill="#F3EBDD"/><path d="M65 75 L125 105 L125 125 L65 95 Z"/><path d="M125 105 L275 65 L275 85 L125 125 Z" fill="#C5AE7D"/></>:shape==="hex"?<><path d="M80 67 L105 52 L130 67 L130 97 L105 112 L80 97 Z M105 52 L240 20 L265 35 L130 67 M265 35 L265 65 L130 97 M265 65 L240 80 L105 112" fill="#DDCBA5"/><path d="M80 67 L105 52 L130 67 L130 97 L105 112 L80 97 Z" fill="#F3EBDD"/></>:<><path d="M85 56 L245 56 A24 39 0 0 1 245 134 L85 134 Z" fill="#DDCBA5"/><ellipse cx="85" cy="95" rx="24" ry="39" fill="#F3EBDD"/>{shape==="tube"&&<ellipse cx="85" cy="95" rx="15" ry="25" fill="#FFFFFF"/>}</>}
</g>
<g fill="none" stroke="#765B2C" strokeWidth="1.3" strokeLinecap="round">
{shape==="flat"?<><path d="M60 64 L120 94 M60 64 l9 1 m-9 -1 l5 8 M120 94 l-9 -1 m9 1 l-5 -8"/><path d="M289 65 V85 m0 -20 l-4 6 m4 -6 l4 6 m-4 14 l-4 -6 m4 6 l4 -6"/><path d="M125 143 L275 101 m-150 42 l7 -6 m-7 6 l9 1 m141 -43 l-7 6 m7 -6 l-9 -1"/></>:shape==="hex"?<><path d="M67 67 V97 m0 -30 l-4 6 m4 -6 l4 6 m-4 24 l-4 -6 m4 6 l4 -6"/><path d="M105 134 L240 102 m-135 32 l7 -6 m-7 6 l9 1 m126 -33 l-7 6 m7 -6 l-9 -1"/></>:<><path d="M48 56 V134 m0 -78 l-4 7 m4 -7 l4 7 m-4 71 l-4 -7 m4 7 l4 -7 M85 151 H245 m-160 0 l7 -4 m-7 4 l7 4 m153 -4 l-7 -4 m7 4 l-7 4"/>{shape==="tube"&&(copperMode==="coil"?<path d="M85 56 V70 L125 24 H155"/>:<path d="M85 70 V120 m0 -50 l-4 6 m4 -6 l4 6 m-4 44 l-4 -6 m4 6 l4 -6 M100 95 H144"/>)}</>}
</g><g fill="#765B2C" fontSize="11" fontWeight="700" fontFamily="Arial,sans-serif">
{shape==="flat"?<><text x="77" y="62">En</text><text x="297" y="79">Et</text><text x="179" y="145">Boy ({unit})</text></>:shape==="hex"?<><text x="59" y="57" textAnchor="middle">AF</text><text x="147" y="145">Boy ({unit})</text></>:<><text x="40" y="100" textAnchor="end">Ø D</text><text x="165" y="169" textAnchor="middle">Boy ({unit})</text>{shape==="tube"&&(copperMode==="coil"?<text x="158" y="27">Et kalınlığı</text>:<text x="147" y="98">Ø İç</text>)}</>}
</g></svg><p>{shape==="hex"?"AF: Karşılıklı düz yüzeyler arası mesafe (mm).":shape==="flat"?"En ve kalınlık (Et): mm.":shape==="tube"?(copperMode==="coil"?"Ø D: dış çap; et kalınlığı: mm.":"Ø D: dış çap; Ø İç: iç çap. Her ikisi mm."):"Ø D: dış çap (mm)."} Çizim ölçekli değildir.</p></div>;
}

export default function WeightCalculator({slug,productName,initialVariant,copperMode}){
const {add}=useQuoteCart();
const [cartFeedback,setCartFeedback]=useState("");
const defaults=materials[slug]||materials.bakir;
const options=variants[slug]||[[defaults.name,defaults.density]];
const selected=options.find(v=>v[0]===initialVariant)||options[0];
const [variant,setVariant]=useState(selected[0]);
const [density,setDensity]=useState(String(selected[1]));
const [unit,setUnit]=useState(copperMode==="coil"?"m":"mm");
const chooseVariant=name=>{setVariant(name);const found=options.find(v=>v[0]===name);if(found)setDensity(String(found[1]));setShape(copperMode==="coil"||copperMode==="tube"?"tube":copperMode==="flat"?"flat":(aluminumShapes[name]||["round"])[0]);};
const availableShapes=slug==="kaynak-telleri"?["round"]:slug==="muhendislik-plastik"?["round","flat"]:copperMode?[copperMode==="coil"||copperMode==="tube"?"tube":copperMode==="flat"?"flat":"round"]:slug==="aluminyum"?(aluminumShapes[variant]||["round","tube","flat","hex"]):["round","tube","flat","hex"];
const [shape,setShape]=useState(copperMode==="coil"||copperMode==="tube"?"tube":copperMode==="flat"?"flat":(aluminumShapes[selected[0]]||["round"])[0]);
const [diameter,setDiameter]=useState(copperMode==="coil"?"10":"50");
const [inner,setInner]=useState("30");
const [width,setWidth]=useState("50");
const [thickness,setThickness]=useState(copperMode==="coil"?"1":"10");
const [length,setLength]=useState(copperMode==="coil"?"100":"1000");
const [quantity,setQuantity]=useState("1");
const [offerOpen,setOfferOpen]=useState(false);
const calculation=useMemo(()=>calculateWeight({shape,diameter,inner,width,thickness,length,quantity,density,unit,copperMode}),[shape,diameter,inner,width,thickness,length,quantity,density,unit,copperMode]);
const result=calculation.kg;
const input=(label,value,setter)=><label className="weight-field"><span>{label}</span><input type="number" inputMode="decimal" min="0" step={label.includes("Adet")?"1":"any"} value={value} onChange={e=>setter(e.target.value)} /></label>;
const mailSubject=encodeURIComponent(productName+" ağırlık ve fiyat teklifi");
const mailBody=encodeURIComponent("Ürün: "+productName+"\nMalzeme kalitesi: "+variant+"\nŞekil: "+(copperMode==="coil"?"Kangal bakır boru":({round:"Yuvarlak çubuk",tube:"Boru",flat:slug==="muhendislik-plastik"?"Levha":"Lama / levha",hex:"Altıköşe"}[shape]))+"\nYoğunluk: "+density+" g/cm³\nÇap: "+diameter+" mm\nİç çap: "+inner+" mm\nEn: "+width+" mm\nKalınlık: "+thickness+" mm\nBoy: "+length+" "+unit+"\nAdet: "+quantity+"\nTahmini ağırlık: "+(result===null?"Hesaplanamadı":fmt(result)+" kg")+"\n\nFiyat ve stok bilgisi rica ederim.");
const offerMail=(address)=>"mailto:"+address+"?subject="+mailSubject+"&body="+mailBody;
return <section className="weight-section" aria-label="Ağırlık hesaplayıcı"><div className="container"><div className="weight-head"><span className="section-kicker">TEKNİK HESAPLAMA</span><h2>Otomatik kilogram hesaplama</h2><p>Çap ve kesit ölçüleri mm; uzunluk mm veya metre olabilir. {copperMode==="coil"?"Kangal bakır boru için dış çap ve et kalınlığını mm, toplam uzunluğu metre olarak girin.":copperMode==="rod"?"Yuvarlak bakır çubuk için çapı ve kesim boyunu girin.":copperMode==="flat"?"Bakır lama için en, kalınlık, boy ve adet girin.":slug==="kaynak-telleri"?"Sarı kaynak çubuğu için çap, boy ve adet girin. Yoğunluk alaşıma göre değişir; doğru değer için teknik belgeyi kontrol edin.":"Ölçüleri girerek teorik ağırlığı hesaplayın."}</p></div><div className="weight-panel"><div className="weight-fields"><ShapeDiagram shape={shape} copperMode={copperMode} unit={unit}/><label className="weight-field"><span>Malzeme kalitesi</span><select value={variant} onChange={e=>chooseVariant(e.target.value)}>{options.map(([name])=><option key={name} value={name}>{name}</option>)}</select></label>{!copperMode&&<label className="weight-field"><span>Ürün şekli</span><select value={shape} onChange={e=>setShape(e.target.value)}>{availableShapes.includes("round")&&<option value="round">{slug==="bakir"?"Yuvarlak bakır çubuk":slug==="kaynak-telleri"?"Yuvarlak kaynak çubuğu":"Yuvarlak çubuk"}</option>}{availableShapes.includes("tube")&&<option value="tube">Boru</option>}{availableShapes.includes("flat")&&<option value="flat">{slug==="aluminyum"&&["Alüminyum 7075","Alüminyum 6082","Alüminyum 5083"].includes(variant)?"Levha":slug==="muhendislik-plastik"?"Levha":"Lama / levha"}</option>}{availableShapes.includes("hex")&&<option value="hex">Altıköşe çubuk (anahtar ağzı)</option>}</select></label>}{input("Yoğunluk (g/cm³)",density,setDensity)}{(shape==="round"||shape==="tube"||shape==="hex")&&input(shape==="hex"?"Anahtar ağzı (mm)":"Dış çap (mm)",diameter,setDiameter)}{shape==="tube"&&(copperMode==="coil"?input("Et kalınlığı (mm)",thickness,setThickness):input("İç çap (mm)",inner,setInner))}{shape==="flat"&&<>{input("En (mm)",width,setWidth)}{input("Kalınlık (mm)",thickness,setThickness)}</>}{!copperMode&&<label className="weight-field"><span>Uzunluk birimi</span><select value={unit} onChange={e=>setUnit(e.target.value)}><option value="mm">Milimetre (mm)</option><option value="m">Metre (m)</option></select></label>}{input(unit==="m"?"Uzunluk (metre)":"Boy (mm)",length,setLength)}{input("Adet (tam sayı)",quantity,setQuantity)}</div><div className="weight-result"><span>Tahmini toplam ağırlık</span><strong aria-live="polite">{result===null?"Ölçüleri kontrol edin":fmt(result)+" kg"}</strong>{calculation.error&&<p className="weight-validation" role="alert">{calculation.error}</p>}<p>Seçilen kalite: {variant}. Kullanılan yoğunluk: {density} g/cm³. Değeri gerektiğinde değiştirebilirsiniz.</p><div className="weight-whatsapp"><span>WhatsApp üzerinden iletişime geçin</span><a href="https://wa.me/905330186924" target="_blank" rel="noopener noreferrer" aria-label="Tuzla Şubesi WhatsApp sohbetini aç">WhatsApp · Tuzla Şubesi ↗</a><a href="https://wa.me/905395986558" target="_blank" rel="noopener noreferrer" aria-label="İkitelli Şubesi WhatsApp sohbetini aç">WhatsApp · İkitelli Şubesi ↗</a></div><button className="button outline weight-add-cart" type="button" disabled={result===null} onClick={()=>{const dims=shape==="flat"?"En "+width+" × kalınlık "+thickness+" mm":shape==="hex"?"Anahtar ağzı "+diameter+" mm":shape==="tube"?"Dış Ø"+diameter+" mm, "+(copperMode==="coil"?"et "+thickness:"iç Ø"+inner)+" mm":"Ø"+diameter+" mm";add({slug,name:productName,subcategory:variant,form:({round:"Yuvarlak çubuk",tube:"Boru",flat:"Lama / levha",hex:"Altıköşe"}[shape]),dimensions:dims+", boy "+length+" "+unit,quantity:Number(quantity),notes:"Teorik ağırlık: "+fmt(result)+" kg (yaklaşık)"});setCartFeedback("Ölçüler teklif sepetine eklendi.");}}>+ Teklif sepetine ekle</button>{cartFeedback&&<p role="status" className="quote-feedback">{cartFeedback} <a href="/teklif-sepeti">Sepete git ↗</a></p>}<button className="button primary" type="button" disabled={result===null} onClick={()=>setOfferOpen(v=>!v)} aria-expanded={offerOpen} aria-controls="weight-offer-branches">Bu ölçülerle teklif iste ↗</button>{offerOpen&&result!==null&&<div className="weight-offer-branches" id="weight-offer-branches"><span>Teklif göndermek istediğiniz şubeyi seçin:</span><a href={offerMail("fatihgunes@gunesgroup.com.tr")}>Tuzla Şubesi <small>fatihgunes@gunesgroup.com.tr</small></a><a href={offerMail("altangunes@gunesgroup.com.tr")}>İkitelli Şubesi <small>altangunes@gunesgroup.com.tr</small></a></div>}</div></div><p className="weight-disclaimer">Hesap teorik yoğunluk ve geometrik ölçülere dayanır. Kesim toleransı, boşluk, alaşım ve üretim farkları dahil değildir. Altıköşe ölçüsü karşılıklı düz yüzeyler arasıdır. Yoğunluk değerleri yaklaşık referans değerlerdir; ürünün gerçek alaşım sertifikasına göre düzeltilebilir. Kangal bakır boruda dış çap, et kalınlığı ve toplam metreyi girin. Kesin ağırlık ve fiyat için firmayla teyitleşin.</p></div></section>;
}
