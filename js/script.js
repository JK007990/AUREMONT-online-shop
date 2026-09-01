// ======================================================
// SHOP EASE - MAIN JAVASCRIPT
// ======================================================


// ======================================================
// CART
// ======================================================

let cart = JSON.parse(localStorage.getItem("cart")) || [];


// ======================================================
// SAVE CART
// ======================================================

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}


// ======================================================
// ADD TO CART
// ======================================================

const addButtons = document.querySelectorAll(".add-cart");

addButtons.forEach(button => {

    button.addEventListener("click", () => {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        const existingProduct = cart.find(
            item => item.name === name
        );

        if (existingProduct) {

            existingProduct.quantity += 1;

        } else {

            cart.push({
                name: name,
                price: price,
                quantity: 1
            });

        }

        saveCart();

        button.textContent = "✓ Added";

        setTimeout(() => {
            button.textContent = "Add to Cart";
        }, 1000);

    });

});


// ======================================================
// SEARCH PRODUCTS
// ======================================================

const searchInput =
    document.getElementById("productSearch");

if (searchInput) {

    searchInput.addEventListener("input", () => {

        const searchValue =
            searchInput.value.toLowerCase().trim();

        const products =
            document.querySelectorAll(".product-card");

        products.forEach(product => {

            const titleElement =
                product.querySelector("h3");

            if (!titleElement) {
                return;
            }

            const productName =
                titleElement.textContent.toLowerCase();

            if (productName.includes(searchValue)) {

                product.style.display = "";

            } else {

                product.style.display = "none";

            }

        });

    });

}


// ======================================================
// CATEGORY FILTER
// ======================================================

const categoryButtons =
    document.querySelectorAll(".category-filter");

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        const selectedCategory =
            button.dataset.category;

        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");


        const products =
            document.querySelectorAll(".product-card");

        products.forEach(product => {

            const productCategory =
                product.dataset.category;

            if (
                selectedCategory === "all" ||
                productCategory === selectedCategory
            ) {

                product.style.display = "";

            } else {

                product.style.display = "none";

            }

        });

    });

});


// ======================================================
// SORT PRODUCTS
// ======================================================

const sortSelect =
    document.getElementById("sortProducts");

if (sortSelect) {

    sortSelect.addEventListener("change", () => {

        const productGrid =
            document.getElementById("productGrid");

        if (!productGrid) {
            return;
        }

        const products =
            Array.from(
                productGrid.querySelectorAll(".product-card")
            );

        if (sortSelect.value === "low") {

            products.sort((a, b) => {

                return (
                    Number(a.dataset.price) -
                    Number(b.dataset.price)
                );

            });

        }

        if (sortSelect.value === "high") {

            products.sort((a, b) => {

                return (
                    Number(b.dataset.price) -
                    Number(a.dataset.price)
                );

            });

        }

        products.forEach(product => {
            productGrid.appendChild(product);
        });

    });

}


// ======================================================
// CART PAGE
// ======================================================

const cartItemsContainer =
    document.getElementById("cartItems");


function displayCart() {

    if (!cartItemsContainer) {
        return;
    }

    cartItemsContainer.innerHTML = "";


    // Empty cart

    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `

            <div class="empty-cart">

                <h2>
                    Your cart is empty
                </h2>

                <p>
                    You haven't added anything yet.
                </p>

                <a
                    href="products.html"
                    class="checkout-btn"
                >
                    Start Shopping →
                </a>

            </div>

        `;

        updateCartTotal();

        return;
    }


    // Cart products

    cart.forEach((item, index) => {

        const cartItem =
            document.createElement("div");

        cartItem.className =
            "cart-item";

        cartItem.innerHTML = `

            <div class="cart-item-image">
                PRODUCT
            </div>

            <div class="cart-item-info">

                <p class="category">
                    Product
                </p>

                <h3>
                    ${item.name}
                </h3>

                <p class="cart-item-price">
                    $${item.price.toFixed(2)}
                </p>

                <div class="quantity-control">

                    <button
                        onclick="changeQuantity(${index}, -1)"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(${index}, 1)"
                    >
                        +
                    </button>

                </div>

            </div>

            <div class="cart-item-actions">

                <button
                    class="remove-item"
                    onclick="removeItem(${index})"
                >
                    Remove
                </button>

            </div>

        `;

        cartItemsContainer.appendChild(cartItem);

    });


    updateCartTotal();

}


// ======================================================
// CHANGE QUANTITY
// ======================================================

function changeQuantity(index, amount) {

    if (!cart[index]) {
        return;
    }

    cart[index].quantity += amount;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    saveCart();
    displayCart();

}


// ======================================================
// REMOVE ITEM
// ======================================================

function removeItem(index) {

    if (!cart[index]) {
        return;
    }

    cart.splice(index, 1);

    saveCart();
    displayCart();

}


