// ============================================
// MAIN JAVASCRIPT FILE
// Navigation, Forms, Animations & Interactions
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeContactForm();
    initializeProducts();

    // Initialize other features
    initializeBackToTop();
    initializeSmoothScrolling();
    initializeFormValidation();
});

// ============================================
// NAVIGATION SYSTEM
// ============================================
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const header = document.getElementById('header');

    if (navToggle && navMenu) {
        // Mobile menu toggle
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
    
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking on links
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Header scroll effect
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Active navigation highlighting
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');

    function highlightNavigation() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation(); // Initial call
}

// ============================================
// SCROLL EFFECTS & ANIMATIONS
// ============================================
function initializeScrollEffects() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Add stagger effect for grid items
                if (entry.target.classList.contains('service-card') ||
                    entry.target.classList.contains('product-card') ||
                    entry.target.classList.contains('review-card')) {
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.service-card, .product-card, .review-card, .stat-item, .info-card').forEach(element => {
        observer.observe(element);
    });

    // Parallax effect for hero section
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            if (scrolled < 500) {
                heroImage.style.transform = `translateY(${rate}px) scale(${1 + scrolled * 0.0002})`;
            }
        });
    }
}

// ============================================
// CONTACT FORM HANDLING
// ============================================
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('contactName').value.trim(),
                phone: document.getElementById('contactPhone').value.trim(),
                email: document.getElementById('contactEmail').value.trim(),
                subject: document.getElementById('contactSubject').value,
                message: document.getElementById('contactMessage').value.trim()
            };

            // Basic validation
            if (!formData.name || !formData.phone || !formData.subject || !formData.message) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (formData.email && !emailRegex.test(formData.email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Phone validation (Indian format)
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(formData.phone)) {
                showNotification('Please enter a valid 10-digit Indian phone number', 'error');
                return;
            }

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                // In a real application, you would send this to your backend
                // For now, we'll simulate a successful submission
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Success
                contactForm.reset();
                showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');

            } catch (error) {
                console.error('Error submitting form:', error);
                showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// ============================================
// PRODUCTS INITIALIZATION
// ============================================
function initializeProducts() {
    // This will be handled by products.js
    // Just ensure the product loading is triggered
    loadFeaturedProducts();
}

// ============================================
// FAQ ACCORDION
// ============================================
function initializeFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        const answer = question.nextElementSibling;
        answer.style.display = 'none'; // Hide answers initially

        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const toggleIcon = this.querySelector('.toggle-icon');

            // Close all other FAQs
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    const otherAnswer = otherQuestion.nextElementSibling;
                    const otherIcon = otherQuestion.querySelector('.toggle-icon');
                    otherAnswer.style.display = 'none';
                    if (otherIcon) otherIcon.classList.remove('rotated');
                }
            });

            // Toggle current FAQ
            this.setAttribute('aria-expanded', !isExpanded);
            answer.style.display = isExpanded ? 'none' : 'block';

            // Rotate icon
            if (toggleIcon) {
                if (isExpanded) {
                    toggleIcon.classList.remove('rotated');
                } else {
                    toggleIcon.classList.add('rotated');
                }
            }
        });
    });
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
                setTimeout(() => {
                    if (!backToTopBtn.classList.contains('show')) {
                        backToTopBtn.style.display = 'none';
                    }
                }, 300);
            }
        });

        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ============================================
// SMOOTH SCROLLING
// ============================================
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = document.getElementById('header') ?
                    document.getElementById('header').offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// FORM VALIDATION
// ============================================
function initializeFormValidation() {
    // Enhanced form field interactions
    document.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('focus', function() {
            this.parentElement.classList.add('field-focus');
        });

        field.addEventListener('blur', function() {
            this.parentElement.classList.remove('field-focus');
        });

        field.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.add('has-content');
            } else {
                this.classList.remove('has-content');
            }
        });
    });
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type = 'success', duration = 5000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const iconClass = type === 'success' ? 'fas fa-check-circle' :
                     type === 'error' ? 'fas fa-exclamation-circle' :
                     type === 'warning' ? 'fas fa-exclamation-triangle' :
                     'fas fa-info-circle';

    notification.innerHTML = `
        <i class="${iconClass}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add to body
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Load featured products (placeholder for products.js)
function loadFeaturedProducts() {
    // This will be implemented in products.js
    console.log('Loading featured products...');
}

// Make functions globally available
window.showNotification = showNotification;
window.initializeNavigation = initializeNavigation;
window.initializeScrollEffects = initializeScrollEffects;
window.initializeContactForm = initializeContactForm;
window.initializeProducts = initializeProducts;
window.initializeFAQAccordion = initializeFAQAccordion;
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});
