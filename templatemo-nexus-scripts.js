/*
TemplateMo 594 nexus flow
https://templatemo.com/tm-594-nexus-flow
*/
// =========================================================
// 1. FUNKCE INICIALIZACE MOBILNÍHO MENU
// =========================================================
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-nav a');
    const mobileMenuCta = document.querySelector('.mobile-menu-cta');
    const mobileMenuCtaButton = document.querySelector('.mobile-menu-cta a');
    const mobileMenuLogo = document.querySelector('.mobile-menu-logo');
    const dropdownToggles = document.querySelectorAll('.mobile-menu-nav .dropdown-toggle');

    // Kontrola, zda existují klíčové prvky (nyní by měly existovat)
    if (!mobileMenuBtn || !mobileMenu || !mobileMenuOverlay || !mobileMenuClose) {
        // Pokud se to spustí, ale prvky nejsou, znamená to chybu v načítání HTML.
        console.warn("Chybí klíčové prvky pro inicializaci mobilního menu. Zkontrolujte header.html.");
        return;
    }

    function openMobileMenu() {
        mobileMenuBtn.classList.add('active');
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset a spuštění animace pro odkazy (zde je kód animace, neupravuji ho)
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
        
        // Animace CTA tlačítka
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
    }

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close mobile menu
    mobileMenuClose.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMobileMenu();
    });
    
    mobileMenuOverlay.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMobileMenu();
    });

    // Dropdown toggle behavior (prevent closing the whole menu)
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const parent = toggle.closest('.dropdown');
            const menu = parent.querySelector('.dropdown-menu');

            // Zavřít ostatní dropdowny
            document.querySelectorAll('.mobile-menu-nav .dropdown.open').forEach(openDropdown => {
                if (openDropdown !== parent) {
                    openDropdown.classList.remove('open');
                     // Zavřít i animaci výšky
                    const openMenu = openDropdown.querySelector('.dropdown-menu');
                    if(openMenu) openMenu.style.maxHeight = "0";
                }
            });

            // Přepnout aktuální dropdown
            parent.classList.toggle('open');
            
            // Přidat jednoduchou animaci výšky
            if (menu) {
                if (parent.classList.contains('open')) {
                    menu.style.maxHeight = menu.scrollHeight + "px";
                } else {
                    menu.style.maxHeight = "0";
                }
            }
        });
    });

    // Close menu when clicking on navigation links (but not dropdown toggles)
    mobileMenuLinks.forEach(link => {
        if (link && !link.classList.contains('dropdown-toggle')) {
            link.addEventListener('click', () => {
                // Přidáno zpoždění, aby se kliknutí stihlo dokončit, než se menu zavře
                setTimeout(closeMobileMenu, 100); 
            });
        }
    });

    // Close menu when clicking on CTA button
    if (mobileMenuCtaButton) {
        mobileMenuCtaButton.addEventListener('click', (e) => {
            if (mobileMenuCtaButton.getAttribute('href') === '#') {
                e.preventDefault();
            }
            closeMobileMenu();
        });
    }

    // Close menu when clicking on logo
    if (mobileMenuLogo) {
        mobileMenuLogo.addEventListener('click', () => {
            closeMobileMenu();
        });
    }

    // Close mobile menu on escape key
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
}

// =========================================================
// 2. FUNKCE PRO POZADÍ EFEKTY
// =========================================================
// ... (Zde následují funkce generateMatrixRain, generateParticles, generateDataStreams, které se nemění) ...

// Generate Matrix Rain Effect
function generateMatrixRain() {
    const matrixRain = document.getElementById('matrixRain');
    if (!matrixRain) {
        return; 
    }
    
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const columns = Math.floor(window.innerWidth / 20);
    
    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.left = `${i * 20}px`;
        column.style.animationDuration = `${Math.random() * 5 + 10}s`;
        column.style.animationDelay = `${Math.random() * 5}s`;
        
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
    if (!particlesContainer) {
        return; 
    }
    
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
    if (!dataStreams) {
        return; 
    }
    
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

// Nová funkce pro spuštění všech efektů
function initializeBackgroundEffects() {
    generateMatrixRain();
    generateParticles();
    generateDataStreams();
}


// =========================================================
// 3. CENTRÁLNÍ INICIALIZACE A SPÁROVÁNÍ S DOMContentLoaded
// =========================================================

/**
 * Inicializuje vkládání obsahu a spouští inicializaci menu
 * po úspěšném vložení headeru.
 */
function initializePageContent() {
    // Použijeme Promise.all pro zajištění, že se menu inicializuje AŽ po načtení headeru
    
    const headerPromise = new Promise(resolve => {
        // Vkládáme header a v resolve spustíme callback
        includeHTML('header.html', 'header-placeholder', resolve);
    });
    
    const footerPromise = new Promise(resolve => {
        // Vkládáme footer, nepotřebujeme callback
        includeHTML('footer.html', 'footer-placeholder', resolve);
    });

    // Jakmile se header VLOŽÍ, můžeme inicializovat mobilní menu
    headerPromise.then(() => {
        initializeMobileMenu();
    });

    // Spustíme i efekty na pozadí
    initializeBackgroundEffects();
}

// Inicializace po načtení DOM (nahrazuje původní blok)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePageContent);
} else {
    initializePageContent();
}