// ======================================================
// CART TOTAL
// ======================================================

function updateCartTotal() {

    const subtotalElement =
        document.getElementById("cartSubtotal");

    const shippingElement =
        document.getElementById("cartShipping");

    const totalElement =
        document.getElementById("cartTotal");


    if (
        !subtotalElement ||
        !shippingElement ||
        !totalElement
    ) {
        return;
    }


    let subtotal = 0;


    cart.forEach(item => {

        subtotal +=
            item.price * item.quantity;

    });


    const shipping =
        subtotal > 0 ? 5 : 0;

    const total =
        subtotal + shipping;


    subtotalElement.textContent =
        `$${subtotal.toFixed(2)}`;

    shippingElement.textContent =
        `$${shipping.toFixed(2)}`;

    totalElement.textContent =
        `$${total.toFixed(2)}`;

}


displayCart();


// ======================================================
// CHECKOUT PAGE
// ======================================================

const checkoutItems =
    document.getElementById("checkoutItems");


function displayCheckout() {

    if (!checkoutItems) {
        return;
    }


    checkoutItems.innerHTML = "";


    if (cart.length === 0) {

        checkoutItems.innerHTML = `

            <p style="color:#777;">
                Your cart is empty.
            </p>

        `;

        updateCheckoutTotal();

        return;
    }


    cart.forEach(item => {

        const product =
            document.createElement("div");

        product.className =
            "checkout-product";

        product.innerHTML = `

            <span>
                ${item.name} × ${item.quantity}
            </span>

            <strong>
                $${(
                    item.price *
                    item.quantity
                ).toFixed(2)}
            </strong>

        `;

        checkoutItems.appendChild(product);

    });


    updateCheckoutTotal();

}


// ======================================================
// CHECKOUT TOTAL
// ======================================================

function updateCheckoutTotal() {

    const subtotalElement =
        document.getElementById("checkoutSubtotal");

    const shippingElement =
        document.getElementById("checkoutShipping");

    const totalElement =
        document.getElementById("checkoutTotal");


    if (
        !subtotalElement ||
        !shippingElement ||
        !totalElement
    ) {
        return;
    }


    let subtotal = 0;


    cart.forEach(item => {

        subtotal +=
            item.price * item.quantity;

    });


    const shipping =
        subtotal > 0 ? 5 : 0;

    const total =
        subtotal + shipping;


    subtotalElement.textContent =
        `$${subtotal.toFixed(2)}`;

    shippingElement.textContent =
        `$${shipping.toFixed(2)}`;

    totalElement.textContent =
        `$${total.toFixed(2)}`;

}


displayCheckout();


// ======================================================
// PLACE ORDER
// ======================================================

const placeOrder =
    document.getElementById("placeOrder");


if (placeOrder) {

    placeOrder.addEventListener("click", () => {


        // Customer information

        const nameElement =
            document.getElementById("customerName");

        const phoneElement =
            document.getElementById("customerPhone");

        const addressElement =
            document.getElementById("customerAddress");


        const name =
            nameElement
                ? nameElement.value.trim()
                : "";

        const phone =
            phoneElement
                ? phoneElement.value.trim()
                : "";

        const address =
            addressElement
                ? addressElement.value.trim()
                : "";


        // Check cart

        if (cart.length === 0) {

            alert("Your cart is empty.");
            return;

        }


        // Check name

        if (!name) {

            alert("Please enter your name.");
            return;

        }


        // Check phone

        if (!phone) {

            alert("Please enter your phone number.");
            return;

        }


        // Check address

        if (!address) {

            alert("Please enter your delivery address.");
            return;

        }


        // Payment
        // Online payment has been removed.
        // COD only.

        const payment =
            "Cash on Delivery";


        // Calculate subtotal

        let subtotal = 0;


        cart.forEach(item => {

            subtotal +=
                item.price *
                item.quantity;

        });


        const shipping =
            subtotal > 0 ? 5 : 0;


        const total =
            subtotal + shipping;


        // ==================================================
        // CREATE ORDER DATA
        // ==================================================

        const receiptData = {

            orderId:
                "SE-" +
                Date.now()
                    .toString()
                    .slice(-8),

            date:
                new Date()
                    .toLocaleString(),

            name:
                name,

            phone:
                phone,

            address:
                address,

            payment:
                payment,

            items:
                cart.map(item => ({

                    name:
                        item.name,

                    price:
                        item.price,

                    quantity:
                        item.quantity

                })),

            subtotal:
                subtotal,

            shipping:
                shipping,

            total:
                total,

            status:
                "Order Placed"

        };


        // ==================================================
        // SAVE LAST RECEIPT
        // ==================================================

        localStorage.setItem(
            "lastOrder",
            JSON.stringify(receiptData)
        );


        // ==================================================
        // SAVE ORDER HISTORY
        // ==================================================

        const orders =
            JSON.parse(
                localStorage.getItem("orders")
            ) || [];


        orders.push(receiptData);


        localStorage.setItem(
            "orders",
            JSON.stringify(orders)
        );


        // ==================================================
        // CLEAR CART
        // ==================================================

        localStorage.removeItem("cart");

        cart = [];


        // ==================================================
        // GO TO RECEIPT
        // ==================================================

        window.location.href =
            "receipt.html";

    });

}


