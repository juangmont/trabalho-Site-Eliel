/* ===== Tema claro / escuro ===== */
const raiz = document.documentElement;
const botaoTema = document.getElementById("botaoTema");

function aplicarTema(tema) {
  raiz.setAttribute("data-theme", tema);
  botaoTema.textContent = tema === "dark" ? "Modo claro" : "Modo escuro";
  try { localStorage.setItem("tema", tema); } catch (e) {}
}

aplicarTema(raiz.getAttribute("data-theme") || "light");

botaoTema.addEventListener("click", () => {
  aplicarTema(raiz.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

/* ===== Menu do celular ===== */
const botaoMenu = document.getElementById("botaoMenu");
const menu = document.getElementById("menu");

function fecharMenu() {
  menu.classList.remove("aberto");
  botaoMenu.setAttribute("aria-expanded", "false");
  botaoMenu.setAttribute("aria-label", "Abrir menu");
}

botaoMenu.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  botaoMenu.setAttribute("aria-expanded", String(aberto));
  botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
});

// Fecha o menu ao escolher uma seção
menu.querySelectorAll("a").forEach(link => link.addEventListener("click", fecharMenu));

/* ===== Fotos e vídeos que deslizam (estilo reels) ===== */
const reduzMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;
let somLigado = false; // vale para todos os vídeos depois que a pessoa ativa o som

document.querySelectorAll(".reels-wrap").forEach(wrap => {
  const reels = wrap.querySelector(".reels");
  const pontos = wrap.querySelectorAll(".ponto");
  const dica = wrap.querySelector(".reels-dica");

  // pontinhos acompanham a rolagem
  reels.addEventListener("scroll", () => {
    const i = Math.round(reels.scrollTop / reels.clientHeight);
    pontos.forEach((p, n) => p.classList.toggle("ativo", n === i));
    if (reels.scrollTop > 10) dica.classList.add("some");
  }, { passive: true });

  pontos.forEach((p, n) => p.addEventListener("click", () => {
    reels.scrollTo({ top: n * reels.clientHeight, behavior: "smooth" });
  }));
});

// Vídeos: tocam quando aparecem e pausam quando saem da tela
const videos = document.querySelectorAll(".reel-video video");
const botoesSom = document.querySelectorAll(".som");

function atualizarSom() {
  videos.forEach(v => { v.muted = !somLigado; });
  botoesSom.forEach(b => {
    b.textContent = somLigado ? "Silenciar" : "Ativar som";
    b.setAttribute("aria-pressed", String(somLigado));
  });
}

botoesSom.forEach(b => b.addEventListener("click", () => {
  somLigado = !somLigado;
  atualizarSom();
}));

videos.forEach(v => v.addEventListener("click", () => {
  v.paused ? v.play().catch(() => {}) : v.pause();
}));

if ("IntersectionObserver" in window) {
  const observador = new IntersectionObserver(entradas => {
    entradas.forEach(e => {
      const v = e.target;
      if (e.isIntersecting && !reduzMovimento) v.play().catch(() => {});
      else v.pause();
    });
  }, { threshold: 0.6 });
  videos.forEach(v => observador.observe(v));
}
