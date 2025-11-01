/*

TemplateMo 594 nexus flow

https://templatemo.com/tm-594-nexus-flow

*/

// JavaScript Document

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-nav ul:not(.mobile-submenu-content) > li > a'); // Cílí na hlavní odkazy, ale ne ty uvnitř podmenu
    const mobileMenuCta = document.querySelector('.mobile-menu-cta');
    const mobileMenuCtaButton = document.querySelector('.mobile-menu-cta a');
    const mobileMenuLogo = document.querySelector('.mobile-menu-logo');
    
    // --- KLÍČOVÉ PRVKY PRO SUBMENU ---
    const mobileSubmenuHeaders = document.querySelectorAll('.mobile-submenu-header');
    const mobileSubmenuLinks = document.querySelectorAll('.mobile-submenu-content a'); // Odkazy uvnitř dropdownu
    // -----------------------------------
    
    // Check if essential elements exist
    if (!mobileMenuBtn || !mobileMenu || !mobileMenuOverlay || !mobileMenuClose) {
        return;
    }

    function openMobileMenu() {
        mobileMenuBtn.classList.add('active');
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset a spuštění animací (zůstává z tvého kódu)
        mobileMenuLinks.forEach((link, index) => {
            if (link) {
                link.style.animation = 'none';
                link.style.opacity = '0';
                link.style.transform = 'translateX(20px)';
                
                setTimeout(() => {
                    if (link) {
                        link.style.animation = `slideInLeft 0.4s ease forwards`;
                    }
                }, 250 + (index * 100));
            }
        });
        
        if (mobileMenuCta) {
            mobileMenuCta.style.animation = 'none';
            mobileMenuCta.style.opacity = '0';
            mobileMenuCta.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                if (mobileMenuCta) {
                    mobileMenuCta.style.animation = 'slideInUp 0.4s ease forwards';
                }
            }, 100);
        }
    }

    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Zavřít všechna rozbalená podmenu při zavření hlavního menu
        mobileSubmenuHeaders.forEach(header => {
            header.classList.remove('active');
        });
    }

    // --- HLAVNÍ TOGGLE MENU ---
    mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // --- ZAVÍRÁNÍ MENU ---
    mobileMenuClose.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMobileMenu();
    });
    
    mobileMenuOverlay.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMobileMenu();
    });

    // Zavřít menu po kliknutí na hlavní navigační odkazy (mimo dropdown)
    mobileMenuLinks.forEach(link => {
        if (link) {
            link.addEventListener('click', () => {
                // Přidáno: Zabraňuje zavření, pokud se jedná o položku dropdownu
                // (Tuto kontrolu zajišťuje i selektor, ale pro jistotu)
                if (!link.classList.contains('mobile-dropbtn')) {
                    closeMobileMenu();
                }
            });
        }
    });
    
    // Zavřít menu po kliknutí na odkazy UVNITŘ PODMENU
    mobileSubmenuLinks.forEach(link => {
        if (link) {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        }
    });
    
    // Zavřít menu po kliknutí na CTA/logo/Escape (zůstává z tvého kódu)
    if (mobileMenuCtaButton) {
        mobileMenuCtaButton.addEventListener('click', (e) => {
            if (mobileMenuCtaButton.getAttribute('href') === '#') {
                e.preventDefault();
            }
            closeMobileMenu();
        });
    }

    if (mobileMenuLogo) {
        mobileMenuLogo.addEventListener('click', () => {
            closeMobileMenu();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Prevent body scroll when menu is open
    if (mobileMenu) {
        mobileMenu.addEventListener('touchmove', (e) => {
            e.stopPropagation();
        });
    }

    // --- LOGIKA PRO MOBILNÍ SUBMENU (DROPDOWN) - UPRAVENO ---
    mobileSubmenuHeaders.forEach(header => {
        // Cílíme na hlavní odkaz v rámci položky submenu, který má CSS třídu 'mobile-dropbtn'
        const link = header.querySelector('.mobile-dropbtn'); 

        // Zabraňuje navigaci, když je kliknuto na dropdown, a místo toho ho otevře
        if (link) {
            link.addEventListener('click', (e) => {
                // Toto zastaví navigaci (pokud href="#" nebo podobné)
                e.preventDefault();
                e.stopPropagation(); 

                // Rozbal/zabal podmenu přidáním/odebráním třídy 'active'
                header.classList.toggle('active');

                // Volitelné: zavři ostatní rozbalená podmenu (pro čistší UI)
                mobileSubmenuHeaders.forEach(otherHeader => {
                    if (otherHeader !== header && otherHeader.classList.contains('active')) {
                        otherHeader.classList.remove('active');
                    }
                });
            });
        }
    });
}

// Initialize mobile menu when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMobileMenu);
} else {
    initializeMobileMenu();
}

// Generate Matrix Rain Effect
function generateMatrixRain() {
    const matrixRain = document.getElementById('matrixRain');
    if (!matrixRain) return;
    
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const columns = Math.floor(window.innerWidth / 20);
    
    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.left = `${i * 20}px`;
        column.style.animationDuration = `${Math.random() * 5 + 10}s`;
        column.style.animationDelay = `${Math.random() * 5}s`;
        
        // Generate random characters for the column
        let text = '';
        const charCount = Math.floor(Math.random() * 20 + 10);
        for (let j = 0; j < charCount; j++) {
            text += characters[Math.floor(Math.random() * characters.length)] + ' ';
        }
        column.textContent = text;
        
        matrixRain.appendChild(column);
    }
}

