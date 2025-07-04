# React + Supabase Product Management Panel

Bu proje, kullanıcıların giriş yapabileceği ve ürün ekleyebileceği bir React + Supabase tabanlı ürün yönetim paneli uygulamasıdır.

## Özellikler

- ✅ Kullanıcı kayıt ve giriş sistemi (Supabase Auth)
- ✅ Korumalı rotalar (ProtectedRoute)
- ✅ Ürün ekleme formu (react-hook-form ile)
- ✅ Resim yükleme (Supabase Storage)
- ✅ Ürün listeleme
- ✅ Form validasyonu
- ✅ Loading durumları
- ✅ Toast bildirimleri
- ✅ Responsive tasarım (Tailwind CSS)

## Teknolojiler

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Supabase** (backend, auth, storage)
- **React Router DOM** (routing)
- **React Hook Form** (form yönetimi)
- **Tailwind CSS** + **Flowbite** (styling)
- **React Hot Toast** (bildirimler)

## Kurulum

### 1. Projeyi Klonlayın

```bash
git clone <repo-url>
cd gorev-18
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Supabase Projesi Oluşturun

1. [Supabase Dashboard](https://supabase.com/dashboard) üzerinde yeni bir proje oluşturun
2. Proje URL'si ve anon key'ini alın

### 4. Environment Dosyası Oluşturun

Proje kök dizininde `.env` dosyası oluşturun:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Supabase Veritabanı Tabloları

Supabase SQL Editor'da aşağıdaki SQL komutlarını çalıştırın:

```sql
-- Products tablosu
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) politikaları
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi ürünlerini görebilir
CREATE POLICY "Users can view own products" ON products
  FOR SELECT USING (auth.uid() = user_id);

-- Kullanıcılar sadece kendi ürünlerini ekleyebilir
CREATE POLICY "Users can insert own products" ON products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Kullanıcılar sadece kendi ürünlerini güncelleyebilir
CREATE POLICY "Users can update own products" ON products
  FOR UPDATE USING (auth.uid() = user_id);

-- Kullanıcılar sadece kendi ürünlerini silebilir
CREATE POLICY "Users can delete own products" ON products
  FOR DELETE USING (auth.uid() = user_id);
```

### 6. Supabase Storage Bucket

Supabase Dashboard'da Storage bölümünden:

1. "products" isimli bir bucket oluşturun
2. Bucket'i public yapın
3. Aşağıdaki politikayı ekleyin:

```sql
-- Storage policy for product images
CREATE POLICY "Users can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');
```

### 7. Uygulamayı Çalıştırın

```bash
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışacaktır.

## Kullanım

1. **Kayıt Ol**: `/signup` sayfasından yeni hesap oluşturun
2. **Giriş Yap**: `/login` sayfasından giriş yapın
3. **Dashboard**: Ana sayfa üzerinden ürün ekleme ve listeleme işlemlerini yapın
4. **Ürün Ekle**: `/add-product` sayfasından yeni ürün ekleyin
5. **Ürünleri Görüntüle**: `/products` sayfasından eklediğiniz ürünleri görün

## Proje Yapısı

```
src/
├── components/
│   └── auth/
│       ├── Login.tsx
│       ├── ProtectedRoute.tsx
│       └── Signup.tsx
├── contexts/
│   └── AuthContext.tsx
├── features/
│   └── products/
│       └── AddProduct.tsx
├── lib/
│   └── supabase.ts
├── pages/
│   ├── Dashboard.tsx
│   └── Products.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## Build ve Deploy

```bash
# Production build
npm run build

# Build dosyalarını test et
npm run preview
```

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Commit yapın (`git commit -am 'Yeni özellik eklendi'`)
4. Branch'i push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request açın

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
