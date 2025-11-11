// ===== CONFIGURATION - EDIT THESE VALUES =====
const CONFIG = {
    // Salesforce Configuration
    salesforce: {
        // Custom REST API endpoint
        apiEndpoint: 'https://mvclouds-2e-dev-ed.develop.my.site.com/CustomerDemo/services/apexrest/customlead',
        apiKey: 'RachitShah@999' // Your API key for authentication
    },
    
    // Resume Configuration
    resume: {
        // Google Drive direct download link
        url: 'https://drive.google.com/uc?export=download&id=14KGupv6Ks5FNl1GVWvNygcP7kLQFYsuK',
        filename: 'RachitShah_Resume.pdf'
    }
};

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    // Remove all classes first
    icon.className = '';
    
    if (theme === 'light') {
        // Light mode - show moon
        icon.className = 'fas fa-moon';
    } else {
        // Dark mode - show sun
        icon.className = 'fas fa-sun';
    }
    
    // Force a repaint
    icon.offsetHeight;
}

// ===== MOBILE MENU =====
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.querySelector('.nav-menu');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = mobileMenuToggle.querySelector('i');
    icon.className = navMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileMenuToggle.querySelector('i');
        icon.className = 'fas fa-bars';
    });
});

// ===== SMOOTH SCROLL WITH OFFSET =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Height of fixed navbar
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// ===== PROJECTS ANIMATION =====
// Projects filter removed - all projects are now displayed together
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
    setTimeout(() => {
        card.style.animation = 'fadeInUp 0.5s ease';
    }, index * 100);
});

// ===== RESUME DOWNLOAD =====
const downloadResumeBtn = document.getElementById('downloadResume');

downloadResumeBtn.addEventListener('click', () => {
    // Use Google Drive direct download link
    const resumeUrl = CONFIG.resume.url;
    
    // Open in new tab for download
    window.open(resumeUrl, '_blank');
    
    // Show a confirmation message
    showNotification('Resume download started!', 'success');
});

// ===== CONTACT FORM - SALESFORCE INTEGRATION =====
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading state
    const submitBtn = contactForm.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-block';
    formMessage.style.display = 'none';
    
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        company: document.getElementById('company').value,
        message: document.getElementById('message').value
    };
    
    try {
        // Call your custom Salesforce REST API
        const requestBody = {
            apiKey: CONFIG.salesforce.apiKey,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone || '',
            company: formData.company || 'Not Specified', // Default value if empty
            leadSource: 'Website',
            description: formData.message
        };
        
        // Debug: Log the request details
        console.log('🔵 Sending request to:', CONFIG.salesforce.apiEndpoint);
        console.log('🔵 Request payload:', JSON.stringify(requestBody, null, 2));
        
        const response = await fetch(CONFIG.salesforce.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        // Debug: Log response details
        console.log('🔵 Response status:', response.status);
        console.log('🔵 Response headers:', [...response.headers.entries()]);
        
        const responseText = await response.text();
        console.log('🔵 Response body:', responseText);
        
        if (response.status === 201) {
            // Success - Lead created
            console.log('✅ Lead created successfully!');
            showFormMessage('✅ Thank you for reaching out! Your message has been received. I\'ll get back to you soon.', 'success');
            contactForm.reset();
            
            // Show success notification
            showNotification('Lead created successfully in Salesforce!', 'success');
        } else if (response.status === 401) {
            // Unauthorized - API Key issue
            console.error('❌ Authentication failed!');
            console.error('Expected API Key:', CONFIG.salesforce.apiKey);
            console.error('Server response:', responseText);
            showFormMessage(`⚠️ Authentication failed: ${responseText}\nPlease contact me directly via email.`, 'error');
        } else if (response.status === 400) {
            // Bad Request - Missing required fields
            console.error('❌ Validation error!');
            console.error('Server response:', responseText);
            showFormMessage(`⚠️ Validation error: ${responseText}`, 'error');
        } else if (response.status === 500) {
            // Server error
            console.error('❌ Server error!');
            console.error('Server response:', responseText);
            showFormMessage(`❌ Server error: ${responseText}`, 'error');
        } else {
            // Other errors
            console.error('❌ Unexpected error!');
            console.error('Status:', response.status);
            console.error('Response:', responseText);
            showFormMessage(`❌ Error (${response.status}): ${responseText}`, 'error');
        }
        
    } catch (error) {
        console.error('❌ Network or fetch error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        // Check if it's a CORS error
        if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
            showFormMessage('❌ Network error! This might be a CORS issue. Check console for details.\n\nPossible fixes:\n1. Enable CORS in Salesforce Site settings\n2. Check if the community URL is correct\n3. Verify the API endpoint is accessible', 'error');
            console.error('💡 CORS Fix: Go to Salesforce Setup > Sites > Your Site > Public Access Settings > CORS');
        } else {
            showFormMessage(`❌ Error: ${error.message}\n\nPlease email me directly at rachitshah2809@gmail.com`, 'error');
        }
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline-block';
        btnLoading.style.display = 'none';
    }
});

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4ea8de' : '#ff6b6b'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('section, .project-card, .timeline-item, .skill-item').forEach(el => {
    observer.observe(el);
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== SCROLL TO TOP BUTTON =====
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== TYPING ANIMATION =====
const typingText = document.querySelector('.typing-text');
const roles = [
    'Salesforce Developer',
    'Apex Developer',
    'LWC Specialist',
    'CRM Solutions Expert'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 150;

function typeRole() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 150;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
        // Pause at end
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500;
    }
    
    setTimeout(typeRole, typingSpeed);
}

