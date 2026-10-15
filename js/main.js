/**
 * ==========================================================================
 * INVEST CAR - LÓGICA PRINCIPAL COM JQUERY & ANIMAÇÕES GSAP
 * ==========================================================================
 * - Controle de vídeo e autoplay sem travas
 * - Animação de entrada da Navbar Flutuante e Ticker Marquee
 * - Animação da Hero Section
 * - Interações no Menu Mobile
 */

$(document).ready(function () {
  'use strict';

  // 1. Registro Obrigatório dos Plugins ScrollTrigger e Draggable no GSAP
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined' && typeof Draggable !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger, Draggable);
    } else if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
  } else {
    console.warn('GSAP não carregado corretamente via CDN.');
    return;
  }

  // 2. Inicialização dos Módulos
  initHeroVideo();
  initNavbarAndMenuTimeline();
  initFloatingHeaderAnimations();
  initDirectionalHeader();
  initSectionIndicadoresAnimations();
  initCardTilt3D();
  initMagneticButtons();
  initRadialMenu();
  initSimuladorRendimento();
  initSimuladorAnimations();
  initHorizontalMarqueeAnimation();
  initTypewriterVantagens();
  initVantagensHorizontalGallery();
  initPlanosAnimations();
  initGlassmorphicBlobs();
  initReelsInfiniteSlider();
  initPassoAPassoLateralPin();
  initFaqAccordion();
  initCtaCarAnimation();

  /* ==========================================================================
     MÓDULO: VÍDEO BACKGROUND 100% HORIZONTAL E VERTICAL
     ========================================================================== */
  function initHeroVideo() {
    var videoElement = document.getElementById('heroVideo');

    if (videoElement) {
      // Garante reprodução mesmo com restrições severas de autoplay dos navegadores
      videoElement.muted = true;
      videoElement.play().catch(function (error) {
        console.log('Autoplay bloqueado pelo navegador, mantendo mudo:', error);
      });

      // Suavização da opacidade quando o vídeo começar a rodar
      $(videoElement).on('playing', function () {
        gsap.to(videoElement, {
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out'
        });
      });
    }
  }

  /* ==========================================================================
     MÓDULO: NAVBAR FLUTUANTE & MENU GSAP TIMELINE (CLEAR & REBUILD PATTERN)
     - Padrão oficial: Timeline única reutilizada com .clear()
     - Entradas via fromTo para estado previsível
     - Saídas via to com drop off-screen e rotação aleatória
     - Ícone hambúrguer faz morph fluido para 'X' e reverte
     ========================================================================== */
  function initNavbarAndMenuTimeline() {
    let isOpen = false;
    let navTl = gsap.timeline();

    function openNavMenu() {
      document.body.style.overflow = "hidden";
      navTl.set("#nav", { visibility: "visible", pointerEvents: "auto" })
        .set(".nav-panel", { x: "101%", y: 0, rotation: 0 })
        .fromTo(
          "#navBg",
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: "power2.out" },
          0
        )
        .fromTo(
          ".nav-panel",
          { x: "101%", y: 0, rotation: 0 },
          {
            x: "0%",
            y: 0,
            rotation: 0,
            duration: 0.65,
            ease: "back.out(1.1)",
            stagger: 0.12,
          },
          0
        )
        .fromTo(
          ".nav-item",
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "expo.out",
            stagger: 0.03
          },
          0.1
        )
        .fromTo(
          ".bar-top",
          { attr: { x1: 3, y1: 7, x2: 17, y2: 7 } },
          {
            attr: { x1: 5, y1: 5, x2: 15, y2: 15 },
            stroke: "#ffffff",
            duration: 0.35,
            ease: "back.out(1.4)",
          },
          0.06
        )
        .fromTo(
          ".bar-mid",
          { opacity: 1 },
          { opacity: 0, duration: 0.2 },
          0.06
        )
        .fromTo(
          ".bar-bot",
          { attr: { x1: 3, y1: 13, x2: 17, y2: 13 } },
          {
            attr: { x1: 15, y1: 5, x2: 5, y2: 15 },
            stroke: "#ffffff",
            duration: 0.35,
            ease: "back.out(1.4)",
          },
          0.06
        )
        .fromTo(
          ".nav-login",
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power3.out",
          },
          0.35
        );
    }

    function closeNavMenu() {
      document.body.style.overflow = "";

      // Desativa imediatamente interação no overlay
      gsap.set("#nav", { pointerEvents: "none" });

      // Reseta qualquer leve deslocamento magnético no botão
      gsap.to("#navCloseBtn, #navCloseBtn .btn-text", { x: 0, y: 0, duration: 0.2, overwrite: true });

      navTl.to(".bar-mid", { opacity: 1, duration: 0.2 }, 0)
        .to(
          ".bar-top",
          {
            attr: { x1: 3, y1: 7, x2: 17, y2: 7 },
            stroke: "#ffffff",
            duration: 0.2,
            ease: "power3.in"
          },
          0
        )
        .to(
          ".bar-bot",
          {
            attr: { x1: 3, y1: 13, x2: 17, y2: 13 },
            stroke: "#ffffff",
            duration: 0.2,
            ease: "power3.in"
          },
          0
        )
        // panels drop off-screen with random rotation (animação original GSAP)
        .to(
          ".nav-panel",
          {
            y: "160vh",
            rotation: () => gsap.utils.random(-15, 15),
            duration: 0.95,
            ease: "power3.in",
            stagger: {
              from: "end",
              each: 0.03
            }
          },
          0
        )
        // bg fades out synchronously with the panels falling
        .to(
          "#navBg",
          {
            opacity: 0,
            duration: 0.45,
            ease: "power2.in"
          },
          0.35
        )
        .call(() => {
          gsap.set("#nav", { visibility: "hidden" });
        });
    }

    function toggleMenu() {
      isOpen = !isOpen;
      const btn = document.getElementById("menuToggle");
      if (btn) {
        btn.setAttribute("aria-expanded", isOpen);
        btn.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
      }
      const closeBtn = document.getElementById("navCloseBtn");
      if (closeBtn) {
        closeBtn.setAttribute("aria-expanded", isOpen);
        closeBtn.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
      }
      document
        .querySelectorAll(".nav-link")
        .forEach((l) => l.setAttribute("tabindex", isOpen ? "0" : "-1"));
      document
        .querySelectorAll(".nav-socials a, .nav-btn-contact, .nav-main-site-link")
        .forEach((l) => l.setAttribute("tabindex", isOpen ? "0" : "-1"));

      // Padrão Timeline Clear and Rebuild
      navTl.kill();
      navTl = gsap.timeline();

      if (isOpen) {
        openNavMenu();
      } else {
        closeNavMenu();
      }
    }

    // Clique no botão hambúrguer do menu e no botão de fechar dentro do menu
    $('#menuToggle, #navCloseBtn').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });

    // Clique no fundo escuro ou fora dos painéis fecha o menu com animação GSAP
    $('#navBg').on('click', function(e) {
      e.stopPropagation();
      if (isOpen) toggleMenu();
    });

    $('#nav').on('click', function(e) {
      if (!$(e.target).closest('.nav-panels-container').length && !$(e.target).closest('#menuToggle').length) {
        if (isOpen) toggleMenu();
      }
    });

    // Tecla ESC fecha o menu
    $(document).on('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) {
        toggleMenu();
        const btn = document.getElementById("menuToggle");
        if (btn) btn.focus();
      }
    });

    // Fechar e rolar suavemente ao clicar em item do menu
    $(document).on('click', '.nav-link, .nav-login-link, .nav-btn-contact[href^="#"]', function(e) {
      var targetId = $(this).attr('href');
      if (targetId && targetId.startsWith('#') && targetId.length > 1) {
        e.preventDefault();
        if (isOpen) toggleMenu();
        var $el = $(targetId);
        if ($el.length) {
          $('html, body').animate({
            scrollTop: $el.offset().top - 20
          }, 800);
        }
      }
    });

    // Scroll Suave para Âncoras e Navegação da Navbar
    $('a[href^="#"]').on('click', function (e) {
      var targetId = $(this).attr('href');
      if (targetId && targetId !== '#' && targetId.length > 1) {
        var $target = $(targetId);
        if ($target.length) {
          e.preventDefault();

          // Identifica a posição precisa (mesmo se dentro ou ao lado de pin-spacer)
          var $spacer = $target.closest('.pin-spacer');
          var targetTop = $spacer.length ? $spacer.offset().top : $target.offset().top;

          if (targetId === '#hero') {
            targetTop = 0;
          } else {
            targetTop = Math.max(0, targetTop - 110);
          }

          $('html, body').stop().animate({
            scrollTop: targetTop
          }, 700);

          $('.navbar-link, .mobile-nav-link').removeClass('active');
          $('a[href="' + targetId + '"]').addClass('active');
        }
      }
    });

    // ScrollSpy com ScrollTrigger para sincronizar o link ativo da Navbar com a rolagem
    var navSections = [
      { id: '#hero', link: 'a[href="#hero"]' },
      { id: '#indicadores', link: 'a[href="#indicadores"]' },
      { id: '#simulador', link: 'a[href="#simulador"]' },
      { id: '#vantagens', link: 'a[href="#vantagens"]' },
      { id: '#planos', link: 'a[href="#planos"]' },
      { id: '#como-funciona', link: 'a[href="#como-funciona"]' },
      { id: '#passo-a-passo', link: 'a[href="#passo-a-passo"]' },
      { id: '#faq', link: 'a[href="#faq"]' }
    ];

    navSections.forEach(function (item) {
      var secEl = document.querySelector(item.id);
      if (secEl) {
        ScrollTrigger.create({
          trigger: secEl,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: function (self) {
            if (self.isActive) {
              $('.navbar-link, .mobile-nav-link').removeClass('active');
              $(item.link).addClass('active');
            }
          }
        });
      }
    });
  }

  /* ==========================================================================
     MÓDULO: ANIMAÇÃO DE ENTRADA CINEMATOGRÁFICA (NAVBAR + MARQUEE + HERO)
     - Navbar e Marquee entram no carregamento inicial
     - O container de conteúdo da Hero entra exatamente 800ms após com Fade + Blur
     ========================================================================== */
  function initFloatingHeaderAnimations() {
    // 1. Entrada suave da Navbar e Marquee
    var headerTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    headerTl
      .from('.navbar-card', {
        y: -30,
        opacity: 0,
        duration: 0.8
      })
      .from('.navbar-marquee-card', {
        y: -15,
        opacity: 0,
        duration: 0.6
      }, '-=0.35');

    // 2. Entrada do Container de Conteúdo da Hero (Textos, Destaques, Botões)
    // Exatamente 800ms (0.8s) após o carregamento, com Fade + Blur
    gsap.fromTo('.hero-content-inner', 
      {
        opacity: 0,
        filter: 'blur(22px)',
        y: 35
      },
      {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 1.2,
        delay: 0.8, // 800ms de delay conforme solicitado
        onComplete: function () {
          ScrollTrigger.refresh();
        }
      }
    );
  }

  /* ==========================================================================
     MÓDULO: DIRECTIONALLY AWARE HEADER (GSAP SCROLLTRIGGER)
     - Rolar para baixo: a header flutuante sobe suavemente e se oculta
     - Rolar para cima: a header desce e reaparece instantaneamente
     - Permanece sempre visível nos primeiros 60px do topo da tela
     ========================================================================== */
  function initDirectionalHeader() {
    const header = document.querySelector('.header-floating-wrapper');
    if (!header) return;

    // Timeline pausada iniciando em progress(1) [estado visível em yPercent: 0]
    const showAnim = gsap.from(header, {
      yPercent: -140,
      paused: true,
      duration: 0.35,
      ease: 'power2.out'
    }).progress(1);

    ScrollTrigger.create({
      start: 'top top',
      end: 'max',
      onUpdate: (self) => {
        // Se o menu timeline estiver aberto, mantém a navbar visível
        if ($('#menuToggle').attr('aria-expanded') === 'true') {
          showAnim.play();
          return;
        }

        // self.direction === -1 significa rolagem para cima (scroll up)
        // Se estiver rolando para cima OU se estiver nos primeiros 60px do topo: exibe
        if (self.direction === -1 || self.scroll() < 60) {
          showAnim.play();
        } else {
          showAnim.reverse();
        }
      }
    });
  }

  /* ==========================================================================
     MÓDULO: SEÇÃO DE INDICADORES & CONFIANÇA (SCROLLTRIGGER)
     ========================================================================== */
  function initSectionIndicadoresAnimations() {
    // Revelação perfeitamente sincronizada dos 4 Cards com Glass Effect
    gsap.fromTo('.cards-row-container .card-item', 
      {
        y: 35,
        opacity: 0
      },
      {
        scrollTrigger: {
          trigger: '.cards-row-container',
          start: 'top 92%',
          once: true
        },
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out',
        clearProps: 'transform' // Elimina transform inline ao finalizar, garantindo alinhamento 100% plano
      }
    );

    // Pre-cache dos textos originais das métricas
    $('.metric-number').each(function () {
      const $el = $(this);
      const target = $el.attr('data-target') || $el.find('.metric-ghost').text().trim() || $el.text().trim();
      $el.data('target-text', target);
    });

    // Revelação dos Indicadores Numéricos + Disparo do Efeito Text Scramble
    gsap.fromTo('.metric-col', 
      {
        y: 25,
        opacity: 0
      },
      {
        scrollTrigger: {
          trigger: '.metrics-row-container',
          start: 'top 95%',
          once: true,
          onEnter: function () {
            runTextScrambleMetrics();
          }
        },
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out',
        clearProps: 'transform,opacity'
      }
    );
  }

  /* ==========================================================================
     MÓDULO: JQUERY TEXT SCRAMBLE EFFECT NOS INDICADORES MÉTRICOS
     - Disparado automaticamente ao chegar na seção .metrics-row-container
     - Tamanho do layout 100% blindado pelo Ghost Sizer (.metric-ghost)
     - A animação ocorre exclusivamente na camada absoluta (.metric-scramble)
     - Zero oscilação de largura, margens ou tremor no layout
     ========================================================================== */
  function runTextScrambleMetrics() {
    const chars = "!@#$%^&*()_+-=<>?/\\[]{}";

    $('.metric-number').each(function (index) {
      const $container = $(this);
      if ($container.data('scrambling')) return;
      $container.data('scrambling', true);

      // Lê com segurança absoluta do atributo data-target ou da camada fantasma
      const target = $container.attr('data-target') || 
                     $container.data('target-text') || 
                     $container.find('.metric-ghost').text().trim() || 
                     $container.text().trim();
      if (!target) {
        $container.data('scrambling', false);
        return;
      }

      const $scramble = $container.find('.metric-scramble');
      let frame = 0;
      const delay = index * 100; // Cascata suave de 100ms entre as 4 métricas

      setTimeout(() => {
        const interval = setInterval(() => {
          const str = target.split('').map((c, i) => {
            if (c === ' ') return ' ';
            return i < frame / 3 ? c : chars[Math.floor(Math.random() * chars.length)];
          }).join('');

          if ($scramble.length) {
            $scramble.text(str);
          } else {
            $container.text(str);
          }

          if (frame++ > target.length * 3) {
            clearInterval(interval);
            if ($scramble.length) {
              $scramble.text(target);
            } else {
              $container.text(target);
            }
            $container.data('scrambling', false);
          }
        }, 40);
      }, delay);
    });
  }

  /* ==========================================================================
     MÓDULO: MOUSE TILT 3D DINÂMICO NOS CARDS (JQUERY)
     - Inclinação 3D proporcional ao ponteiro do mouse (apenas no desktop > 960px)
     - Camada adicional preservando bordas Gemini e demais estilos existentes
     ========================================================================== */
  function initCardTilt3D() {
    $('.card-item').off('mousemove mouseleave').on('mousemove', function (e) {
      if (window.innerWidth <= 960) return;
      const o = $(this).offset();
      const x = e.pageX - o.left - $(this).outerWidth() / 2;
      const y = e.pageY - o.top - $(this).outerHeight() / 2;

      $(this).css({
        'transition': 'transform 0.08s ease-out',
        'transform': `perspective(1000px) rotateY(${x * 0.075}deg) rotateX(${-y * 0.075}deg) scale(1.03)`
      });
    }).on('mouseleave', function () {
      if (window.innerWidth <= 960) return;
      $(this).css({
        'transition': 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
        'transform': 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)'
      });
    });
  }

  /* ==========================================================================
     MÓDULO: BOTÕES MAGNÉTICOS GSAP (NO WIGGLE, OVERWRITE: TRUE)
     - Desktop (> 960px): Atração suave do corpo do botão e texto interno ao mouse
     - Mobile (<= 960px): Sem puxão magnético (botões estáticos e normais), com
       efeito de luz/brilho disparado no clique/toque
     ========================================================================== */
  function initMagneticButtons() {
    // Força de atração do corpo do botão (50% mais leve que o padrão)
    const btnStrength = 0.20;
    // Força de atração da fonte (puxada com mais intensidade que o botão)
    const textStrength = 0.48;

    // Seleciona todos os botões do site
    const buttons = document.querySelectorAll('.btn, .btn-investir-agora, [data-magnetic="true"]');

    buttons.forEach((btn) => {
      // Evita duplicação caso a função seja chamada novamente para novos elementos
      if (btn.dataset.magneticInit === 'true') return;
      btn.dataset.magneticInit = 'true';

      // Garante que o conteúdo interno esteja em uma camada isolada (.btn-text)
      let inner = btn.querySelector('.btn-text');
      if (!inner) {
        inner = document.createElement('span');
        inner.className = 'btn-text';
        while (btn.firstChild) {
          inner.appendChild(btn.firstChild);
        }
        btn.appendChild(inner);
      }

      const zone = btn;

      // Movimento magnético ativado APENAS no desktop (> 960px)
      zone.addEventListener("mousemove", (e) => {
        if (window.innerWidth <= 960) return;

        const rect = zone.getBoundingClientRect();
        const x = gsap.utils.mapRange(rect.left, rect.right, -rect.width / 2, rect.width / 2, e.clientX);
        const y = gsap.utils.mapRange(rect.top, rect.bottom, -rect.height / 2, rect.height / 2, e.clientY);

        // Limite máximo para a fonte se mover estritamente dentro dos limites do botão
        const maxTextX = Math.min(16, rect.width * 0.16);
        const maxTextY = Math.min(9, rect.height * 0.22);
        const textX = gsap.utils.clamp(-maxTextX, maxTextX, x * textStrength);
        const textY = gsap.utils.clamp(-maxTextY, maxTextY, y * textStrength);

        // 1. Movimento do corpo do botão (50% mais leve)
        gsap.to(btn, {
          x: x * btnStrength,
          y: y * btnStrength,
          duration: 0.4,
          ease: "power2.out",
          overwrite: true
        });

        // 2. Movimento da fonte interna (puxada com mais força nos limites do botão)
        gsap.to(inner, {
          x: textX,
          y: textY,
          duration: 0.35,
          ease: "power2.out",
          overwrite: true
        });
      });

      zone.addEventListener("mouseleave", () => {
        if (window.innerWidth <= 960) return;

        // Retorno elástico simultâneo do botão
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.4)",
          overwrite: true
        });

        // Retorno elástico da fonte interna
        gsap.to(inner, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.4)",
          overwrite: true
        });
      });

      // No mobile: feedback luminoso instantâneo no toque (tap/clique)
      zone.addEventListener("touchstart", () => {
        zone.classList.add("btn-tap-active");
      }, { passive: true });

      zone.addEventListener("touchend", () => {
        setTimeout(() => {
          zone.classList.remove("btn-tap-active");
        }, 250);
      }, { passive: true });

      zone.addEventListener("touchcancel", () => {
        zone.classList.remove("btn-tap-active");
      }, { passive: true });
    });

    // Limpa quaisquer transforms residuais se redimensionar ou carregar no mobile
    const clearOnMobile = () => {
      if (window.innerWidth <= 960) {
        buttons.forEach((btn) => {
          const inner = btn.querySelector('.btn-text');
          gsap.set(btn, { clearProps: 'transform' });
          if (inner) gsap.set(inner, { clearProps: 'transform' });
        });
      }
    };
    window.addEventListener('resize', clearOnMobile, { passive: true });
    window.addEventListener('orientationchange', clearOnMobile, { passive: true });
    clearOnMobile();
  }

  /* ==========================================================================
     MÓDULO: MENU RADIAL FLUTUANTE (GSAP ELASTIC EJEÇÃO)
     - Disparo em arco radial (180° a 270° - quadrante superior esquerdo)
     - Física com mola elástica elastic.out(1, 0.5)
     - Fechamento rápido timeScale(1.75)
     - Suporte a Escape e clique externo
     ========================================================================== */
  function initRadialMenu() {
    const radialWrap = document.querySelector("#radialWrap");
    const fabBtn = document.querySelector("#fabBtn");
    if (!radialWrap || !fabBtn) return;

    const items = gsap.utils.toArray(".fab-item");
    const pulseRing = document.querySelector("#pulseRing");
    const iconChat = document.querySelector(".icon-chat");
    const iconClose = document.querySelector(".icon-close");

    const radius = 125;
    const startAngle = 180;
    const endAngle = 270;
    const angleStep = items.length > 1 ? (endAngle - startAngle) / (items.length - 1) : 0;

    let tl;
    let isOpen = false;

    function buildTimeline() {
      gsap.set(items, { x: 0, y: 0, scale: 0, opacity: 0, rotation: -35 });

      tl = gsap.timeline({ paused: true });

      // Pausa / esmaece o anel de pulso
      if (pulseRing) {
        tl.to(pulseRing, { opacity: 0, scale: 0.8, duration: 0.2 }, 0);
      }

      // Transição fluida de ícones (Chat -> X)
      if (iconChat) {
        tl.to(iconChat, {
          scale: 0.2,
          rotation: -90,
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut"
        }, 0);
      }

      if (iconClose) {
        tl.to(iconClose, {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.45,
          ease: "back.out(2)"
        }, 0.1);
      }

      // Ejeção com elastic.out
      items.forEach((item, i) => {
        const rad = (startAngle + angleStep * i) * (Math.PI / 180);
        const tx = Math.cos(rad) * radius;
        const ty = Math.sin(rad) * radius;

        tl.to(item, {
          x: tx,
          y: ty,
          scale: 1,
          opacity: 1,
          rotation: 0,
          pointerEvents: "auto",
          duration: 0.65,
          ease: "elastic.out(1, 0.5)",
          easeReverse: "power3.in"
        }, i * 0.055);
      });
    }

    buildTimeline();

    function toggleMenu() {
      if (isOpen) {
        tl.timeScale(1.75).reverse();
        fabBtn.setAttribute("aria-expanded", "false");
      } else {
        tl.timeScale(1).play();
        fabBtn.setAttribute("aria-expanded", "true");
      }
      isOpen = !isOpen;
    }

    fabBtn.addEventListener("click", toggleMenu);

    items.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        if (!isOpen) return;
        gsap.to(item, { scale: 1.18, duration: 0.3, ease: "back.out(2)" });
      });
      item.addEventListener("mouseleave", () => {
        if (!isOpen) return;
        gsap.to(item, { scale: 1, duration: 0.25, ease: "power2.out" });
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen) toggleMenu();
    });

    document.addEventListener("click", (e) => {
      if (isOpen && !radialWrap.contains(e.target)) {
        toggleMenu();
      }
    });
  }

  /* ==========================================================================
     MÓDULO: CALCULADORA / SIMULADOR DE RENDIMENTO
     - Juros compostos mensais M = P * (1 + i)^n
     - A bolinha branca (slider) calcula o % ao mês
     - O prazo dita os meses (6, 12, 24 ou 48)
     - O valor dita o valor investido (mínimo R$ 1.000)
     - O rendimento mensal é quanto o juros dá por mês: R = P * i
     - CDI (~0,9% a.m.) e Poupança (~0,5% a.m.) são taxas fixas sobre o mesmo prazo e valor
     ========================================================================== */
  function initSimuladorRendimento() {
    const $valorInput = $('#simValorInput');
    const $prazoSelect = $('#simPrazoSelect');
    const $taxaSlider = $('#simTaxaSlider');
    const $taxaDisplay = $('#simTaxaDisplay');

    const $patrimonioVal = $('#simPatrimonioVal');
    const $patrimonioSub = $('#simPatrimonioSub');
    const $rendimentoVal = $('#simRendimentoVal');
    const $compInvestCar = $('#simCompInvestCar');
    const $compCDI = $('#simCompCDI');
    const $compPoupanca = $('#simCompPoupanca');

    if (!$valorInput.length || !$taxaSlider.length) return;

    function formatBRL(val) {
      return val.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }

    function calculate() {
      // 1. Valor investido (se vazio ou menor que 0, assume 1000)
      let rawVal = parseFloat($valorInput.val());
      let valor = (isNaN(rawVal) || rawVal < 0) ? 1000 : rawVal;

      // 2. Prazo em meses (6, 12, 24, 48)
      let prazo = parseInt($prazoSelect.val(), 10);
      if (isNaN(prazo) || prazo <= 0) prazo = 12;

      // 3. Taxa mensal em % (0.5% a 3.0%)
      let taxa = parseFloat($taxaSlider.val());
      if (isNaN(taxa)) taxa = 3.0;

      // Atualiza a barra gradiente ativa do slider
      const minSlider = parseFloat($taxaSlider.attr('min')) || 0.5;
      const maxSlider = parseFloat($taxaSlider.attr('max')) || 3.0;
      const progress = ((taxa - minSlider) / (maxSlider - minSlider)) * 100;
      $taxaSlider.css('--slider-progress', `${progress}%`);

      // Atualiza o texto da taxa ("3% ao mês" ou "2,5% ao mês")
      const taxaTexto = (taxa % 1 === 0 ? taxa.toFixed(0) : taxa.toFixed(1).replace('.', ',')) + '% ao mês';
      $taxaDisplay.text(taxaTexto);

      // 4. Juros Compostos InvestCar: M = P * (1 + i)^n
      const iInvestCar = taxa / 100;
      const montanteInvestCar = valor * Math.pow(1 + iInvestCar, prazo);

      // 5. Rendimento mensal estimado: R = P * i
      const rendimentoMensal = valor * iInvestCar;

      // 6. Comparativo CDI fixo (~0,9% a.m.)
      const iCDI = 0.009;
      const montanteCDI = valor * Math.pow(1 + iCDI, prazo);

      // 7. Comparativo Poupança fixo (~0,5% a.m.)
      const iPoupanca = 0.005;
      const montantePoupanca = valor * Math.pow(1 + iPoupanca, prazo);

      // 8. Renderização instantânea na interface
      $patrimonioVal.text(formatBRL(montanteInvestCar));
      $patrimonioSub.text(`em ${prazo} meses`);
      $rendimentoVal.text(formatBRL(rendimentoMensal));
      $compInvestCar.text(formatBRL(montanteInvestCar));
      $compCDI.text(formatBRL(montanteCDI));
      $compPoupanca.text(formatBRL(montantePoupanca));
    }

    // Ouvintes de eventos em tempo real
    $taxaSlider.on('input change', calculate);
    $prazoSelect.on('change', calculate);
    $valorInput.on('input change keyup', calculate);

    // Executa o cálculo inicial para deixar tudo preenchido e formatado
    calculate();
  }

  /* ==========================================================================
     MÓDULO: GLARE SHEEN ANIMATION NO SIMULADOR-CARD (JQUERY)
     - Feixe luminoso sutil, suave e leve percorrendo o card (apenas desktop > 960px)
     - No mobile (<= 960px), desativado para economizar recursos e aliviar peso
     ========================================================================== */
  function initCardGlareSheen() {
    // No mobile (<= 960px), desativa a animação Glare Sheen
    if (window.innerWidth <= 960) return;

    const $sheen = $('#simuladorCardSheen');
    if (!$sheen.length || $sheen.data('sheen-active')) return;
    $sheen.data('sheen-active', true);

    function triggerSheen() {
      if (window.innerWidth <= 960) return;
      $sheen
        .css({ left: '-150%' })
        .stop(true, true)
        .animate({
          left: '150%'
        }, 1100, 'swing', function () {
          $sheen.css({ left: '-150%' });
        });
    }

    // Primeiro disparo suave na entrada/exibição da seção
    setTimeout(triggerSheen, 350);

    // Repete suavemente a cada 5 segundos (5000ms)
    setInterval(triggerSheen, 5000);
  }

  /* ==========================================================================
     MÓDULO: ANIMAÇÃO DE ENTRADA DO SIMULADOR (GSAP SCROLLTRIGGER)
     ========================================================================== */
  function initSimuladorAnimations() {
    if (!$('.section-simulador').length) return;

    let sheenTriggered = false;
    function onSectionShow() {
      if (!sheenTriggered) {
        sheenTriggered = true;
        initCardGlareSheen();
      }
    }

    gsap.fromTo('.simulador-info-col',
      { y: 35, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.section-simulador',
          start: 'top 85%',
          once: true,
          onEnter: onSectionShow
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'transform'
      }
    );

    gsap.fromTo('.simulador-card-col',
      { y: 45, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.section-simulador',
          start: 'top 85%',
          once: true,
          onEnter: onSectionShow
        },
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power2.out',
        clearProps: 'transform'
      }
    );
  }

  /* ==========================================================================
     MÓDULO: MARQUEE LINEAR CONTÍNUO (400PX) COM ANIMAÇÃO DE FORMAÇÃO DE LETRAS
     - Altura de 400px fixa, linear contínua e autônoma (sem dependência de scroll)
     - As letras chegam dinamicamente se formando com rotação e translação (yPercent)
     - Ícone separador V-Invest-icon.svg ampliado com animação de impacto
     ========================================================================== */
  function initHorizontalMarqueeAnimation() {
    const wrapper = document.querySelector(".marquee-linear-wrapper") || document.querySelector(".section-marquee-400");
    const track = document.getElementById("marqueeLinearTrack");
    if (!wrapper || !track) return;

    // Cancela qualquer tween anterior se houver
    gsap.killTweensOf(track);

    // 1. Divide os textos em palavras e caracteres (.char)
    const charElements = [];
    const iconElements = [];
    const phrases = track.querySelectorAll(".marquee-phrase");

    phrases.forEach((phrase) => {
      const rawText = phrase.textContent.trim();
      phrase.innerHTML = "";

      const words = rawText.split(/\s+/);
      words.forEach((word, wIdx) => {
        const wordSpan = document.createElement("span");
        wordSpan.className = "marquee-word";
        wordSpan.style.display = "inline-block";
        wordSpan.style.whiteSpace = "nowrap";

        for (let i = 0; i < word.length; i++) {
          const charSpan = document.createElement("span");
          charSpan.className = "char";
          charSpan.style.display = "inline-block";
          charSpan.style.willChange = "transform, opacity";
          charSpan.textContent = word[i];
          charSpan.dataset.assembled = "false";
          wordSpan.appendChild(charSpan);
          charElements.push(charSpan);
        }

        phrase.appendChild(wordSpan);

        if (wIdx < words.length - 1) {
          const space = document.createTextNode("\u00A0");
          phrase.appendChild(space);
        }
      });
    });

    const icons = track.querySelectorAll(".marquee-linear-icon");
    icons.forEach((icon) => {
      icon.dataset.assembled = "false";
      iconElements.push(icon);
    });

    // 2. Movimento 100% linear, contínuo e autônomo em loop infinito
    gsap.to(track, {
      xPercent: -50,
      ease: "none",
      duration: 38, // Movimento fluido e elegante
      repeat: -1
    });

    // 3. Ponto de formação calibrado a 200px do canto direito da tela
    const RIGHT_CORNER_OFFSET = 200; // 200px do canto da tela direita (clip content boundary)
    const wrapperRect = wrapper.getBoundingClientRect();
    const initialFormationBoundary = wrapperRect.right - RIGHT_CORNER_OFFSET;
    const leftEdge = wrapperRect.left;

    const initialCharsInView = [];
    charElements.forEach((char) => {
      const rect = char.getBoundingClientRect();
      if (rect.left <= initialFormationBoundary && rect.right >= leftEdge) {
        char.dataset.assembled = "true";
        initialCharsInView.push(char);
      } else if (rect.left > initialFormationBoundary) {
        char.dataset.assembled = "false";
        char.style.opacity = "0";
      }
    });

    if (initialCharsInView.length > 0) {
      gsap.fromTo(initialCharsInView, 
        {
          yPercent: () => gsap.utils.random(-140, 140),
          rotation: () => gsap.utils.random(-20, 20),
          opacity: 0
        },
        {
          yPercent: 0,
          rotation: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.012,
          ease: "back.out(1.3)"
        }
      );
    }

    iconElements.forEach((icon) => {
      const rect = icon.getBoundingClientRect();
      if (rect.left <= initialFormationBoundary && rect.right >= leftEdge) {
        icon.dataset.assembled = "true";
      } else if (rect.left > initialFormationBoundary) {
        icon.dataset.assembled = "false";
        icon.style.opacity = "0";
      }
    });

    // 4. Watcher contínuo: letras e ícones se formando a exatamente 200px do canto direito
    let checkCounter = 0;
    const tickerCallback = () => {
      // Executa a cada 2 frames para máxima performance (~30fps de verificação)
      if (++checkCounter % 2 !== 0) return;

      const currentWrapperRect = wrapper.getBoundingClientRect();
      const R = currentWrapperRect.right;
      const formationLine = R - RIGHT_CORNER_OFFSET; // Linha de montagem a 200px do canto direito

      // Executa de forma contínua desde a abertura do site, mesmo fora do campo de visão da tela
      // Isso evita que frases parem na metade ou sumam quando o usuário estiver em outras seções
      for (let i = 0; i < charElements.length; i++) {
        const char = charElements[i];
        const rect = char.getBoundingClientRect();

        // Se cruzou a linha de montagem (200px da margem direita) e ainda não foi montado:
        if (rect.left <= formationLine && char.dataset.assembled !== "true") {
          char.dataset.assembled = "true";
          if (rect.left >= formationLine - 160) {
            gsap.fromTo(char,
              {
                yPercent: gsap.utils.random(-140, 140),
                rotation: gsap.utils.random(-20, 20),
                opacity: 0,
                scale: 0.72
              },
              {
                yPercent: 0,
                rotation: 0,
                opacity: 1,
                scale: 1,
                duration: 0.75,
                ease: "back.out(1.3)",
                overwrite: "auto"
              }
            );
          } else {
            // Se já cruzou além da margem imediata, fixa imediatamente visível e estável
            gsap.set(char, {
              yPercent: 0,
              rotation: 0,
              opacity: 1,
              scale: 1,
              overwrite: "auto"
            });
          }
        }
        // Enquanto estiver na margem direita antes dos 200px: permanece invisível
        else if (rect.left > formationLine && char.dataset.assembled !== "true") {
          char.style.opacity = "0";
        }
        // Se voltou para fora da tela à direita (por causa do reset no loop -50% a 0%):
        else if (rect.left > R + 60) {
          char.dataset.assembled = "false";
          char.style.opacity = "0";
        }
      }

      // Verifica ícones separadores de forma contínua
      for (let j = 0; j < iconElements.length; j++) {
        const icon = iconElements[j];
        const rect = icon.getBoundingClientRect();

        if (rect.left <= formationLine && icon.dataset.assembled !== "true") {
          icon.dataset.assembled = "true";
          if (rect.left >= formationLine - 160) {
            gsap.fromTo(icon,
              {
                scale: 0.25,
                rotation: gsap.utils.random(-40, 40),
                opacity: 0
              },
              {
                scale: 1,
                rotation: 0,
                opacity: 1,
                duration: 0.85,
                ease: "back.out(1.5)",
                overwrite: "auto"
              }
            );
          } else {
            gsap.set(icon, {
              scale: 1,
              rotation: 0,
              opacity: 1,
              overwrite: "auto"
            });
          }
        }
        else if (rect.left > formationLine && icon.dataset.assembled !== "true") {
          icon.style.opacity = "0";
        }
        else if (rect.left > R + 60) {
          icon.dataset.assembled = "false";
          icon.style.opacity = "0";
        }
      }
    };

    gsap.ticker.add(tickerCallback);
  }

  /* ==========================================================================
     MÓDULO: TYPEWRITER DINÂMICO ("vantagens", "benefícios", "diferenciais")
     ========================================================================== */
  function initTypewriterVantagens() {
    const el = document.getElementById('typewriterText');
    if (!el) return;

    const words = ['vantagens', 'benefícios', 'diferenciais'];
    let wordIndex = 0;
    let charIndex = words[0].length;
    let isDeleting = true;
    let typeSpeed = 2200;

    function typeStep() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        el.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 65; // Apaga rápido e suave
      } else {
        el.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 120; // Digitação orgânica
      }

      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 380; // Pausa antes de digitar a próxima palavra
      } else if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeSpeed = 2200; // Tempo de exibição da palavra digitada
      }

      setTimeout(typeStep, typeSpeed);
    }

    setTimeout(typeStep, typeSpeed);
  }

  /* ==========================================================================
     MÓDULO: GSAP HORIZONTAL SCROLLING GALLERY (SEÇÃO VANTAGENS)
     - Desktop (> 960px): A seção inteira (100vh) é pinada com ScrollTrigger e
       percorre os cards horizontalmente via scrub do scroll vertical (100% inalterado).
     - Mobile (<= 960px): Totalmente desvinculado do scroll vertical da página!
       A página rola naturalmente e os cards formam um carrossel livremente
       arrastável para os lados com toque/mouse (GSAP Draggable com amortecimento).
     ========================================================================== */
  function initVantagensHorizontalGallery() {
    const section = document.querySelector('.section-vantagens');
    const strip = document.getElementById('vantagensGalleryStrip');
    const wrapper = document.getElementById('vantagensGalleryWrapper');
    if (!section || !strip) return;

    const mm = gsap.matchMedia();

    // DESKTOP (> 960px): Pin vertical + Scroll horizontal acoplado ao scroll da página (100% inalterado)
    mm.add('(min-width: 961px)', () => {
      gsap.set(strip, { clearProps: 'all' });

      const getScrollLength = () => Math.max(0, strip.scrollWidth - window.innerWidth);

      const tween = gsap.to(strip, {
        x: () => -getScrollLength(),
        ease: 'none',
        scrollTrigger: {
          id: 'vantagensGallery',
          trigger: section,
          pin: true,
          pinSpacing: true,
          start: 'top top',
          end: () => '+=' + getScrollLength(),
          scrub: true,
          invalidateOnRefresh: true
        }
      });

      return () => {
        if (tween.scrollTrigger) tween.scrollTrigger.kill();
        tween.kill();
        gsap.set(strip, { clearProps: 'all' });
      };
    });

    // MOBILE (<= 960px): Carrossel independente e arrastável pro lado, SEM pin/scrolltrigger!
    mm.add('(max-width: 960px)', () => {
      gsap.set(strip, { clearProps: 'all', x: 0 });

      let dragInstance;
      let lastX = 0;
      let lastTime = 0;
      let velocity = 0;

      const getBounds = () => {
        const wrapW = wrapper ? wrapper.clientWidth : window.innerWidth;
        const totalW = strip.scrollWidth;
        const maxDrag = Math.max(0, totalW - wrapW);
        return { minX: -maxDrag, maxX: 0 };
      };

      if (typeof Draggable !== 'undefined') {
        dragInstance = Draggable.create(strip, {
          type: 'x',
          bounds: getBounds(),
          edgeResistance: 0.8,
          cursor: 'grab',
          activeCursor: 'grabbing',
          allowEventDefault: true,
          dragClickables: true,
          onPress() {
            gsap.killTweensOf(strip);
            lastX = this.x;
            lastTime = Date.now();
            velocity = 0;
          },
          onDrag() {
            const now = Date.now();
            const dt = Math.max(1, now - lastTime);
            velocity = (this.x - lastX) / dt;
            lastX = this.x;
            lastTime = now;
          },
          onDragEnd() {
            const b = getBounds();
            if (Math.abs(velocity) > 0.12) {
              const projected = this.x + (velocity * 200);
              const targetX = Math.max(b.minX, Math.min(b.maxX, projected));
              gsap.to(strip, {
                x: targetX,
                duration: 0.55,
                ease: 'power2.out',
                overwrite: 'auto'
              });
            }
          }
        })[0];

        const updateBounds = () => {
          if (dragInstance) {
            dragInstance.applyBounds(getBounds());
          }
        };

        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(updateBounds);
        }
        strip.querySelectorAll('img').forEach((img) => {
          if (!img.complete) img.addEventListener('load', updateBounds, { once: true });
        });
        window.addEventListener('resize', updateBounds);
        window.addEventListener('orientationchange', updateBounds);
      }

      return () => {
        if (dragInstance) dragInstance.kill();
        gsap.set(strip, { clearProps: 'all' });
      };
    });

    // Recalcula todas as posições quando o layout final estiver pronto
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh);
    }
    strip.querySelectorAll('img').forEach((img) => {
      if (!img.complete) img.addEventListener('load', refresh, { once: true });
    });
    window.addEventListener('load', refresh);
  }

  /* ==========================================================================
     MÓDULO: ENTRADA DA SEÇÃO PLANOS (SCROLLTRIGGER)
     - Criada depois da galeria pinada para manter a ordem correta dos triggers
     ========================================================================== */
  function initPlanosAnimations() {
    if (!document.querySelector('.section-planos')) return;

    gsap.fromTo('.planos-header',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: '.planos-header', start: 'top 85%', once: true }
      }
    );

    gsap.fromTo('.plano-card',
      { y: 45, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.75,
        stagger: 0.14,
        ease: 'power2.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: '.planos-grid', start: 'top 85%', once: true }
      }
    );
  }

  /* ==========================================================================
     MÓDULO: BACKGROUND ANIMADO - GLASSMORPHIIC BLOBS (CANVAS FULLSCREEN)
     - Gradientes radiais orgânicos em movimento suave (drift)
     - Padrão exato com Blobs Glow conforme solicitado:
         const g = ctx.createRadialGradient(x, y, 0, x, y, r);
         g.addColorStop(0, 'rgba(99,102,241,0.3)');
         g.addColorStop(1, 'transparent');
     - Interação elegante com cursor do mouse e transição suave no viewport
     - Renderização fluida a 60fps com pause automático quando aba oculta
     ========================================================================== */
  function initGlassmorphicBlobs() {
    const canvas = document.getElementById('blobsCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animId = null;

    // Suporte ao cursor para parallax e dinamismo interativo
    const mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
      active: false
    };

    // Configuração dos Blobs contendo a cor solicitada (rgba(99,102,241,0.3)) e acentos InvestCar
    const blobConfigs = [
      {
        color: 'rgba(99, 102, 241, 0.35)', // Cor solicitada pelo usuário (indigo glow)
        rRatio: 0.38,
        vx: 0.36,
        vy: 0.22,
        xRel: 0.22,
        yRel: 0.28,
        pulseSpeed: 0.007,
        pulseAmp: 40,
        parallax: 0.035
      },
      {
        color: 'rgba(17, 31, 241, 0.30)', // Azul elétrico InvestCar
        rRatio: 0.44,
        vx: -0.30,
        vy: 0.28,
        xRel: 0.78,
        yRel: 0.32,
        pulseSpeed: 0.009,
        pulseAmp: 45,
        parallax: 0.025
      },
      {
        color: 'rgba(46, 213, 255, 0.22)', // Ciano neon InvestCar
        rRatio: 0.35,
        vx: 0.28,
        vy: -0.30,
        xRel: 0.48,
        yRel: 0.68,
        pulseSpeed: 0.006,
        pulseAmp: 35,
        parallax: 0.040
      },
      {
        color: 'rgba(99, 102, 241, 0.28)', // Indigo glow complementar
        rRatio: 0.42,
        vx: -0.26,
        vy: -0.25,
        xRel: 0.15,
        yRel: 0.82,
        pulseSpeed: 0.008,
        pulseAmp: 42,
        parallax: 0.030
      },
      {
        color: 'rgba(12, 16, 203, 0.32)', // Cobalto profundo InvestCar
        rRatio: 0.40,
        vx: 0.24,
        vy: -0.26,
        xRel: 0.82,
        yRel: 0.78,
        pulseSpeed: 0.010,
        pulseAmp: 38,
        parallax: 0.020
      },
      {
        color: 'rgba(6, 8, 101, 0.38)', // Deep Royal Blue
        rRatio: 0.46,
        vx: -0.20,
        vy: 0.22,
        xRel: 0.50,
        yRel: 0.20,
        pulseSpeed: 0.005,
        pulseAmp: 50,
        parallax: 0.015
      }
    ];

    let blobs = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const minDim = Math.min(width, height);

      if (blobs.length === 0) {
        blobs = blobConfigs.map(function (cfg, index) {
          const baseR = Math.max(220, minDim * cfg.rRatio);
          return {
            x: width * cfg.xRel,
            y: height * cfg.yRel,
            baseR: baseR,
            r: baseR,
            vx: cfg.vx,
            vy: cfg.vy,
            color: cfg.color,
            phase: index * (Math.PI / 3),
            pulseSpeed: cfg.pulseSpeed,
            pulseAmp: cfg.pulseAmp,
            parallax: cfg.parallax
          };
        });
      } else {
        blobs.forEach(function (b, index) {
          const cfg = blobConfigs[index];
          b.baseR = Math.max(220, minDim * cfg.rRatio);
        });
      }
    }

    // Acompanha a movimentação do cursor com amortecimento
    window.addEventListener('mousemove', function (e) {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      if (!mouse.active) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
      }
    }, { passive: true });

    function isMobile() {
      return window.innerWidth <= 960;
    }

    function drawStatic() {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'screen';

      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];
        const safeR = Math.max(10, b.baseR);
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, safeR);
        g.addColorStop(0, b.color);
        g.addColorStop(1, 'transparent');

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, safeR, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
    }

    function handleResize() {
      resize();
      if (isMobile()) {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
        drawStatic();
      } else {
        if (!animId) {
          animId = requestAnimationFrame(render);
        }
      }
    }

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });
    resize();

    // Loop de animação contínua (60fps)
    function render() {
      if (isMobile()) {
        if (animId) cancelAnimationFrame(animId);
        animId = null;
        drawStatic();
        return;
      }
      // Interpolação suave do mouse (easing)
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.04;
        mouse.y += (mouse.targetY - mouse.y) * 0.04;
      }

      ctx.clearRect(0, 0, width, height);

      // Efeito de iluminação aditiva suave para realce glassmorphic
      ctx.globalCompositeOperation = 'screen';

      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];

        // Pulsação orgânica suave do raio
        b.phase += b.pulseSpeed;
        b.r = b.baseR + Math.sin(b.phase) * b.pulseAmp;

        // Movimento contínuo suave
        b.x += b.vx;
        b.y += b.vy;

        // Limites com reflexão suave (mantém os blobs circulando na tela)
        const pad = b.r * 0.25;
        if (b.x < -pad) {
          b.x = -pad;
          b.vx = Math.abs(b.vx);
        } else if (b.x > width + pad) {
          b.x = width + pad;
          b.vx = -Math.abs(b.vx);
        }

        if (b.y < -pad) {
          b.y = -pad;
          b.vy = Math.abs(b.vy);
        } else if (b.y > height + pad) {
          b.y = height + pad;
          b.vy = -Math.abs(b.vy);
        }

        // Deslocamento de parallax suave baseado no mouse
        let drawX = b.x;
        let drawY = b.y;
        if (mouse.active) {
          const mdx = (mouse.x - width / 2) * b.parallax;
          const mdy = (mouse.y - height / 2) * b.parallax;
          drawX += mdx;
          drawY += mdy;
        }

        const safeR = Math.max(10, b.r);

        // Blobs Glow
        const g = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, safeR);
        g.addColorStop(0, b.color);
        g.addColorStop(1, 'transparent');

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(drawX, drawY, safeR, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';

      animId = requestAnimationFrame(render);
    }

    // Economia de recursos: pausa quando a página não estiver visível
    document.addEventListener('visibilitychange', function () {
      if (isMobile()) return;
      if (document.hidden) {
        if (animId) cancelAnimationFrame(animId);
        animId = null;
      } else {
        if (!animId) {
          animId = requestAnimationFrame(render);
        }
      }
    });

    if (isMobile()) {
      drawStatic();
    } else {
      render();
    }
  }

  /* ==========================================================================
     MÓDULO: GSAP INFINITE CARD SLIDER (REELS & BASTIDORES) + MODAL DE VÍDEO
     - Criação de loop 3D contínuo sem emendas (seamlessLoop)
     - 10 Cards das Capas dos Reels (proporção 9:16 com 8px de border-radius)
     - Botão Play dinâmico no card centralizado
     - Modal de vídeo 9:16 vertical centralizado (100px das bordas verticais)
     - Sequência de animação: Blur in no fundo -> Fade in no vídeo; Fade out no vídeo -> Blur out no fundo
     - Botão "X" azul no canto superior direito do vídeo e clique fora para fechar
     - Controles via botões Prev/Next (padrão InvestCar) e Draggable
     ========================================================================== */
  function initReelsInfiniteSlider() {
    const section = document.querySelector('.section-reels-slider');
    const cardsList = document.querySelector('.reels-cards-list');
    if (!section || !cardsList) return;

    const cards = gsap.utils.toArray('.reels-cards-list li');
    if (!cards.length) return;

    // Elementos do Modal de Vídeo
    const overlay = document.getElementById('reelsModalOverlay');
    const modalCard = document.getElementById('reelsModalCard');
    const modalVideo = document.getElementById('reelsModalVideo');
    const closeBtn = document.getElementById('reelsModalCloseBtn');

    // Estado inicial de todos os cards
    gsap.set(cards, { xPercent: 400, opacity: 0, scale: 0 });

    const spacing = 0.1; // Espaçamento proporcional dos 10 cards (10 * 0.1 = 1.0)
    const snapTime = gsap.utils.snap(spacing);

    // Função de animação de cada card no loop (3D yoyo scaling & horizontal translation)
    const animateFunc = element => {
      const tl = gsap.timeline();
      tl.fromTo(element, 
        { scale: 0, opacity: 0 }, 
        { scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: 'power1.in', immediateRender: false }
      ).fromTo(element, 
        { xPercent: 400 }, 
        { xPercent: -400, duration: 1, ease: 'none', immediateRender: false }, 
        0
      );
      return tl;
    };

    const seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc);
    const playhead = { offset: 0 };
    const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration());

    // Identifica e marca o card que está perfeitamente no centro da tela
    function updateActiveCenterCard() {
      let closestCard = null;
      let minDistance = Infinity;

      cards.forEach(card => {
        const xPct = Math.abs(parseFloat(gsap.getProperty(card, 'xPercent')) || 0);
        if (xPct < minDistance) {
          minDistance = xPct;
          closestCard = card;
        }
      });

      cards.forEach(card => {
        if (card === closestCard && minDistance < 50) {
          card.classList.add('is-center');
        } else {
          card.classList.remove('is-center');
        }
      });
    }

    const scrub = gsap.to(playhead, {
      offset: 0,
      onUpdate() {
        seamlessLoop.time(wrapTime(playhead.offset));
        updateActiveCenterCard();
      },
      duration: 0.6,
      ease: 'power3.out',
      paused: true
    });

    // Inicia centralizado no primeiro card
    playhead.offset = 0;
    seamlessLoop.time(wrapTime(0));
    updateActiveCenterCard();

    // =========================================================================
    // LÓGICA DO MODAL DE VÍDEO (BLUR IN -> FADE IN / FADE OUT -> BLUR OUT)
    // =========================================================================
    let isModalOpen = false;
    let isClosingModal = false;

    function openReelsVideoModal(videoSrc) {
      if (!videoSrc || !overlay || !modalCard || !modalVideo || isClosingModal) return;
      isModalOpen = true;

      // Define a fonte e reinicia o ponteiro do vídeo
      modalVideo.src = videoSrc;
      modalVideo.currentTime = 0;

      // Exibe overlay no layout
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';

      gsap.killTweensOf([overlay, modalCard]);

      // Sequência: 1º Entra com blur in no overlay -> 2º Fade in no vídeo
      const openTl = gsap.timeline();

      // 1. Blur in no fundo
      openTl.fromTo(overlay, 
        { opacity: 0, backdropFilter: 'blur(0px)', webkitBackdropFilter: 'blur(0px)' },
        { opacity: 1, backdropFilter: 'blur(20px)', webkitBackdropFilter: 'blur(20px)', duration: 0.35, ease: 'power2.out' }
      )
      // 2. Fade in + Scale in suave no vídeo
      .fromTo(modalCard,
        { opacity: 0, scale: 0.88, y: 15 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          duration: 0.36, 
          ease: 'back.out(1.3)',
          onComplete: () => {
            modalVideo.play().catch(function(e) {
              console.log('Autoplay com som requisitou interação do usuário:', e);
            });
          }
        },
        "-=0.08"
      );
    }

    function closeReelsVideoModal() {
      if (!isModalOpen || !overlay || !modalCard || !modalVideo || isClosingModal) return;
      isClosingModal = true;

      gsap.killTweensOf([overlay, modalCard]);

      // Sequência: 1º Dá fade out no vídeo -> 2º Blur out no overlay
      const closeTl = gsap.timeline({
        onComplete: () => {
          modalVideo.pause();
          modalVideo.removeAttribute('src');
          modalVideo.load();
          overlay.style.display = 'none';
          document.body.style.overflow = '';
          isModalOpen = false;
          isClosingModal = false;
        }
      });

      // 1. Fade out no vídeo
      closeTl.to(modalCard, {
        opacity: 0,
        scale: 0.9,
        y: 15,
        duration: 0.25,
        ease: 'power2.in'
      })
      // 2. Blur out no overlay de fundo
      .to(overlay, {
        opacity: 0,
        backdropFilter: 'blur(0px)',
        webkitBackdropFilter: 'blur(0px)',
        duration: 0.28,
        ease: 'power2.out'
      }, "-=0.05");
    }

    // Clique no 'X' azul do canto superior direito do vídeo
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeReelsVideoModal();
      });
    }

    // Clique fora do vídeo (no overlay de fundo)
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
          closeReelsVideoModal();
        }
      });
    }

    // Tecla ESC fecha o vídeo
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isModalOpen) {
        closeReelsVideoModal();
      }
    });

    // Botões Próximo e Anterior estilizados no padrão InvestCar
    const nextBtn = document.querySelector('.reels-btn-next');
    const prevBtn = document.querySelector('.reels-btn-prev');

    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        scrub.vars.offset = snapTime(scrub.vars.offset + spacing);
        scrub.invalidate().restart();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        scrub.vars.offset = snapTime(scrub.vars.offset - spacing);
        scrub.invalidate().restart();
      });
    }

    // Controle de clique / arrasto para evitar clique acidental durante drag
    let wasDragging = false;
    let dragStartX = 0;

    // Clique individual nos cards: se for o do centro abre o vídeo; se não, centraliza
    cards.forEach((card, index) => {
      // Botão de Play dentro do card
      const playBtn = card.querySelector('.reels-card-play-btn');
      if (playBtn) {
        playBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          if (wasDragging) return;
          const videoSrc = card.getAttribute('data-video');
          if (videoSrc) {
            openReelsVideoModal(videoSrc);
          }
        });
      }

      // Clique no corpo do card
      card.addEventListener('click', function () {
        if (wasDragging) return;

        // Se já está centralizado, abre o vídeo
        if (card.classList.contains('is-center')) {
          const videoSrc = card.getAttribute('data-video');
          if (videoSrc) {
            openReelsVideoModal(videoSrc);
          }
          return;
        }

        // Se não está centralizado, desliza até centralizar
        const currentWrapped = wrapTime(playhead.offset);
        const cardTargetTime = (index * spacing) % seamlessLoop.duration();
        let diff = cardTargetTime - currentWrapped;
        if (diff > seamlessLoop.duration() / 2) diff -= seamlessLoop.duration();
        if (diff < -seamlessLoop.duration() / 2) diff += seamlessLoop.duration();
        scrub.vars.offset = snapTime(scrub.vars.offset + diff);
        scrub.invalidate().restart();
      });
    });

    // Draggable (arrasto interativo em desktop e mobile)
    if (typeof Draggable !== 'undefined') {
      Draggable.create('.drag-proxy', {
        type: 'x',
        trigger: '.reels-cards-list',
        onPress() {
          wasDragging = false;
          dragStartX = this.x;
          this.startOffset = scrub.vars.offset;
        },
        onDrag() {
          if (Math.abs(this.x - dragStartX) > 5) {
            wasDragging = true;
          }
          scrub.vars.offset = this.startOffset + (this.startX - this.x) * 0.0012;
          scrub.invalidate().restart();
        },
        onDragEnd() {
          scrub.vars.offset = snapTime(scrub.vars.offset);
          scrub.invalidate().restart();
          setTimeout(() => {
            wasDragging = false;
          }, 80);
        }
      });
    }

    // Função construtora do Seamless Loop GreenSock
    function buildSeamlessLoop(items, spacing, animateFunc) {
      const overlap = Math.ceil(1 / spacing);
      const startTime = items.length * spacing + 0.5;
      const loopTime = (items.length + overlap) * spacing + 1;
      const rawSequence = gsap.timeline({ paused: true });
      const seamless = gsap.timeline({
        paused: true,
        repeat: -1,
        onRepeat() {
          this._time === this._dur && (this._tTime += this._dur - 0.01);
        }
      });
      const l = items.length + overlap * 2;

      for (let i = 0; i < l; i++) {
        const index = i % items.length;
        const time = i * spacing;
        rawSequence.add(animateFunc(items[index]), time);
      }

      rawSequence.time(startTime);
      seamless.to(rawSequence, {
        time: loopTime,
        duration: loopTime - startTime,
        ease: 'none'
      }).fromTo(rawSequence, { time: overlap * spacing + 1 }, {
        time: startTime,
        duration: startTime - (overlap * spacing + 1),
        immediateRender: false,
        ease: 'none'
      });

      return seamless;
    }

    // Expõe globalmente caso necessário
    window.openReelsVideoModal = openReelsVideoModal;
    window.closeReelsVideoModal = closeReelsVideoModal;
  }

  /* ==========================================================================
     MÓDULO: PASSO A PASSO (LATERAL PIN INDICATOR NO DESKTOP / CARROSSEL ARRASTÁVEL NO MOBILE)
     - Desktop (> 960px): Pin vertical com Scrub suave + 2 colunas com Lateral Indicator (100% inalterado)
     - Mobile (<= 960px): .passo-topics-column oculta, cards dispostos em linha e
       livremente arrastáveis para os lados (carrossel horizontal touch/mouse com Draggable)
     ========================================================================== */
  function initPassoAPassoLateralPin() {
    const section = document.querySelector('.section-passo-a-passo');
    if (!section) return;

    const listItems = gsap.utils.toArray('.passo-topic-item');
    const slides = gsap.utils.toArray('.passo-card-slide');
    const fill = document.querySelector('.passo-indicator-fill');
    const viewport = document.querySelector('.passo-cards-viewport');
    const cardsCol = document.querySelector('.passo-cards-column');

    if (!slides.length) return;

    const mm = gsap.matchMedia();

    // DESKTOP (> 960px): Pin vertical + Lateral Indicator com Scrub (100% inalterado)
    mm.add('(min-width: 961px)', () => {
      // Estado inicial dos slides para o layout empilhado com pin
      gsap.set(slides[0], { autoAlpha: 1, y: 0, scale: 1 });
      for (let i = 1; i < slides.length; i++) {
        gsap.set(slides[i], { autoAlpha: 0, y: 35, scale: 0.96 });
      }

      if (fill && listItems.length) {
        gsap.set(fill, {
          scaleY: 1 / listItems.length,
          transformOrigin: 'top left'
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=' + (listItems.length * 600),
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            let activeIdx = 0;
            if (p >= 0.66) {
              activeIdx = 2;
            } else if (p >= 0.33) {
              activeIdx = 1;
            } else {
              activeIdx = 0;
            }

            listItems.forEach((item, idx) => {
              if (idx === activeIdx) {
                item.classList.add('is-active');
              } else {
                item.classList.remove('is-active');
              }
            });
          }
        }
      });

      // Animação contínua da barra indicadora de progresso (fill)
      if (fill) {
        tl.to(fill, {
          scaleY: 1,
          transformOrigin: 'top left',
          ease: 'none',
          duration: 3.0
        }, 0);
      }

      // Transição Slide 0 -> Slide 1 (sincronizada no terço 0.33 da timeline)
      tl.to(slides[0], {
        autoAlpha: 0,
        y: -30,
        scale: 0.96,
        duration: 0.35,
        ease: 'power2.inOut'
      }, 0.85)
      .to(slides[1], {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.35,
        ease: 'power2.out'
      }, 0.95);

      // Transição Slide 1 -> Slide 2 (sincronizada no terço 0.66 da timeline)
      tl.to(slides[1], {
        autoAlpha: 0,
        y: -30,
        scale: 0.96,
        duration: 0.35,
        ease: 'power2.inOut'
      }, 1.85)
      .to(slides[2], {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.35,
        ease: 'power2.out'
      }, 1.95);

      // Pausa final com o card 3 estabilizado até o fim do pin
      tl.to({}, { duration: 0.7 });

      // Clique nos tópicos da direita para rolar até o slide correspondente
      const topicClicks = [];
      listItems.forEach((item, idx) => {
        const handler = () => {
          const st = tl.scrollTrigger;
          if (!st) return;
          const targetFrac = idx === 0 ? 0.05 : (idx === 1 ? 0.5 : 0.95);
          const scrollTarget = st.start + (st.end - st.start) * targetFrac;
          window.scrollTo({
            top: scrollTarget,
            behavior: 'smooth'
          });
        };
        item.addEventListener('click', handler);
        topicClicks.push({ item, handler });
      });

      return () => {
        if (tl.scrollTrigger) tl.scrollTrigger.kill();
        tl.kill();
        topicClicks.forEach(({ item, handler }) => item.removeEventListener('click', handler));
        gsap.set(slides, { clearProps: 'all' });
        if (fill) gsap.set(fill, { clearProps: 'all' });
      };
    });

    // MOBILE (<= 960px): CARROSSEL HORIZONTAL ARRASTÁVEL!
    // .passo-topics-column é oculto via CSS. Os cards viram um carrossel livremente arrastável pro lado.
    mm.add('(max-width: 960px)', () => {
      // Limpa qualquer propriedade inline de opacidade/transform dos cards deixada pelo desktop
      gsap.set(slides, {
        clearProps: 'all',
        autoAlpha: 1,
        opacity: 1,
        visibility: 'visible',
        y: 0,
        scale: 1
      });
      if (viewport) {
        gsap.set(viewport, { clearProps: 'all', x: 0 });
      }

      let dragInstance;
      let lastX = 0;
      let lastTime = 0;
      let velocity = 0;

      const getBounds = () => {
        if (!viewport) return { minX: 0, maxX: 0 };
        const wrapW = cardsCol ? cardsCol.clientWidth : window.innerWidth;
        const totalW = viewport.scrollWidth;
        const maxDrag = Math.max(0, totalW - wrapW);
        return { minX: -maxDrag, maxX: 0 };
      };

      if (viewport && typeof Draggable !== 'undefined') {
        dragInstance = Draggable.create(viewport, {
          type: 'x',
          bounds: getBounds(),
          edgeResistance: 0.8,
          cursor: 'grab',
          activeCursor: 'grabbing',
          allowEventDefault: true,
          dragClickables: true,
          onPress() {
            gsap.killTweensOf(viewport);
            lastX = this.x;
            lastTime = Date.now();
            velocity = 0;
          },
          onDrag() {
            const now = Date.now();
            const dt = Math.max(1, now - lastTime);
            velocity = (this.x - lastX) / dt;
            lastX = this.x;
            lastTime = now;
          },
          onDragEnd() {
            const b = getBounds();
            if (Math.abs(velocity) > 0.12) {
              const projected = this.x + (velocity * 200);
              const targetX = Math.max(b.minX, Math.min(b.maxX, projected));
              gsap.to(viewport, {
                x: targetX,
                duration: 0.55,
                ease: 'power2.out',
                overwrite: 'auto'
              });
            }
          }
        })[0];

        const updateBounds = () => {
          if (dragInstance) {
            dragInstance.applyBounds(getBounds());
          }
        };

        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(updateBounds);
        }
        window.addEventListener('resize', updateBounds);
        window.addEventListener('orientationchange', updateBounds);
      }

      return () => {
        if (dragInstance) dragInstance.kill();
        if (viewport) gsap.set(viewport, { clearProps: 'all' });
        gsap.set(slides, { clearProps: 'all' });
      };
    });
  }

  /* ==========================================================================
     MÓDULO: FAQ ACCORDION (PERGUNTAS FREQUENTES)
     ========================================================================== */
  function initFaqAccordion() {
    var $faqItems = $('.faq-item');
    if (!$faqItems.length) return;

    $('.faq-question-btn').on('click', function () {
      var $item = $(this).closest('.faq-item');
      var isOpen = $item.hasClass('is-open');

      // Fecha outros itens para comportamento de acordeão limpo
      $faqItems.not($item).removeClass('is-open').find('.faq-question-btn').attr('aria-expanded', 'false');

      if (isOpen) {
        $item.removeClass('is-open');
        $(this).attr('aria-expanded', 'false');
      } else {
        $item.addClass('is-open');
        $(this).attr('aria-expanded', 'true');
      }

      // Atualiza o ScrollTrigger após a transição da altura
      setTimeout(function () {
        ScrollTrigger.refresh();
      }, 360);
    });
  }

  /* ==========================================================================
     MÓDULO: CTA FINAL - CARRO 3D ENTRANCE ANIMATION
     ========================================================================== */
  function initCtaCarAnimation() {
    var car = document.querySelector('.cta-car-image');
    if (!car) return;

    gsap.from(car, {
      scrollTrigger: {
        trigger: '.section-cta',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 45,
      opacity: 0,
      scale: 0.94,
      duration: 1.1,
      ease: 'power3.out'
    });
  }

  // Disponível globalmente para ser invocado automaticamente em novas seções
  window.initNavbarAndMenuTimeline = initNavbarAndMenuTimeline;
  window.initCtaCarAnimation = initCtaCarAnimation;
  window.initFaqAccordion = initFaqAccordion;
  window.initPassoAPassoLateralPin = initPassoAPassoLateralPin;
  window.initReelsInfiniteSlider = initReelsInfiniteSlider;
  window.initGlassmorphicBlobs = initGlassmorphicBlobs;
  window.initPlanosAnimations = initPlanosAnimations;
  window.initMagneticButtons = initMagneticButtons;
  window.initCardTilt3D = initCardTilt3D;
  window.initRadialMenu = initRadialMenu;
  window.initDirectionalHeader = initDirectionalHeader;
  window.runTextScrambleMetrics = runTextScrambleMetrics;
  window.initSimuladorRendimento = initSimuladorRendimento;
  window.initCardGlareSheen = initCardGlareSheen;
  window.initHorizontalMarqueeAnimation = initHorizontalMarqueeAnimation;
  window.initTypewriterVantagens = initTypewriterVantagens;
  window.initVantagensHorizontalGallery = initVantagensHorizontalGallery;

  // Garante sincronização perfeita do ScrollTrigger quando todas as fontes/vídeos terminarem de carregar
  $(window).on('load', function () {
    ScrollTrigger.refresh();
  });

});
