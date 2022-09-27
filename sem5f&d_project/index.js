const productTemplate = document.querySelector("[data-product-template]");        
const cartTemplate = document.querySelector("[data-cart-template]");

const productCardContainer = document.querySelector("[data-product-container]");
const searchInput = document.querySelector("[data-search]");

document.getElementsByClassName('total_amt')[0].innerHTML = "$ "+0;
let temp = [];

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  temp.forEach((prod) => {
    const isVisible =
      prod.title.toLowerCase().includes(value) ||
      prod.category.toLowerCase().includes(value);
    prod.element.classList.toggle("hide", !isVisible);
  });
});


function updateCart() {
  const main_menu = document.querySelector('[data-cart-menu]');
  const price = main_menu.querySelectorAll('.cart_item_price');
  const count = main_menu.querySelectorAll('.cart_item_count');
  let sum = 0;
  let badge_count = 0;
  for (let i = 0; i < price.length; i++) {
    let str = price[i].innerHTML.replace("$ ","");
    badge_count += parseInt(count[i].innerHTML)
    sum+=parseInt(str)*parseInt(count[i].innerHTML)
  }
  document.getElementsByClassName('total_amt')[0].innerHTML = "$ "+sum;
  document.getElementsByClassName('data-cart-count')[0].innerHTML = badge_count
}


function addToCartClicked(event) {
  let button = event.target;

  let shopItem = button.parentElement.parentElement;
  let title = shopItem.getElementsByClassName("card-title")[0].innerHTML;
  let price = shopItem.getElementsByClassName("card-price")[0].innerHTML;
  let image = shopItem.getElementsByClassName("cartplus")[0].src;


  const cart_item = cartTemplate.content.cloneNode(true).children[0];
  const cart_title = cart_item.querySelector("[cart-name]");
  const cart_price = cart_item.querySelector("[cart-price]");
  const cart_image = cart_item.querySelector(".cart-item-image");
  const cart_id = shopItem.id;
  cart_title.textContent = title;
  cart_price.textContent = price;
  cart_item.id = cart_id + "_product";
  cart_image.src = image;

  const cart_item_container = document.querySelector(".cart_item_container");
  
  let item = document.getElementById(cart_item.id);

  if (item != null) {
    let count = parseInt(
      item.querySelector("[data-product-count]").textContent
    );
    count++;
    item.querySelector("[data-product-count]").textContent = count;
  } else {
    cart_item_container.appendChild(cart_item);
  }
  const badge = document.querySelector(".data-cart-count");
  const cart_item_badge = document.getElementsByClassName("cart_item");
  if (cart_item_badge != null) {
    badge.classList.remove("hide")
    badge.classList.add("show");
  }
  const plus = cart_item.querySelector(".plus_item_button");
  const minus = cart_item.querySelector(".minus_item_button");

  plus.addEventListener("click", () => {
    let countItem = parseInt(
      cart_item.querySelector("[data-product-count]").textContent
    );
    countItem++;
    cart_item.querySelector("[data-product-count]").textContent = countItem;
    updateCart();
  });
  minus.addEventListener("click", () => {
    let countItem = parseInt(
      cart_item.querySelector("[data-product-count]").textContent
    );
    countItem-- ? countItem > 0 : (countItem = 0);
    cart_item.querySelector("[data-product-count]").textContent = countItem;
    if (countItem == 0) {
      minus.parentElement.parentElement.remove();
      badge.classList.add("hide");
    }
    updateCart();
  });
  updateCart();
}
const cart_menu = document.querySelector(".side-menu");
const purchase = cart_menu.querySelector(".btn-purchase");
const cart_item_container = document.querySelector(".cart_item_container");
const badge = document.querySelector(".data-cart-count");

purchase.addEventListener("click", (e) => {
  if (document.querySelector('.cart_item')!=null) {
    cart_item_container.innerHTML = "";
    window.alert("Purchased successfully!!");
    badge.classList.add("hide");
    updateCart();
  }
  else{
    window.alert("Cart is Empty! \nPlease add items in the cart to purchase.");
  }
});

//remove product button

const remove = document.querySelector(".remove-product");
remove.addEventListener("click", (e) => {
  if(document.querySelector('.cart_item')!=null) {
    cart_item_container.innerHTML = "";
    badge.classList.add("hide");
    updateCart();
  }
  else{
    window.alert("Cart is already Empty!!")
  }
  
})



fetch("https://dummyjson.com/products?limit=100")
  .then((response) => response.json())
  .then((data) => {
    let productData = data.products;
    temp = productData.map((product) => {
      const card = productTemplate.content.cloneNode(true).children[0];
      card.id = product.id;
      card.setAttribute("id", card.id);
      const title = card.querySelector("[data-name]");
      let price = card.querySelector("[data-price]");
      let discount = card.querySelector("[data-card-discount]");
      const description = card.querySelector("[data-description]");
      const rating = card.querySelector("[data-rating]");
      const addToCart = document.getElementsByClassName("add-button");
      const image = card.querySelector("img");

      image.src = product.thumbnail;
      title.textContent = product.title;
      rating.textContent = product.rating;
      price.textContent =
        "$ " +
        Math.round(
          product.price - (product.price * product.discountPercentage) / 100
        );
      discount.textContent = "( -" + product.discountPercentage + "% )";
      description.textContent = product.description;
      productCardContainer.append(card);

      for (let i = 0; i < addToCart.length; i++) {
        const cartItem = addToCart[i];
        cartItem.addEventListener("click", addToCartClicked);
      }
      return {
        title: product.title,
        price: product.price,
        image: product.thumbnail,
        discount: product.discountPercentage,
        description: product.description,
        id: product.id,
        category: product.category,
        element: card,
      };
    });
  });

const cartIcon = document.querySelector(".cart");
cartIcon.addEventListener("click", () => {
  const menu = document.querySelector(".side-menu");
  menu.classList.toggle("side-visible");
});
