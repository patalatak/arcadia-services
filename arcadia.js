/* Arcadia — interactions légères, sans dépendance.
   1. Le halo des surfaces réactives suit le curseur.
   2. Les sections situées sous la ligne de flottaison entrent en scène.

   Principe de sûreté : rien n'est jamais masqué en attendant un script.
   Si le JS ne s'exécute pas, ou si l'utilisateur limite les animations,
   la page reste entièrement lisible. */
(function () {
  "use strict";

  var sobre = window.matchMedia &&
              window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- 1. Halo qui suit le curseur --------------------------------------- */
  if (!sobre) {
    document.querySelectorAll(".card, .fiche .illus, .tool").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px");
        el.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
      el.addEventListener("pointerleave", function () {
        el.style.removeProperty("--mx");
        el.style.removeProperty("--my");
      });
    });
  }

  /* --- 2. Entrée en scène ------------------------------------------------- */
  if (sobre || !("IntersectionObserver" in window)) return;

  var cibles = [];
  document.querySelectorAll("[data-reveal]").forEach(function (el) {
    // On n'anime que ce qui démarre hors de l'écran : le contenu déjà
    // visible au chargement ne clignote pas.
    if (el.getBoundingClientRect().top > window.innerHeight * 0.95) {
      cibles.push(el);
    }
  });
  if (!cibles.length) return;

  var obs = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (entree) {
      if (!entree.isIntersecting) return;
      var el = entree.target;
      el.style.animationDelay = (parseInt(el.getAttribute("data-reveal"), 10) || 0) + "ms";
      el.classList.add("reveal");
      obs.unobserve(el);
    });
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });

  cibles.forEach(function (el) { obs.observe(el); });
})();
