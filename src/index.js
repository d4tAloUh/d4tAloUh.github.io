import './scss/main.css';
import 'bootstrap'
import $ from 'jquery';

$(document).ready(launch());


function getData(url, successCallBack) {
    $.ajax({
        url: url,
        async: false,
        dataType: "json",
        success: successCallBack,
        error: function (xhr, textStatus, errorThrown) {
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
    printData = function (data) {
        console.log(data);
    };
    createElement = function (data) {
        for (let i = 0; i < data.length; i++) {
            var product = document.createElement('article')
            product.classList.add('product');
            var sale = data[i].special_price;
            var price = data[i].price;
            product.innerHTML = ` 
                <div class="product-container">
                    <div class="product-padding">
                        <div class="img">
                    <span class="img-container">
                    <img class="img-class" src= ` + data[i].image_url + ` alt="` +data[i].name + `" class="product-img">
                        <button class="bag-btn" data-id="` + data[i].id + `">
                                <i class="fas fa-shopping-cart"></i>
                                add to cart
                            </button>
                        </span>
                            
                        </div>
                        <h3 class="name">` + data[i].name + `</h3>
                <h4 class="price">$` + price + `</h4>
                <div class="information">` + data[i].description + `</div>`;
            var saleElem = document.createElement('h4')
            saleElem.classList.add('specPrice');
            if (sale !== null) {
                saleElem.innerHTML = '$' + sale;
            }
            product.querySelector('.product-padding').append(saleElem);
            var items = $('.cart-item').filter('[data-id=' + data[i].id + ']')[0]
            if (items !== undefined){
                var button = (product.querySelector('button'));
                button.innerText = "In Cart";
                button.disabled = true;
            }
            $('.products-table').append(product)
            updateAddItemButtons();
        }

    }
    createCategories = function (data) {
        for (let i = 0; i < data.length; i++) {
            var product = document.createElement('li')
            product.classList.add('category');
            product.setAttribute('data-id', data[i].id);
            product.innerHTML = '<span>' + data[i].name + '</span> ';
            $('.categories').append(product)
            updateAddItemButtons();
        }

    }
}


function launch() {
    loadVariables();
    // getData('https://nit.tron.net.ua/api/product/list', printData);
    //make grid of elements
    getData('https://nit.tron.net.ua/api/product/list', createElement);
    getData('https://nit.tron.net.ua/api/category/list', createCategories);
    // button listeners
    $('.cart-btn').on('click', showCart);
    $('.close-cart').on('click', closeCart);
    $('.clear-cart').unbind('click').click(clearCart);
    $('.cart-proceed').unbind('click').click(cartProceed);
    $('.close-full').on('click', closeFull);
    printListeners()
    // categories listeners
    updateCategoriesListeners();
    updateFullProductListeners()

}


function postCart(name, phone, email, products) {
    $.post('https://nit.tron.net.ua/api/order/add/', {
            token: 'x8H_i721iqlF4YP2BTAU',
            name: name,
            phone: phone,
            async: false,
            email: email,
            products: products,

        },
        function (data, textStatus, jqXHR) {
            removePrevResult();
            if (data.status === 'error') {
                for (var key in data.errors) {
                    var value = data.errors[key];
                    setResult(value);
                }
            }
            else {
                clearCart(false);
                setResult("Your order has been placed!", "success")
            }
        });
}
// function for removing every element of any class
// takes element as class without .
function removeElem(element) {
    element = '.' + element;
    var elements = $(element);
    if (elements.length < 1) {
        return false;
    }
    for (let i = 0; i < elements.length; i++) {
        elements[i].parentElement.removeChild(elements[i]);
    }
}

function removePrevResult() {
    removeElem('result');
}

function setResult(text, success) {
    var result = document.createElement('div')
    result.classList.add('result');
    result.innerHTML = `<p> ` + text + `</p>`;
    if (success !== undefined){
        result.classList.add('success')
        var formsInput = $('.formInput');
        for (let i = 0; i < formsInput.length; i++) {
            formsInput[i].value = '';
        }
    }
    $('.form').append(result)
}

function cartProceed() {
    var items = $('.cart-item');
    var products = {};
    //return if no items in cart
    if (items.length < 1) {
        return false;
    }
    for (let i = 0; i < items.length; i++) {
        products[parseInt(items[i].getAttribute('data-id'))] = parseInt(items[i].querySelector('.item-amount').innerHTML);
    }
    var name = $('#fname').val();
    var email = $('#email').val();
    var phone = $('#phone').val();
    postCart(name, phone, email, products)
}

function removeItems() {
    removeElem('product');
}

function getCategoryItems(element) {
    var id = element.target.parentElement.getAttribute('data-id');
    $('.selected')[0].classList.remove('selected');
    element.target.classList.add('selected');
    removeItems()
    var url = 'https://nit.tron.net.ua/api/product/list';
    if (id !== '') {
        url += '/category/' + id;
    }
    getData(url, createElement);

    updateFullProductListeners();
}

//add listeners to categories
function updateCategoriesListeners() {
    $('.category').bind('click', getCategoryItems)
}

//show full product listeners
function updateFullProductListeners() {
    $('.product').find('.img').bind('click', showFullProduct);
    $('.product').find('h3').bind('click', showFullProduct)
}

function showFullProduct(element) {
    var img;
    var name;
    var info;
    var id;
    var price;
    var specPrice;
    var button
    if (element.target.className === 'bag-btn' || element.target.className === 'fas fa-shopping-cart') {
        return false;
    }
    if (element.target.className === 'img-class') {
        img = element.target.getAttribute('src')
        // id = element.target.parentElement.querySelector('.bag-btn').getAttribute('data-id')
        info = element.target.parentElement.parentElement.parentElement.querySelector('.information').innerHTML;
        price = element.target.parentElement.parentElement.parentElement.querySelector(".price").innerHTML;
        name = element.target.parentElement.parentElement.parentElement.querySelector('h3').innerHTML;
        specPrice = element.target.parentElement.parentElement.parentElement.querySelector(".specPrice").innerHTML;
        button = element.target.parentElement.querySelector('.bag-btn')
    } else if (element.target.className === 'img-container') {
        img = element.target.parentElement.querySelector('.img-class').getAttribute('src')
        // id = element.target.parentElement.querySelector('.bag-btn').getAttribute('data-id')
        info = element.target.parentElement.parentElement.querySelector('.information').innerHTML;
        price = element.target.parentElement.parentElement.querySelector(".price").innerHTML;
        specPrice = element.target.parentElement.parentElement.querySelector(".specPrice").innerHTML;
        name = element.target.parentElement.parentElement.querySelector('h3').innerHTML;
        button = element.target.parentElement.querySelector('.bag-btn')
    } else {
        img = element.target.parentElement.querySelector('img').getAttribute('src')
        // id = element.target.parentElement.parentElement.querySelector('.bag-btn').getAttribute('data-id')
        info = element.target.parentElement.querySelector('.information').innerHTML;
        price = element.target.parentElement.querySelector(".price").innerHTML;
        specPrice = element.target.parentElement.querySelector(".specPrice").innerHTML;
        name = element.target.innerHTML;
        button = element.target.parentElement.parentElement.querySelector('.bag-btn');
    }
    createFullWindow(name, price, img, id, info, specPrice, button)

}


function createFullWindow(name, price, img, id, info, specPrice, button) {
    var div = document.createElement('div')
    div.classList.add('full-product-container');
    div.innerHTML = `<div class="full-product-content">
            <span class="close-full"><i class="far fa-window-close"></i></span>
            <div class="full-name name">` + name + `</div>
            <div class="full-image-container">
                <div class="full-image"><img src=" ` + img + ` " alt="` +  name + `" class="img-class"></div>
                
                <h4 class="price">` + price + `</h4>
                <h4 class="specPrice">` + specPrice + `</h4>
                <div class="button-wrap">
                </div>
            </div>
            <div class="full-product-main">
                <div class="full-legend-container">
                    <div class="full-legend"><p> ` + info + `</p></div>
                </div>
            </div>
            <div class="full-close"></div>
        </div>`;
    $('.main-container')[0].append(div);
    // create copy of button, to change both buttons;
    var newButton = button.cloneNode(true);
    newButton.classList.remove('bag-btn');
    newButton.classList.add('full-btn')
    $('.button-wrap')[0].append(newButton);
    // add listeners
    $('.full-btn').on('click', addToCartClickedFull);
    // close on click on cross
    $('.close-full').on('click', closeFull);
}

function updateFullProductButton(event) {
    var id = event.target.getAttribute('data-id');
    var button = $('.bag-btn').filter('[data-id=' + id + ']')[0];
    button.innerText = "In Cart";
    button.disabled = true;
}

function addToCartClickedFull(event) {
    updateFullProductButton(event);
    addToCartClicked(event);
    closeFull()
}

//print functions
function printListeners() {
    window.addEventListener('beforeprint', function (event) {
        var products = document.querySelectorAll('.product');
        for (var i = 0; i < products.length; i++) {
            var div = document.createElement('h3');
            div.classList.add('print-text')
            div.innerText = "You can buy those on our site";
            products.item(i).insertBefore(div, products.item(i).querySelector('h4'))
        }
    })
    window.addEventListener('afterprint', function (event) {
        var products = document.querySelectorAll('.product');
        for (var i = 0; i < products.length; i++) {
            products.item(i).removeChild(products.item(i).querySelector('.print-text'))
        }
    })
}

function updateRemoveItemButtons() {
    var removeCartItemButtons = document.getElementsByClassName('remove-item')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i];
        button.addEventListener('click', removeCartItemCall)
    }
}

function updateAddItemButtons() {
    var addToCartButtons = $('.bag-btn');
    for (var i = 0; i < addToCartButtons.length; i++) {
        addToCartButtons[i].addEventListener('click', addToCartClicked)
    }
}

function removeCartItem(element) {
    var id = element.getAttribute('data-id')
    var elem = $('.cart-item').filter('[data-id=' + id + ']');
    elem[0].parentElement.removeChild(elem[0]);
    updateProducts(id);
    updateCartTotal()
}

function removeCartItemCall(event) {
    var element = event.target;
    removeCartItem(element);
}

function updateProducts(id) {
    var product = $('[data-id]');
    for (var i = 0; i < product.length; i++) {
        if (product[i].getAttribute('data-id') === id) {
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

function clearCart(close = true) {
    var list = $('.cart-item');
    for (let i = 0; i < list.length; i++) {
        var elem = list[i];
        elem.parentNode.removeChild(elem)
        updateProducts(elem.getAttribute('data-id'));
    }
    updateCartTotal();
    if (close) closeCart();
}

function showCart() {
    closeFull();
    document.querySelector('.cart-overlay').classList.add('showOverlay');
    document.querySelector('.cart').classList.add('showCart');
}

function closeCart() {
    document.querySelector('.cart-overlay').classList.remove('showOverlay');
    document.querySelector('.cart').classList.remove('showCart');
}

function closeFull(element) {
    var container = $('.full-product-container');
    if (container.length < 1) {
        return false;
    }
    // delete full window
    container[0].parentElement.removeChild(container[0]);

}

function addToCartClicked(event) {
    var button = event.target;
    if (button.className ==='fas fa-shopping-cart'){
        button = button.parentElement;
    }
    button.innerText = "In Cart";
    button.disabled = true;
    var shopItem = button.parentElement.parentElement.parentElement;
    var name = shopItem.querySelector('.name').innerHTML;
    var id = shopItem.querySelector('button').getAttribute('data-id');
    var price = parseFloat(shopItem.querySelector('.price')
    // How to split price into number;???????
        .innerHTML.slice(1)).toFixed(2);
    var specPrice = parseFloat(shopItem.querySelector('.specPrice')
        .innerHTML.slice(1)).toFixed(2);
    var imageSrc = shopItem.querySelector('img').getAttribute('src');
    addItemToCart(name, price, imageSrc, id, specPrice);
    updateCartTotal()
    updateRemoveItemButtons();
}

function addItemToCart(title, price, imageSrc, id, specPrice) {
    var div = document.createElement('div');
    var items = $('.cart-item').filter('[data-id=' + id + ']')[0]
    if (items !== undefined){
        return false;
    }
    div.classList.add('cart-item');
    if (specPrice > 0) {
        price = specPrice;
    }
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
    } else {
        removeCartItem(event.target)
    }
    updateCartTotal();
}

function chevronUp(event) {
    var amount = event.target.parentElement.querySelector('p');
    amount.innerText = parseInt(amount.innerText) + 1;
    updateCartTotal();
}

function addListenersToChevrons(div) {
    div.getElementsByClassName('fa-chevron-up')[0]
        .addEventListener('click', chevronUp)
    div.getElementsByClassName('fa-chevron-down')[0]
        .addEventListener('click', chevronDown)
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
