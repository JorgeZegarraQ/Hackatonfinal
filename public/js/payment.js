/**
 * Created by sonu on 11/7/17.
 */

var productlist = []
var total = 0;
var cartproducts = []

$(function () {
    var cc = $("input[name=cc]");
    var month = $("input[name=month]");
    var year = $("input[name=year]");
    var cvv = $("input[name=cvv]");
    var email = $("input[name=email]");
    var dni = $("input[name=dni]");
    $('button[type="submit"]').click(function (e) {
        e.preventDefault();
        //little validation just to check username
        if (cc.val() != "" && month.val() != "" && year.val() != "" && cvv.val() != "" && email.val() != "" && dni.val() != "") {
            const data = JSON.stringify({
                "card_number": cc.val(),
                "cvv": cvv.val(),
                "expiration_month": month.val(),
                "expiration_year": year.val(),
                "email": email.val(),
                "metadata": {
                    "dni": dni.val()
                }
            });

            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            // xhr.addEventListener("readystatechange", function () {
            //     if (this.readyState === this.DONE) {
            //         console.log(this.responseText);
            //         savePurchase();
            //     }
            // });

            xhr.onload = () => {
                if (xhr.readyState == 4 && xhr.status == 201) {
                    
                    savePurchase();
                } else {
                    console.log(JSON.stringify(xhr.status));
                }
            };

            xhr.open("POST", "https://secure.culqi.com/v2/tokens");
            xhr.setRequestHeader("Authorization", "Bearer pk_test_27f4fbc0ddc64976");
            xhr.setRequestHeader("content-type", "application/json");

            xhr.send(data);
        } else {
            //remove success mesage replaced with error message
            alert("Please enter all information")
        }

    });
});

async function fetchProducts() {
    // Simulamos una solicitud a un servidor para obtener los productos
    return serverCall("/api/products", {}, saveProducts, "GET")
}

async function serverCall(path, body, callback, type) {
    const xhr = new XMLHttpRequest();
    xhr.open(type, "http://localhost:8000" + path)
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

    var user = sessionStorage.getItem("user");
    if (user) {
        user = JSON.parse(user)
        var cart = sessionStorage.getItem("cart");
        if (cart) {
            cart = JSON.parse(cart)
            if (cart.products && cart.products.length > 0) {
                cartproducts = cart.products
                total = 0
                cart.products.forEach(function (prod) {
                    var productdetail = productlist.filter(function (prodtemp) {
                        return prodtemp._id == prod.productid
                    })[0]
                    if (productdetail) {
                        var price = parseFloat(productdetail.price)
                        var prodqty = parseFloat(prod.quantity)
                        total += price * prodqty
                    }
                })
            }
        }
    }
}

function savePurchase() {
    var user = sessionStorage.getItem("user");
    if (user) {
        user = JSON.parse(user)


        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8000/savepurchase")
        xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        const body = JSON.stringify({
            userid: user._id,
            total: total,
            products: cartproducts
        })
        xhr.onload = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText)
                console.log(JSON.parse(xhr.responseText));

                window.location.replace("index.html")
            } else {
                console.log(JSON.stringify(xhr.status));
            }
        };
        xhr.send(body);
    }
}

$(document).ready(function () {
    var results = fetchProducts()


});
