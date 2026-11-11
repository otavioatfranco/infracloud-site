(function () {
  var S = window.SITE || {};
  var wa = "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(S.whatsappMsg || "");
  var mail = "mailto:" + S.email;

  document.querySelectorAll("[data-wa]").forEach(function (a) { a.href = wa; a.target = "_blank"; a.rel = "noopener"; });
  document.querySelectorAll("[data-mail]").forEach(function (a) { a.href = mail; });
  document.querySelectorAll("[data-show]").forEach(function (el) {
    var v = S[el.getAttribute("data-show")];
    if (v) el.textContent = v;
  });
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  // Topo: fica sólido ao rolar
  var top = document.querySelector(".topbar");
  function onScroll() { top.classList.toggle("is-solid", window.scrollY > 40); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Menu mobile
  var btn = document.querySelector(".menu-btn");
  var nav = document.getElementById("menu");
  function setMenu(open) {
    btn.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    top.classList.toggle("menu-open", open);
  }
  btn.addEventListener("click", function () { setMenu(btn.getAttribute("aria-expanded") !== "true"); });
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });

  // Abas de nuvem (acessíveis por teclado)
  document.querySelectorAll("[data-tabs]").forEach(function (box) {
    var tabs = Array.prototype.slice.call(box.querySelectorAll('[role="tab"]'));
    function select(t) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute("aria-selected", String(on));
        x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var n = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!n) return;
        e.preventDefault();
        var next = tabs[(i + n + tabs.length) % tabs.length];
        select(next); next.focus();
      });
    });
  });

  // Painel NOC: latência oscila e eventos se alternam (ilustrativo)
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var rows = document.querySelectorAll(".noc__table tbody tr");
  setInterval(function () {
    rows.forEach(function (r) {
      var base = +r.getAttribute("data-base");
      var v = Math.max(1, Math.round(base + (Math.random() - 0.4) * base * 0.35));
      var cell = r.querySelector(".lat");
      cell.textContent = v + " ms";
      cell.classList.toggle("is-up", v > base * 1.25);
    });
  }, 1800);

  var events = [
    "Link 2 da filial com perda de pacotes. Tráfego movido para o link 1 via SD-WAN.",
    "Backup imutável da Cloud privada concluído e verificado.",
    "Uso de CPU acima de 85% na AWS. Instância ajustada automaticamente.",
    "Tentativas de login bloqueadas no FortiGate a partir de IP suspeito.",
    "Atualizações de segurança aplicadas no Azure fora do expediente."
  ];
  var ei = 0, msg = document.querySelector(".noc__msg"), time = document.querySelector(".noc__time");
  setInterval(function () {
    ei = (ei + 1) % events.length;
    var d = new Date();
    time.textContent = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
    msg.textContent = events[ei];
  }, 4500);
})();
