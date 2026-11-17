"use client";

import { useEffect, useState } from "react";

import { products } from "./products";
const slides = [
  { tag: "1988'DEN BUGÜNE", title: "Metalde güvenilir çözüm ortağınız", detail: "Bakır, bronz, alüminyum ve pirinç ürünlerinde geniş seçenekler. Endüstriyel ihtiyaçlarınız için Güneş Metal yanınızda.", label: "Ürünleri Keşfet", href: "#urunler", image: products.find(p => p.slug === "bakir")?.image, imageLabel: "Bakır ürünleri", category: "METAL ÜRÜNLERİ", note: "Bakır · Bronz · Pirinç · Alüminyum" },
  { tag: "GENİŞ ÜRÜN YELPAZESİ", title: "Sanayiye özel metal çözümleri", detail: "Farklı alaşım ve ürün formlarını inceleyin, ölçülerinize uygun malzemeyi kolayca bulun.", label: "Metalleri İncele", href: "#urunler", image: products.find(p => p.slug === "bronz")?.image, imageLabel: "Bronz ürünleri", category: "ENDÜSTRİYEL METALLER", note: "Kaliteye göre ürün ve ağırlık hesaplama" },
  { tag: "MÜHENDİSLİK ÇÖZÜMLERİ", title: "Teknik plastiklerde doğru malzeme", detail: "Delrin, Kestamid, Teflon ve polietilen seçenekleriyle projeleriniz için teknik malzeme alternatifleri.", label: "Plastikleri İncele", href: "/urunler/muhendislik-plastik", image: products.find(p => p.slug === "muhendislik-plastik")?.image, imageLabel: "Mühendislik plastikleri", category: "MÜHENDİSLİK PLASTİKLERİ", note: "Yuvarlak çubuk · Levha" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, []);

  const visible = products.filter((p) =>
    `${p.name} ${p.desc}`.toLocaleLowerCase("tr-TR").includes(search.toLocaleLowerCase("tr-TR"))
  );
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <span>1988'den bugüne metal ve plastikte çözüm ortağınız</span>
          <div><a href="tel:+902126713324">0212 671 33 24</a><a href="mailto:info@gunesgroup.com.tr">info@gunesgroup.com.tr</a></div>
        </div>
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#anasayfa" onClick={closeMenu}>GÜNEŞ <strong>METAL</strong><small>METAL & MÜHENDİSLİK PLASTİKLERİ</small></a>
          <button className="menu-toggle" type="button" aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "✕" : "☰"}</button>
          <nav className={menuOpen ? "main-nav open" : "main-nav"} aria-label="Ana menü">
            <a onClick={closeMenu} href="#anasayfa">Ana Sayfa</a>
            <a onClick={closeMenu} href="#urunler">Ürünlerimiz</a>
            <a onClick={closeMenu} href="#hizmetler">Hizmet Alanları</a>
            <a onClick={closeMenu} href="#hakkimizda">Hakkımızda</a>
            <a onClick={closeMenu} href="#iletisim">İletişim</a>
            <a className="nav-cta" onClick={closeMenu} href="mailto:info@gunesgroup.com.tr?subject=Urun%20Teklif%20Talebi">Teklif Al ↗</a>
          </nav>
        </div>
      </header>

      <main id="anasayfa">
        <section className="hero" aria-label="Tanıtım">
          <div className="hero-decor hero-decor-one"/><div className="hero-decor hero-decor-two"/>
          <div className="container hero-inner">
            <div className="hero-content" key={slide}>
              <span className="eyebrow"><i/> {slides[slide].tag}</span>
              <h1>{slides[slide].title}</h1>
              <p>{slides[slide].detail}</p>
              <div className="hero-actions"><a className="button primary" href={slides[slide].href}>{slides[slide].label} <span>↗</span></a><a className="button outline" href="#iletisim">Teklif Al ↗</a></div>
              <div className="hero-trust"><span><strong>1988</strong> Kuruluş</span><span><strong>Metal & Plastik</strong> Ürün grupları</span></div>
            </div>
            <div className="hero-showcase" key={slides[slide].imageLabel}>
              <div className="hero-showcase-top"><span className="hero-showcase-kicker">GÜNEŞ METAL / ÜRÜN VİTRİNİ</span><span className="hero-showcase-number">0{slide + 1} / 0{slides.length}</span></div>
              <div className="hero-showcase-image"><img src={slides[slide].image} alt={slides[slide].imageLabel} fetchPriority={slide === 0 ? "high" : "auto"} /></div>
              <div className="hero-showcase-caption"><div><small>{slides[slide].category}</small><strong>{slides[slide].note}</strong></div><a href={slides[slide].href} aria-label={slides[slide].imageLabel + " ürünlerini incele"}>↗</a></div>
            </div>
          </div>
          <div className="container hero-bottom"><div className="slide-dots" aria-label="Slayt seçimi">{slides.map((s, i) => <button type="button" key={s.tag} className={slide === i ? "active" : ""} aria-label={`${i+1}. slayt`} onClick={() => setSlide(i)}/>)}</div><span>GÜNEŞ METAL / {String(slide + 1).padStart(2,"0")}</span></div>
        </section>

        <section className="features" id="hizmetler"><div className="container feature-grid">
          <div><span className="feature-icon">◇</span><strong>Kaliteli Ürün</strong><p>Metal ve plastik malzeme çeşitleri</p></div>
          <div><span className="feature-icon">↗</span><strong>Hızlı Teslimat</strong><p>İhtiyaçlarınıza odaklı hizmet</p></div>
          <div><span className="feature-icon">◎</span><strong>Teknik Destek</strong><p>Malzeme seçiminde bilgi desteği</p></div>
          <div><span className="feature-icon">✓</span><strong>Güvenilir Hizmet</strong><p>1988'den gelen sektör tecrübesi</p></div>
        </div></section>

        <section className="section products-section" id="urunler"><div className="container">
          <div className="section-top"><div><span className="section-kicker">ÜRÜN KATALOĞU</span><h2>Ürün gruplarımız</h2><p>İhtiyacınız olan malzemeyi kolayca bulun.</p></div><label className="search-box"><span aria-hidden="true">⌕</span><input type="search" placeholder="Ürün veya malzeme ara..." value={search} onChange={e => setSearch(e.target.value)} aria-label="Ürün ara" /></label></div>
          <div className="product-grid">{visible.map(p => <article className="product-card" key={p.name}><a className="product-art photo-art" href={`/urunler/${p.slug}`}><img src={p.image} alt={`${p.name} ürün görseli`} loading="lazy" /></a><div className="product-body"><h3>{p.name}</h3><p>{p.desc}</p><a href={`/urunler/${p.slug}`}>Ürünleri İncele <span>↗</span></a></div></article>)}</div>
          {visible.length === 0 && <p className="empty-results">Aramanıza uygun ürün bulunamadı. Başka bir kelime deneyin.</p>}
        </div></section>

        <section className="about-section" id="hakkimizda"><div className="container about-grid"><div className="about-mark"><span>1988</span><small>KURULUŞ</small></div><div><span className="section-kicker">GÜNEŞ METAL HAKKINDA</span><h2>Tecrübemizle yanınızdayız.</h2><p>1988 yılından bu yana metal sektöründe faaliyet gösteren Güneş Metal, mühendislik plastiklerini de ürün yelpazesine ekleyerek müşterilerine geniş malzeme seçenekleri sunmaktadır.</p><p>Teknik bilgi desteği, güvenilir hizmet ve hızlı dağıtım anlayışıyla çalışıyoruz.</p><a className="text-link" href="#iletisim">Bizimle İletişime Geçin ↗</a></div></div></section>

        <section className="contact-section" id="iletisim"><div className="container contact-grid"><div><span className="section-kicker">İLETİŞİM</span><h2>Projeniz için doğru malzemeyi birlikte bulalım.</h2><p>Ölçü, adet ve ürün detaylarını paylaşarak teklif isteyebilirsiniz.</p></div><div className="contact-actions"><a className="button primary" href="mailto:info@gunesgroup.com.tr?subject=Urun%20Teklif%20Talebi">E-posta ile Teklif Al ↗</a><a className="button outline" href="tel:+902126713324">0212 671 33 24</a></div></div></section>
      </main>
      <footer className="footer"><div className="container footer-inner"><a className="footer-brand" href="#anasayfa">GÜNEŞ <strong>METAL</strong></a><span>© {new Date().getFullYear()} Güneş Metal. Tüm hakları saklıdır.</span><a href="mailto:info@gunesgroup.com.tr">info@gunesgroup.com.tr</a></div></footer>
    </>
  );
}
