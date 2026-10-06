const API_URL =
    import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

async function request(path, options = {}) {
    const token = localStorage.getItem("pardrit_token");

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token
                ? { Authorization: `Bearer ${token}` }
                : {}),
            ...options.headers,
        },
    });

    if (response.status === 204) {
        return null;
    }

    const contentType =
        response.headers.get("content-type") ?? "";

    let data;

    if (contentType.includes("application/json")) {
        data = await response.json().catch(() => null);
    } else {
        data = await response.text().catch(() => "");
    }

    if (!response.ok) {
        let message = "Something went wrong";

        if (typeof data === "string" && data.trim()) {
            message = data;
        } else if (data?.message) {
            message = data.message;
        } else if (data?.error) {
            message = data.error;
        }

        throw new Error(message);
    }

    return data;
}

export function getProducts() {
    return request("/products");
}

export function getCategories() {
    return request("/categories");
}

export function registerUser(data) {
    return request("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function loginUser(data) {
    return request("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function getCart() {
    return request("/cart");
}

export function addToCart(productId, quantity = 1) {
    return request("/cart", {
        method: "POST",
        body: JSON.stringify({
            productId,
            quantity,
        }),
    });
}

export function updateCartItem(cartItemId, quantity) {
    return request(
        `/cart/${cartItemId}?quantity=${quantity}`,
        {
            method: "PUT",
        }
    );
}

export function removeCartItem(cartItemId) {
    return request(`/cart/${cartItemId}`, {
        method: "DELETE",
    });
}

export function checkout() {
    return request("/orders/checkout", {
        method: "POST",
    });
}