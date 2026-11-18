// Yalnızca mevcut katalogda adı geçen kalite ve ürün formları.
// Bu liste stok, mevcut ölçü veya teslimat taahhüdü değildir.
export const subcategories={
 bakir:[
  {slug:"yuvarlak-cubuk",name:"Yuvarlak Bakır Çubuk",detail:"Çap, boy ve adet ile teorik ağırlık hesabı.",mode:"rod",variant:"Elektrolitik bakır"},
  {slug:"lama",name:"Bakır Lama",detail:"En, kalınlık, boy ve adet ile teorik ağırlık hesabı.",mode:"flat",variant:"Elektrolitik bakır"},
  {slug:"kangal-boru",name:"Kangal Bakır Boru",detail:"Dış çap, et kalınlığı ve toplam metre ile teorik ağırlık hesabı.",mode:"coil",variant:"Elektrolitik bakır"},
  {slug:"levha",name:"Bakır Levha",detail:"En, kalınlık ve boy üzerinden teorik ağırlık hesabı.",mode:"flat",variant:"Elektrolitik bakır"},
  {slug:"tel",name:"Bakır Tel",detail:"Çap ve boy üzerinden teorik ağırlık hesabı.",mode:"rod",variant:"Elektrolitik bakır"}
 ],
 bronz:[
  {slug:"rg5",name:"RG5 Bronz",detail:"RG5 / CuSn5Zn5Pb5 için yaklaşık yoğunlukla ağırlık hesabı.",variant:"RG5 / CuSn5Zn5Pb5"},
  {slug:"12-kalay",name:"12 Kalay Bronz (CuSn12)",detail:"CuSn12 alaşımı için yaklaşık yoğunlukla ağırlık hesabı.",variant:"12 kalay bronz (CuSn12)"},
  {slug:"cubuk",name:"Bronz Çubuk",detail:"Yuvarlak bronz çubuk için teorik ağırlık hesabı.",mode:"rod",variant:"Bronz (genel)"},
  {slug:"burc",name:"Bronz Burç",detail:"Dış ve iç çap ile teorik ağırlık hesabı.",mode:"tube",variant:"Bronz (genel)"}
 ],
 pirinc:[
  {slug:"profil",name:"Pirinç Profil",detail:"Profil kesitine ve ölçülere göre bilgi almak için şubelerimizle iletişime geçin.",calculator:false,variant:"Pirinç (genel)"},
  {slug:"boru",name:"Pirinç Boru",detail:"Dış ve iç çap ile teorik ağırlık hesabı.",mode:"tube",variant:"Pirinç (genel)"},
  {slug:"ozel-imalat",name:"Pirinç Özel İmalat",detail:"Özel ölçü ve kesit için şubelerimizden bilgi alın.",calculator:false,variant:"Pirinç (genel)"}
 ],
 "muhendislik-plastik":[
  {slug:"delrin-pom",name:"Delrin / POM",detail:"POM mühendislik plastiği için teorik ağırlık hesabı.",variant:"Delrin / POM"},
  {slug:"pe1000",name:"PE1000",detail:"PE1000 için teorik ağırlık hesabı.",variant:"PE1000"},
  {slug:"pe500",name:"PE500",detail:"PE500 için teorik ağırlık hesabı.",variant:"PE500"},
  {slug:"teflon-ptfe",name:"PTFE / Teflon",detail:"PTFE için teorik ağırlık hesabı.",variant:"PTFE / Teflon"},
  {slug:"kestamid",name:"Kestamid / PA6G",detail:"PA6G için teorik ağırlık hesabı.",variant:"Kestamid / PA6G"}
 ]
};
export const getSubcategory=(slug,item)=>subcategories[slug]?.find(x=>x.slug===item);
