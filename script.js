document.getElementById('product-form').addEventListener('submit', function(event) {
    event.preventDefault();

    let productName = document.getElementById('product-name').value;
    let productPrice = document.getElementById('product-price').value;
    let farmerName = document.getElementById('farmer-name').value;
    let farmerContact = document.getElementById('farmer-contact').value;
    let productImage = document.getElementById('product-image').files[0];

    if (productName && productPrice && farmerName && farmerContact && productImage) {
        let reader = new FileReader();
        reader.onload = function(e) {
            let productList = document.getElementById('product-list');

            let productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <img src="${e.target.result}" alt="${productName}">
                <h3>${productName}</h3>
                <p>Price: ₹${productPrice}</p>
                <p>Farmer: ${farmerName}</p>
                <p>Contact: <a href="tel:${farmerContact}">${farmerContact}</a> | 
                <a href="https://wa.me/${farmerContact}" target="_blank">WhatsApp</a></p>
                <button class="buy-btn">Buy Now</button>
            `;

            productItem.querySelector('.buy-btn').addEventListener('click', function() {
                placeOrder(productName, productPrice, farmerName, farmerContact);
            });

            productList.appendChild(productItem);
        };
        reader.readAsDataURL(productImage);
        
        document.getElementById('product-form').reset();
    }
});

function placeOrder(productName, productPrice, farmerName, farmerContact) {
    let orderList = document.getElementById('order-list');

    let orderItem = document.createElement('div');
    orderItem.classList.add('order-item');
    orderItem.innerHTML = `
        <h3>${productName}</h3>
        <p>Price: ₹${productPrice}</p>
        <p>Ordered from: ${farmerName}</p>
        <p>Contact: <a href="tel:${farmerContact}">${farmerContact}</a> | 
        <a href="https://wa.me/${farmerContact}" target="_blank">WhatsApp</a></p>
        <p>Status: <strong>Pending</strong></p>
        <button class="confirm-btn">Confirm Order</button>
        <button class="pay-btn">Pay Now</button>
    `;

    orderItem.querySelector('.confirm-btn').addEventListener('click', function() {
        this.previousElementSibling.innerHTML = "<strong>Confirmed</strong>";
        this.remove();
    });

    orderItem.querySelector('.pay-btn').addEventListener('click', function() {
        window.open(`https://pay.google.com/gp/w/u/0/home/activity`, '_blank');
    });

    orderList.appendChild(orderItem);
}
