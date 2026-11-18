# Güneş Metal admin kurulum notları

Bu commit bir **altyapı aşamasıdır**. /admin, Supabase bağlantısı kurulmadan kapalı bilgilendirme ekranı gösterir. Mevcut WhatsApp/e-posta teklif sepeti **veritabanına otomatik kayıt yapmaz**. Veritabanına kaydetme için ayrıca sunucu tarafı doğrulamalı, spam korumalı teklif kayıt API'si gereklidir.

1. Supabase projesi oluşturun. SQL Editor'de `supabase/schema.sql` çalıştırın. Önce SQL güvenlik politikalarını inceleyin.
2. Supabase Authentication altında e-posta/şifre ile yetkili kullanıcıları oluşturun. Her kullanıcının Auth UUID'sini alın.
3. SQL Editor'de ilk owner profilini, dosyanın sonundaki örneğe göre gerçek UUID ile oluşturun. Diğer çalışanları `staff_profiles` tablosuna `branch_admin` ve `tuzla` / `ikitelli` ile ekleyin.
4. Vercel ortam değişkenlerine `NEXT_PUBLIC_SUPABASE_URL` ve **publishable/anon** key ekleyin, yeniden dağıtın. **service_role** anahtarını asla NEXT_PUBLIC_ değişkenine veya GitHub'a koymayın.
5. /admin girişini owner, Tuzla ve İkitelli hesaplarıyla test edin. Şube dışı kayıtların REST isteğiyle de erişilemediğini doğrulayın.
6. Canlı teklif kayıt API'si tamamlanmadan bu panelde yeni talepler görünmez. Çalışan oluşturma/silme ve Excel dışa aktarma henüz uygulanmadı. Giriş oturumu sayfa yenilenince sona erer; güvenli oturum yenileme eklenmelidir.

**Güvenlik:** Şube izolasyonu Postgres RLS ile sağlanır. `quote_requests` için herkese açık INSERT politikası yoktur. Müşteri verisini istemci tarafında doğrudan service_role ile yazmayın.
