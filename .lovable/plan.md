

# Şifre Göster/Gizle Butonu Ekleme

`src/pages/AdminUsers.tsx` dosyasındaki iki şifre alanına (yeni kullanıcı oluşturma ve şifre değiştirme) göz ikonu ile şifreyi göster/gizle toggle butonu eklenecek.

### Değişiklikler

**`src/pages/AdminUsers.tsx`**:
1. `lucide-react`'ten `Eye` ve `EyeOff` ikonları import edilecek
2. İki state eklenecek: `showNewPassword` ve `showChangePassword`
3. Her iki `Input` alanı bir `div relative` ile sarılacak, sağ tarafa göz ikonu butonu eklenecek
4. `type` değeri state'e göre `"password"` veya `"text"` olacak

