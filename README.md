# Ujjawal Tour & Travels — Web Booking Application

A production-grade travel booking web application designed and built for **Ujjawal Tour & Travels**, based in Hariom Nagar, Samneghat, Lanka, Varanasi, Uttar Pradesh, India.

---

## 1. Verified Vehicle Fleet & Asset Integration

The application integrates the four reference vehicle assets into `/public/assets/vehicles/` and serves them across all components:

| Vehicle Display Name | Category | Asset Filename | Registration Plate / Identifying Details |
|---|---|---|---|
| **Maruti Suzuki Dzire** | Sedan | `maruti-suzuki-dzire.png` | Displays **DZIRE** on front plate, clean white sedan |
| **Maruti Suzuki Ertiga** | MPV | `maruti-suzuki-ertiga.png` | Displays **ERTIGA** on front plate, 6+1 family MPV |
| **Toyota Innova** | MPV | `toyota-innova-reference.png` | Toyota badge, roof-mounted luggage carrier rack |
| **Tata Zest** | Sedan | `tata-zest.png` | Displays **ZEST** on front plate, compact sedan |
| **Force Tempo Traveller** | Group Van | `force-traveller.png` | Provisional entry for 13+ seat group pilgrimage tours |

### Central Data Source
All vehicles share a single persistent model in `server/db.ts` and `data/db.json`, reused consistently across:
- **Homepage Brochure Carousel**: Overlapping, touch-swipeable brochure deck with depth layering.
- **Fare Calculator**: Selecting a car in the brochure auto-selects it in the calculator.
- **Booking Enquiry**: Carries over selected vehicle ID, name, tariff, and estimate reference.
- **Admin Dashboard**: Full CRUD over vehicle tariffs, images, and active/inactive status.

---

## 2. Brand Identity & Visual Theme

- **Color Palette**: Fire red (`#B5222A`), deep crimson (`#821B25`), sand beige (`#F3E8D5`), warm beige (`#E8D5B5`), ivory cream (`#FFF9F0`), antique gold (`#C69A52`), and dark charcoal (`#292321`).
- **Signature Stamp Watermark**: Engraved circular stamp featuring a ceremonial priest silhouette holding the multi-tiered brass **Ganga Aarti lamp** aloft over Dashashwamedh ghat steps and sacred river Ganga waves. Sits quietly in the background at 5–12% opacity.
- **Authentic Varanasi Photography**: Real Ganga Aarti dusk artwork and heritage landmarks without generic stock photos.

---

## 3. Server-Powered Fare Calculation Engine

Endpoint: `POST /api/fare-estimates`

1. **Highway Road Distance**: Uses Varanasi highway network routing (e.g., Prayagraj 125 km, Ayodhya 218 km, Bodh Gaya 254 km, Babatpur Airport 26–32 km, Local 8hr/80km package).
2. **Itemized Billing**:
   - Base fare
   - Billable distance charges (`billableKm × perKmRate`)
   - Driver allowance (applied for outstation / round trips)
   - Night charges (applied between 22:00 and 06:00)
   - **Configurable ₹200 Adjustment**: Applied strictly once per eligible estimate when enabled by admin.
   - Transparent exclusions note for tolls and monument parking.

---

## 4. Admin Management Dashboard

- Accessible via the **Shield** icon in the header or footer link.
- **Credentials**: `admin` / `admin123`
- **Features**:
  - Operational KPIs & Enquiry counts
  - Search & filter booking enquiries by status (`New enquiry`, `Quotation sent`, `Booking confirmed`, etc.)
  - Record agreed final prices and staff dispatch notes
  - Vehicle management (tariffs, base fares, plate tags, active toggles)
  - Pricing rules & ₹200 adjustment settings
  - Editable business details (Phone: `7651944600`, `8934045614`, Address: `Hariom Nagar, Samneghat, Lanka, Varanasi`)

---

## 5. Development & Production Run

```bash
# Start development server (serves on port 3000)
npm run dev

# Run TypeScript linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```
