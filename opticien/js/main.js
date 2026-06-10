document.addEventListener('DOMContentLoaded', () => {
  // --- SYSTÈME DE THÈME CLAIR / SOMBRE ---
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;

  // Récupérer le thème enregistré
  const currentTheme = localStorage.getItem('theme') || 'dark';
  if (currentTheme === 'light') {
    body.classList.add('light-theme');
  }

  // Écouteur pour basculer le thème
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const theme = body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
  });

  // --- MENU MOBILE ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      // Empêcher le défilement du body quand le menu est ouvert
      body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Fermer le menu au clic sur un lien d'ancrage
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
        body.style.overflow = '';
      });
    });
  }

  // --- HEADER EFFET AU DEFILEMENT ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- ANIMATIONS D'APPARITION AU SCROLL (REVEAL) ---
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Une fois animé, on arrête d'observer pour de meilleures performances
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- CARROUSEL DE LA COLLECTION ---
  const track = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.prev-arrow');
  const nextBtn = document.querySelector('.next-arrow');
  const cards = document.querySelectorAll('.collection-card');
  
  if (track && prevBtn && nextBtn && cards.length > 0) {
    let currentIndex = 0;
    
    function getSlidesPerView() {
      if (window.innerWidth <= 480) return 1;
      if (window.innerWidth <= 768) return 2;
      return 3;
    }

    function updateCarousel() {
      const slidesPerView = getSlidesPerView();
      const maxIndex = Math.max(0, cards.length - slidesPerView);
      
      // Ajuster l'index actuel si nécessaire (par ex. suite à un redimensionnement)
      if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
      }
      
      const gap = 32; // Valeur du gap en px (2rem)
      const cardWidth = cards[0].getBoundingClientRect().width;
      const offset = currentIndex * (cardWidth + gap);
      
      track.style.transform = `translateX(-${offset}px)`;
      
      // Activer/Désactiver les boutons
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === maxIndex;
    }

    // Gestionnaires de clic
    nextBtn.addEventListener('click', () => {
      const slidesPerView = getSlidesPerView();
      if (currentIndex < cards.length - slidesPerView) {
        currentIndex++;
        updateCarousel();
      }
    });

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    // Écouteur de redimensionnement de fenêtre
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateCarousel();
      }, 100);
    });

    // Initialisation du carrousel
    setTimeout(updateCarousel, 200);
  }

  // --- EFFET DE PARALLAXE 3D SUR LES CARTES ÉQUIPE ---
  const teamCards = document.querySelectorAll('.team-card');
  
  teamCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // Position X de la souris dans la carte
      const y = e.clientY - rect.top;  // Position Y de la souris dans la carte
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculer l'angle de rotation (max 10 degrés)
      const rotateX = ((centerY - y) / centerY) * 10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      card.style.transition = 'transform 0.1s ease';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.transition = 'transform 0.5s ease';
    });
  });

  // --- FORMULAIRE DE RÉSERVATION INTERACTIF ---
  const bookingForm = document.getElementById('appointment-form');
  const bookingFormFields = document.querySelector('.booking-form');
  const successMessage = document.querySelector('.form-success-message');
  
  if (bookingForm && successMessage) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simulation d'une validation simple
      let isValid = true;
      const inputs = bookingForm.querySelectorAll('.form-input[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#ef4444';
          input.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.2)';
        } else {
          input.style.borderColor = '';
          input.style.boxShadow = '';
        }
      });
      
      if (isValid) {
        // Obtenir des détails saisis pour personnaliser le message
        const clientName = document.getElementById('form-name').value;
        const dateInput = document.getElementById('form-date').value;
        const timeInput = document.getElementById('form-time').value;
        
        // Formater la date en français
        let formattedDate = dateInput;
        try {
          const dateObj = new Date(dateInput);
          formattedDate = dateObj.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        } catch (err) {
          console.error(err);
        }
        
        // Mettre à jour les infos de confirmation dans le message de succès
        const successDetails = successMessage.querySelector('.success-details');
        if (successDetails) {
          successDetails.innerHTML = `
            <strong>Cabinet L'Optique Signature</strong><br>
            Le ${formattedDate} à <strong>${timeInput}</strong>.<br><br>
            Un email de confirmation contenant un lien de rappel vous a été envoyé.
          `;
        }
        
        // Animation de transition
        bookingFormFields.style.opacity = '0';
        bookingFormFields.style.transform = 'scale(0.95)';
        bookingFormFields.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        
        setTimeout(() => {
          bookingFormFields.style.display = 'none';
          successMessage.style.display = 'flex';
        }, 400);
      }
    });
  }

  // --- NAVIGATION FLUIDE ET LIENS ACTIFS EN FONCTION DU DEFILEMENT ---
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
      
      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });
});
