fetchProducts()
var productlist = []

// Función para mostrar los productos filtrados en el div
function renderFilteredProducts(products) {
    const filteredProductsDiv = document.getElementById('filteredProducts');
    filteredProductsDiv.innerHTML = ''; // Limpiar el div antes de agregar nuevos elementos
    const ul = document.createElement('ul');
    products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `${product.name} - ${product.category} - $${product.price}` + " <a href='selectItem("+product._id+")'>Select Item</a>";        
        ul.appendChild(li);
    });
    filteredProductsDiv.appendChild(ul);
}

function selectItem(id){
    const filteredProducts = productlist.filter(product =>
        product._id.toLowerCase().includes(id)
    );
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
    return serverCall("/api/products", {}, saveProducts)
}

async function serverCall(path, body, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000" + path)
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")

    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(JSON.parse(xhr.responseText));
            callback(JSON.parse(xhr.responseText))
        } else {
            console.log(JSON.stringify(xhr.status));
        }
    };
    xhr.send(body);
}

function saveProducts(results) {
    productlist = results
    renderFilteredProducts(productlist)
}

$(document).ready(function () {
    var results = fetchProducts()

    var user = sessionStorage.getItem("user");
    if(user){
        user = JSON.parse(user)
        const loggedinuserdisplay = document.getElementById('loggedinuser');
        loggedinuserdisplay.textContent = `${user.user}`;
        
    }

});