import './scss/main.css';
import $ from 'jquery'
$(document).ready(launch());



function getData(url, successCallBack){
    $.ajax({
        url: url,
        dataType : "json",
        success: successCallBack,
        error: function(xhr, textStatus, errorThrown) {
            alert("An error occured " + xhr.status + " " + textStatus)
        }
    })
}
var cartTotal;
var cartItems;
var cartContent;
var printData;
var createElement;
var createCategories;


function loadVariables() {
//cart and updating buttons method
    cartTotal = $('.cart-total');
    cartItems = $('.cart-items');
    cartContent = $('.cart-content');
    printData = function(data){
        console.log(data);
    };
    createElement = function(data) {
        for (let i = 0; i < data.length; i++) {
            var product = document.createElement('article')
            product.classList.add('product');
            product.innerHTML = ` 
                <div class="product-container">
                    <div class="product-padding">
                        <div class="img">
                    <span class="img-container">
                    <img class="img-class" src= ` + data[i].image_url + ` alt="product" class="product-img">
                        <button class="bag-btn" data-id="`+ data[i].id + `">
                                <i class="fas fa-shopping-cart"></i>
                                add to cart
                            </button>
                        </span>
                            
                        </div>
                        <h3>` + data[i].name + `</h3>
                <h4 class="price">$` + data[i].price + `</h4>`;
            $('.products-table').append(product)
            updateAddItemButtons();
        }

    }
    createCategories = function(data) {
        for (let i = 0; i < data.length; i++) {
            var product = document.createElement('li')
            product.classList.add('category');
            product.innerHTML = '<span>' + data[i].name + '</span> ';
            $('.categories').append(product)
            // updateAddItemButtons();
        }

    }
}



function launch() {
    loadVariables();
    // getData('https://nit.tron.net.ua/api/product/list', printData);
    //make grid of elements
    getData('https://nit.tron.net.ua/api/product/list', createElement);
    getData('https://nit.tron.net.ua/api/category/list', createCategories);
    $('.cart-btn').on('click', showCart);
    $('.close-cart').on('click', closeCart);
    $('.clear-cart').on ('click', clearCart);
    updateAddItemButtons();
    updateRemoveItemButtons();
    updateFullProductListeners();
    updateCartTotal()
    printListeners()


}
//show full product listeners
function updateFullProductListeners(){
    var productss = $('.product');
    var products = document.getElementsByClassName('product')
    console.log(productss)
    console.log(products)
    console.log(products.length)
    console.log(productss.length)
    for (var i = 0; i < products.length; i++) {
        console.log(i);
        console.log(products[i]);
        products[i].addEventListener("touchstart", showFullProduct, false)
    }
}

function showFullProduct(element){
    console.log(element);
}
//print functions
function printListeners(){
    window.addEventListener('beforeprint', function(event){
        var products = document.querySelectorAll('.product');
        for (var i = 0; i < products.length; i++) {
            var div = document.createElement('h3');
            div.classList.add('print-text')
            div.innerText = "You can buy those on our site";
            products.item(i).insertBefore(div,products.item(i).querySelector('h4'))
        }
    })
    window.addEventListener('afterprint', function(event){
        var products = document.querySelectorAll('.product');
        for (var i = 0; i < products.length; i++) {
            products.item(i).removeChild(products.item(i).querySelector('.print-text'))
        }
    })
}

function updateRemoveItemButtons(){
    var removeCartItemButtons = document.getElementsByClassName('remove-item')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i];
        button.addEventListener('click', removeCartItemCall)
    }
    updateCartTotal()
}

function updateAddItemButtons(){
    var addToCartButtons = document.getElementsByClassName('bag-btn');
    for (var i = 0; i < addToCartButtons.length; i++) {
        addToCartButtons[i].addEventListener('click', addToCartClicked)
    }
}

function removeCartItem(element) {
    var id = element.getAttribute('data-id')
    var elem = $('.cart-item').filter('[data-id=' + id +']');
    elem[0].parentElement.removeChild(elem[0]);
    updateProducts(id);
    updateCartTotal()
}

function removeCartItemCall(event){
    var element = event.target;
    removeCartItem(element);
}

