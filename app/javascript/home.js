// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {


    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100); // Stagger animation
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .result-card, .process-step, .testimonial-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Counter Animation for Results
    const counters = document.querySelectorAll('.result-number');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    function animateCounter(element) {
        const text = element.textContent;
        const isPercentage = text.includes('%');
        const isNegative = text.includes('-');
        const hasPlus = text.includes('+');
        const isMillion = text.includes('M');
        
        let targetNumber;
        if (isMillion) {
            targetNumber = parseInt(text.replace(/[^\d]/g, ''));
        } else {
            targetNumber = parseInt(text.replace(/[^\d]/g, ''));
        }
        
        let currentNumber = 0;
        const increment = targetNumber / 50;
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= targetNumber) {
                currentNumber = targetNumber;
                clearInterval(timer);
            }
            
            let displayNumber = Math.floor(currentNumber);
            let displayText = '';
            
            if (hasPlus) displayText += '+';
            if (isNegative) displayText += '-';
            
            if (isMillion) {
                displayText += displayNumber + 'M+';
            } else {
                displayText += displayNumber;
                if (isPercentage) displayText += '%';
            }
            
            element.textContent = displayText;
        }, 30);
    }

    // Button Click Effects
    const buttons = document.querySelectorAll('.btn-primary, .btn-accent');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // Add floating action button for scroll to top
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<lord-icon src="https://cdn.lordicon.com/ilgqmqtz.json" trigger="hover" stroke="light" style="width:30px;height:30px"></lord-icon>'; // Updated: Lordicon arrow up
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 30px;
        height: 30px;
        background: transparent;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    // Responsive adjustments for scroll button
    function adjustScrollButton() {
        if (window.innerWidth <= 480) {
            scrollTopBtn.style.bottom = '20px';
            scrollTopBtn.style.right = '20px';
            scrollTopBtn.style.width = '25px';
            scrollTopBtn.style.height = '25px';
        } else {
            scrollTopBtn.style.bottom = '30px';
            scrollTopBtn.style.right = '30px';
            scrollTopBtn.style.width = '30px';
            scrollTopBtn.style.height = '30px';
        }
    }
    
    // Initial adjustment
    adjustScrollButton();
    
    // Adjust on resize
    window.addEventListener('resize', adjustScrollButton);
    document.body.appendChild(scrollTopBtn);

    // Initialize Lordicon after adding to DOM
    setTimeout(() => {
        if (window.lordicon) {
            window.lordicon.createElements();
        }
    }, 100);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    });

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});

// CSS for ripple effect and animations
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn-primary, .btn-accent {
        position: relative;
        overflow: hidden;
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .header.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        padding: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
    }
`;
document.head.appendChild(style);
