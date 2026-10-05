import { useRef, useState } from "react";
import "./App.css";

const categories = [
    {
        id: 1,
        name: "PC Components",
        description: "Processors, graphics, motherboards and everything inside.",
        code: "CORE",
        image: "/images/products/b850-gaming-wifi6.webp",
        imageClass: "category-image-components",
    },
    {
        id: 2,
        name: "Peripherals",
        description: "Mice, keyboards, audio and precise control.",
        code: "INPUT",
        image: "/images/products/steelseries-rival-5.webp",
        imageClass: "category-image-peripherals",
    },
    {
        id: 3,
        name: "Processors",
        description: "The silicon at the center of every serious system.",
        code: "COMPUTE",
        image: "/images/products/ryzen-5-5600x.webp",
        imageClass: "category-image-processors",
    },
    {
        id: 4,
        name: "Cases & Builds",
        description: "Cases and complete systems built around your hardware.",
        code: "SYSTEM",
        image: "/images/products/antec-ax20-rgb-elite.webp",
        imageClass: "category-image-builds",
    },
];

const products = [
    {
        id: 1,
        brand: "ZOTAC GAMING",
        name: "GeForce RTX 4070",
        type: "GRAPHICS",
        price: "₡429,900",
        image: "/images/products/rtx-4070-zotac.webp",
        imageFit: "wide",
    },
    {
        id: 2,
        brand: "AMD",
        name: "Ryzen 5 5600X",
        type: "PROCESSOR",
        price: "₡89,900",
        image: "/images/products/ryzen-5-5600x.webp",
        imageFit: "square",
    },
    {
        id: 3,
        brand: "GIGABYTE",
        name: "B850 Gaming WiFi6",
        type: "MOTHERBOARD",
        price: "₡119,900",
        image: "/images/products/b850-gaming-wifi6.webp",
        imageFit: "wide",
    },
    {
        id: 4,
        brand: "STEELSERIES",
        name: "Rival 5",
        type: "PERIPHERALS",
        price: "₡39,900",
        image: "/images/products/steelseries-rival-5.webp",
        imageFit: "wide",
    },
    {
        id: 5,
        brand: "STEELSERIES",
        name: "Apex 100",
        type: "KEYBOARD",
        price: "₡34,900",
        image: "/images/products/steelseries-apex-100.webp",
        imageFit: "wide",
    },
    {
        id: 6,
        brand: "ANTEC",
        name: "AX20 RGB Elite",
        type: "CASE",
        price: "₡42,900",
        image: "/images/products/antec-ax20-rgb-elite.webp",
        imageFit: "portrait",
    },
];

function Arrow() {
    return <span aria-hidden="true">↗</span>;
}

function ProductCard( { product, index }) {
    return (
            <article className="product-card">
                <div className="product-visual">
                    <div className="product-label">
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <span>{product.type}</span>
                    </div>
            
                    <img
                        className={`product-image product-image--${product.imageFit}`}
                        src={product.image}
                        alt={`${product.brand} ${product.name}`}
                        />
            
                    <button
                        className="wishlist"
                        type="button"
                        aria-label={`Add ${product.name} to wishlist`}
                        >
                        +
                    </button>
            
                    <span className="product-view">
                        VIEW <Arrow />
                    </span>
                </div>
            
                <div className="product-meta">
                    <div>
                        <p className="product-brand">{product.brand}</p>
                        <h3>{product.name}</h3>
                    </div>
            
                    <div className="product-price">
                        <p>{product.type}</p>
                        <strong>{product.price}</strong>
                    </div>
                </div>
            </article>
            );
}

function CategoryCard( { category, index }) {
    return (
            <a className="category-card" href="#shop">
                <div className="category-top">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>{category.code}</span>
                </div>
            
                <div className="category-media">
                    <span className="category-watermark">
                        {String(index + 1).padStart(2, "0")}
                    </span>
            
                    <img
                        className={category.imageClass}
                        src={category.image}
                        alt=""
                        />
                </div>
            
                <div className="category-content">
                    <div>
                        <h3>{category.name}</h3>
                        <p>{category.description}</p>
                    </div>
            
                    <span className="category-arrow">
                        <Arrow />
                    </span>
                </div>
            </a>
            );
}

