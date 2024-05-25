fetchProducts()
var productlist = []
var shoppingcart = []

// Función para mostrar los productos filtrados en el div
function renderFilteredProducts(products) {
    const filteredProductsDiv = document.getElementById('filteredProducts');
    filteredProductsDiv.innerHTML = ''; // Limpiar el div antes de agregar nuevos elementos
    const ul = document.createElement('ul');
    products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `${product.name} - ${product.category} - $${product.price}` + " <a href='javascript: selectItem(" + product._id + ")'>Select Item</a>";
        ul.appendChild(li);
    });
    filteredProductsDiv.appendChild(ul);
}

function selectItem(id) {
    var user = sessionStorage.getItem("user");
    if (user) {
        user = JSON.parse(user)

        const filteredProducts = productlist.filter(product =>
            product._id == id
        )[0];
        if (filteredProducts) {
            let quantity = prompt("How much quantity do you want", "1")

            if (quantity) {
                var parsedquantity = parseFloat(quantity)
                if (parsedquantity) {
                    shoppingcart.push({
                        productid: filteredProducts._id,
                        quantity: parsedquantity
                    })
                    var cart = {
                        userid: user._id,
                        products: shoppingcart
                    }
                    serverCall("/updatecart", cart, updateCartDisplay, "POST")
                }
                else {
                    alert("Invalid Quantity")
                }
            }
        }
    }
    else {
        alert("Please log in")
    }

}

function updateCartDisplay() {

}

// Función para filtrar productos según el término de búsqueda
async function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim().toLowerCase();

    // Filtrar productos según el nombre o la categoría
    const filteredProducts = productlist.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );

    renderFilteredProducts(filteredProducts); // Mostrar los productos filtrados en el div
}

// Simulación de la función fetchProducts (reemplaza esto con tu lógica real)
async function fetchProducts() {
    // Simulamos una solicitud a un servidor para obtener los productos
    return serverCall("/api/products", {}, saveProducts, "GET")
}

async function serverCall(path, body, callback, type) {
    const xhr = new XMLHttpRequest();
    xhr.open(type, "http://localhost:3000" + path)
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")

    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callback(JSON.parse(xhr.responseText))
        } else {
            console.log(JSON.stringify(xhr.status));
        }
    };
    xhr.send(JSON.stringify(body));
}

function saveProducts(results) {
    productlist = results
    renderFilteredProducts(productlist)
}

$(document).ready(function () {
    var results = fetchProducts()

    var user = sessionStorage.getItem("user");
    if (user) {
        user = JSON.parse(user)
        const loggedinuserdisplay = document.getElementById('loggedinuser');
        loggedinuserdisplay.textContent = `${user.user}`;


        var cart = sessionStorage.getItem("cart");
        if (cart) {
            cart = JSON.parse(cart)
            shoppingcart = cart.products
        }

    }

});