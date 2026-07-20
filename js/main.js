/**
 * Shashti Dental Clinic & Orthodontic Centre - Interactive Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initClinicStatus();
  initServiceFilters();
  initAppointmentModal();
  initGalleryLightbox();
  initHoursHighlighter();
  initReviewsSlider();
  initGallerySlider();
});

/* --------------------------------------------------------------------------
   1. Dark / Light Theme Switcher
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggleBtn');
  const icon = themeBtn ? themeBtn.querySelector('i') : null;
  
  // Check stored theme or default to light
  const storedTheme = localStorage.getItem('shashti_theme') || 'light';
  document.documentElement.setAttribute('data-theme', storedTheme);
  updateThemeIcon(storedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('shashti_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!icon) return;
    if (theme === 'dark') {
      icon.className = 'ri-sun-line';
      themeBtn.setAttribute('title', 'Switch to Light Mode');
    } else {
      icon.className = 'ri-moon-line';
      themeBtn.setAttribute('title', 'Switch to Dark Mode');
    }
  }
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Menu Toggle
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isOpen = navMenu.classList.contains('active');
      mobileToggle.innerHTML = isOpen ? '<i class="ri-close-line"></i>' : '<i class="ri-menu-line"></i>';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.innerHTML = '<i class="ri-menu-line"></i>';
      });
    });
  }
}

/* --------------------------------------------------------------------------
   3. Real-Time Clinic Open / Closed Status
   -------------------------------------------------------------------------- */
function initClinicStatus() {
  const statusContainer = document.getElementById('clinicStatusBadge');
  if (!statusContainer) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTimeInMinutes = hour * 60 + minute;

  let isOpen = false;
  let nextScheduleText = '';

  if (day === 0) { // Sunday: 10:00 AM - 1:30 PM (600 - 810 minutes)
    const openTime = 10 * 60; // 10:00
    const closeTime = 13 * 60 + 30; // 13:30
    if (currentTimeInMinutes >= openTime && currentTimeInMinutes < closeTime) {
      isOpen = true;
      nextScheduleText = 'Closes today at 1:30 PM';
    } else {
      nextScheduleText = 'Opens Mon at 10:00 AM';
    }
  } else { // Monday - Saturday: 10:00 AM - 8:00 PM (600 - 1200 minutes)
    const openTime = 10 * 60; // 10:00
    const closeTime = 20 * 60; // 20:00
    if (currentTimeInMinutes >= openTime && currentTimeInMinutes < closeTime) {
      isOpen = true;
      nextScheduleText = 'Closes today at 8:00 PM';
    } else {
      nextScheduleText = 'Opens tomorrow at 10:00 AM';
    }
  }

  if (isOpen) {
    statusContainer.innerHTML = `
      <span class="status-dot"></span>
      <span>OPEN NOW • ${nextScheduleText}</span>
    `;
  } else {
    statusContainer.innerHTML = `
      <span class="status-dot closed"></span>
      <span>CLOSED NOW • ${nextScheduleText}</span>
    `;
  }
}

/* --------------------------------------------------------------------------
   4. Services Showcase Category Filtering
   -------------------------------------------------------------------------- */
function initServiceFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || filterValue === cardCategory) {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Appointment Booking Modal & Form Handling
   -------------------------------------------------------------------------- */
function initAppointmentModal() {
  const modal = document.getElementById('appointmentModal');
  const openBtns = document.querySelectorAll('.trigger-booking');
  const closeBtn = document.getElementById('closeModalBtn');
  const bookingForm = document.getElementById('bookingForm');
  const formState = document.getElementById('modalFormState');
  const successState = document.getElementById('modalSuccessState');
  const resetBtn = document.getElementById('resetBookingBtn');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Auto pre-select service if clicked from a service card
      const preselectedService = btn.getAttribute('data-service');
      if (preselectedService && bookingForm) {
        const serviceSelect = bookingForm.querySelector('#bookingService');
        if (serviceSelect) serviceSelect.value = preselectedService;
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('patientName').value.trim();
      const phone = document.getElementById('patientPhone').value.trim();
      const service = document.getElementById('bookingService').value;
      const doctor = document.getElementById('bookingDoctor').value;
      const date = document.getElementById('bookingDate').value;
      const time = document.getElementById('bookingTime').value;

      if (!name || !phone || !service || !date) {
        alert('Please fill out all required fields.');
        return;
      }

      // Populate summary details in success screen
      const refNum = 'SHS-' + Math.floor(100000 + Math.random() * 900000);
      document.getElementById('summaryRefNo').innerText = refNum;
      document.getElementById('summaryPatientName').innerText = name;
      document.getElementById('summaryService').innerText = service;
      document.getElementById('summaryDoctor').innerText = doctor;
      document.getElementById('summaryDateTime').innerText = `${date} at ${time}`;

      // Switch views
      formState.style.display = 'none';
      successState.style.display = 'block';

      // Setup WhatsApp button trigger
      const whatsappBtn = document.getElementById('whatsappConfirmBtn');
      if (whatsappBtn) {
        const msg = encodeURIComponent(`Hello Shashti Dental Clinic, I booked an appointment.\nRef: ${refNum}\nName: ${name}\nService: ${service}\nDoctor: ${doctor}\nDate: ${date} at ${time}`);
        whatsappBtn.href = `https://wa.me/919677936740?text=${msg}`;
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      bookingForm.reset();
      formState.style.display = 'block';
      successState.style.display = 'none';
      closeModal();
    });
  }
}

/* --------------------------------------------------------------------------
   6. Gallery Lightbox Modal
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!lightbox) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-overlay h4')?.innerText || '';
      const desc = item.querySelector('.gallery-overlay p')?.innerText || '';

      lightboxImg.src = img.src;
      lightboxCaption.innerText = `${title} - ${desc}`;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* --------------------------------------------------------------------------
   7. Contact Working Hours Active Day Highlighter
   -------------------------------------------------------------------------- */
function initHoursHighlighter() {
  const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayDayName = daysMap[new Date().getDay()];
  
  const todayRow = document.querySelector(`.hours-table tr[data-day="${todayDayName}"]`);
  if (todayRow) {
    todayRow.classList.add('today');
    const dayTd = todayRow.querySelector('.day');
    if (dayTd) {
      dayTd.innerHTML += ' <span style="font-size:0.75rem; background:var(--primary-light); color:var(--primary); padding:2px 6px; border-radius:4px; margin-left:6px;">Today</span>';
    }
  }
}

/* --------------------------------------------------------------------------
   8. Patient Reviews Carousel / Slider
   -------------------------------------------------------------------------- */
function initReviewsSlider() {
  const track = document.getElementById('reviewsTrack');
  const slides = document.querySelectorAll('.review-slide');
  const prevBtn = document.getElementById('reviewPrevBtn');
  const nextBtn = document.getElementById('reviewNextBtn');
  const dots = document.querySelectorAll('.slider-dots .dot');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoSlideTimer = null;

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
      resetAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      resetAutoSlide();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      goToSlide(idx);
      resetAutoSlide();
    });
  });

  function startAutoSlide() {
    autoSlideTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  startAutoSlide();

  const wrapper = document.querySelector('.reviews-slider-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
    wrapper.addEventListener('mouseleave', startAutoSlide);
  }
}

/* --------------------------------------------------------------------------
   9. Inside Clinic Photo Gallery Slider
   -------------------------------------------------------------------------- */
function initGallerySlider() {
  const track = document.getElementById('galleryTrack');
  const slides = document.querySelectorAll('.gallery-slide');
  const prevBtn = document.getElementById('galleryPrevBtn');
  const nextBtn = document.getElementById('galleryNextBtn');
  const dots = document.querySelectorAll('#galleryDots .dot');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoSlideTimer = null;

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
      resetAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      resetAutoSlide();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      goToSlide(idx);
      resetAutoSlide();
    });
  });

  function startAutoSlide() {
    autoSlideTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 4500);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  startAutoSlide();

  const wrapper = document.querySelector('.gallery-slider-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
    wrapper.addEventListener('mouseleave', startAutoSlide);
  }
}
