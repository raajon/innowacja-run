# 🚀 Commerz-Run (Innowacje 2026) — Środowisko Startowe

Repozytorium zawiera szablon aplikacji opartej o **React + TypeScript (Vite)** na frontendzie oraz **Parse Server + MongoDB** na backendzie (uruchamianym w kontenerach Docker).

## 📋 Wymagania wstępne

Przed rozpoczęciem pracy upewnij się, że masz zainstalowane:

* **Node.js** (zalecana wersja **v20.12+** lub **v22+**) oraz `npm`

* **Docker** oraz **Docker Compose** (wtyczka `docker compose`)

* **Visual Studio Code** (opcjonalnie: oficjalna wtyczka **Docker** od Microsoftu do wygodnego podglądu kontenerów)

## 🛠️ 1. Uruchomienie Backendu (Tryb Developerski)

W trakcie codziennego pisania kodu nie budujemy frontendu w Dockerze. Uruchamiamy w kontenerach wyłącznie bazę danych **MongoDB** oraz **Parse Server** wraz z panelem administracyjnym.

1. W głównym katalogu projektu uruchom kontenery backendowe:

   ```
   docker compose up -d
   
   ```

   *(Pierwsze uruchomienie pobierze obrazy i zbuduje kontener `innowacje-parse` — może to potrwać kilkadziesiąt sekund).*

2. Sprawdź, czy kontenery działają poprawnie:

   ```
   docker ps
   
   ```

   Powinieneś zobaczyć dwa aktywne kontenery: `innowacje-mongo` oraz `innowacje-parse`.

### Dostępne adresy backendu (Tryb Dev):

* **Parse API:** `http://localhost:1337/parse`

* **Parse Dashboard (Panel bazy danych):** `http://localhost:1337/dashboard`

  * **Login:** `admin`

  * **Hasło:** `pass`

* **App ID:** `innowacje2026`

## 💻 2. Uruchomienie Frontendu (React + Vite)

Frontend uruchamiamy lokalnie bezpośrednio na swoim komputerze, aby korzystać z błyskawicznego odświeżania zmian (Hot Module Replacement).

1. Zainstaluj zależności projektu (wymagane po pobraniu repozytorium lub zmianach w `package.json`):

   ```
   npm install
   
   ```

2. Uruchom lokalny serwer deweloperski Vite:

   ```
   npm run dev
   
   ```

3. Otwórz aplikację w przeglądarce pod adresem wyświetlonym w terminalu (domyślnie: **`http://localhost:5173`**).

## 🏗️ 3. Budowanie i testowanie wersji produkcyjnej (Full Stack + Nginx + SSL)

Jeśli chcesz przetestować całą aplikację w środowisku zbliżonym do produkcyjnego (gdzie React jest budowany do plików statycznych i serwowany przez serwer **Nginx** z obsługą **HTTPS**):

1. *(Jednorazowo)* Jeśli nie masz jeszcze lokalnych certyfikatów SSL w katalogu `certs/`, wygeneruj je w terminalu:

   ```
   mkdir -p certs
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout certs/key.pem \
     -out certs/server.crt \
     -subj "/C=PL/ST=Lodzkie/L=Lodz/O=Innowacje/CN=localhost" \
     -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
   
   ```

2. Uruchom Docker Compose z profilem produkcyjnym (`prod`):

   ```
   PUBLIC_SERVER_URL=https://localhost/parse docker compose --profile prod up -d --build
   
   ```

3. Wejdź w przeglądarce na:

   * **Aplikacja Frontend:** `https://localhost`

   * **Parse Dashboard:** `https://localhost/dashboard/`
     *(Przy pierwszym wejściu zaakceptuj lokalny certyfikat SSL w przeglądarce: Zaawansowane -> Kontynuuj mimo to).*

## 🧹 Przydatne komendy

| Zadanie | Komenda | 
| ----- | ----- | 
| Zatrzymanie kontenerów | `docker compose down` | 
| Zatrzymanie wszystkich kontenerów (wraz z profilem `prod`) | `docker compose --profile prod down` | 
| Podgląd logów Parse Servera | `docker logs -f innowacje-parse` | 
| Przebudowanie kontenera po zmianach w folderze `server/` | `docker compose up -d --build parse-app` | 
| Sprawdzenie czy frontend buduje się poprawnie (TypeScript + Vite) | `npm run build` | 