// Start typing animation after page loads
// (Moved to dynamic experience calculation function)

// ===== ENHANCED SCROLL ANIMATIONS =====
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.project-card, .timeline-item, .skill-item, .contact-item');
    
    elements.forEach((element, index) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100 && elementBottom > 0) {
            // Add staggered delay for cards in the same row
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
};

// Initialize elements for animation
const initializeAnimations = () => {
    const elements = document.querySelectorAll('.project-card, .timeline-item, .skill-item, .contact-item');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
    });
};

window.addEventListener('load', () => {
    initializeAnimations();
    animateOnScroll();
});

window.addEventListener('scroll', animateOnScroll);

// ===== SKILL ITEMS HOVER EFFECT =====
document.querySelectorAll('.skill-item').forEach(skill => {
    skill.addEventListener('mouseenter', function() {
        this.style.animation = 'pulse 0.5s ease';
    });
    
    skill.addEventListener('animationend', function() {
        this.style.animation = '';
    });
});

// ===== PROJECT CARD TILT EFFECT =====
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===== SMOOTH REVEAL FOR TIMELINE =====
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, index * 200);
        }
    });
}, { threshold: 0.1 });

timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-50px)';
    item.style.transition = 'all 0.6s ease';
    timelineObserver.observe(item);
});

// ===== NAVBAR ACTIVE LINK ENHANCEMENT =====
const navLinksEnhanced = document.querySelectorAll('.nav-menu a');
navLinksEnhanced.forEach(link => {
    link.addEventListener('click', function() {
        navLinksEnhanced.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// ===== DYNAMIC EXPERIENCE CALCULATION =====
function calculateExperience() {
    const startDate = new Date('2023-08-01');
    const today = new Date();
    
    let years = today.getFullYear() - startDate.getFullYear();
    let months = today.getMonth() - startDate.getMonth();
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    const experienceText = `${years}.${months}+`;
    const experienceYears = years + (months / 10); // For better readability like 2.3 instead of 2.3
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', `Rachit Shah - Professional Salesforce Developer with ${experienceText} years of experience in Apex, LWC, and CRM solutions`);
    }
    
    // Update hero stats (first stat box)
    const heroStatNumber = document.querySelector('.hero-stats .stat-box:first-child .stat-number');
    if (heroStatNumber) {
        heroStatNumber.textContent = experienceText;
    }
    
    // Update hero description
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) {
        heroDescription.textContent = `Passionate Salesforce developer with over ${experienceText} years of industry experience at MV Clouds, building scalable CRM solutions and innovative applications on the Salesforce platform. Specialized in Apex, Lightning Web Components, and seamless third-party integrations.`;
    }
    
    // Update About section first paragraph
    const aboutFirstParagraph = document.querySelector('.about-text p:first-child');
    if (aboutFirstParagraph) {
        aboutFirstParagraph.textContent = `I'm a dedicated Salesforce developer with over ${experienceText} years of professional experience, specializing in building robust and scalable CRM solutions. My journey began with a comprehensive 6-month training program, followed by ${Math.floor(years * 12 + months - 6)}+ months of hands-on development work delivering enterprise-grade Salesforce solutions.`;
    }
    
    // Update footer about text
    const footerAboutText = document.querySelector('.footer-about p');
    if (footerAboutText) {
        footerAboutText.textContent = `A passionate Salesforce developer with over ${experienceText} years of experience in building scalable CRM solutions and custom applications on the Salesforce platform.`;
    }
    
    // Update footer stats
    const footerStatNumber = document.querySelector('.footer-stats .stat-item:first-child .stat-number');
    if (footerStatNumber) {
        footerStatNumber.textContent = experienceText;
    }
}

// Calculate experience on page load
window.addEventListener('load', () => {
    calculateExperience();
    setTimeout(typeRole, 1000);
});

// ===== CONSOLE MESSAGE =====
console.log('%c👋 Hello there!', 'color: #5390d9; font-size: 20px; font-weight: bold;');
console.log('%cInterested in the code? Check it out on GitHub!', 'color: #64dfdf; font-size: 14px;');
console.log('%cBuilt with ❤️ and lots of coffee ☕', 'color: #80ffdb; font-size: 12px;');