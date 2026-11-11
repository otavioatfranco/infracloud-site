(function () {
  var S = window.SITE || {};
  var wa = "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(S.whatsappMsg || "");
  var mail = "mailto:" + S.email;

  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.href = wa; a.target = "_blank"; a.rel = "noopener";
  });
  document.querySelectorAll("[data-mail]").forEach(function (a) { a.href = mail; });
  document.querySelectorAll("[data-show]").forEach(function (el) {
    var v = S[el.getAttribute("data-show")];
    if (v) el.textContent = v;
  });
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  // Menu mobile
  var btn = document.querySelector(".menu-btn");
  var nav = document.getElementById("menu");
  btn.addEventListener("click", function () {
    var open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
  });
  nav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      btn.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    });
  });
})();
