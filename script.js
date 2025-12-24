// ============================
// Cookies Helpers (Basic)
// ============================

function setCookie(key, value, days) {
  let d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = key + "=" + value + ";" + expires + ";path=/";
}

function getCookie(key) {
  let name = key + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let arr = decodedCookie.split(";");

  for (let i = 0; i < arr.length; i++) {
    let c = arr[i].trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function deleteCookie(key) {
  document.cookie = key + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
}

function resetData() {
  deleteCookie("userName");
  deleteCookie("userPass");
}

// ============================
// Detect which page we are on
// ============================

let loginForm = document.getElementById("loginForm");
let signupForm = document.getElementById("signupForm");

// ============================
// LOGIN PAGE LOGIC
// ============================
if (loginForm) {
  let loginUser = document.getElementById("loginUser");
  let loginPass = document.getElementById("loginPass");
  let loginMsg = document.getElementById("loginMsg");
  let goSignup = document.getElementById("goSignup");


  let savedUser = getCookie("userName");
  let savedPass = getCookie("userPass");

  if (savedUser) loginUser.value = savedUser;
  if (savedPass) loginPass.value = savedPass;

  goSignup.addEventListener("click", function () {
    location.href = "signup.html";
  });

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let u = loginUser.value;
  let p = loginPass.value;

  if (u === "" || p === "") {
    loginMsg.className = "msg error";
    loginMsg.innerText = "Please fill username and password.";
    return;
  }

  savedUser = getCookie("userName");
  savedPass = getCookie("userPass");

  if (savedUser === "" || savedPass === "") {
    loginMsg.className = "msg error";
    loginMsg.innerText = "No account found. Redirecting to Sign Up...";

    setTimeout(function () {
      location.href = "signup.html";
    }, 1000);

    return;
  }

  if (u !== savedUser) {
    loginMsg.className = "msg error";
    loginMsg.innerText = "Username not found. Redirecting to Sign Up...";

    setTimeout(function () {
      location.href = "signup.html";
    }, 3000);

    return;
  }

if (p === savedPass) {
  loginMsg.className = "msg success";
  loginMsg.innerText = "Login success ✅";

  setTimeout(function () {
    location.href = "home.html";
  }, 1000);
                    } 
else {
  loginMsg.className = "msg error";
  loginMsg.innerText = "Wrong password ❌";
    } 
});

  let resetBtn = document.getElementById("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      resetData();
      loginMsg.className = "msg success";
      loginMsg.innerText = "Cookies deleted ✅";
      loginUser.value = "";
      loginPass.value = "";
    });
  }
}

// ============================
// SIGNUP PAGE LOGIC
// ============================
if (signupForm) {
  let signupUser = document.getElementById("signupUser");
  let signupPass = document.getElementById("signupPass");
  let signupMsg = document.getElementById("signupMsg");
  let goLogin = document.getElementById("goLogin");

  goLogin.addEventListener("click", function () {
    location.href = "login.html";
  });

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let u = signupUser.value;
    let p = signupPass.value;

    if (u === "" || p === "") {
      signupMsg.className = "msg error";
      signupMsg.innerText = "Please fill username and password.";
      return;
    }

    let usernamePattern = /^[a-zA-Z]{4,}$/;
    if (!usernamePattern.test(u)) {
      signupMsg.className = "msg error";
      signupMsg.innerText = "Username must be letters only and at least 4 characters.";
      return;
    }

    let capitalPattern = /[A-Z]/;
    if (!capitalPattern.test(p)) {
      signupMsg.className = "msg error";
      signupMsg.innerText = "Password must contain at least one capital letter.";
      return;
    }

    let symbolPattern = /[!@#$%^&*]/;
    if (!symbolPattern.test(p)) {
      signupMsg.className = "msg error";
      signupMsg.innerText = "Password must contain at least one symbol (!@#$%^&*).";
      return;
    }

    let oldUser = getCookie("userName");
    if (oldUser !== "" && u === oldUser) {
      signupMsg.className = "msg error";
      signupMsg.innerText = "This username already exists. Try another one.";
      return;
    }

    setCookie("userName", u, 30);
    setCookie("userPass", p, 30);

    signupMsg.className = "msg success";
    signupMsg.innerText = "Account created ✅ Redirecting to Login...";

    setTimeout(function () {
      location.href = "login.html";
    }, 1000);
  });
}


