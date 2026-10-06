import {
    checkout,
    removeCartItem,
    updateCartItem,
} from "../services/api";

const productImages = {
    "GeForce RTX 4070":
        "/images/products/rtx-4070-zotac.webp",

    "Ryzen 5 5600X":
        "/images/products/ryzen-5-5600x.webp",

    "B850 Gaming WiFi6":
        "/images/products/b850-gaming-wifi6.webp",

    "Rival 5":
        "/images/products/steelseries-rival-5.webp",

    "Apex 100":
        "/images/products/steelseries-apex-100.webp",

    "AX20 RGB Elite":
        "/images/products/antec-ax20-rgb-elite.webp",
};

function formatPrice(value) {
    return `₡${Number(value).toLocaleString("en-US", {
        maximumFractionDigits: 0,
    })}`;
}

function CartDrawer({
    cart,
    onClose,
    onCartChanged,
    onCheckoutComplete,
}) {
    const total = cart.reduce(
        (sum, item) => sum + Number(item.subtotal),
        0
    );

    const totalQuantity = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const changeQuantity = async (item, amount) => {
        const nextQuantity = item.quantity + amount;

        if (nextQuantity < 1) {
            return;
        }

        try {
            await updateCartItem(item.id, nextQuantity);
            await onCartChanged();
        } catch (error) {
            alert(error.message);
        }
    };

    const removeItem = async (itemId) => {
        try {
            await removeCartItem(itemId);
            await onCartChanged();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            return;
        }

        try {
            const order = await checkout();

            await onCartChanged();
            onCheckoutComplete(order);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div
            className="overlay cart-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <aside className="cart-drawer">
                <div className="panel-top">
                    <span>
                        / BAG — {totalQuantity}{" "}
                        {totalQuantity === 1 ? "ITEM" : "ITEMS"}
                    </span>

                    <button type="button" onClick={onClose}>
                        CLOSE ×
                    </button>
                </div>

                <div className="cart-heading">
                    <h2>YOUR BAG.</h2>
                </div>

                {cart.length === 0 ? (
                    <div className="empty-cart">
                        <span>00</span>

                        <p>
                            Your bag is empty.
                            <br />
                            Hardware belongs here.
                        </p>
                    </div>
                ) : (
                    <div className="cart-items">
                        {cart.map((item, index) => {
                            const image =
                                productImages[item.productName];

                            return (
                                <article
                                    className="cart-item"
                                    key={item.id}
                                >
                                    <span className="cart-index">
                                        {String(index + 1).padStart(
                                            2,
                                            "0"
                                        )}
                                    </span>

                                    <div className="cart-item-image">
                                        {image ? (
                                            <img
                                                src={image}
                                                alt={item.productName}
                                            />
                                        ) : (
                                            <span>PARDRIT</span>
                                        )}
                                    </div>

                                    <div className="cart-item-info">
                                        <h3>
                                            {item.productName}
                                        </h3>

                                        <p>
                                            {formatPrice(
                                                item.unitPrice
                                            )}{" "}
                                            / UNIT
                                        </p>

                                        <div className="quantity-control">
                                            <button
                                                type="button"
                                                aria-label={`Decrease ${item.productName} quantity`}
                                                onClick={() =>
                                                    changeQuantity(
                                                        item,
                                                        -1
                                                    )
                                                }
                                            >
                                                −
                                            </button>

                                            <span>
                                                {item.quantity}
                                            </span>

                                            <button
                                                type="button"
                                                aria-label={`Increase ${item.productName} quantity`}
                                                onClick={() =>
                                                    changeQuantity(
                                                        item,
                                                        1
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="cart-item-end">
                                        <strong>
                                            {formatPrice(
                                                item.subtotal
                                            )}
                                        </strong>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeItem(item.id)
                                            }
                                        >
                                            REMOVE
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                <div className="cart-summary">
                    <div>
                        <span>TOTAL</span>
                        <strong>
                            {formatPrice(total)}
                        </strong>
                    </div>

                    <button
                        type="button"
                        className="checkout-button"
                        disabled={cart.length === 0}
                        onClick={handleCheckout}
                    >
                        CHECKOUT ↗
                    </button>
                </div>
            </aside>
        </div>
    );
}

export default CartDrawer;