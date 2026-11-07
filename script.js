
let products = [];
let cart = [];

// Fetch products from JSON file
async function loadProducts() {
    try {
        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products");
        }

        products = await response.json();
        displayProducts(products);

    } catch (error) {
        document.getElementById("productContainer").innerHTML =
            "<p>Products could not be loaded. Please run the project using Live Server.</p>";

        console.error(error);
    }
}

// Display Products
function displayProducts(productList) {
    const container = document.getElementById("productContainer");

    if (productList.length === 0) {
        container.innerHTML = "<p>No products found.</p>";
        return;
    }

    container.innerHTML = productList.map(product => `
        <div class="product-card">
            <img src="${product.image}"
                 alt="${product.name}"
                 onerror="this.src='https://placehold.co/400x300?text=Product'">

            <div class="product-info">
                <h3>${product.name}</h3>

                <p class="category">${product.category}</p>

                <p class="rating">
                    ⭐ ${product.rating}/5
                </p>

                <p class="price">₹${product.price}</p>

                <button class="add-btn"
                    onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join("");
}

// Search Products
function searchProducts() {
    const searchValue = document
        .getElementById("searchInput")
        .value.toLowerCase()
        .trim();

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchValue) ||
        product.category.toLowerCase().includes(searchValue)
    );

    displayProducts(filteredProducts);
}

// Search when Enter is pressed
document.getElementById("searchInput")
    .addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            searchProducts();
        }
    });

// Add Product to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();

    alert(product.name + " added to cart!");
}

// Update Cart
function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    let totalItems = 0;
    let totalPrice = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <span>${item.name} x ${item.quantity}</span>
                <strong>₹${item.price * item.quantity}</strong>
                <button onclick="removeFromCart(${item.id})">
                    Remove
                </button>
            </div>
        `).join("");
    }

    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
    });

    cartCount.textContent = totalItems;
    cartTotal.textContent = "Total: ₹" + totalPrice;
}

// Remove Product from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Clear Entire Cart
function clearCart() {
    cart = [];
    updateCart();
}

// Load products when page opens
loadProducts();
