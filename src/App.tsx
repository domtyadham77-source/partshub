import { useMemo, useState } from "react";
import { Search, ShoppingCart, SlidersHorizontal, Wrench, Bike, CarFront, ArrowUpRight, ShieldCheck, Truck, Headphones } from "lucide-react";

type Category = "All" | "Car parts" | "Motorcycle parts" | "Workshop";
type Product = { id: number; name: string; category: Exclude<Category, "All">; fitment: string; price: number; seller: string; rating: number; tag?: string };

const products: Product[] = [
  { id: 1, name: "Premium ceramic brake pads", category: "Car parts", fitment: "Toyota Corolla · 2017–2022", price: 1850, seller: "AutoLine Egypt", rating: 4.9, tag: "Bestseller" },
  { id: 2, name: "High-flow air filter", category: "Car parts", fitment: "Hyundai Elantra · 2016–2023", price: 920, seller: "Performance Hub", rating: 4.8 },
  { id: 3, name: "Motorcycle chain kit", category: "Motorcycle parts", fitment: "Honda CBR · 150cc", price: 2450, seller: "Moto District", rating: 4.7, tag: "New" },
  { id: 4, name: "LED headlight pair", category: "Car parts", fitment: "Universal · H7 socket", price: 1350, seller: "LightWorks", rating: 4.6 },
  { id: 5, name: "Full synthetic engine oil", category: "Workshop", fitment: "5W-40 · 4 litres", price: 1680, seller: "Engine Care", rating: 4.9 },
  { id: 6, name: "Sport motorcycle mirrors", category: "Motorcycle parts", fitment: "Universal handlebar mount", price: 780, seller: "Moto District", rating: 4.5 }
];

const money = (value: number) => new Intl.NumberFormat("en-EG", { style: "currency", currency: "EGP", maximumFractionDigits: 0 }).format(value);

export default function App() {
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const visible = useMemo(() => products.filter((item) =>
    (category === "All" || item.category === category) &&
    (item.name + item.fitment + item.seller).toLowerCase().includes(query.toLowerCase())
  ), [category, query]);

  return <div className="app-shell">
    <header className="site-header">
      <a className="brand" href="#" aria-label="Parts Hub home"><span className="brand-mark"><Wrench size={21}/></span><span>PARTS<span className="brand-accent">HUB</span></span></a>
      <nav className="desktop-nav" aria-label="Main navigation">
        <a className="active" href="#parts">Explore parts</a><a href="#categories">Categories</a><a href="#workshops">Workshops</a><a href="#sell">Sell with us</a>
      </nav>
      <button className="cart-button" aria-label={`Shopping cart, ${cartCount} items`}><ShoppingCart size={19}/><span>Cart</span><b>{cartCount}</b></button>
    </header>

    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot"/> THE AUTOMOTIVE MARKETPLACE</span>
          <h1>Find the right part.<br/><span>Drive with confidence.</span></h1>
          <p>Discover quality car and motorcycle parts from trusted Egyptian sellers, all in one place.</p>
          <div className="hero-search"><Search size={20}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search parts, brands or vehicle model..." aria-label="Search products"/><button onClick={() => document.getElementById("parts")?.scrollIntoView({ behavior: "smooth" })}>Search</button></div>
          <div className="hero-meta"><span><ShieldCheck size={16}/> Trusted sellers</span><span><Truck size={16}/> Delivery options</span><span><Headphones size={16}/> Local support</span></div>
        </div>
        <div className="hero-art" aria-label="Automotive parts illustration"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="hero-wheel"><div className="wheel-inner"><Wrench size={76} strokeWidth={1.1}/></div></div><span className="art-label label-top">BUILT FOR THE ROAD</span><span className="art-label label-bottom">PARTS · PEOPLE · PERFORMANCE</span><div className="art-chip"><span className="chip-dot"/> QUALITY FIRST</div></div>
      </section>

      <section className="trust-strip" aria-label="Marketplace benefits"><div><ShieldCheck/><span><b>Seller transparency</b><small>Know who you're buying from</small></span></div><div><Truck/><span><b>Delivery choices</b><small>Options that suit your order</small></span></div><div><Wrench/><span><b>Parts & workshops</b><small>Everything automotive</small></span></div><div><Headphones/><span><b>Support when needed</b><small>Help through your journey</small></span></div></section>

      <section className="catalog-section" id="parts">
        <div className="section-heading"><div><span className="eyebrow">THE RIGHT GEAR</span><h2>Explore the marketplace</h2><p>Find dependable parts for every ride.</p></div><button className="filter-button"><SlidersHorizontal size={17}/> Filters</button></div>
        <div className="category-tabs" id="categories">{(["All", "Car parts", "Motorcycle parts", "Workshop"] as Category[]).map((item) => <button key={item} className={category === item ? "selected" : ""} onClick={() => setCategory(item)}>{item === "Car parts" ? <CarFront size={17}/> : item === "Motorcycle parts" ? <Bike size={17}/> : item === "Workshop" ? <Wrench size={17}/> : null}{item}</button>)}</div>
        <div className="results-line"><span>{visible.length} items to explore</span><span>Curated marketplace <ArrowUpRight size={15}/></span></div>
        <div className="product-grid">{visible.map((item, index) => <article className="product-card" key={item.id}><div className={`product-visual visual-${index % 4}`}>{item.category === "Motorcycle parts" ? <Bike size={66} strokeWidth={1}/> : item.category === "Workshop" ? <Wrench size={66} strokeWidth={1}/> : <CarFront size={66} strokeWidth={1}/ >}{item.tag && <span className="product-tag">{item.tag}</span>}<span className="visual-code">PH / 0{item.id}</span></div><div className="product-info"><span className="product-category">{item.category}</span><h3>{item.name}</h3><p>{item.fitment}</p><div className="seller-line"><span>{item.seller}</span><span>★ {item.rating}</span></div><div className="product-bottom"><b>{money(item.price)}</b><button aria-label={`Add ${item.name} to cart`} onClick={() => setCartCount((count) => count + 1)}>+</button></div></div></article>)}</div>
        {visible.length === 0 && <div className="empty-results"><Search size={28}/><h3>No matching parts found</h3><p>Try another search or choose a different category.</p><button onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button></div>}
      </section>

      <section className="seller-banner" id="sell"><div><span className="eyebrow">GROW WITH PARTS HUB</span><h2>Your business.<br/><span>More customers.</span></h2><p>Connect your inventory with drivers and workshops looking for the right parts.</p><a href="mailto:partners@partshub.example">Become a seller <ArrowUpRight size={17}/></a></div><div className="banner-icon"><Wrench size={100} strokeWidth={1}/><span>PARTNER NETWORK / EG</span></div></section>
      <section className="workshop-note" id="workshops"><div className="workshop-icon"><Wrench/></div><div><h3>Need a trusted workshop?</h3><p>We're building a network of garages and maintenance centers to make your next repair easier.</p></div><span className="coming-soon">COMING SOON</span></section>
    </main>
    <footer className="site-footer"><a className="brand" href="#"><span className="brand-mark"><Wrench size={18}/></span><span>PARTS<span className="brand-accent">HUB</span></span></a><span>Parts for the road ahead.</span><small>© {new Date().getFullYear()} Parts Hub. Marketplace preview.</small></footer>
  </div>;
}