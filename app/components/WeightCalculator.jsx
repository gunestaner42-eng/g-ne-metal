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
const variants={
bakir:[["Elektrolitik bakır",8.96]],
"ozel-bakir-urunler":[["Bakır",8.96]],
aluminyum:[["Alüminyum (genel)",2.70],["Alüminyum 7075",2.81],["Alüminyum 6061",2.70],["Alüminyum 6082",2.70],["Alüminyum 5083",2.66]],
bronz:[["Bronz (genel)",8.80],["12 kalay bronz (CuSn12)",8.80],["5 kalay bronz (CuSn5)",8.90],["RG5 / CuSn5Zn5Pb5",8.80]],
pirinc:[["Pirinç (genel)",8.50]],
"muhendislik-plastik":[["Delrin / POM",1.41],["PE1000",0.93],["PE500",0.95],["PTFE / Teflon",2.17],["Kestamid / PA6G",1.15]],
"kaynak-telleri":[["Bakır esaslı tel",8.96]],
"kursun-cinko":[["Kurşun",11.34],["Çinko",7.14]]
};
const fmt=n=>new Intl.NumberFormat("tr-TR",{maximumFractionDigits:3}).format(n);
export default function WeightCalculator({slug,productName,initialVariant}){
const defaults=materials[slug]||materials.bakir;
const options=variants[slug]||[[defaults.name,defaults.density]];
const selected=options.find(v=>v[0]===initialVariant)||options[0];
const [variant,setVariant]=useState(selected[0]);
const [density,setDensity]=useState(String(selected[1]));
const [unit,setUnit]=useState("mm");
const chooseVariant=name=>{setVariant(name);const found=options.find(v=>v[0]===name);if(found)setDensity(String(found[1]));};
const [shape,setShape]=useState("round");
const [diameter,setDiameter]=useState("50");
const [inner,setInner]=useState("30");
const [width,setWidth]=useState("50");
const [thickness,setThickness]=useState("10");
const [length,setLength]=useState("1000");
const [quantity,setQuantity]=useState("1");
const n=x=>Number(String(x).replace(",","."));
const result=useMemo(()=>{
const D=n(diameter),I=n(inner),W=n(width),T=n(thickness),L=n(length)*(unit==="m"?1000:1),Q=n(quantity),R=n(density);
if(![L,Q,R].every(v=>Number.isFinite(v)&&v>0)||!Number.isInteger(Q))return null;
let area=0;
if(shape==="round"){if(!(D>0))return null;area=Math.PI*D*D/4;}
if(shape==="tube"){if(!(D>0&&I>=0&&I<D))return null;area=Math.PI*(D*D-I*I)/4;}
if(shape==="flat"){if(!(W>0&&T>0))return null;area=W*T;}
if(shape==="hex"){if(!(D>0))return null;area=Math.sqrt(3)*D*D/2;}
const kg=area*L*Q*R/1000000;
return Number.isFinite(kg)?kg:null;
},[shape,diameter,inner,width,thickness,length,quantity,density,unit]);
const input=(label,value,setter)=><label className="weight-field"><span>{label}</span><input type="number" inputMode="decimal" min="0" step="any" value={value} onChange={e=>setter(e.target.value)} /></label>;
const mail="mailto:info@gunesgroup.com.tr?subject="+encodeURIComponent(productName+" ağırlık ve fiyat teklifi")+"&body="+encodeURIComponent("Ürün: "+productName+"\nŞekil: "+({round:"Yuvarlak çubuk",tube:"Boru",flat:"Lama / levha",hex:"Altıköşe"}[shape])+"\nYoğunluk: "+density+" g/cm³\nÇap: "+diameter+" mm\nİç çap: "+inner+" mm\nEn: "+width+" mm\nKalınlık: "+thickness+" mm\nBoy: "+length+" mm\nAdet: "+quantity+"\nTahmini ağırlık: "+(result===null?"Hesaplanamadı":fmt(result)+" kg")+"\n\nFiyat ve stok bilgisi rica ederim.");
return <section className="weight-section" aria-label="Ağırlık hesaplayıcı"><div className="container"><div className="weight-head"><span className="section-kicker">TEKNİK HESAPLAMA</span><h2>Otomatik kilogram hesaplama</h2><p>Çap ve kesit ölçüleri mm; uzunluk mm veya metre olabilir. Kangal bakır için metre seçebilirsiniz.</p></div><div className="weight-panel"><div className="weight-fields"><label className="weight-field"><span>Malzeme kalitesi</span><select value={variant} onChange={e=>chooseVariant(e.target.value)}>{options.map(([name])=><option key={name} value={name}>{name}</option>)}</select></label><label className="weight-field"><span>Ürün şekli</span><select value={shape} onChange={e=>setShape(e.target.value)}><option value="round">Yuvarlak çubuk / kangal tel</option><option value="tube">Boru</option><option value="flat">Lama / levha</option><option value="hex">Altıköşe çubuk (anahtar ağzı)</option></select></label>{input("Yoğunluk (g/cm³)",density,setDensity)}{(shape==="round"||shape==="tube"||shape==="hex")&&input(shape==="hex"?"Anahtar ağzı (mm)":"Dış çap (mm)",diameter,setDiameter)}{shape==="tube"&&input("İç çap (mm)",inner,setInner)}{shape==="flat"&&<>{input("En (mm)",width,setWidth)}{input("Kalınlık (mm)",thickness,setThickness)}</>}<label className="weight-field"><span>Uzunluk birimi</span><select value={unit} onChange={e=>setUnit(e.target.value)}><option value="mm">Milimetre (mm)</option><option value="m">Metre (m) — kangal / tel</option></select></label>{input(unit==="m"?"Uzunluk (metre)":"Boy (mm)",length,setLength)}{input("Adet (tam sayı)",quantity,setQuantity)}</div><div className="weight-result"><span>Tahmini toplam ağırlık</span><strong aria-live="polite">{result===null?"Ölçüleri kontrol edin":fmt(result)+" kg"}</strong><p>Seçilen kalite: {variant}. Kullanılan yoğunluk: {density} g/cm³. Değeri gerektiğinde değiştirebilirsiniz.</p><a className="button primary" href={mail}>Bu ölçülerle teklif iste ↗</a></div></div><p className="weight-disclaimer">Hesap teorik yoğunluk ve geometrik ölçülere dayanır. Kesim toleransı, boşluk, alaşım ve üretim farkları dahil değildir. Altıköşe ölçüsü karşılıklı düz yüzeyler arasıdır. Yoğunluk değerleri yaklaşık referans değerlerdir; ürünün gerçek alaşım sertifikasına göre düzeltilebilir. Kangal telde çap ve toplam metreyi girin. Kesin ağırlık ve fiyat için firmayla teyitleşin.</p></div></section>;
}
