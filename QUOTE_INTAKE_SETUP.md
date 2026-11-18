# Müşteri teklif kayıt sistemi kurulumu

1. Supabase SQL Editor içinde `supabase/quote_intake.sql` dosyasını çalıştırın. Bu adım `request_fingerprint` sütunu ve tekil indeksi ekler.
2. Cloudflare Turnstile panelinde `gunes-metal.vercel.app` ve varsa özel site alan adınız için widget oluşturun. Site key ve secret key alın.
3. Vercel > gunes-metal > Settings > Environment Variables altında Production için:
   - `SUPABASE_SERVICE_ROLE_KEY`: **yalnızca sunucu ortamı**, Supabase projesinin service_role secret key'i. GitHub'a, sohbete, NEXT_PUBLIC_ değişkenine koymayın.
   - `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile secret.
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: Cloudflare Turnstile public site key.
   - Mevcut `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY` aynen kalsın.
4. Vercel Redeploy yapın. Değişkenler olmadan endpoint 503 yanıt verir ve arayüz online kayıt butonunu etkinleştirmez.
5. /teklif-sepeti üzerinden bir deneme talebi oluşturup 'Teklif Talebini Gönder' butonuna basın. Başarılı kayıt numarası gördükten sonra /admin > Teklif Talepleri > Yenile yapın. Supabase RLS şube erişimini sınırlar.
6. Aynı talep 10 dakika içinde tekrar gönderilirse mükerrer kayıt hatası döner. 10 dakika sonra aynı veriler yeniden kaydedilebilir.

Güvenlik: Supabase service role key yalnızca Next.js sunucu rotasında kullanılır; client koduna eklenmez. Cloudflare Turnstile gerçek üretim anahtarları gereklidir. Endpoint istemci girdisini doğrular ve Origin kontrolü yapar. İleri seviye yoğunluk limiti için Cloudflare WAF/rate limiting tavsiye edilir. Müşteri verileri yönetim panelinde görüntülenir; KVKK aydınlatma ve saklama politikaları ayrıca ele alınmalıdır.
