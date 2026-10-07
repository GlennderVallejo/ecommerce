import { useEffect, useRef, useState } from "react";
import "./App.css";

import AccountModal from "./components/AccountModal";
import CartDrawer from "./components/CartDrawer";

import {
    addToCart,
    getCart,
    getCategories,
    getProducts,
} from "./services/api";

const categoryPresentation = {
    Electronics: {
        name: "PC Components",
        description: "Graphics, components and everything inside.",
        code: "CORE",
        image: `${import.meta.env.BASE_URL}images/products/b850-gaming-wifi6.webp",
        imageFit: "wide",
    },
    Peripherals: {
        name: "Peripherals",
        description: "Mice, keyboards and precise control.",
        code: "INPUT",
        image: `${import.meta.env.BASE_URL}images/products/steelseries-rival-5.webp",
        imageFit: "wide",
    },
    Processors: {
        name: "Processors",
        description: "The silicon at the center of every serious system.",
        code: "COMPUTE",
        image: `${import.meta.env.BASE_URL}images/products/ryzen-5-5600x.webp",
        imageFit: "square",
    },
    Cases: {
        name: "Cases & Builds",
        description: "Cases and complete systems built around your hardware.",
        code: "SYSTEM",
        image: `${import.meta.env.BASE_URL}images/products/antec-ax20-rgb-elite.webp",
        imageFit: "portrait",
    },
};

const productPresentation = {
    "GeForce RTX 4070": {
        brand: "ZOTAC GAMING",
        type: "GRAPHICS",
        image: `${import.meta.env.BASE_URL}images/products/rtx-4070-zotac.webp",
        imageFit: "wide",
    },
    "Ryzen 5 5600X": {
        brand: "AMD",
        type: "PROCESSOR",
        image: `${import.meta.env.BASE_URL}images/products/ryzen-5-5600x.webp",
        imageFit: "square",
    },
    "B850 Gaming WiFi6": {
        brand: "GIGABYTE",
        type: "MOTHERBOARD",
        image: `${import.meta.env.BASE_URL}images/products/b850-gaming-wifi6.webp",
        imageFit: "wide",
    },
    "Rival 5": {
        brand: "STEELSERIES",
        type: "PERIPHERALS",
        image: `${import.meta.env.BASE_URL}images/products/steelseries-rival-5.webp",
        imageFit: "wide",
    },
    "Apex 100": {
        brand: "STEELSERIES",
        type: "KEYBOARD",
        image: `${import.meta.env.BASE_URL}images/products/steelseries-apex-100.webp",
        imageFit: "wide",
    },
    "AX20 RGB Elite": {
        brand: "ANTEC",
        type: "CASE",
        image: `${import.meta.env.BASE_URL}images/products/antec-ax20-rgb-elite.webp",
        imageFit: "portrait",
    },
};

function formatPrice(price) {
    return `₡${Number(price).toLocaleString("en-US", {
        maximumFractionDigits: 0,
    })}`;
}

function Arrow() {
    return <span aria-hidden="true">↗</span>;
}

function ProductCard({ product, index, onAddToCart }) {
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
                    aria-label={`Add ${product.name} to bag`}
                    title="Add to bag"
                    onClick={() => onAddToCart(product)}
                >
                    +
                </button>

                <span className="product-view">
                    ADD <Arrow />
                </span>
            </div>

            <div className="product-meta">
                <div>
                    <p className="product-brand">{product.brand}</p>
                    <h3>{product.name}</h3>
                </div>

                <div className="product-price">
                    <p>{product.type}</p>
                    <strong>{formatPrice(product.price)}</strong>
                </div>
            </div>
        </article>
    );
}

