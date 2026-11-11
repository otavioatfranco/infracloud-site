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

  // Rolagem: barra de progresso, topo claro/escuro e escurecimento da página
  document.documentElement.classList.add("js");
  var top = document.querySelector(".topbar");
  var bar = document.querySelector(".progress");
  var themed = Array.prototype.slice.call(document.querySelectorAll("[data-theme]"));
  var shift = document.querySelector(".sec--shift");
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;
    if (bar) bar.style.setProperty("--scroll", max > 0 ? (y / max).toFixed(4) : 0);

    // tema da seção que está embaixo do topo
    var probe = 36, theme = "light";
    for (var i = 0; i < themed.length; i++) {
      var r = themed[i].getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) { theme = themed[i].getAttribute("data-theme"); break; }
    }
    top.classList.toggle("is-dark", theme === "dark");
    top.classList.toggle("is-solid", theme !== "dark" && y > 40);

    // a seção "Como trabalhamos" vai do claro ao escuro enquanto entra na tela
    if (shift) {
      var t = shift.getBoundingClientRect().top;
      var p = Math.min(1, Math.max(0, (vh - t) / (vh * 0.6)));
      shift.style.setProperty("--p", p.toFixed(3));
    }
  }
  // parallax suave nas fotos
  var px = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function parallax() {
    if (reduce) return;
    var vh = window.innerHeight;
    px.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      var off = (r.top + r.height / 2 - vh / 2) * parseFloat(el.getAttribute("data-parallax"));
      el.style.transform = "translate3d(0," + off.toFixed(1) + "px,0)";
    });
  }
  var _onScroll = onScroll;
  onScroll = function () { _onScroll(); parallax(); };
  function requestTick() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
  onScroll();
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);

  // Elementos aparecem suavemente ao entrar na tela
  var targets = document.querySelectorAll(".people__text, .band__quote, .sec__head, .tabs, .svc li, .steps li, .why dl > div, .tech ul, .faq details, .cta__in, .facts p");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (el) {
      var sibs = el.parentElement.children, idx = Array.prototype.indexOf.call(sibs, el);
      if (sibs.length > 1 && el.tagName !== "HEADER") el.style.setProperty("--d", Math.min(idx, 5) * 0.08 + "s");
      el.classList.add("reveal");
      io.observe(el);
    });
  }

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
