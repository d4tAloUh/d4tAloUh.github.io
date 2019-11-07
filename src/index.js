import './scss/main.css';
import $ from 'jquery'
$.ajax()
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', ready)
// } else {
//     ready()
// }
// const cartTotal = document.querySelector('.cart-total');
// const cartItems = document.querySelector('.cart-items');
// const cartContent = document.getElementsByClassName('cart-content')[0];
//
//
// function ready() {
//     // document.querySelector('.cart-overlay').addEventListener('click',closeCart);
//
//     document.querySelector('.cart-btn').addEventListener('click', showCart);
//     document.querySelector('.close-cart').addEventListener('click', closeCart);
//     document.querySelector('.clear-cart').addEventListener('click', clearCart);
//     updateAddItemButtons();
//     updateRemoveItemButtons();
//     updateCartTotal()
//     printListeners()
//
//
// }
// function printListeners(){
//     window.addEventListener('beforeprint', function(event){
//         var products = document.querySelectorAll('.product');
//         for (var i = 0; i < products.length; i++) {
//             var div = document.createElement('h3');
//             div.classList.add('print-text')
//             div.innerText = "You can buy those on our site";
//             products.item(i).insertBefore(div,products.item(i).querySelector('h4'))
//         }
//     })
//     window.addEventListener('afterprint', function(event){
//         var products = document.querySelectorAll('.product');
//         for (var i = 0; i < products.length; i++) {
//             console.log(products.item(i).querySelector('.print-text'));
//             products.item(i).removeChild(products.item(i).querySelector('.print-text'))
//         }
//     })
// }
//
// function updateRemoveItemButtons(){
//     var removeCartItemButtons = document.getElementsByClassName('remove-item')
//     for (var i = 0; i < removeCartItemButtons.length; i++) {
//         var button = removeCartItemButtons[i]
//         button.addEventListener('click', removeCartItemCall)
//     }
//     updateCartTotal()
// }
//
// function updateAddItemButtons(){
//     var addToCartButtons = document.getElementsByClassName('bag-btn');
//     for (var i = 0; i < addToCartButtons.length; i++) {
//         addToCartButtons[i].addEventListener('click', addToCartClicked)
//     }
// }
//
// function removeCartItem(element) {
//     element.parentElement.parentElement.parentElement
//         .removeChild(element.parentElement.parentElement);
//     var id = element.getAttribute('data-id')
//     updateProducts(id);
//     updateCartTotal()
// }
//
// function removeCartItemCall(event){
//     var element = event.target;
//     removeCartItem(element);
// }
//
// function updateProducts(id){
//     var product = document.querySelectorAll('[data-id]');
//     for (var i = 0; i < product.length; i++) {
//         if (product[i].getAttribute('data-id') === id){
//             var button = document.createElement('button');
//             button.classList.add('bag-btn');
//             button.setAttribute('data-id', id);
//             button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
//             var parent = product[i].parentElement;
//             parent.removeChild(product[i]);
//             parent.appendChild(button);
//         }
//     }
//     updateAddItemButtons();
// }
// function clearCart(){
//     var childNodes = cartContent.childNodes;
//     var idList = cartContent.querySelectorAll('[data-id]');
//     while(childNodes.length>0){
//         childNodes[0].parentElement.removeChild(childNodes[0]);
//     }
//     for (var i = 0; i < idList.length; i++) {
//         updateProducts(idList.item(i).getAttribute('data-id'));
//     }
//     updateCartTotal();
//     closeCart();
// }
// function showCart(){
//     document.querySelector('.cart-overlay').classList.add('showOverlay');
//     document.querySelector('.cart').classList.add('showCart');
// }
//
// function closeCart() {
//     document.querySelector('.cart-overlay').classList.remove('showOverlay');
//     document.querySelector('.cart').classList.remove('showCart');
// }
//
// function addToCartClicked(event) {
//     var button = event.target;
//     button.innerText = "In Cart";
//     button.disabled = true;
//     var shopItem = button.parentElement.parentElement;
//     var name = shopItem.querySelector('h3').innerHTML;
//     var id = shopItem.querySelector('button').getAttribute('data-id');
//     var price = parseFloat(shopItem.querySelector(  '.price')
//     // How to split price into number;???????
//         .innerHTML.slice(1)).toFixed(2);
//     var imageSrc = shopItem.querySelector('img').getAttribute('src');
//     addItemToCart(name, price, imageSrc,id);
//     updateCartTotal()
//     updateRemoveItemButtons();
// }
//
// function addItemToCart(title, price, imageSrc, id) {
//     var div = document.createElement('div')
//     div.classList.add('cart-item');
//     div.innerHTML = `<img src="${imageSrc}" alt="product" />
//               <div>
//                 <h4 class="cart-item-title">${title}</h4>
//                 <h5 class="cart-item-price">$${price}</h5>
//                 <span class="remove-item" data-id = ${id}>remove
//                     <i class="fas fa-times cross"></i>
//                 </span>
//               </div>
//               <div>
//                   <i class="fas fa-chevron-up" data-id = ${id}></i>
//                 <p class="item-amount">1</p>
//                 <i class="fas fa-chevron-down" data-id = ${id}></i>
//               </div>`;
//     cartContent.appendChild(div);
//     addListenersToChevrons(div);
//
// }
//
// function chevronDown(event) {
//     var amount = event.target.parentElement.querySelector('p');
//     if (parseInt(amount.innerText) > 1) {
//         amount.innerText = parseInt(amount.innerText) - 1;
//     }
//     else {
//         removeCartItem(event.target)
//     }
//     updateCartTotal();
// }
//
// function chevronUp(event) {
//     var amount = event.target.parentElement.querySelector('p');
//     amount.innerText = parseInt(amount.innerText) + 1;
//     updateCartTotal();
// }
//
// function addListenersToChevrons(div){
//     div.getElementsByClassName('fa-chevron-up')[0]
//         .addEventListener('click',chevronUp)
//     div.getElementsByClassName('fa-chevron-down')[0]
//         .addEventListener('click',chevronDown)
// }
//
// function updateCartTotal() {
//     var numberOfElements = cartContent.getElementsByClassName('cart-item');
//
//     var total = 0;
//     var numberOfQuantities = 0;
//     for (var i = 0; i < numberOfElements.length; i++) {
//         var element = numberOfElements[i];
//         var priceElement = element.getElementsByClassName('cart-item-price')[0].innerHTML;
//         var quantityElement = element.getElementsByClassName('item-amount')[0].innerHTML;
//         numberOfQuantities += parseInt(quantityElement);
//         var price = parseFloat(priceElement.slice(1)).toFixed(2);
//         total = parseFloat(total) + parseFloat((price * quantityElement).toFixed(2));
//     }
//     cartTotal.innerHTML = parseFloat(total).toFixed(2);
//     cartItems.innerHTML = String(numberOfQuantities);
// }
