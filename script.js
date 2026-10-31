/* Lysites — JavaScript principal
   Este arquivo funciona com o index.html e style.css do projeto Lysites.
   Observação: a criação de sites usa modelos locais no navegador; ainda não há
   integração com uma API de IA, login, banco de dados ou pagamentos reais. */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Menu mobile
  const menuToggle = $("[data-menu-toggle], .menu-toggle, #menuToggle");
  const nav = $("[data-nav], .nav-links, #navLinks");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Rolagem suave para links internos
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = $(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (nav) nav.classList.remove("is-open");
    });
  });

  // FAQ em formato sanfona
  $$(".faq-question, [data-faq-question]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item, [data-faq-item]") || button.parentElement;
      if (!item) return;
      const answer = $(".faq-answer, [data-faq-answer]", item);
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      if (answer) answer.hidden = expanded;
      item.classList.toggle("active", !expanded);
    });
  });

  // Filtro de modelos por categoria
  const filterButtons = $$(".filter-btn, [data-template-filter]");
  const templateCards = $$(".template-card, [data-template-category]");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || button.dataset.templateFilter || "todos";
      filterButtons.forEach((item) => item.classList.toggle("active", item === button));
      templateCards.forEach((card) => {
        const category = card.dataset.category || card.dataset.templateCategory || "";
        card.hidden = filter !== "todos" && filter !== "all" && category !== filter;
      });
    });
  });

  // Formulário de criação: gera uma página HTML simples e permite baixá-la.
  const form = $("#siteForm, #createSiteForm, [data-site-form]");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = (selectors) => {
        const field = $(selectors, form) || $(selectors);
        return field ? field.value.trim() : "";
      };

      const businessName = value('[name="businessName"], #businessName, [name="nome"], #siteName') || "Meu negócio";
      const businessType = value('[name="businessType"], #businessType, [name="tipo"]') || "Serviços";
      const description = value('[name="description"], #description, [name="descricao"]') ||
        "Conheça nossos serviços e entre em contato para saber mais.";
      const primaryColor = value('[name="color"], #siteColor, [name="primaryColor"]') || "#79c8f2";
      const email = value('[name="email"], #businessEmail, #email');
      const safe = (text) => String(text).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
      }[char]));

      const generatedHtml = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${safe(businessName)}</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;color:#253447;background:#f5f8fb;line-height:1.6}
header{padding:22px 8%;background:white;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e3ebf2}
.logo{font-size:1.3rem;font-weight:800;color:${safe(primaryColor)}}main{max-width:1000px;margin:65px auto;padding:20px}
.hero{background:white;border-radius:24px;padding:clamp(30px,7vw,75px);box-shadow:0 15px 45px #20354a12}
.tag{color:${safe(primaryColor)};font-weight:bold;text-transform:uppercase;letter-spacing:2px;font-size:.8rem}
h1{font-size:clamp(2.2rem,6vw,4rem);line-height:1.08;margin:15px 0}
p{font-size:1.1rem;color:#607184}.button{display:inline-block;margin-top:18px;background:${safe(primaryColor)};color:#102334;padding:13px 22px;border-radius:10px;text-decoration:none;font-weight:bold}
footer{text-align:center;padding:28px;color:#718096}
</style>
</head>
<body>
<header><div class="logo">${safe(businessName)}</div><span>${safe(businessType)}</span></header>
<main><section class="hero"><div class="tag">Bem-vindo(a)</div><h1>${safe(businessName)}</h1><p>${safe(description)}</p>
<a class="button" href="${email ? "mailto:" + safe(email) : "mailto:contato@exemplo.com"}">Entre em contato</a></section></main>
<footer>© ${new Date().getFullYear()} ${safe(businessName)}. Todos os direitos reservados.</footer>
</body></html>`;

      const blob = new Blob([generatedHtml], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = "meu-site-lysites.html";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      URL.revokeObjectURL(url);

      const message = $("[data-form-message], #formMessage, .form-message");
      if (message) {
        message.textContent = "Seu modelo foi gerado e o download começou!";
        message.hidden = false;
      } else {
        alert("Seu modelo de site foi gerado! Confira a pasta Downloads.");
      }
    });
  }

  // Botões demonstrativos: feedback visual sem simular pagamentos reais.
  $$("[data-demo-action], .demo-action").forEach((button) => {
    button.addEventListener("click", () => {
      const message = button.dataset.message || "Este recurso é demonstrativo e ainda precisa ser conectado.";
      alert(message);
    });
  });

  // Atualiza o ano em elementos dedicados
  $$("[data-current-year], .current-year").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
});