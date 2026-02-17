// ===== CONFIGURATION =====
const CONFIG = {
    salesforce: {
        apiEndpoint: 'https://mvclouds-2e-dev-ed.develop.my.site.com/CustomerDemo/services/apexrest/customlead',
        apiKey: 'RachitShah@999'
    },
    resume: {
        url: 'https://drive.google.com/file/d/1-BitCGFkBERP1yqQ60lHVmX3doI4uPVE/view?usp=drive_link',
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
// ===== 10. PARTICLE BACKGROUND EFFECT =====
(function() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    // Add to body, but ensure it stays behind content via CSS
    document.body.prepend(canvas);
    
    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Particles config
    const particles = [];
    const particleCount = 60; // Adjust density
    const colors = ['#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981']; // Blue, Purple, Red, Orange, Green
    
    // Mouse interaction
    let mouse = {
        x: null,
        y: null,
        radius: 150
    }

    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Antigravity: Always moving up (negative y velocity)
            this.vx = (Math.random() - 0.5) * 0.2; // Slight horizontal drift
            this.vy = -(Math.random() * 0.5 + 0.2); // Upward movement
            this.size = Math.random() * 2 + 1; 
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.5 + 0.1;
            
            // Store original speed to return to it
            this.baseVx = this.vx;
            this.baseVy = this.vy;
        }
        
        update() {
            // Mouse interaction (Repel)
            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    
                    // Push away
                    const directionX = forceDirectionX * force * 0.5;
                    const directionY = forceDirectionY * force * 0.5;

                    this.vx -= directionX;
                    this.vy -= directionY;
                }
            }

            this.x += this.vx;
            this.y += this.vy;

            // Return to natural antigravity flow
            // Interpolate current velocity towards base velocity
            this.vx = this.vx * 0.98 + this.baseVx * 0.02;
            this.vy = this.vy * 0.98 + this.baseVy * 0.02;

            // Wrap edges
            // If it goes off the top, respawn at bottom
            if (this.y < -10) {
                this.y = height + 10;
                this.x = Math.random() * width;
            }
            // If extended interaction pushes it down off bottom
            if (this.y > height + 10) {
                this.y = -10;
            }
            // Horizontal wrapping
            if (this.x < -10) this.x = width + 10;
            if (this.x > width + 10) this.x = -10;
        }
        
        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function init() {
        resize();
        window.addEventListener('resize', resize);
        // Clear old particles if refetched
        particles.length = 0;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        animate();
    }
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    
    // Initialize when DOM is ready (script is defer/bottom usually, but safe to call)
    init();
})();


