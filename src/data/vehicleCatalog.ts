export type EngineVariant = { label: string; cc: number; code?: string; fuel: string; transmissions: string[]; trims?: string[]; years: [number, number]; source: string };
export type VehicleModel = { id: string; name: string; generation?: string; years: [number, number]; engines: EngineVariant[] };
export type VehicleMake = { id: string; name: string; models: VehicleModel[] };

// Egypt-market entries only where a published specification supports the engine details.
// Expand this catalog only after checking the exact market, model year and variant.
export const vehicleCatalog: VehicleMake[] = [
 { id:"chevrolet", name:"Chevrolet", models:[
  {id:"aveo",name:"Aveo",generation:"Aveo · Egypt 2018–2020",years:[2018,2020],engines:[{label:"1.5L Petrol · 1498 cc",cc:1498,fuel:"Petrol",transmissions:["Manual 5-speed","Automatic 4-speed"],trims:["Trim not specified in brochure"],years:[2018,2020],source:"https://www.chevroletarabia.com/content/dam/chevrolet/middle-east/egypt/english/index/cars/2019-aveo/mov/02-pdfs/aveo.pdf"}]}
 ]},
 { id:"hyundai", name:"Hyundai", models:[
  {id:"elantra-ad",name:"Elantra AD",generation:"AD",years:[2024,2026],engines:[{label:"1.6 MPI Petrol · 1600 cc (nominal)",cc:1600,fuel:"Petrol",transmissions:["Automatic 6-speed"],trims:["Baseline","Modern","Topline"],years:[2024,2026],source:"https://hyundai-egypt.net/wp-content/uploads/2024/08/Elantra-AD-Brochure_updated.pdf"}]}
 ]},
 { id:"mercedes-benz", name:"Mercedes-Benz", models:[
  {id:"c-class-w205-c180",name:"C-Class W205 · C180",generation:"W205",years:[2015,2015],engines:[{label:"1.595L Petrol · 1595 cc",cc:1595,fuel:"Petrol",transmissions:["Market-specific · verify"],trims:["C180"],years:[2015,2015],source:"https://group.mercedes-benz.com/documents/sustainability/product/daimler-environmental-certificate-mb-c-class.pdf"}]}
 ]}
];

export const vehicleDataSources = [
 {name:"Chevrolet Egypt / Middle East official 2019 Aveo brochure",url:"https://www.chevroletarabia.com/content/dam/chevrolet/middle-east/egypt/english/index/cars/2019-aveo/mov/02-pdfs/aveo.pdf"},
 {name:"Hyundai Egypt Elantra AD brochure",url:"https://hyundai-egypt.net/wp-content/uploads/2024/08/Elantra-AD-Brochure_updated.pdf"},
 {name:"Mercedes-Benz C-Class technical environmental certificate",url:"https://group.mercedes-benz.com/documents/sustainability/product/daimler-environmental-certificate-mb-c-class.pdf"},
 {name:"NHTSA vPIC vehicle API (basic make/model and VIN data; US-market coverage limits apply)",url:"https://vpic.nhtsa.dot.gov/api/"},
 {name:"TecAlliance TecDoc reference data (regional vehicle and engine fitment structure)",url:"https://www.tecalliance.net/products/cards/tecdoc-reference-data"}
];
