"use client";
import {useMemo,useState} from "react";
const materials={
bakir:{name:"Bakır",density:8.96},pirinc:{name:"Pirinç",density:8.5},
bronz:{name:"Bronz",density:8.8},aluminyum:{name:"Alüminyum",density:2.7},
"muhendislik-plastik":{name:"Mühendislik plastik",density:1.41},
"ozel-bakir-urunler":{name:"Özel bakır",density:8.96},
"kaynak-telleri":{name:"Kaynak teli (bakır varsayımı)",density:8.96},
"kursun-cinko":{name:"Kurşun",density:11.34}
};
const fmt=n=>new Intl.NumberFormat("tr-TR",{maximumFractionDigits:3}).format(n);
export default function WeightCalculator({slug,productName}){
const defaults=materials[slug]||materials.bakir;
const [density,setDensity]=useState(String(defaults.density));
const [shape,setShape]=useState("round");
const [diameter,setDiameter]=useState("50");
const [inner,setInner]=useState("30");
const [width,setWidth]=useState("50");
const [thickness,setThickness]=useState("10");
const [length,setLength]=useState("1000");
const [quantity,setQuantity]=useState("1");
const n=x=>Number(String(x).replace(",","."));
const result=useMemo(()=>{
const D=n(diameter),I=n(inner),W=n(width),T=n(thickness),L=n(length),Q=n(quantity),R=n(density);
if(![L,Q,R].every(v=>Number.isFinite(v)&&v>0)||!Number.isInteger(Q))return null;
let area=0;
if(shape==="round"){if(!(D>0))return null;area=Math.PI*D*D/4;}
if(shape==="tube"){if(!(D>0&&I>=0&&I<D))return null;area=Math.PI*(D*D-I*I)/4;}
if(shape==="flat"){if(!(W>0&&T>0))return null;area=W*T;}
if(shape==="hex"){if(!(D>0))return null;area=Math.sqrt(3)*D*D/2;}
const kg=area*L*Q*R/1000000;
return Number.isFinite(kg)?kg:null;
},[shape,diameter,inner,width,thickness,length,quantity,density]);
const input=(label,value,setter)=><label className="weight-field"><span>{label}</span><input type="number" inputMode="decimal" min="0" step="any" value={value} onChange={e=>setter(e.target.value)} /></label>;
const mail="mailto:info@gunesgroup.com.tr?subject="+encodeURIComponent(productName+" ağırlık ve fiyat teklifi")+"&body="+encodeURIComponent("Ürün: "+productName+"\nŞekil: "+({round:"Yuvarlak çubuk",tube:"Boru",flat:"Lama / levha",hex:"Altıköşe"}[shape])+"\nYoğunluk: "+density+" g/cm³\nÇap: "+diameter+" mm\nİç çap: "+inner+" mm\nEn: "+width+" mm\nKalınlık: "+thickness+" mm\nBoy: "+length+" mm\nAdet: "+quantity+"\nTahmini ağırlık: "+(result===null?"Hesaplanamadı":fmt(result)+" kg")+"\n\nFiyat ve stok bilgisi rica ederim.");
return <section className="weight-section" aria-label="Ağırlık hesaplayıcı"><div className="container"><div className="weight-head"><span className="section-kicker">TEKNİK HESAPLAMA</span><h2>Otomatik kilogram hesaplama</h2><p>Ölçüleri milimetre cinsinden girin. Hesaplama yaklaşık teorik ağırlıktır.</p></div><div className="weight-panel"><div className="weight-fields"><label className="weight-field"><span>Ürün şekli</span><select value={shape} onChange={e=>setShape(e.target.value)}><option value="round">Yuvarlak çubuk</option><option value="tube">Boru</option><option value="flat">Lama / levha</option><option value="hex">Altıköşe çubuk (anahtar ağzı)</option></select></label>{input("Yoğunluk (g/cm³)",density,setDensity)}{(shape==="round"||shape==="tube"||shape==="hex")&&input(shape==="hex"?"Anahtar ağzı (mm)":"Dış çap (mm)",diameter,setDiameter)}{shape==="tube"&&input("İç çap (mm)",inner,setInner)}{shape==="flat"&&<>{input("En (mm)",width,setWidth)}{input("Kalınlık (mm)",thickness,setThickness)}</>}{input("Boy (mm)",length,setLength)}{input("Adet (tam sayı)",quantity,setQuantity)}</div><div className="weight-result"><span>Tahmini toplam ağırlık</span><strong aria-live="polite">{result===null?"Ölçüleri kontrol edin":fmt(result)+" kg"}</strong><p>Yoğunluk başlangıç değeri: {defaults.name} için {fmt(defaults.density)} g/cm³. Alaşıma ve malzeme türüne göre değişir.</p><a className="button primary" href={mail}>Bu ölçülerle teklif iste ↗</a></div></div><p className="weight-disclaimer">Hesap teorik yoğunluk ve geometrik ölçülere dayanır. Kesim toleransı, boşluk, alaşım ve üretim farkları dahil değildir. Altıköşe ölçüsü karşılıklı düz yüzeyler arasıdır. Kesin ağırlık ve fiyat için firmayla teyitleşin.</p></div></section>;
}
