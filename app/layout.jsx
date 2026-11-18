import "./globals.css";

export const metadata = {
 metadataBase: new URL("https://gunes-metal.vercel.app"),
 title: {default:"Güneş Metal | Bakır, Pirinç, Bronz, Alüminyum ve Teknik Plastik",template:"%s | Güneş Metal"},
 description:"Güneş Metal: Bakır, pirinç, bronz, alüminyum ve mühendislik plastikleri. İstanbul Tuzla ve İkitelli şubeleri, teorik kilogram hesaplama ve fiyat teklifi.",
 alternates:{canonical:"/"},
 robots:{index:true,follow:true},
 icons:{icon:"/gunes-metal-logo.svg"},
 openGraph:{type:"website",locale:"tr_TR",siteName:"Güneş Metal",title:"Güneş Metal | Metal ve Mühendislik Plastikleri",description:"Ürün kataloğu, kilogram hesaplama ve teklif talepleri.",url:"/",images:[{url:"/gunes-metal-logo.svg",alt:"Güneş Metal"}]},
};
export default function RootLayout({children}) {
 const organization={"@context":"https://schema.org","@type":"Organization",name:"Güneş Metal",url:"https://gunes-metal.vercel.app",logo:"https://gunes-metal.vercel.app/gunes-metal-logo.svg",email:"info@gunesgroup.com.tr",contactPoint:[{"@type":"ContactPoint",telephone:"+90 216 394 92 48",contactType:"sales",areaServed:"TR",availableLanguage:"Turkish"},{"@type":"ContactPoint",telephone:"+90 212 671 33 20",contactType:"sales",areaServed:"TR",availableLanguage:"Turkish"}]};
 return <html lang="tr"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organization).replace(/</g,"\\u003c")}}/>{children}</body></html>;
}