// Generate Floating Particles
function generateParticles() {
    const particlesContainer = document.getElementById('particlesContainer');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.animationDuration = `${Math.random() * 10 + 20}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Generate Data Streams
function generateDataStreams() {
    const dataStreams = document.getElementById('dataStreams');
    if (!dataStreams) return;
    
    const streamCount = 10;
    
    for (let i = 0; i < streamCount; i++) {
        const stream = document.createElement('div');
        stream.className = 'data-stream';
        stream.style.top = `${Math.random() * 100}%`;
        stream.style.left = `-300px`;
        stream.style.animationDelay = `${Math.random() * 5}s`;
        stream.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
        
        dataStreams.appendChild(stream);
    }
}

// Initialize background effects
generateMatrixRain();
generateParticles();
generateDataStreams();

// Regenerate matrix rain on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const matrixRain = document.getElementById('matrixRain');
        if (matrixRain) {
            matrixRain.innerHTML = '';
            generateMatrixRain();
        }
    }, 250);
});

// Interactive mouse glow effect (throttled for performance)
let mouseTimer;
document.addEventListener('mousemove', (e) => {
    if (!mouseTimer) {
        mouseTimer = setTimeout(() => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // Move orbs slightly based on mouse position
            const orbs = document.querySelectorAll('.orb');
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.02;
                const x = (mouseX - window.innerWidth / 2) * speed;
                const y = (mouseY - window.innerHeight / 2) * speed;
                orb.style.transform = `translate(${x}px, ${y}px)`;
            });
            
            // Make nearby particles glow brighter (desktop only)
            if (window.innerWidth > 768) {
                const particles = document.querySelectorAll('.particle');
                particles.forEach(particle => {
                    const rect = particle.getBoundingClientRect();
                    const particleX = rect.left + rect.width / 2;
                    const particleY = rect.top + rect.height / 2;
                    const distance = Math.sqrt(Math.pow(mouseX - particleX, 2) + Math.pow(mouseY - particleY, 2));
                    
                    if (distance < 150) {
                        const brightness = 1 - (distance / 150);
                        particle.style.boxShadow = `0 0 ${20 + brightness * 30}px rgba(0, 255, 255, ${0.5 + brightness * 0.5})`;
                        particle.style.transform = `scale(${1 + brightness * 0.5})`;
                    } else {
                        particle.style.boxShadow = '';
                        particle.style.transform = '';
                    }
                });
            }
            
            mouseTimer = null;
        }, 16); // ~60fps
    }
});

// Add a glow that follows the cursor (desktop only)
if (window.innerWidth > 768) {
    const cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
        position: fixed;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
        opacity: 0;
    `;
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
        cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only prevent default and scroll if href is more than just '#'
        if (href && href.length > 1) {
            e.preventDefault();
            if (href === '#top') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(15, 15, 35, 0.95)';
        nav.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.2)';
    } else {
        nav.style.background = 'rgba(15, 15, 35, 0.9)';
        nav.style.boxShadow = 'none';
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
});

