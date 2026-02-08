// ===== CONFIGURATION =====
const CONFIG = {
    salesforce: {
        apiEndpoint: 'https://mvclouds-2e-dev-ed.develop.my.site.com/CustomerDemo/services/apexrest/customlead',
        apiKey: 'RachitShah@999'
    },
    resume: {
        url: 'https://drive.google.com/file/d/1EyQWNiVD--Bs84ZAQb7ozd9BI6o9vJg6/view?usp=sharing',
        filename: 'RachitShah_Resume.pdf'
    }
};

// ===== MOBILE MENU =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// ===== ACTIVE LINK HIGHLIGHTING =====
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-link').forEach(link => {
    if (link.href.includes(currentPath) && currentPath !== '/') {
        link.classList.add('active');
    } else if (currentPath === '/' || currentPath.endsWith('index.html')) {
        if (link.getAttribute('href') === 'index.html') {
            link.classList.add('active');
        }
    }
});

// ===== CONTACT FORM HANDLING =====
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Update footer about text
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-block';
        formMessage.style.display = 'none';
        
        // Get values
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;
        
        // Split name
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Not Specified';
        
        const requestBody = {
            apiKey: CONFIG.salesforce.apiKey,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            company: 'Website Inquiry',
            leadSource: 'Portfolio Website',
            description: message
        };

        try {
            const response = await fetch(CONFIG.salesforce.apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (response.ok || response.status === 201) {
                formMessage.textContent = 'Message sent successfully! I will get back to you soon.';
                formMessage.style.color = '#10b981'; // Green
                formMessage.style.display = 'block';
                contactForm.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            formMessage.textContent = 'Something went wrong. Please try again or email me directly.';
            formMessage.style.color = '#ef4444'; // Red
            formMessage.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoading.style.display = 'none';
        }
    });
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .hero-content, .section-title').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// ===== 7. PROJECT FILTERING =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-category');
            
            projectCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                let match = false;

                if (category === 'all') {
                    match = true;
                } else if (category === 'lwc') {
                    // Match LWC or Apex
                    if (text.includes('lwc') || text.includes('apex')) match = true;
                } else if (category === 'flows') {
                    if (text.includes('flow')) match = true;
                } else if (category === 'integration') {
                    if (text.includes('api') || text.includes('integration')) match = true;
                }

                if (match) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    });
}

// ===== 8. DYNAMIC YEAR CALCULATION =====
function calculateExperience() {
    const startDate = new Date('2023-08-01'); // Started as Trainee in Aug 2023
    const today = new Date();
    
    let years = today.getFullYear() - startDate.getFullYear();
    let months = today.getMonth() - startDate.getMonth();
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // Format: "1.5+" (approx)
    // Logic: If months > 6, round up to next half year or year
    let experienceText = (years + (months/12)).toFixed(1) + '+';

    const expYearsElement = document.getElementById('expYears');
    if (expYearsElement) {
        expYearsElement.textContent = experienceText;
    }
    
    // Resume link for download button
    const resumeBtn = document.getElementById('downloadResumeBtn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
             window.open(CONFIG.resume.url, '_blank');
        });
    }
}

// window.addEventListener('load', calculateExperience);
window.addEventListener('load', () => {
    calculateExperience();
});