function CategoryCard({ category, index }) {
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
                    className={`category-image category-image--${category.imageFit}`}
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

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [catalogError, setCatalogError] = useState(false);

    const [accountOpen, setAccountOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);

    const [authenticated, setAuthenticated] = useState(
        Boolean(localStorage.getItem("pardrit_token"))
    );

    const [cart, setCart] = useState([]);

    const productGridRef = useRef(null);

    const dragState = useRef({
        dragging: false,
        startX: 0,
        startScrollLeft: 0,
    });

    const cartQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const loadCart = async () => {
        if (!localStorage.getItem("pardrit_token")) {
            setCart([]);
            return;
        }

        try {
            const cartData = await getCart();

            setCart((currentCart) => {
                if (currentCart.length === 0) {
                    return cartData;
                }

                const currentOrder = new Map(
                    currentCart.map((item, index) => [
                        item.productId,
                        index,
                    ])
                );

                return [...cartData].sort((a, b) => {
                    const aIndex =
                        currentOrder.get(a.productId) ??
                        Number.MAX_SAFE_INTEGER;

                    const bIndex =
                        currentOrder.get(b.productId) ??
                        Number.MAX_SAFE_INTEGER;

                    return aIndex - bIndex;
                });
            });
        } catch (error) {
            console.error("PARDRIT cart error:", error);

            if (
                error.message === "Unauthorized" ||
                error.message.includes("401")
            ) {
                localStorage.removeItem("pardrit_token");
                setAuthenticated(false);
                setCart([]);
            }
        }
    };

    useEffect(() => {
        const loadCatalog = async () => {
            try {
                const [productsData, categoriesData] =
                    await Promise.all([
                        getProducts(),
                        getCategories(),
                    ]);

                const enrichedProducts = productsData.map(
                    (product) => {
                        const presentation =
                            productPresentation[product.name] ?? {};

                        return {
                            ...product,
                            brand:
                                presentation.brand ?? "PARDRIT",
                            type:
                                presentation.type ??
                                product.categoryName?.toUpperCase() ??
                                "HARDWARE",
                            image:
                                presentation.image ??
                                `${import.meta.env.BASE_URL}images/products/b850-gaming-wifi6.webp",
                            imageFit:
                                presentation.imageFit ?? "wide",
                        };
                    }
                );

                const enrichedCategories = categoriesData
                    .filter(
                        (category) =>
                            categoryPresentation[category.name]
                    )
                    .map((category) => ({
                        ...category,
                        ...categoryPresentation[category.name],
                    }));

                setProducts(enrichedProducts);
                setCategories(enrichedCategories);
                setCatalogError(false);
            } catch (error) {
                console.error(
                    "PARDRIT catalog error:",
                    error
                );
                setCatalogError(true);
            }
        };

        loadCatalog();
        loadCart();
    }, []);

    const handleLogin = async () => {
        setAuthenticated(true);
        await loadCart();
    };

    const handleLogout = () => {
        localStorage.removeItem("pardrit_token");

        setAuthenticated(false);
        setCart([]);
        setAccountOpen(false);
    };

    const handleAccountClick = () => {
        if (authenticated) {
            const shouldLogout = window.confirm(
                "You are signed in. Do you want to sign out?"
            );

            if (shouldLogout) {
                handleLogout();
            }

            return;
        }

        setAccountOpen(true);
    };

    const handleBagClick = async () => {
        if (!authenticated) {
            setAccountOpen(true);
            return;
        }

        await loadCart();
        setCartOpen(true);
    };

    const handleAddToCart = async (product) => {
        if (!authenticated) {
            setAccountOpen(true);
            return;
        }

        try {
            await addToCart(product.id, 1);
            await loadCart();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleCheckoutComplete = (order) => {
        setCartOpen(false);

        alert(
            `Order #${order.id} created successfully.\nTotal: ${formatPrice(
                order.total
            )}`
        );
    };

    const startProductDrag = (event) => {
        if (
            event.target.closest("button") ||
            event.target.closest("a")
        ) {
            return;
        }

        if (
            event.pointerType === "mouse" &&
            event.button !== 0
        ) {
            return;
        }

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

        if (!grid || !dragState.current.dragging) {
            return;
        }

        const deltaX =
            event.clientX - dragState.current.startX;

        grid.scrollLeft =
            dragState.current.startScrollLeft - deltaX;

        if (Math.abs(deltaX) > 4) {
            event.preventDefault();
        }
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
                <a
                    className="brand"
                    href="#top"
                    aria-label="PARDRIT home"
                >
                    <span className="brand-name">
                        PARDRIT
                    </span>
                </a>

                <nav
                    className="desktop-nav"
                    aria-label="Main navigation"
                >
                    <a href="#shop">SHOP</a>
                    <a href="#categories">CATEGORIES</a>
                    <a href="#build">BUILD A PC</a>
                </nav>

                <div className="header-actions">
                    <button
                        type="button"
                        className="search-button"
                    >
                        SEARCH
                    </button>

                    <button
                        type="button"
                        className="account-button"
                        onClick={handleAccountClick}
                    >
                        {authenticated
                            ? "SIGN OUT"
                            : "ACCOUNT"}
                    </button>

                    <button
                        type="button"
                        className="mobile-menu-button"
                        aria-label={
                            mobileMenuOpen
                                ? "Close menu"
                                : "Open menu"
                        }
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-menu"
                        onClick={() =>
                            setMobileMenuOpen(
                                (open) => !open
                            )
                        }
                    >
                        <span
                            className="hamburger"
                            aria-hidden="true"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </button>

                    <button
                        type="button"
                        className="bag-button"
                        onClick={handleBagClick}
                    >
                        BAG ({cartQuantity})
                    </button>
                </div>

                <nav
                    id="mobile-menu"
                    className={`mobile-nav ${
                        mobileMenuOpen ? "is-open" : ""
                    }`}
                    aria-label="Mobile navigation"
                >
                    <a
                        href="#shop"
                        onClick={() =>
                            setMobileMenuOpen(false)
                        }
                    >
                        SHOP
                    </a>

                    <a
                        href="#categories"
                        onClick={() =>
                            setMobileMenuOpen(false)
                        }
                    >
                        CATEGORIES
                    </a>

                    <a
                        href="#build"
                        onClick={() =>
                            setMobileMenuOpen(false)
                        }
                    >
                        BUILD A PC
                    </a>

                    <button
                        type="button"
                        onClick={() =>
                            setMobileMenuOpen(false)
                        }
                    >
                        SEARCH
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setMobileMenuOpen(false);
                            handleAccountClick();
                        }}
                    >
                        {authenticated
                            ? "SIGN OUT"
                            : "ACCOUNT"}
                    </button>
                </nav>
            </header>

            <section className="hero" id="top">
                <div className="hero-kicker">
                    <span>
                        HARDWARE / SYSTEMS / PERFORMANCE
                    </span>
                    <span>SAN JOSÉ — CR</span>
                </div>

                <div className="hero-stage">
                    <h1 className="hero-title">
                        PARDRIT
                    </h1>
                </div>

                <div className="hero-bottom">
                    <p>
                        Hardware selected for people who care
                        about what happens{" "}
                        <strong>
                            inside the machine.
                        </strong>
                    </p>

                    <div className="hero-product-note">
                        <span>CURATED HARDWARE</span>
                        <strong>
                            SAN JOSÉ / COSTA RICA
                        </strong>
                    </div>

                    <a
                        className="circle-link"
                        href="#shop"
                        aria-label="Explore shop"
                    >
                        <Arrow />
                    </a>
                </div>
            </section>

            <section className="manifesto">
                <p className="eyebrow">
                    / 001 — OUR APPROACH
                </p>

                <div className="manifesto-grid">
                    <div className="manifesto-heading">
                        <h2>
                            LESS NOISE.
                            <br />
                            <span>MORE MACHINE.</span>
                        </h2>

                        <div
                            className="manifesto-machine"
                            aria-hidden="true"
                        >
                            <span className="machine-number">
                                01 / CORE
                            </span>

                            <img
                                src=`${import.meta.env.BASE_URL}images/products/b850-gaming-wifi6.webp"
                                alt=""
                            />
                        </div>
                    </div>

                    <div className="manifesto-copy">
                        <p>
                            Components, peripherals and complete
                            setups without the visual chaos of
                            the typical tech store.
                        </p>

                        <p>
                            Serious hardware. Clear information.
                            A store designed with the same
                            attention we expect from the
                            products we sell.
                        </p>

                        <div className="manifesto-spec">
                            <span>CURATED HARDWARE</span>
                            <span>CR / 2026</span>
                        </div>
                    </div>
                </div>
            </section>

            <section
                className="categories"
                id="categories"
            >
                <div className="categories-heading">
                    <div>
                        <p className="eyebrow">
                            / 002 — FIND YOUR HARDWARE
                        </p>

                        <h2>
                            START WITH
                            <br />
                            WHAT YOU NEED.
                        </h2>
                    </div>

                    <p className="categories-intro">
                        Explore the store by category. The
                        catalog grows without changing the
                        layout.
                    </p>
                </div>

                <div className="category-grid">
                    {categories.map(
                        (category, index) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                index={index}
                            />
                        )
                    )}
                </div>
            </section>

            <section className="shop" id="shop">
                <div className="shop-header">
                    <div>
                        <p className="eyebrow">
                            / 003 — SELECTED HARDWARE
                        </p>

                        <h2>NEW HARDWARE</h2>
                    </div>

                    <a href="#all-products">
                        VIEW ALL <Arrow />
                    </a>
                </div>

                {catalogError && (
                    <p className="catalog-error">
                        Catalog temporarily unavailable.
                    </p>
                )}

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
                            onAddToCart={
                                handleAddToCart
                            }
                        />
                    ))}
                </div>
            </section>

            <section
                className="statement"
                id="build"
            >
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
                        Performance starts with choosing the
                        right pieces.
                        <br />
                        We'll handle the noise.
                    </p>

                    <a href="#shop">
                        START BUILDING <Arrow />
                    </a>
                </div>
            </section>

            <footer>
                <div className="footer-brand">
                    PARDRIT
                </div>

                <div className="footer-grid">
                    <p>
                        Technology selected
                        <br />
                        in Costa Rica.
                    </p>

                    <div>
                        <a href="#shop">SHOP</a>
                        <a href="#categories">
                            CATEGORIES
                        </a>
                        <a href="#build">
                            BUILD A PC
                        </a>
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

            {accountOpen && (
                <AccountModal
                    onClose={() =>
                        setAccountOpen(false)
                    }
                    onLogin={handleLogin}
                />
            )}

            {cartOpen && (
                <CartDrawer
                    cart={cart}
                    onClose={() => setCartOpen(false)}
                    onCartChanged={loadCart}
                    onCheckoutComplete={
                        handleCheckoutComplete
                    }
                />
            )}
        </main>
    );
}

export default App;