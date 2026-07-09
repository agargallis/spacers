# Spacers Athens — Official Site

Επίσημη ιστοσελίδα της μπασκετικής ομάδας **Spacers**, με δύο τμήματα (**Main** &
**Beta**) και εναλλαγή context από ένα κεντρικό toggle. Δεδομένα (βαθμολογίες,
πρόγραμμα, αποτελέσματα, ρόστερ, video) αντλούνται από το προφίλ της ομάδας στο
[Basketaki The League](https://www.basketaki.com).

## Tech stack

- **React 19** + **Vite**
- **Tailwind CSS 4**
- **React Router 7** (single-page, scroll-spy navigation)
- **Framer Motion** (animations)
- **Zustand** (global `activeTeam` state, persisted)

## Αρχιτεκτονική

- `src/services/` — data layer με async, team-aware functions. Σήμερα διαβάζουν
  από local mock data / localStorage· είναι έτοιμα να αντικατασταθούν από
  πραγματικό API ή Supabase **χωρίς αλλαγές στα components**.
- `src/data/` — mock/seed data (σκραπαρισμένα πραγματικά δεδομένα από basketaki).
- `src/store/` — Zustand stores (ενεργή ομάδα, admin auth, content revision).
- `src/components/sections/` — οι ενότητες της ενιαίας σελίδας.
- Κρυφή σελίδα διαχείρισης στο `/admin` (CRUD πάνω στα δεδομένα, per team).

## Ανάπτυξη

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build στο dist/
npm run preview
```
