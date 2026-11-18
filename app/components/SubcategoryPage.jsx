import Link from "next/link";
import Image from "next/image";
import {notFound} from "next/navigation";
import {products} from "../products";
import {getSubcategory} from "../subcategories";
import WeightCalculator from "./WeightCalculator";
export function getSubcategoryMetadata(slug,item){
 const p=products.find(x=>x.slug===slug),info=getSubcategory(slug,item);
 if(!p||!info)return {title:"Ürün bulunamadı",robots:{index:false,follow:false}};
 const title=info.name+" | Ürün Bilgisi ve Kilogram Hesaplama";
 const description=info.detail+" Stok, ölçü ve fiyat için Güneş Metal Tuzla veya İkitelli şubesinden teyit alın.";
 const url="/urunler/"+slug+"/"+item;
 return {title,description,alternates:{canonical:url},openGraph:{title,description,url}};
}
export default function SubcategoryPage({slug,item}){
 const p=products.find(x=>x.slug===slug),info=getSubcategory(slug,item);
 if(!p||!info)notFound();
 const email="mailto:info@gunesgroup.com.tr?subject="+encodeURIComponent(info.name+" ürün bilgi ve fiyat talebi");
 return <><header className="site-header"><div className="container header-inner"><Link className="brand" href="/">GÜNEŞ <strong>METAL</strong><small>METAL & MÜHENDİSLİK PLASTİKLERİ</small></Link><Link className="detail-back" href={"/urunler/"+slug}>← {p.name}</Link></div></header><main className="detail-page"><div className="container"><nav className="subcategory-breadcrumb" aria-label="Sayfa yolu"><Link href="/">Ana Sayfa</Link><span> / </span><Link href={"/urunler/"+slug}>{p.name}</Link><span> / </span><span>{info.name}</span></nav><div className="detail-grid"><div className="detail-photo"><Image src={p.image} alt={p.name+" kategorisi temsili görseli"} width={640} height={480} sizes="(max-width: 760px) 90vw, 550px"/></div><div className="detail-copy"><span className="section-kicker">{p.name.toLocaleUpperCase("tr-TR")} / ALT KATEGORİ</span><h1>{info.name}</h1><p>{info.detail}</p><div className="detail-info"><div><strong>Katalog kategorisi</strong>{p.name}</div><div><strong>Stok ve ölçü bilgisi</strong>Şubelerimizden teyit ediniz.</div></div><div className="detail-actions"><a className="button primary" href={email}>Ürün Bilgisi ve Teklif İste ↗</a><Link className="button outline" href={"/urunler/"+slug}>Diğer Ürünler</Link></div><p>Görsel kategoriye aittir; bu alt ürünü birebir temsil etmeyebilir. Stok, ölçü ve teslimat bilgisi verilmemektedir.</p></div></div></div><WeightCalculator slug={slug} productName={info.name} initialVariant={info.variant} copperMode={info.mode}/></main></>;
}