function App() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const productGridRef = useRef(null);
    const dragState = useRef({ dragging: false, startX: 0, startScrollLeft: 0 });

    const startProductDrag = (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        const grid = productGridRef.current;
        if (!grid) return;

        dragState.current = {
            dragging: true,
            startX: event.clientX,
            startScrollLeft: grid.scrollLeft,
        };
        grid.classList.add("is-dragging");
        grid.setPointerCapture?.(event.pointerId);
    };

    const moveProductDrag = (event) => {
        const grid = productGridRef.current;
        if (!grid || !dragState.current.dragging) return;

        const deltaX = event.clientX - dragState.current.startX;
        grid.scrollLeft = dragState.current.startScrollLeft - deltaX;
        if (Math.abs(deltaX) > 4) event.preventDefault();
    };

    const endProductDrag = (event) => {
        const grid = productGridRef.current;
        if (!grid) return;
        dragState.current.dragging = false;
        grid.classList.remove("is-dragging");
        if (grid.hasPointerCapture?.(event.pointerId)) {
            grid.releasePointerCapture(event.pointerId);
        }
    };

    return (
            <main>
                <header className="site-header">
                    <a className="brand" href="#top" aria-label="PARDRIT home">
                        <span className="brand-name">PARDRIT</span>
                    </a>
            
                    <nav className="desktop-nav" aria-label="Main navigation">
                        <a href="#shop">SHOP</a>
                        <a href="#categories">CATEGORIES</a>
                        <a href="#build">BUILD A PC</a>
                    </nav>
            
                    <div className="header-actions">
                        <button type="button" className="search-button">SEARCH</button>
                        <button type="button" className="account-button">ACCOUNT</button>
                        <button
                            type="button"
                            className="mobile-menu-button"
                            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobile-menu"
                            onClick={() => setMobileMenuOpen((open) => !open)}
                        >
                            <span className="hamburger" aria-hidden="true">
                                <span></span><span></span><span></span>
                            </span>
                        </button>
                        <button type="button" className="bag-button">BAG (0)</button>
                    </div>

                    <nav
                        id="mobile-menu"
                        className={`mobile-nav ${mobileMenuOpen ? "is-open" : ""}`}
                        aria-label="Mobile navigation"
                    >
                        <a href="#shop" onClick={() => setMobileMenuOpen(false)}>SHOP</a>
                        <a href="#categories" onClick={() => setMobileMenuOpen(false)}>CATEGORIES</a>
                        <a href="#build" onClick={() => setMobileMenuOpen(false)}>BUILD A PC</a>
                        <button type="button" onClick={() => setMobileMenuOpen(false)}>SEARCH</button>
                        <button type="button" onClick={() => setMobileMenuOpen(false)}>ACCOUNT</button>
                    </nav>
                </header>
            
                <section className="hero" id="top">
                    <div className="hero-kicker">
                        <span>HARDWARE / SYSTEMS / PERFORMANCE</span>
                        <span>SAN JOSÉ — CR</span>
                    </div>
            
                    <div className="hero-stage">
                        <h1 className="hero-title">PARDRIT</h1>
                    </div>
            
                    <div className="hero-bottom">
                        <p>
                            Hardware selected for people who care about what happens{" "}
                            <strong>inside the machine.</strong>
                        </p>
            
                        <div className="hero-product-note">
                            <span>CURATED HARDWARE</span>
                            <strong>SAN JOSÉ / COSTA RICA</strong>
                        </div>
            
                        <a className="circle-link" href="#shop" aria-label="Explore shop">
                            <Arrow />
                        </a>
                    </div>
                </section>
            
                <section className="manifesto">
                    <p className="eyebrow">/ 001 — OUR APPROACH</p>
            
                    <div className="manifesto-grid">
                        <div className="manifesto-heading">
                            <h2>
                                LESS NOISE.
                                <br />
                                <span>MORE MACHINE.</span>
                            </h2>
            
                            <div className="manifesto-machine" aria-hidden="true">
                                <span className="machine-number">01 / CORE</span>
            
                                <img
                                    src="/images/products/b850-gaming-wifi6.webp"
                                    alt=""
                                    />
                            </div>
                        </div>
            
                        <div className="manifesto-copy">
                            <p>
                                Components, peripherals and complete setups without the visual
                                chaos of the typical tech store.
                            </p>
            
                            <p>
                                Serious hardware. Clear information. A store designed with the
                                same attention we expect from the products we sell.
                            </p>
            
                            <div className="manifesto-spec">
                                <span>CURATED HARDWARE</span>
                                <span>CR / 2026</span>
                            </div>
                        </div>
                    </div>
                </section>
            
                <section className="categories" id="categories">
                    <div className="categories-heading">
                        <div>
                            <p className="eyebrow">/ 002 — FIND YOUR HARDWARE</p>
            
                            <h2>
                                START WITH
                                <br />
                                WHAT YOU NEED.
                            </h2>
                        </div>
            
                        <p className="categories-intro">
                            Explore the store by category. The catalog grows without changing
                            the layout.
                        </p>
                    </div>
            
                    <div className="category-grid">
                        {categories.map((category, index) => (
                                        <CategoryCard
                                            key={category.id}
                                            category={category}
                                            index={index}
                                            />
                                                ))}
                    </div>
                </section>
            
                <section className="shop" id="shop">
                    <div className="shop-header">
                        <div>
                            <p className="eyebrow">/ 003 — SELECTED HARDWARE</p>
                            <h2>NEW HARDWARE</h2>
                        </div>
            
                        <a href="#all-products">
                            VIEW ALL <Arrow />
                        </a>
                    </div>
            
                    <div
                            className="product-grid"
                            id="all-products"
                            ref={productGridRef}
                            onPointerDown={startProductDrag}
                            onPointerMove={moveProductDrag}
                            onPointerUp={endProductDrag}
                            onPointerCancel={endProductDrag}
                            onPointerLeave={endProductDrag}
                        >
                        {products.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    index={index}
                                    />
                                        ))}
                    </div>
                </section>
            
                <section className="statement" id="build">
                    <div className="statement-top">
                        <span>BUILD / PLAY / CREATE</span>
                        <span>HARDWARE WITH INTENT</span>
                    </div>
            
                    <div className="statement-layout">
                        <h2>
                            YOUR SETUP
                            <br />
                            SHOULDN'T LOOK
                            <br />
                            <em>ACCIDENTAL.</em>
                        </h2>
                    </div>
            
                    <div className="statement-footer">
                        <p>
                            Performance starts with choosing the right pieces.
                            <br />
                            We'll handle the noise.
                        </p>
            
                        <a href="#shop">
                            START BUILDING <Arrow />
                        </a>
                    </div>
                </section>
            
                <footer>
                    <div className="footer-brand">PARDRIT</div>
            
                    <div className="footer-grid">
                        <p>
                            Technology selected
                            <br />
                            in Costa Rica.
                        </p>
            
                        <div>
                            <a href="#shop">SHOP</a>
                            <a href="#categories">CATEGORIES</a>
                            <a href="#build">BUILD A PC</a>
                        </div>
            
                        <div>
                            <a href="#support">SUPPORT</a>
                            <a href="#shipping">SHIPPING</a>
                            <a href="#contact">CONTACT</a>
                        </div>
            
                        <p className="footer-copy">
                            © 2026
                            <br />
                            PORTFOLIO PROJECT
                        </p>
                    </div>
                </footer>
            </main>
            );
}

export default App;