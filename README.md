# 🏥 CarePulse – Gesundheitsmanagement-System
CarePulse ist ein modernes und umfassendes Gesundheitsmanagement-System, entwickelt mit Next.js und TailwindCSS. Die Anwendung bietet Patienten und Ärzten eine intuitive Plattform zur Terminverwaltung, Patientenregistrierung und administrativen Aufgaben – alles in einer einzigen, benutzerfreundlichen Oberfläche.

## 🎯 Ziel des Projekts
- Erleichterung der Terminverwaltung für Patienten und Ärzte.
- Sicherstellung einer klaren Kommunikation durch eine strukturierte Patientendatenbank.
- Optimierung von Workflows durch Automatisierung und moderne Technologien.
- Bereitstellung eines intuitiven Dashboards für Administratoren.

## 🌟 Features
- Terminplanung mit automatischer Validierung und detaillierten Angaben.
- Patientenregistrierung mit Erfassung persönlicher und medizinischer Informationen.
- Rollenbasierter Zugriff (Admin-Ansicht & Patientenansicht).
- Statistiken zur Überwachung geplanter, anstehender und abgesagter Termine.
- Fehlerüberwachung und -behebung mittels Sentry-Integration.
- Responsives Design, optimiert für Desktop- und mobile Geräte.
- Datenschutz und Sicherheitsmaßnahmen durch individuelle Einwilligungen.

## 📂 Projektstruktur
```
/
├── components/              # Wiederverwendbare Komponenten (Forms, Buttons, Tables)
├── lib/                     # API-Aufrufe, Validierungen und Hilfsfunktionen
├── pages/                   # Seiten (Home, Admin, Register, Appointment)
├── public/                  # Statische Dateien und Assets (Bilder, Icons)
├── styles/                  # Globale CSS-Dateien (TailwindCSS-Konfiguration)
├── types/                   # Typdefinitionen (z. B. für Appwrite)
└── tailwind.config.ts       # TailwindCSS-Konfigurationsdatei
```

## 🚀 Technologien
- Next.js: React-Framework für serverseitiges Rendering und API-Integration.
- TailwindCSS: Utility-First CSS-Framework für schnelle und anpassbare Gestaltung.
- TypeScript: Statische Typisierung für robusten Code.
- Sentry: Fehlerüberwachung und Leistungsmetriken.
- Zod: Validierung von Formulardaten.
- Appwrite: Backend-Service für Benutzerdatenverwaltung und -authentifizierung.

## 📝 Lernpunkte
Während der Entwicklung dieses Projekts wurden folgende Technologien und Konzepte vertieft:

- Integration von formulargestützter Validierung mit Zod und React-Hook-Form.
- Nutzung von Sentry zur Echtzeit-Fehlerüberwachung.
- Erstellung von dynamischen Dashboards und Tabellen mit Echtzeitdaten.
- Implementierung von rollenspezifischen Ansichten für Patienten und Administratoren.
- Verwendung von TailwindCSS zur schnellen Gestaltung und Anpassung des Designs.

## ⚙️ Installation und Verwendung
### 1. Repository klonen:
```
git clone https://github.com/PeterKlass/gm_kontakt.git
cd gm_kontakt
```

### 2. Abhängigkeiten installieren:
```
npm install
```

### 3. Entwicklungsserver starten:
```
npm run dev
```

### 4. Öffne die App in deinem Browser unter:
```
http://localhost:3000
```

### 5. Produktions-Build erstellen:
```
npm run build
```

### 6. Vorschau des Builds anzeigen:
```
npm start
```

## 🖥️ Live-Demo
Die Live-Version dieses Projekts ist hier verfügbar: https://gm-kontakt.vercel.app/

## 🔗 Weitere Projekte
Weitere Projekte von mir findest du hier: https://github.com/PeterKlass
