// Teorik hesaplayıcıda kullanılan yaklaşık referans yoğunlukları.
// Mekanik dayanım, sertifika, stok ve standart uygunluğu iddiası içermez.
export const technicalData={
 "bakir":{density:"8,96",family:"Bakır",note:"Elektrolitik bakır için yaklaşık referans yoğunluk."},
 "bronz":{density:"8,80",family:"Bronz",note:"Genel bronz için yaklaşık referans yoğunluk; alaşıma göre değişebilir."},
 "bronz/rg5":{density:"8,80",family:"RG5 / CuSn5Zn5Pb5",note:"RG5 için hesaplayıcıda kullanılan yaklaşık referans değeri; parti sertifikasıyla teyit edilmelidir."},
 "bronz/12-kalay":{density:"8,80",family:"CuSn12",note:"12 kalay bronz için hesaplayıcıda kullanılan yaklaşık referans değeri; parti sertifikasıyla teyit edilmelidir."},
 "pirinc":{density:"8,50",family:"Pirinç",note:"Genel pirinç yoğunluğu; alaşıma göre değişebilir."},
 "muhendislik-plastik/delrin-pom":{density:"1,41",family:"POM / Delrin",note:"POM için yaklaşık referans yoğunluk."},
 "muhendislik-plastik/pe1000":{density:"0,93",family:"PE1000",note:"PE1000 için yaklaşık referans yoğunluk."},
 "muhendislik-plastik/pe500":{density:"0,95",family:"PE500",note:"PE500 için yaklaşık referans yoğunluk."},
 "muhendislik-plastik/teflon-ptfe":{density:"2,17",family:"PTFE / Teflon",note:"PTFE için yaklaşık referans yoğunluk."},
 "muhendislik-plastik/kestamid":{density:"1,15",family:"PA6G / Kestamid",note:"PA6G için yaklaşık referans yoğunluk."},
 "aluminyum/7075":{density:"2,81",family:"Alüminyum 7075",note:"7075 için yaklaşık referans yoğunluk."},
 "aluminyum/6082":{density:"2,70",family:"Alüminyum 6082",note:"6082 için yaklaşık referans yoğunluk."},
 "aluminyum/6061":{density:"2,70",family:"Alüminyum 6061",note:"6061 için yaklaşık referans yoğunluk."},
 "aluminyum/6013":{density:"2,72",family:"Alüminyum 6013",note:"6013 için yaklaşık referans yoğunluk."},
 "aluminyum/5083":{density:"2,66",family:"Alüminyum 5083",note:"5083 için yaklaşık referans yoğunluk."}
};
export function getTechnicalData(slug,item){
 const specific=technicalData[slug+"/"+item];
 if(specific)return specific;
 if(slug==="bakir"||slug==="bronz"||slug==="pirinc")return technicalData[slug];
 return null;
}
