# Müşteri teklif kayıt sistemi kurulumu (bot doğrulaması olmadan)

1. Supabase SQL Editor içinde `supabase/quote_intake.sql` dosyasını çalıştırın.
2. Vercel > gunes-metal > Settings > Environment Variables altında Production için `SUPABASE_SERVICE_ROLE_KEY` ekleyin. Bu gizli anahtarı yalnızca Vercel ortam değişkenine girin; GitHub'a, sohbete veya `NEXT_PUBLIC_` değişkenine koymayın.
3. Mevcut `NEXT_PUBLIC_SUPABASE_URL` aynı kalmalı.
4. Vercel'de Redeploy yapın.
5. /teklif-sepeti üzerinden test talebi gönderin. Başarılı kayıt numarasından sonra /admin > Teklif Talepleri > Yenile ile kontrol edin.

Bot doğrulaması kullanıcı isteği üzerine kaldırıldı. Sunucuda alan doğrulaması, Origin kontrolü ve 10 dakikalık aynı talep için veritabanı tekillik koruması bulunur. Bunlar botlara veya yoğun otomatik istek trafiğine karşı tam koruma sağlamaz. Kötüye kullanımı önlemek için ileride IP tabanlı rate limiting/WAF eklenmesi önerilir.
