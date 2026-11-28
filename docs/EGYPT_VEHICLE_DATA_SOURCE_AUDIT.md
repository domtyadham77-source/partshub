# Egypt vehicle specification source audit

Checked: 2026-11-28  
Target: Parts Hub preview vehicle selector. This is a staged source audit, not a claim that every Egyptian make/model has been completely verified.

## Source order used for vehicle records

1. **Egyptian authorized distributor / official Egypt market brochure** for the exact model year and trim.
2. **Manufacturer's official Egypt or Middle East page** where the Egypt market is explicitly identified.
3. **Manufacturer global specification** only as a cross-check; never substitute it for Egypt-market fitment without marking the market difference.
4. **Independent Egyptian car catalogs** (for example Instadriv, AutoFyon, Hatla2ee / 3arabeyti) as secondary cross-checks for model names, years and local variants, not as sole authority for a technical fitment record.
5. **TecDoc / supplier fitment references** for later parts compatibility validation. A vehicle specification alone is not enough to claim that a particular spare part fits.

## Sources reviewed for the initial audited group

| Make | Source | Use / caveat |
|---|---|---|
| Toyota | Toyota Egypt Corolla model page and official Corolla 2026 brochure | Source for Egypt Corolla 2026 trims, engine capacities, output, torque and transmission. |
| Hyundai | Hyundai Egypt Elantra AD brochure | Local trim/equipment cross-check. The engine/year details in the existing entry still require a separate exact powertrain confirmation before broadening its year range. |
| Chevrolet | Chevrolet Middle East/Egypt Aveo brochure | Historical Egypt Aveo reference; do not use for newer generations or other markets. |
| MG | MG Egypt official brochure library and buying guide | Egypt model and engine-output cross-check; each model's downloadable brochure must be checked before adding exact engine variants. |
| JAC | JAC Egypt JS4 2026 brochure | Exact local JS4 2026 variant and powertrain source. |
| BYD | BYD Egypt authorized distributor and Contigo authorized distributor lineup | Confirms Egypt-market model lineup/distributor; technical engine/motor specs require each model's own local brochure. |
| Geely | Geely official Egypt launch announcement for Cityray | Confirms local model and published engine/output; exact trim and engine code need local brochure confirmation. |
| Chery | Chery Egypt / GB Auto official launch announcement | Confirms local model availability; variant-specific engine data requires model brochure. |
| Mercedes-Benz | Mercedes-Benz technical certificate for C-Class | Global technical cross-check only; it is not sufficient by itself to verify Egypt C180 year/trim/transmission fitment. |

## Independent cross-check sites

- Instadriv Egypt: https://eg.instadriv.com/en/new-cars/compare
- AutoFyon Egypt: https://autofyon.com/en/cars
- Hatla2ee: https://www.hatla2ee.com/
- 3arabeyti: https://3arabeyti.com/brands

These sites are useful to discover local model/trim names and detect disagreements. They do not override an official Egypt brochure.

## Data entry rules

- Keep separate records for model generation, model year, engine, fuel/powertrain, transmission, trim and market.
- Do not infer a model year range from one brochure year or from a current used-car listing.
- Do not convert a nominal 1.6L label into an exact displacement unless the source states it.
- Record engine code when the source provides it; engine displacement alone is not enough for reliable parts fitment.
- Distinguish hybrid engine output from combined system output, and distinguish engine cc from electric motor power.
- Do not mark a model as supported merely because a brand card exists.
- If sources conflict or a variant is unclear, leave it disabled / marked for verification instead of guessing.
- Product compatibility must additionally be verified using OEM part number, engine code, chassis/generation and applicable production dates when available.

## Status

The catalog is still a verified sample. Toyota Corolla Egypt 2026 was added with the two powertrain entries shown in the official brochure. Other makes remain limited to their current sample records until their exact local brochures and variant tables are checked. The source list will expand model-by-model; no blanket claim of full coverage is made.
