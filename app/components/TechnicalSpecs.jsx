import {getTechnicalData} from "../technicalData";
export default function TechnicalSpecs({slug,item,form}){
 const data=getTechnicalData(slug,item);
 if(!data)return null;
 return <section className="container technical-section" aria-labelledby="technical-title"><span className="section-kicker">TEKNİK BİLGİLER</span><h2 id="technical-title">Malzeme özellikleri</h2><p>Hesaplamalarda kullanılan yaklaşık referans bilgiler. Kesin değerler ürün ve üretici belgesine göre değişebilir.</p><div className="technical-table-wrap"><table className="technical-table"><tbody><tr><th scope="row">Malzeme / kalite</th><td>{data.family}</td></tr><tr><th scope="row">Yaklaşık yoğunluk</th><td>{data.density} g/cm³</td></tr>{form&&<tr><th scope="row">Ürün formu</th><td>{form}</td></tr>}<tr><th scope="row">Stok ve ölçü</th><td>Şubeden teyit edilmelidir</td></tr><tr><th scope="row">Teknik belge / sertifika</th><td>Sertifikalar talep edilmesi halinde paylaşılır</td></tr></tbody></table></div><p className="technical-note">{data.note} Tablodaki yoğunluklar yaklaşık referans değerlerdir; ürüne ait kesin teknik bilgiler ilgili sertifikadan kontrol edilmelidir.</p></section>;
}
