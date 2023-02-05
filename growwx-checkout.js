function targetButton(get) {
  var buttonId = get.id;
  switch (buttonId) {
    case "growwxMainCheckoutButton":
      var encodedPayload = getEncodedPayloadForCheckout();
      growwxCheckout(encodedPayload);
      break;
    case "growwxNotificationCheckoutButton":
      var encodedPayload = getEncodedPayloadForCheckout();
      growwxCheckout(encodedPayload);
      break;
    case "growwxBuyNowButton":
      var encodedPayload = getBuyNowPayload();
      growwxCheckout(encodedPayload);
      break;
    default:
      console.log("targetButton Error");
      return;
  }
}

function placeCartOrder() {
  var cartDetail;
  $.ajax({
    url: `https://test-store-growwx.myshopify.com/cart.js`,
    type: "GET",
    async: false,
    ContentType: "application/json",
    success: function (data) {
      console.log("First time logging data " + data);
      var cart = JSON.parse(data);
      cartDetail = cart;
    },
    error: function (error) {
      console.log(`Error ${error}`);
    },
  });
  return cartDetail;
}

function getEncodedPayloadForCheckout() {
  var cartDetails = placeCartOrder();
  console.log("inside function " + cartDetails.items);
  console.log(cartDetails.items[0].featured_image.url);
  let cartItems = cartDetails.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    variant_id: item.variant_id,
    title: item.title,
    price: item.price / 100,
    original_price: item.original_price / 100,
    discounted_price: item.discounted_price / 100,
    total_discount: 0,
    discounts: [],
    sku: item.sku,
    grams: item.grams,
    url: item.featured_image.url,
    image: item.featured_image.url,
  }));

  console.log("cartItems " + cartItems);

  var payload = {
    cart: {
      total_price: cartDetails.total_price / 100,
      total_discount: cartDetails.total_discount / 100,
      item_count: cartDetails.item_count,
      items: cartItems,
      requires_shipping: true,
      currency: "INR",
      items_subtotal_price: cartDetails.total_price / 100,
      cart_level_discount_applications: [],
    },
    mid: "1769cdac-18a3-4ad7-ab71-a26e5d63eb8a",
  };
  console.log("payload " + payload);
  var encodedPayload = btoa(JSON.stringify(payload));
  return encodedPayload;
}

function isMobile() {
  return screen.width <= 480;
}

function growwxCheckout(encodedPayload) {
  var ifrm = document.createElement("iframe");
  ifrm.id = "growwx-iframe";
  ifrm.setAttribute(
    "src",
    `https://master.dsa2svnq8e9eh.amplifyapp.com/?payload=${encodedPayload}`
  );
  if (isMobile()) {
    console.log("Mobile");
    ifrm.style.width = "100%";
    ifrm.style.height = "100%";
    ifrm.style.border = "none";
    ifrm.allowFullscreen = true;
    ifrm.style.position = "fixed";
    ifrm.style.top = "0px";
    ifrm.style.left = "0px";
    ifrm.style.bottom = "0px";
    ifrm.style.right = "0px";
    ifrm.style.overflow = "unset";
    ifrm.style.zIndex = "9999999999";
  } else {
    console.log("Desktop view not supported");
  }
  document.body.appendChild(ifrm);
  document.body.style.overflow = "hidden";
  window.addEventListener("message", function (e) {
    if (e.data && e.data.event === "unload-iframe") {
      var iframe = document.getElementById("growwx-iframe");
      iframe.parentNode.removeChild(iframe);
      document.body.style.overflow = "auto";
    }
    if (e.data && e.data.event === "navigate") {
      this.window.location.replace(e.data.location);
    }
    if (e.data && e.data.event === "setItem") {
      this.localStorage.setItem(e.data.key, e.data.value);
    }
    if (e.data && e.data.event === "removeItem") {
      this.localStorage.removeItem(e.data.key);
    }
  });
  ifrm.onload = function () {
    publishLocalStorage();
  };
}

function publishLocalStorage() {
  console.log("publishLocalStorage");
  var localStorageMap = {};
  for (var i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    localStorageMap[key] = localStorage.getItem(key);
  }
  var iframe = document.getElementById("growwx-iframe");
  iframe.contentWindow.postMessage(
    { event: "storageSync", dataMap: localStorageMap },
    "*"
  );
}