// ======================================================
// RECEIPT PAGE
// ======================================================

const receiptOrder =
    JSON.parse(
        localStorage.getItem("lastOrder")
    );


if (receiptOrder) {

    const orderIdElement =
        document.getElementById("receiptOrderId");

    const dateElement =
        document.getElementById("receiptDate");

    const nameElement =
        document.getElementById("receiptName");

    const phoneElement =
        document.getElementById("receiptPhone");

    const addressElement =
        document.getElementById("receiptAddress");

    const paymentElement =
        document.getElementById("receiptPayment");

    const itemsElement =
        document.getElementById("receiptItems");

    const subtotalElement =
        document.getElementById("receiptSubtotal");

    const shippingElement =
        document.getElementById("receiptShipping");

    const totalElement =
        document.getElementById("receiptTotal");


    if (orderIdElement) {

        orderIdElement.textContent =
            receiptOrder.orderId;

    }


    if (dateElement) {

        dateElement.textContent =
            receiptOrder.date;

    }


    if (nameElement) {

        nameElement.textContent =
            receiptOrder.name;

    }


    if (phoneElement) {

        phoneElement.textContent =
            receiptOrder.phone;

    }


    if (addressElement) {

        addressElement.textContent =
            receiptOrder.address;

    }


    if (paymentElement) {

        paymentElement.textContent =
            receiptOrder.payment;

    }


    if (itemsElement) {

        itemsElement.innerHTML = "";


        receiptOrder.items.forEach(item => {

            const itemElement =
                document.createElement("div");

            itemElement.className =
                "receipt-product";

            itemElement.innerHTML = `

                <div class="receipt-product-info">

                    <strong>
                        ${item.name}
                    </strong>

                    <span>
                        Quantity: ${item.quantity}
                    </span>

                </div>

                <strong>
                    $${(
                        item.price *
                        item.quantity
                    ).toFixed(2)}
                </strong>

            `;


            itemsElement.appendChild(
                itemElement
            );

        });

    }


    if (subtotalElement) {

        subtotalElement.textContent =
            `$${receiptOrder.subtotal.toFixed(2)}`;

    }


    if (shippingElement) {

        shippingElement.textContent =
            `$${receiptOrder.shipping.toFixed(2)}`;

    }


    if (totalElement) {

        totalElement.textContent =
            `$${receiptOrder.total.toFixed(2)}`;

    }

}


// ======================================================
// ORDER HISTORY
// ======================================================

const ordersList =
    document.getElementById("ordersList");


function displayOrders() {

    if (!ordersList) {
        return;
    }


    const orders =
        JSON.parse(
            localStorage.getItem("orders")
        ) || [];


    ordersList.innerHTML = "";


    // No orders

    if (orders.length === 0) {

        ordersList.innerHTML = `

            <div class="no-orders">

                <h2>
                    No orders yet
                </h2>

                <p>
                    Your completed orders will appear here.
                </p>

                <a href="products.html">
                    Start Shopping →
                </a>

            </div>

        `;

        return;
    }


    // Newest order first

    [...orders]
        .reverse()
        .forEach(order => {

            const card =
                document.createElement("div");

            card.className =
                "order-card";


            let itemsHTML = "";


            order.items.forEach(item => {

                itemsHTML += `

                    <div class="order-item">

                        <span class="order-item-name">

                            ${item.name}
                            × ${item.quantity}

                        </span>

                        <span class="order-item-price">

                            $${(
                                item.price *
                                item.quantity
                            ).toFixed(2)}

                        </span>

                    </div>

                `;

            });


            card.innerHTML = `

                <div class="order-card-top">

                    <div>

                        <div class="order-id">
                            ${order.orderId}
                        </div>

                        <div class="order-date">
                            ${order.date}
                        </div>

                    </div>

                    <span class="order-status">
                        ${order.status || "Order Placed"}
                    </span>

                </div>


                <div class="order-items">

                    ${itemsHTML}

                </div>


                <div class="order-card-bottom">

                    <span class="order-total-label">
                        Total
                    </span>

                    <span class="order-total">
                        $${order.total.toFixed(2)}
                    </span>

                </div>

            `;


            ordersList.appendChild(card);

        });

}


displayOrders();
