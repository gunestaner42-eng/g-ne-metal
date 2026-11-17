
"use client";

import { useState } from "react";

const categories = [
  { name: "Bakır", slug: "bakir", desc: "Bakır çubuk, lama, levha ve boru" },
  { name: "Pirinç", slug: "pirinc", desc: "Pirinç çubuk, lama, levha ve boru" },
  { name: "Bronz", slug: "bronz", desc: "Bronz çubuk, burç ve döküm ürünleri" },
  { name: "Alüminyum", slug: "aluminyum", desc: "Alüminyum levha, çubuk ve profil" },
  { name: "Plastik", slug: "plastik", desc: "Delrin, polietilen ve teflon ürünleri" },
];

export default function Home() {
  const [search, setSearch] = useState("");

  const filtered = categories.filter((item) =>
    item.name.toLocaleLowerCase("tr").includes(
      search.toLocaleLowerCase("tr")
    )
  );

  return (
    <>
      <header className="header">
        <div className="container nav">
          <a href="/" className="logo">GÜNEŞ <span>METAL</span></a>
          <nav>
            <a href="/">Ana Sayfa</a>
            <a href="#urunler">Ürünlerimiz</a>
            <a href="#hakkimizda">Hakkımızda</a>
            <a href="#iletisim">İletişim</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <p>ENDÜSTRİYEL METAL ÇÖZÜMLERİ</p>
            <h1>GÜNEŞ METAL</h1>
            <h2>Kaliteli Malzeme, Güçlü Çözümler</h2>
            <a className="btn" href="#urunler">Ürünlerimizi İnceleyin</a>
          </div>
        </section>

        <section id="urunler" className="section container">
          <h2>Ürün Gruplarımız</h2>
          <p>İhtiyacınız olan malzemeyi keşfedin.</p>

          <input
            className="search"
            placeholder="Ürün kategorisi ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="products">
            {filtered.map((item) => (
              <article className="product" key={item.slug}>
                <div className="product-image">{item.name}</div>
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                <a href="#iletisim">Teklif Al →</a>
              </article>
            ))}
          </div>
        </section>

        <section id="hakkimizda" className="section about">
          <div className="container">
            <h2>Hakkımızda</h2>
            <p>
              Güneş Metal ürün kataloğuna hoş geldiniz.
              Metal ve endüstriyel malzeme ihtiyaçlarınız
              için ürün gruplarımızı inceleyebilirsiniz.
            </p>
          </div>
        </section>

        <section id="iletisim" className="section container">
          <h2>İletişim ve Teklif</h2>
          <p>Ürünlerimiz hakkında bilgi almak için bizimle iletişime geçin.</p>
          <a className="btn" href="mailto:">E-posta ile İletişim</a>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          © {new Date().getFullYear()} Güneş Metal
        </div>
      </footer>
    </>
  );
}
