export const productPresentation = {
    "GeForce RTX 4070": {
        brand: "ZOTAC GAMING",
        type: "GRAPHICS",
        image: `${import.meta.env.BASE_URL}images/products/rtx-4070-zotac.webp`,
        imageFit: "wide",
    },
    "Ryzen 5 5600X": {
        brand: "AMD",
        type: "PROCESSOR",
        image: `${import.meta.env.BASE_URL}images/products/ryzen-5-5600x.webp`,
        imageFit: "square",
    },
    "B850 Gaming WiFi6": {
        brand: "GIGABYTE",
        type: "MOTHERBOARD",
        image: `${import.meta.env.BASE_URL}images/products/b850-gaming-wifi6.webp`,
        imageFit: "wide",
    },
    "Rival 5": {
        brand: "STEELSERIES",
        type: "PERIPHERALS",
        image: `${import.meta.env.BASE_URL}images/products/steelseries-rival-5.webp`,
        imageFit: "wide",
    },
    "Apex 100": {
        brand: "STEELSERIES",
        type: "KEYBOARD",
        image: `${import.meta.env.BASE_URL}images/products/steelseries-apex-100.webp`,
        imageFit: "wide",
    },
    "AX20 RGB Elite": {
        brand: "ANTEC",
        type: "CASE",
        image: `${import.meta.env.BASE_URL}images/products/antec-ax20-rgb-elite.webp`,
        imageFit: "portrait",
    },
};


// Product photos are static frontend assets; product data still comes from the API.
// Unknown products intentionally have no image rather than showing an unrelated item.
export function getProductPresentation(name) {
    return productPresentation[name] ?? {};
}