// Button effects
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.6)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
});

// Stats counter animation
const animateStats = () => {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        // Preskoci botStatus
        if (stat.id === 'botStatus') return;

        const initialText = stat.textContent;
        const target = parseInt(initialText.replace(/[^\d]/g, ''));
        if (isNaN(target)) return;

        let count = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                clearInterval(timer);
                count = target;
            }
            const suffix = initialText.replace(/[\d\s,.]/g, ''); // Uchova jen necisla
            stat.textContent = Math.floor(count).toLocaleString('cs-CZ') + suffix;
        }, 20);
    });
};

// Trigger stats animation when section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Glitch effect on hover for feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.animation = 'glitch1 0.3s ease-in-out';
        setTimeout(() => {
            this.style.animation = '';
        }, 300);
    });
});

// Random cyber text effects
const cyberTexts = ['CONNECTING...', 'NEURAL LINK ESTABLISHED', 'QUANTUM SYNC ACTIVE', 'REALITY MATRIX LOADED'];

setInterval(() => {
    const randomText = cyberTexts[Math.floor(Math.random() * cyberTexts.length)];
    const tempElement = document.createElement('div');
    tempElement.textContent = randomText;
    tempElement.style.cssText = `
        position: fixed;
        top: ${Math.random() * 100}vh;
        left: ${Math.random() * 100}vw;
        color: var(--primary-cyan);
        font-size: 0.8rem;
        font-weight: 700;
        z-index: 1000;
        opacity: 0.7;
        pointer-events: none;
        animation: fadeOut 3s ease-out forwards;
        text-shadow: 0 0 10px var(--primary-cyan);
    `;
    document.body.appendChild(tempElement);
    
    setTimeout(() => {
        document.body.removeChild(tempElement);
    }, 3000);
}, 5000);

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 0.7; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-50px); }
    }
`;
document.head.appendChild(style);





// novinky
/* --- COMMAND VIEWER LOGIKA --- */

function toggleCommand(element) {
    const item = element.closest('.command-item');
    // Zavře všechny ostatní otevřené příkazy
    document.querySelectorAll('.command-item.open').forEach(openItem => {
        if (openItem !== item) {
            openItem.classList.remove('open');
        }
    });
    // Přepne aktuální příkaz
    item.classList.toggle('open');
}

// Funkce filtruje podle plného textu kategorie
function filterCommands(category) {
    const items = document.querySelectorAll('.command-item');
    
    items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        // Zobrazení/skrytí položky na základě shody s kategorií
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'flex'; // Používáme flex, aby se správně zobrazil .command-item
        } else {
            item.style.display = 'none';
        }
        // Při filtrování zavřeme všechny akordeony
        item.classList.remove('open'); 
    });
}

function searchCommands(query) {
    const items = document.querySelectorAll('.command-item');
    const lowerCaseQuery = query.toLowerCase();

    items.forEach(item => {
        const commandName = item.getAttribute('data-command').toLowerCase();
        const commandModule = item.getAttribute('data-category').toLowerCase(); 
        const commandText = item.textContent.toLowerCase(); // Hledá i v popisech

        // Zobrazení, pokud se dotaz shoduje s příkazem, modulem nebo textem
        if (commandName.includes(lowerCaseQuery) || commandModule.includes(lowerCaseQuery) || commandText.includes(lowerCaseQuery)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
        // Při vyhledávání zavřeme všechny akordeony
        item.classList.remove('open'); 
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // 1. Logika filtrování (kliknutí na tlačítka)
    const filters = document.getElementById('categoryFilters');
    if (filters) {
        filters.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                // Odstranění active třídy ze všech tlačítek a přidání na kliknuté
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                // Spuštění filtrování
                filterCommands(e.target.getAttribute('data-category'));
            }
        });
    }

    // 2. Logika vyhledávání (psaní do pole)
    const searchInput = document.getElementById('commandSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            // Při psaní do vyhledávání aktivujeme tlačítko "VŠECHNY MODULY"
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            const allButton = document.querySelector('.filter-btn[data-category="all"]');
            if(allButton) {
                allButton.classList.add('active');
            }
            
            searchCommands(e.target.value);
        });
    }
});
