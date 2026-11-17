"use client";

import { useEffect, useState } from "react";

const products = [
  { name: "Bakır", desc: "Lama, çubuk, boru, levha ve tel", icon: "Cu", tone: "copper" },
  { name: "Alüminyum", desc: "Levha, çubuk ve endüstriyel ürünler", icon: "Al", tone: "silver" },
  { name: "Bronz", desc: "Bronz çubuk, burç ve döküm çeşitleri", icon: "Br", tone: "bronze" },
  { name: "Pirinç", desc: "Profil, boru ve özel pirinç ürünleri", icon: "Zn", tone: "brass" },
  { name: "Mühendislik Plastik", desc: "Endüstriyel plastik malzeme çeşitleri", icon: "PE", tone: "plastic" },
  { name: "Özel Bakır Ürünler", desc: "Yivli ve bakır-nikel boru çeşitleri", icon: "Cu", tone: "copper" },
  { name: "Kaynak Telleri", desc: "Sarı, bakır ve gümüş kaynak telleri", icon: "Ag", tone: "silver" },
  { name: "Kurşun ve Çinko", desc: "Kurşun levha ve çinko levha", icon: "Zn", tone: "slate" },
];

const slides = [
  { tag: "1988'DEN BUGÜNE", title: "Metalde güvenilir çözüm ortağınız", detail: "Bakır, bronz, alüminyum ve pirinç ürünlerinde geniş seçenekler.", label: "Ürünleri Keşfet", href: "#urunler" },
  { tag: "TEKNİK ÇÖZÜMLER", title: "Mühendislik plastikleri", detail: "Endüstriyel ihtiyaçlarınız için farklı malzeme alternatifleri.", label: "Ürünleri İncele", href: "#urunler" },
  { tag: "ÖZEL ÜRÜNLER", title: "İhtiyacınıza uygun malzemeler", detail: "Özel ürünler ve teknik bilgi için bizimle iletişime geçin.", label: "Teklif İsteyin", href: "#iletisim" },
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
              <div className="hero-actions"><a className="button primary" href={slides[slide].href}>{slides[slide].label} <span>↗</span></a><a className="button outline" href="#hakkimizda">Bizi Tanıyın</a></div>
            </div>
            <div className="hero-visual" aria-hidden="true"><div className="metal-ring ring-outer"/><div className="metal-ring ring-inner"/><div className="metal-core">GM</div></div>
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
          <div className="product-grid">{visible.map(p => <article className="product-card" key={p.name}><div className={`product-art ${p.tone}`}><span className="art-glow"/><span className="art-symbol">{p.icon}</span><span className="art-lines"/></div><div className="product-body"><h3>{p.name}</h3><p>{p.desc}</p><a href={`mailto:info@gunesgroup.com.tr?subject=${encodeURIComponent(p.name + " hakkında teklif talebi")}`}>Teklif İste <span>↗</span></a></div></article>)}</div>
          {visible.length === 0 && <p className="empty-results">Aramanıza uygun ürün bulunamadı. Başka bir kelime deneyin.</p>}
        </div></section>

        <section className="about-section" id="hakkimizda"><div className="container about-grid"><div className="about-mark"><span>1988</span><small>KURULUŞ</small></div><div><span className="section-kicker">GÜNEŞ METAL HAKKINDA</span><h2>Tecrübemizle yanınızdayız.</h2><p>1988 yılından bu yana metal sektöründe faaliyet gösteren Güneş Metal, mühendislik plastiklerini de ürün yelpazesine ekleyerek müşterilerine geniş malzeme seçenekleri sunmaktadır.</p><p>Teknik bilgi desteği, güvenilir hizmet ve hızlı dağıtım anlayışıyla çalışıyoruz.</p><a className="text-link" href="#iletisim">Bizimle İletişime Geçin ↗</a></div></div></section>

        <section className="contact-section" id="iletisim"><div className="container contact-grid"><div><span className="section-kicker">İLETİŞİM</span><h2>Projeniz için doğru malzemeyi birlikte bulalım.</h2><p>Ölçü, adet ve ürün detaylarını paylaşarak teklif isteyebilirsiniz.</p></div><div className="contact-actions"><a className="button primary" href="mailto:info@gunesgroup.com.tr?subject=Urun%20Teklif%20Talebi">E-posta ile Teklif Al ↗</a><a className="button outline" href="tel:+902126713324">0212 671 33 24</a></div></div></section>
      </main>
      <footer className="footer"><div className="container footer-inner"><a className="footer-brand" href="#anasayfa">GÜNEŞ <strong>METAL</strong></a><span>© {new Date().getFullYear()} Güneş Metal. Tüm hakları saklıdır.</span><a href="mailto:info@gunesgroup.com.tr">info@gunesgroup.com.tr</a></div></footer>
    </>
  );
}
