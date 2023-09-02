welcome = Hej { $name }!
  Miło mi cię poznać 😁
  Wysyłam powiadomienia o dostępnych ofertach z aplikacji Foodsi 🤤
  Oto lista poleceń:
    /setcity - ustawienie miasta skąd brane są dla Ciebie oferty
    /setfilters - ustawienie filtrów dla ofert z twojego miasta
    /cities - wyświetl listę dostępnych miast
    /help - wyświetl pomocne strony
welcome-back = Hej { $name } - super, że wróciłeś 😁
  W razie gdybyś zapomniał, o to dostępne polecenia:
    /setcity - ustawienie miasta skąd brane są dla Ciebie oferty
    /setfilters - ustawienie filtrów dla ofert z twojego miasta
    /cities - wyświetl listę dostępnych miast
    /help - wyświetl pomocne strony
city-list = Przeszukuje oferty z miast:

  { $cities }
unexpected-error = Ups...! Coś poszło nie tak, spróbuj ponownie później 😥
missing-session-error = Ups...! Wygląda na to, że jeszcze nie jestem wstanie wysyłać Tobie powiadomień 😥
  Proszę, użyj polecenia /setcity
help = Jeżeli potrzebujesz pomocy:
  - Telegram - https://t.me/unsoldfooddeals
  - GitHub - https://github.com/pjamroziak/unsold-food-deals
  - Wsparcie - https://buycoffee.to/pjamroziak
setcity-welcome = Potrzebuje twoją lokalizację, aby przypisać cię do danego miasta 🦐🍜
  Możesz mi ją wysłać na dwa różne sposoby:
  - użyj przycisku poniżej
  - wyślij lokalizację jako załącznik

  Jeżeli chcesz przerwać proces, użyj polecenia /cancel
setcity-cancel = Konfiguracja przerwana 😥 
  Możesz rozpocząć proces ponownie, używając polecenia /setcity 😁
setcity-send-location-btn = Wyślij lokalizację
setcity-location-found = Znalazłem - { $city }! Czy chcesz otrzymywać powiadomienia z tego miasta?
setcity-location-not-found = Niestety, nie obsługuję żadnego miasta w twojej okolicy 😥 
  Możesz sprawdzić listę obsługiwanych miast poprzez polecenie /cities 😁
setcity-location-again = Czekam na twoją lokalizację 😁 
  Jeżeli chcesz przerwać proces, użyj polecenia /cancel
setcity-finish = Udało się! Od teraz będę Ci wysyłać powiadomienia o dostępnych ofertach
setfilters-welcome = Potrafię wyfiltrować oferty z twojego miasta bazując na nazwach miejsc skąd pochodzą 😁
  Wyślij mi listę filtrów (maksymalnie *5* o maksymalnej długości *32* znaków *oddzielonych spacją*):
  
  piekarnia kwiaciarnia grono winoteka lodów

  Jeżeli chcesz usunąć dotychczasowe filtry, użyj polecania /empty
  Jeżeli chcesz przerwać proces, użyj polecenia /cancel
setfilters-error = Lista jest nieprawidłowa, spróbuj ponownie lub użyj polecenia /cancel 😥
setfilters-cancel = Lista twoich filtrów pozostała bez zmian. 
  Możesz rozpocząć proces ponownie, używając polecenia /setfilters 😁
setfilters-empty-finish = Udało się! Od teraz będę wysyłał Ci wszystkie znalezione oferty 😁
setfilters-finish = Udało się! Od teraz będę filtrował dla Ciebie oferty, używając poniższych filtrów:

  { $filters }

