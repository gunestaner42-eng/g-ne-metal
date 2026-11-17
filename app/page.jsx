"use client";

import { useEffect, useState } from "react";

import { products } from "./products";
const slides = [
  { tag: "1988'DEN BUGÜNE", title: "Sanayinin gücü, malzemenin kalitesi.", detail: "Bakır, bronz, alüminyum ve pirinç ürünlerinde geniş seçenekler. Endüstriyel ihtiyaçlarınız için Güneş Metal yanınızda.", label: "Ürünleri Keşfet", href: "#urunler", image: products.find(p => p.slug === "bakir")?.image, imageLabel: "Bakır ürünleri", category: "METAL ÜRÜNLERİ", note: "Bakır · Bronz · Pirinç · Alüminyum" },
  { tag: "GENİŞ ÜRÜN YELPAZESİ", title: "Her projeye uygun metal çözümleri.", detail: "Farklı alaşım ve ürün formlarını inceleyin, ölçülerinize uygun malzemeyi kolayca bulun.", label: "Metalleri İncele", href: "#urunler", image: products.find(p => p.slug === "bronz")?.image, imageLabel: "Bronz ürünleri", category: "ENDÜSTRİYEL METALLER", note: "Kaliteye göre ürün ve ağırlık hesaplama" },
  { tag: "MÜHENDİSLİK ÇÖZÜMLERİ", title: "Mühendislik plastiklerinde doğru tercih.", detail: "Delrin, Kestamid, Teflon ve polietilen seçenekleriyle projeleriniz için teknik malzeme alternatifleri.", label: "Plastikleri İncele", href: "/urunler/muhendislik-plastik", image: products.find(p => p.slug === "muhendislik-plastik")?.image, imageLabel: "Mühendislik plastikleri", category: "MÜHENDİSLİK PLASTİKLERİ", note: "Yuvarlak çubuk · Levha" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), 7500);
    return () => clearInterval(id);
  }, [paused]);

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
        <section className="hero premium-hero" aria-label="Tanıtım" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}>
          <div className="hero-decor hero-decor-one"/><div className="hero-decor hero-decor-two"/><div className="hero-grid-lines" aria-hidden="true"/>
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
              <div className="hero-showcase-image"><div className="hero-showcase-halo" aria-hidden="true"/><img src={slides[slide].image} alt={slides[slide].imageLabel} fetchPriority={slide === 0 ? "high" : "auto"} /></div>
              <div className="hero-showcase-caption"><div><small>{slides[slide].category}</small><strong>{slides[slide].note}</strong></div><a href={slides[slide].href} aria-label={slides[slide].imageLabel + " ürünlerini incele"}>↗</a></div>
            </div>
          </div>
          <div className="container hero-bottom"><div className="slide-dots" aria-label="Slayt seçimi">{slides.map((s, i) => <button type="button" key={s.tag} className={slide === i ? "active" : ""} aria-current={slide === i ? "true" : undefined} aria-label={`${i+1}. slayt`} onClick={() => setSlide(i)}/>)}</div><div className="hero-bottom-right"><span>GÜNEŞ METAL / {String(slide + 1).padStart(2,"0")}</span><button className="hero-slide-control" type="button" aria-label={paused ? "Slaytları oynat" : "Slaytları duraklat"} onClick={() => setPaused(v => !v)}>{paused ? "▶" : "Ⅱ"}</button></div></div>
        </section>

        <section className="home-category-strip" aria-label="Popüler ürün kategorileri"><div className="container home-category-inner"><div className="home-category-intro"><small>MALZEMELERİ KEŞFEDİN</small><strong>Aradığınız ürün bir tık uzağınızda.</strong></div><div className="home-category-links">{["bakir","bronz","aluminyum","pirinc","muhendislik-plastik"].map(slug => { const product = products.find(p => p.slug === slug); return <a key={slug} href={`/urunler/${slug}`}>{product?.name}<span aria-hidden="true">↗</span></a>; })}</div></div></section>

        <section className="features" id="hizmetler"><div className="container feature-grid">
          <div><span className="feature-icon">◇</span><strong>Kaliteli Ürün</strong><p>Metal ve plastik malzeme çeşitleri</p></div>
          <div><span className="feature-icon">↗</span><strong>Hızlı Teslimat</strong><p>İhtiyaçlarınıza odaklı hizmet</p></div>
          <div><span className="feature-icon">◎</span><strong>Teknik Destek</strong><p>Malzeme seçiminde bilgi desteği</p></div>
          <div><span className="feature-icon">✓</span><strong>Güvenilir Hizmet</strong><p>1988'den gelen sektör tecrübesi</p></div>
        </div></section>

        <section className="section products-section" id="urunler"><div className="container">
          <div className="section-top"><div><span className="section-kicker">ÜRÜN KATALOĞU</span><h2>Ürün gruplarımız</h2><p>İhtiyacınız olan malzemeyi kolayca bulun.</p></div><label className="search-box"><span aria-hidden="true">⌕</span><input type="search" placeholder="Ürün veya malzeme ara..." value={search} onChange={e => setSearch(e.target.value)} aria-label="Ürün ara" /></label></div>
          <div className="product-grid">{visible.map(p => <article className="product-card" key={p.name}><a className="product-art photo-art" aria-label={`${p.name} kategorisini incele`} href={`/urunler/${p.slug}`}><img src={p.image} alt={`${p.name} ürün görseli`} loading="lazy" decoding="async" /></a><div className="product-body"><h3>{p.name}</h3><p>{p.desc}</p><a href={`/urunler/${p.slug}`}>Ürünleri İncele <span>↗</span></a></div></article>)}</div>
          {visible.length === 0 && <p className="empty-results">Aramanıza uygun ürün bulunamadı. Başka bir kelime deneyin.</p>}
        </div></section>

        <section className="about-section" id="hakkimizda"><div className="container about-grid"><div className="about-mark"><span>1988</span><small>KURULUŞ</small></div><div><span className="section-kicker">GÜNEŞ METAL HAKKINDA</span><h2>Tecrübemizle yanınızdayız.</h2><p>1988 yılından bu yana metal sektöründe faaliyet gösteren Güneş Metal, mühendislik plastiklerini de ürün yelpazesine ekleyerek müşterilerine geniş malzeme seçenekleri sunmaktadır.</p><p>Teknik bilgi desteği, güvenilir hizmet ve hızlı dağıtım anlayışıyla çalışıyoruz.</p><a className="text-link" href="#iletisim">Bizimle İletişime Geçin ↗</a></div></div></section>

        <section className="contact-section" id="iletisim"><div className="container contact-grid"><div><span className="section-kicker">İLETİŞİM</span><h2>Projeniz için doğru malzemeyi birlikte bulalım.</h2><p>Ölçü, adet ve ürün detaylarını paylaşarak teklif isteyebilirsiniz.</p></div><div className="contact-actions"><a className="button primary" href="mailto:info@gunesgroup.com.tr?subject=Urun%20Teklif%20Talebi">E-posta ile Teklif Al ↗</a><a className="button outline" href="tel:+902126713324">0212 671 33 24</a></div></div></section>
        <section className="locations-section" id="magazalarimiz" aria-labelledby="locations-title">
          <div className="container">
            <div className="locations-heading">
              <span className="section-kicker">BİZE ULAŞIN</span>
              <h2 id="locations-title">Mağazalarımız</h2>
              <p>Tuzla ve İkitelli şubelerimizin adreslerini inceleyebilir, tek tıkla yol tarifi alabilirsiniz.</p>
            </div>
            <div className="locations-grid">
              {[
                { name: "Güneş Metal Tuzla", district: "TUZLA / İSTANBUL", address: "Evliya Çelebi Mahallesi, Ümmet Sokak No:19, 34944 Tuzla / İstanbul", lat: 40.843751, lng: 29.294404, whatsapp: "905330186924", phone: "+90 533 018 69 24", email: "fatihgunes@gunesgroup.com.tr", landline: "0216 394 92 48", landlineHref: "+902163949248" },
                { name: "Güneş Metal İkitelli", district: "BAŞAKŞEHİR / İSTANBUL", address: "Ziya Gökalp Mahallesi, Demirciler Sanayi Sitesi, İkitelli OSB, B8 Blok No:188, 34490 Başakşehir / İstanbul", lat: 41.0687003, lng: 28.8055369, whatsapp: "905395986558", phone: "+90 539 598 65 58", email: "altangunes@gunesgroup.com.tr", landline: "0212 671 33 20–25", landlineHref: "+902126713320" }
              ].map((location) => (
                <article className="location-card" key={location.name}>
                  <div className="location-map">
                    <iframe
                      title={location.name + " harita konumu"}
                      src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=16&output=embed`}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>
                  <div className="location-details">
                    <span className="location-district">{location.district}</span>
                    <h3>{location.name}</h3>
                    <p>{location.address}</p>
                    <div className="location-contact-list">
                      <a href={`tel:${location.landlineHref}`} aria-label={location.name + " sabit telefon numarasını ara"}><span>Sabit Telefon</span><strong>{location.landline}</strong></a>
                      <a href={`mailto:${location.email}`} aria-label={location.name + " e-posta gönder"}><span>E-posta</span><strong>{location.email}</strong></a>
                    </div>
                    <div className="location-actions">
                      <a className="location-directions" href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat}%2C${location.lng}`} target="_blank" rel="noopener noreferrer" aria-label={location.name + " için Google Haritalar yol tarifi al"}>Yol Tarifi Al <span aria-hidden="true">↗</span></a>
                      <a className="location-whatsapp" href={`https://wa.me/${location.whatsapp}?text=${encodeURIComponent("Merhaba, Güneş Metal'den ürün hakkında bilgi almak istiyorum.")}`} target="_blank" rel="noopener noreferrer" aria-label={location.name + " WhatsApp hattına mesaj gönder"}>WhatsApp <span>{location.phone}</span></a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="footer"><div className="container footer-inner"><a className="footer-brand" href="#anasayfa">GÜNEŞ <strong>METAL</strong></a><span>© {new Date().getFullYear()} Güneş Metal. Tüm hakları saklıdır.</span><a href="mailto:info@gunesgroup.com.tr">info@gunesgroup.com.tr</a></div></footer>
    </>
  );
}
