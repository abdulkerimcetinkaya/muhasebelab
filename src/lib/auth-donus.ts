// Anonim kullanıcı bir sayfadan giriş ekranına yönlendiğinde,
// auth + onboarding zinciri sonrası geri döneceği URL'i sessionStorage'da tutarız.
// Onboarding araya girince react-router state kaybolur — sessionStorage hayatta kalır.

const ANAHTAR = 'auth_donus_url';

export const authDonusYaz = (url: string) => {
  try {
    sessionStorage.setItem(ANAHTAR, url);
  } catch {
    // sessionStorage erişilemiyorsa sessizce geç
  }
};

export const authDonusOku = (): string | null => {
  try {
    return sessionStorage.getItem(ANAHTAR);
  } catch {
    return null;
  }
};

export const authDonusTemizle = () => {
  try {
    sessionStorage.removeItem(ANAHTAR);
  } catch {
    // sessizce geç
  }
};