// ============================
// HOME PAGE LOGIC
// ============================
let sliderImg = document.getElementById("sliderImg");
let cardsContainer = document.getElementById("cardsContainer");
let homeMsg = document.getElementById("homeMsg");
let logoutBtn = document.getElementById("logoutBtn");

if (sliderImg && cardsContainer) {
 
  let savedUser = getCookie("userName");
  let savedPass = getCookie("userPass");
  if (savedUser === "" || savedPass === "") {
    location.href = "login.html";
  }

  let sliderImages = [];
  let sliderIndex = 0;
  let sliderIntervalId;

  function startSlider() {
    if (sliderImages.length === 0) return;

    sliderImg.src = sliderImages[sliderIndex];

    if (sliderIntervalId) {
      clearInterval(sliderIntervalId);
    }

    sliderIntervalId = setInterval(function () {
      sliderIndex++;
      if (sliderIndex >= sliderImages.length) sliderIndex = 0;
      sliderImg.src = sliderImages[sliderIndex];
    }, 2000);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      location.href = "login.html";
    });
  }

  let url = "https://dummyjson.com/products?limit=9";
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.send("");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        let data = JSON.parse(xhr.responseText);
        let products = data.products;

        sliderImages = [];
        for (let i = 0; i < products.length; i++) {
          sliderImages.push(products[i].thumbnail);
        }
        sliderIndex = 0;
        startSlider();

        sliderImg.onclick = function () {
          let currentProductId = products[sliderIndex].id;
          location.href = "details.html?id=" + currentProductId;
        };

        cardsContainer.innerHTML = "";

        for (let i = 0; i < products.length; i++) {
          let p = products[i];

          let card = document.createElement("div");
          card.className = "card";

          card.innerHTML =
            '<img src="' + p.thumbnail + '" alt="thumb">' +
            "<h4>" + p.title + "</h4>" +
            "<div>$" + p.price + "</div>";

          card.addEventListener("click", function () {
            location.href = "details.html?id=" + p.id;
          });

          cardsContainer.appendChild(card);
        }
      } else {
        homeMsg.className = "msg error";
        homeMsg.innerText = "API Error. Try again.";
      }
    }
  };
}


// ============================
// DETAILS PAGE LOGIC
// ============================
let detailsTitle = document.getElementById("detailsTitle");
let detailsDesc = document.getElementById("detailsDesc");
let detailsPrice = document.getElementById("detailsPrice");
let detailsImg = document.getElementById("detailsImg");
let detailsMsg = document.getElementById("detailsMsg");
let backHome = document.getElementById("backHome");

if (detailsTitle && detailsDesc && detailsPrice && detailsImg) {

  let savedUser = getCookie("userName");
  let savedPass = getCookie("userPass");
  if (savedUser === "" || savedPass === "") {
    location.href = "login.html";
  }

  if (backHome) {
    backHome.addEventListener("click", function () {
      location.href = "home.html";
    });
  }

  let params = new URLSearchParams(location.search);
  let id = params.get("id");

  if (!id) {
    detailsMsg.className = "msg error";
    detailsMsg.innerText = "No item id found.";
  } else {
    let url = "https://dummyjson.com/products/" + id;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send("");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let p = JSON.parse(xhr.responseText);
          detailsTitle.innerText = p.title;
          detailsDesc.innerText = p.description;
          detailsPrice.innerText = p.price;
          detailsImg.src = p.thumbnail;
        } else {
          detailsMsg.className = "msg error";
          detailsMsg.innerText = "API Error loading details.";
        }
      }
    };
  }
}

window.addEventListener("pageshow", function (e) {
  if (e.persisted) {
    location.reload();
  }
});