// Regenerate matrix rain on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const matrixRain = document.getElementById('matrixRain');
        if (matrixRain) {
             matrixRain.innerHTML = '';
        }
        generateMatrixRain();
    }, 250);
});

// =========================================================
// 4. OSTATNÍ SKRIPTY (INTERAKCE, SCROLL, ANIMACE)
// ... (Tato sekce zůstává nezměněna) ...
// =========================================================

let mouseTimer;
document.addEventListener('mousemove', (e) => {
    if (!mouseTimer) {
        mouseTimer = setTimeout(() => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            const orbs = document.querySelectorAll('.orb');
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.02;
                const x = (mouseX - window.innerWidth / 2) * speed;
                const y = (mouseY - window.innerHeight / 2) * speed;
                orb.style.transform = `translate(${x}px, ${y}px)`;
            });
            
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

if (window.innerWidth > 768) {
    const cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
        position: fixed;
        width: 200px;
        height: 200px;
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

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
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

window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) {
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(15, 15, 35, 0.95)';
            nav.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.2)';
        } else {
            nav.style.background = 'rgba(15, 15, 35, 0.9)';
            nav.style.boxShadow = 'none';
        }
    }
});

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

document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.6)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
});

const animateStats = () => {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
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
            const suffix = initialText.replace(/[\d\s,.]/g, ''); 
            stat.textContent = Math.floor(count).toLocaleString('cs-CZ') + suffix;
        }, 20);
    });
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const statsSection = document.querySelector('.stats');
        if (entry.isIntersecting && entry.target === statsSection) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.animation = 'glitch1 0.3s ease-in-out';
        setTimeout(() => {
            this.style.animation = '';
        }, 300);
    });
});

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
        if (document.body.contains(tempElement)) {
            document.body.removeChild(tempElement);
        }
    }, 3000);
}, 5000);

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 0.7; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-50px); }
    }
`;
document.head.appendChild(style);

// =========================================================
// FUNKCE PRO DYNAMICKÉ NAČÍTÁNÍ DISCORD AVATARŮ S HASHEM
// =========================================================
function loadDiscordAvatars() {
    const cards = document.querySelectorAll('.contributor-card');

    cards.forEach(card => {
        const discordId = card.getAttribute('data-discord-id');
        const avatarHash = card.getAttribute('data-avatar-hash'); 
        const avatarImg = card.querySelector('.avatar-img');

        if (discordId && avatarImg) {
            let avatarUrl;

            if (avatarHash) {
                avatarUrl = `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.png?size=128`;
            } else {
                const defaultIndex = discordId % 6;
                avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
            }
            
            avatarImg.src = avatarUrl;
            
            avatarImg.onerror = function() {
                const defaultIndex = discordId % 6;
                this.src = `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
            };
        }
    });
}

// Spuštění po načtení stránky, aby se načetly avatary
window.addEventListener('load', loadDiscordAvatars);

// =========================================================
// FUNKCE PRO VKLÁDÁNÍ EXTERNÍHO HTML OBSAHU
// =========================================================
function includeHTML(url, targetElementId, callback) {
    const element = document.getElementById(targetElementId);
    if (!element) return; 

    fetch(url)
        .then(response => {
            if (!response.ok) {
                console.error(`Chyba při načítání ${url}: ${response.statusText}`);
                element.innerHTML = `<p style="color:red;">Chyba: Nelze načíst ${url}</p>`;
                return ''; 
            }
            return response.text();
        })
        .then(data => {
            if (data) {
                element.innerHTML = data;
                
                // Speciální manipulace s HTML po vložení (např. aktivní třída menu)
                if (targetElementId === 'header-placeholder') {
                    
                    const currentPath = window.location.pathname.split("/").pop();
                    const links = element.querySelectorAll('a');
                    links.forEach(link => {
                        const linkPath = link.href.split("/").pop();
                        if (linkPath === currentPath) {
                            link.classList.add('active');
                            
                            let parentLi = link.closest('li.dropdown');
                            while(parentLi) {
                                parentLi.classList.add('active-parent');
                                parentLi = parentLi.parentElement.closest('li.dropdown');
                            }
                        }
                    });
                }
            }
            // Zde je KLÍČOVÝ KROK: Spustíme callback po úspěšném vložení
            if (callback) {
                callback();
            }
        })
        .catch(error => {
            console.error('Chyba Fetch API:', error);
            // Spustíme callback i při chybě, aby se zkusilo menu inicializovat
            if (callback) {
                callback();
            }
        });
}

// Původní spouštěcí bloky, které rušíme, jsou zakomentovány nebo nahrazeny.
// window.addEventListener('load', function() {
//     includeHTML('header.html', 'header-placeholder'); 
//     includeHTML('footer.html', 'footer-placeholder'); 
// });
