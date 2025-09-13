/* 
====================================
DevOps Portfolio JavaScript
Author: Anil Rot
====================================
*/

// DOM Elements
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeContactForm();
    createScrollProgressBar();
});

/* 
====================================
Navigation Functions
====================================
*/

// Initialize navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    mobileMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navMenu.contains(event.target) && !mobileMenu.contains(event.target)) {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

/* 
====================================
Scroll Effects
====================================
*/

// Initialize scroll-based effects
function initializeScrollEffects() {
    window.addEventListener('scroll', function() {
        updateScrollProgressBar();
        updateActiveNavLink();
        handleNavbarBackground();
    });
}

// Create scroll progress bar
function createScrollProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
}

// Update scroll progress bar
function updateScrollProgressBar() {
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    scrollProgress.style.width = scrollPercent + '%';
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            // Remove active class from all nav links
            navLinks.forEach(link => link.classList.remove('active'));
            // Add active class to current section's nav link
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
}

// Handle navbar background on scroll
function handleNavbarBackground() {
    const navbar = document.getElementById('navbar');
    const scrollTop = window.scrollY;

    if (scrollTop > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
}

/* 
====================================
Animation Functions
====================================
*/

// Initialize scroll animations
function initializeAnimations() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements that should animate
    const animateElements = document.querySelectorAll(
        '.skill-category, .project-card, .about-stats .stat, .contact-item'
    );
    
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Animate skill tags with staggered delay
    animateSkillTags();
}

// Animate skill tags with staggered delay
function animateSkillTags() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach((tag, index) => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(20px)';
        tag.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            tag.style.opacity = '1';
            tag.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/* 
====================================
Contact Form Functions
====================================
*/

// Initialize contact form
function initializeContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
        
        // Add input validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateInput);
            input.addEventListener('input', clearValidationError);
        });
    }
}

// Handle contact form submission
function handleContactFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Validate form
    if (!validateForm(name, email, subject, message)) {
        return;
    }
    
    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual backend integration)
    setTimeout(() => {
        showFormSuccess();
        contactForm.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Validate individual input
function validateInput(event) {
    const input = event.target;
    const value = input.value.trim();
    
    // Remove previous error styling
    input.classList.remove('error');
    
    // Validate based on input type
    switch (input.type) {
        case 'email':
            if (!isValidEmail(value)) {
                showInputError(input, 'Please enter a valid email address');
            }
            break;
        case 'text':
            if (value.length < 2) {
                showInputError(input, 'This field must be at least 2 characters long');
            }
            break;
    }
    
    if (input.tagName === 'TEXTAREA' && value.length < 10) {
        showInputError(input, 'Message must be at least 10 characters long');
    }
}

// Clear validation error
function clearValidationError(event) {
    const input = event.target;
    input.classList.remove('error');
    
    // Remove error message if exists
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Show input error
function showInputError(input, message) {
    input.classList.add('error');
    
    // Remove existing error message
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.5rem';
    
    input.parentNode.appendChild(errorDiv);
}

// Validate entire form
function validateForm(name, email, subject, message) {
    let isValid = true;
    
    if (!name || name.length < 2) {
        showInputError(document.getElementById('name'), 'Name is required (minimum 2 characters)');
        isValid = false;
    }
    
    if (!email || !isValidEmail(email)) {
        showInputError(document.getElementById('email'), 'Valid email is required');
        isValid = false;
    }
    
    if (!subject || subject.length < 2) {
        showInputError(document.getElementById('subject'), 'Subject is required (minimum 2 characters)');
        isValid = false;
    }
    
    if (!message || message.length < 10) {
        showInputError(document.getElementById('message'), 'Message is required (minimum 10 characters)');
        isValid = false;
    }
    
    return isValid;
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show form success message
function showFormSuccess() {
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.innerHTML = `
        <div style="
            background: #d4edda;
            color: #155724;
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid #c3e6cb;
            margin-bottom: 1rem;
            text-align: center;
        ">
            <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
            Thank you for your message! I'll get back to you soon.
        </div>
    `;
    
    // Insert success message at the top of the form
    contactForm.insertBefore(successDiv, contactForm.firstChild);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
    
    // Scroll to success message
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* 
====================================
Utility Functions
====================================
*/

// Smooth scroll to element (fallback for older browsers)
function smoothScrollTo(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Debounce function to limit function calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function to limit function calls
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

/* 
====================================
Performance Optimizations
====================================
*/

// Optimize scroll events with throttling
const optimizedScrollHandler = throttle(function() {
    updateScrollProgressBar();
    updateActiveNavLink();
    handleNavbarBackground();
}, 16); // ~60fps

// Replace scroll event listener with optimized version
window.removeEventListener('scroll', initializeScrollEffects);
window.addEventListener('scroll', optimizedScrollHandler);

/* 
====================================
Additional Features
====================================
*/

// Add typing animation to hero subtitle (optional)
function initializeTypingAnimation() {
    const subtitle = document.querySelector('.hero-subtitle');
    const text = 'DevOps Engineer';
    let index = 0;
    
    subtitle.textContent = '';
    
    const typeWriter = setInterval(() => {
        subtitle.textContent += text.charAt(index);
        index++;
        
        if (index >= text.length) {
            clearInterval(typeWriter);
        }
    }, 100);
}

// Add particle effect to hero background (optional)
function createParticleEffect() {
    const hero = document.querySelector('.hero');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(0, 123, 255, 0.3);
            border-radius: 50%;
            animation: float ${Math.random() * 3 + 2}s infinite linear;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
        `;
        particlesContainer.appendChild(particle);
    }
    
    hero.appendChild(particlesContainer);
}

/* 
====================================
Error Handling
====================================
*/

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Portfolio Error:', event.error);
    // Could send error reports to analytics service here
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
    event.preventDefault();
});

/* 
====================================
Browser Compatibility
====================================
*/

// Check for required features and provide fallbacks
function checkBrowserCompatibility() {
    // Check for IntersectionObserver support
    if (!window.IntersectionObserver) {
        // Fallback: make all animated elements immediately visible
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(el => el.classList.add('visible'));
    }
    
    // Check for CSS Grid support
    if (!CSS.supports('display', 'grid')) {
        // Add fallback class for flexbox layout
        document.body.classList.add('no-grid-support');
    }
}

// Run compatibility check
checkBrowserCompatibility();

/* 
====================================
Analytics & Tracking (Optional)
====================================
*/

// Track user interactions for analytics
function trackInteraction(action, category = 'Portfolio', label = '') {
    // Example: Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
        });
    }
    
    console.log(`Tracked: ${category} - ${action} - ${label}`);
}

// Track button clicks
document.addEventListener('click', function(event) {
    const target = event.target.closest('a, button');
    if (target) {
        const text = target.textContent.trim();
        const href = target.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            trackInteraction('navigation_click', 'Internal Link', href);
        } else if (href && href.startsWith('http')) {
            trackInteraction('external_link_click', 'External Link', href);
        } else if (target.tagName === 'BUTTON') {
            trackInteraction('button_click', 'Button', text);
        }
    }
});

console.log('🚀 DevOps Portfolio JavaScript Loaded Successfully!');