function updateProducts(id){
    var product = document.querySelectorAll('[data-id]');
    for (var i = 0; i < product.length; i++) {
        if (product[i].getAttribute('data-id') === id){
            var button = document.createElement('button');
            button.classList.add('bag-btn');
            button.setAttribute('data-id', id);
            button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
            var parent = product[i].parentElement;
            parent.removeChild(product[i]);
            parent.append(button);
        }
    }
    updateAddItemButtons();
}
function clearCart(){
    var list = $('.cart-content')[0].childNodes;
    for (let i = 0; i < list.length; i++) {
        updateProducts(list[i].getAttribute('data-id'));
    }
    while(list.length>0){
        list[0].parentElement.removeChild(list[0]);
    }
    updateCartTotal();
    closeCart();
}
function showCart(){
    document.querySelector('.cart-overlay').classList.add('showOverlay');
    document.querySelector('.cart').classList.add('showCart');
}

function closeCart() {
    document.querySelector('.cart-overlay').classList.remove('showOverlay');
    document.querySelector('.cart').classList.remove('showCart');
}

function addToCartClicked(event) {
    var button = event.target;
    button.innerText = "In Cart";
    button.disabled = true;
    var shopItem = button.parentElement.parentElement.parentElement;
    var name = shopItem.querySelector('h3').innerHTML;
    var id = shopItem.querySelector('button').getAttribute('data-id');
    var price = parseFloat(shopItem.querySelector(  '.price')
    // How to split price into number;???????
        .innerHTML.slice(1)).toFixed(2);
    var imageSrc = shopItem.querySelector('img').getAttribute('src');
    addItemToCart(name, price, imageSrc,id);
    updateCartTotal()
    updateRemoveItemButtons();
}

function addItemToCart(title, price, imageSrc, id) {
    var div = document.createElement('div')
    div.classList.add('cart-item');
    div.setAttribute('data-id', id);
    div.innerHTML = `<span class="img-container-cart">
                    <img class="img-class" src="${imageSrc}" alt="${title}" />
                    </span>
              <div>
                <h4 class="cart-item-title">${title}</h4>
                <h5 class="cart-item-price">$${price}</h5>
                <span class="remove-item" data-id = ${id}>remove 
                <i class="fas fa-times cross" data-id = ${id}></i>
                </span>
              </div>
              <div>
                  <i class="fas fa-chevron-up" data-id = ${id}></i>
                <p class="item-amount">1</p>
                <i class="fas fa-chevron-down" data-id = ${id}></i>
              </div>`;
    cartContent.append(div);
    addListenersToChevrons(div);

}
// Cart functions
function chevronDown(event) {
    var amount = event.target.parentElement.querySelector('p');
    if (parseInt(amount.innerText) > 1) {
        amount.innerText = parseInt(amount.innerText) - 1;
    }
    else {
        removeCartItem(event.target)
    }
    updateCartTotal();
}

function chevronUp(event) {
    var amount = event.target.parentElement.querySelector('p');
    amount.innerText = parseInt(amount.innerText) + 1;
    updateCartTotal();
}

function addListenersToChevrons(div){
    div.getElementsByClassName('fa-chevron-up')[0]
        .addEventListener('click',chevronUp)
    div.getElementsByClassName('fa-chevron-down')[0]
        .addEventListener('click',chevronDown)
}

function updateCartTotal() {
    var numberOfElements = cartContent.children('.cart-item');
    var total = 0;
    var numberOfQuantities = 0;
    for (var i = 0; i < numberOfElements.length; i++) {
        var element = numberOfElements[i];
        var priceElement = element.getElementsByClassName('cart-item-price')[0].innerHTML;
        var quantityElement = element.getElementsByClassName('item-amount')[0].innerHTML;
        numberOfQuantities += parseInt(quantityElement);
        var price = parseFloat(priceElement.slice(1)).toFixed(2);
        total = parseFloat(total) + parseFloat((price * quantityElement).toFixed(2));
    }
    cartTotal.text(parseFloat(total).toFixed(2));
    cartItems.text(String(numberOfQuantities));
}
