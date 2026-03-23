Proje Özeti

Bu proje, spor ekipmanlarının depo/stok takibini yapmak amacıyla geliştirilmiş bir sistemdir. Kullanıcılar ürün ekleme, listeleme, güncelleme ve silme işlemlerini gerçekleştirebilir, aynı zamanda stok durumlarını ve stok hareket geçmişini takip edebilir.

Kullanılan Teknolojiler
Backend: ASP.NET Core Web API (.NET 9)
Veritabanı: SQL Server
ORM: Entity Framework Core
Frontend: React (Vite)
Diller: C#, JavaScript
Mimari Yapı

Proje katmanlı mimari yapıya uygun olarak geliştirilmiştir:

Entity Katmanı: Veritabanı modelleri
Repository Katmanı: Veri erişim işlemleri
Manager/Service Katmanı: İş kuralları
Controller Katmanı: API endpointleri

Bu yapı, projenin sürdürülebilirliğini, okunabilirliğini ve geliştirilebilirliğini artırmaktadır.

Karşılaşılan Sorunlar ve Çözümler
Yanlış port ve URL kullanımı nedeniyle oluşan API bağlantı hataları, frontend ve backend adreslerinin uyumlu hale getirilmesiyle çözüldü.
Connection string eksikliği ve migration hataları, doğru yapılandırma ile giderildi.
Zorunlu alan hataları (örneğin companyId), request yapısının düzeltilmesiyle çözüldü.
Kullanılmayan zorunlu alanlardan (örneğin ImageUrl) kaynaklı hatalar, alanın kaldırılması veya nullable yapılmasıyla giderildi.
Yapay Zeka Kullanımı

Yapay zeka, geliştirme sürecinde destekleyici olarak kullanılmıştır:

Proje mimarisinin planlanması
Hata çözümü ve debugging süreçleri
Kod yapısının iyileştirilmesi
Frontend tasarım önerileri
Notlar

Proje ilk etapta planlandığı şekilde geliştirilmiştir, ancak karşılaşılan teknik sorunlar nedeniyle yeniden kurgulanmıştır. Bu nedenle bazı kısımlar geliştirmeye açıktır.
