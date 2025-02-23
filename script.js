const productList = document.getElementById("product-list");
const productForm = document.getElementById("product-form");
const imageInput = document.getElementById("image");
const submitButton = document.getElementById("submit-button");
const editIndexInput = document.getElementById("edit-index");
const cancelEditButton = document.getElementById("cancel-edit");

// Define a simple role (can be replaced with a proper authentication mechanism)
const userRole = "farmer"; // Change this to 'customer' for customer view

// Show Sections
function showSection(section) {
    document.getElementById("farmer-section").style.display = section === "farmer" ? "block" : "none";
    document.getElementById("customer-section").style.display = section === "customer" ? "block" : "none";
}

// Create Product Card
function createProductCard(product, index) {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Price: ₹${product.price}</p>
        <p>Farmer: ${product.farmer}</p>
        <p>Contact: <a href="tel:${product.contact}">${product.contact}</a> | 
            <a href="https://wa.me/${product.contact}" target="_blank">WhatsApp</a>
        </p>
        
        <div class="quantity">
            <button onclick="changeQuantity(${index}, -1)">-</button>
            <input type="number" id="quantity-${index}" value="1" min="1" max="10" readonly>
            <button onclick="changeQuantity(${index}, 1)">+</button>
        </div>

        <button onclick="orderProduct(${index})">Buy Now</button>
        ${userRole === "farmer" ? `
            <button onclick="editProduct(${index})">Edit</button>
            <button onclick="deleteProduct(${index})">Delete</button>
        ` : ""}
    `;

    return card;
}

// Load Products
function loadProducts() {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    productList.innerHTML = "";
    products.forEach((product, index) => {
        const card = createProductCard(product, index);
        productList.appendChild(card);
    });
}

// Handle Order
function orderProduct(index) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let product = products[index];
    let quantity = document.getElementById(`quantity-${index}`).value;

    let confirmation = confirm(
        `Do you want to buy ${quantity} "${product.name}" from ${product.farmer} for ₹${product.price * quantity}?`
    );

    if (confirmation) {
        alert("Order placed successfully! Contact the farmer for payment & delivery.");
    }
}

// Change Quantity
function changeQuantity(index, change) {
    let quantityInput = document.getElementById(`quantity-${index}`);
    let newQuantity = parseInt(quantityInput.value) + change;

    if (newQuantity >= 1 && newQuantity <= 10) {
        quantityInput.value = newQuantity;
    }
}

// Handle Adding & Editing Products
productForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const farmer = document.getElementById("farmer").value;
    const contact = document.getElementById("contact").value;
    const file = imageInput.files[0];

    let products = JSON.parse(localStorage.getItem("products")) || [];
    let index = editIndexInput.value;

    if (index !== "") {
        products[index].name = name;
        products[index].price = price;
        products[index].farmer = farmer;
        products[index].contact = contact;

        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                products[index].image = reader.result;
                localStorage.setItem("products", JSON.stringify(products));
                loadProducts();
            };
        } else {
            localStorage.setItem("products", JSON.stringify(products));
            loadProducts();
        }

        submitButton.textContent = "Add Product";
        cancelEditButton.style.display = "none";
    } else {
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                const newProduct = { name, price, farmer, contact, image: reader.result };
                products.push(newProduct);
                localStorage.setItem("products", JSON.stringify(products));
                loadProducts();
            };
        }
    }

    productForm.reset();
    editIndexInput.value = "";
});

// Edit Product
function editProduct(index) {
    let products = JSON.parse(localStorage.getItem("products"));
    let product = products[index];

    document.getElementById("name").value = product.name;
    document.getElementById("price").value = product.price;
    document.getElementById("farmer").value = product.farmer;
    document.getElementById("contact").value = product.contact;
    editIndexInput.value = index;

    submitButton.textContent = "Update Product";
    cancelEditButton.style.display = "inline-block";
}

// Delete Product
function deleteProduct(index) {
    let products = JSON.parse(localStorage.getItem("products"));
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    loadProducts();
}

loadProducts();
