/*

TemplateMo 594 nexus flow

https://templatemo.com/tm-594-nexus-flow

*/

// JavaScript Document

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

    // Check if essential elements exist
    if (!mobileMenuBtn || !mobileMenu || !mobileMenuOverlay || !mobileMenuClose) {
        return;
    }

    function openMobileMenu() {
        mobileMenuBtn.classList.add('active');
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset and trigger animations for links
        mobileMenuLinks.forEach((link, index) => {
            if (link) {
                link.style.animation = 'none';
                link.style.opacity = '0';
                link.style.transform = 'translateX(20px)';
                
                // Apply animation with delay
                setTimeout(() => {
                    if (link) {
                        link.style.animation = `slideInLeft 0.4s ease forwards`;
                    }
                }, 250 + (index * 100));
            }
        });
        
        // Animate CTA button
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

            // Zavřít ostatní dropdowny (volitelné)
            document.querySelectorAll('.mobile-menu-nav .dropdown.open').forEach(openDropdown => {
                if (openDropdown !== parent) {
                    openDropdown.classList.remove('open');
                }
            });

            // Přepnout aktuální dropdown
            parent.classList.toggle('open');
            
            // Přidat jednoduchou animaci
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
                closeMobileMenu();
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
// 2. FUNKCE PRO POZADÍ EFEKTY (OPRAVENO: Kontrola existence elementu)
// =========================================================

// Generate Matrix Rain Effect
function generateMatrixRain() {
    const matrixRain = document.getElementById('matrixRain');
    // **OPRAVA**: Zabraňuje chybě, pokud element neexistuje
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
    // **OPRAVA**: Zabraňuje chybě, pokud element neexistuje (Zde byla původní chyba)
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
    // **OPRAVA**: Zabraňuje chybě, pokud element neexistuje
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

// =========================================================
// 3. CENTRÁLNÍ INICIALIZACE A SPÁROVÁNÍ S DOMContentLoaded
// =========================================================

// Nová funkce pro spuštění všech efektů
function initializeBackgroundEffects() {
    generateMatrixRain();
    generateParticles();
    generateDataStreams();
}

// Inicializovat menu a efekty, jakmile je DOM připraven (tím se vyhneme chybě)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMobileMenu);
    document.addEventListener('DOMContentLoaded', initializeBackgroundEffects); // Přidáno spuštění efektů
} else {
    initializeMobileMenu();
    initializeBackgroundEffects(); // Přidáno spuštění efektů
}

// Regenerate matrix rain on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const matrixRain = document.getElementById('matrixRain');
        // Kontrola před manipulací s innerHTML
        if (matrixRain) {
             matrixRain.innerHTML = '';
        }
        generateMatrixRain();
    }, 250);
});

// =========================================================
// 4. OSTATNÍ SKRIPTY (INTERAKCE, SCROLL, ANIMACE)
// =========================================================

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
    // **OPRAVA**: Zde je volána metoda appendChild, ale je to na document.body, což je v pořádku.
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
        const statsSection = document.querySelector('.stats'); // Kontrola, zda sekce existuje
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
        // Kontrola před odstraněním
        if (document.body.contains(tempElement)) {
            document.body.removeChild(tempElement);
        }
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

// --- KONSTANTY PRO API A STRÁNKOVÁNÍ ---
// !!! TOTO JE VAŠE API URL !!!
const API_URL = 'https://rs422cznas.myds.me:5038/logs'; 
const RECORDS_PER_PAGE = 20; // Kolik záznamů zobrazit na jedné stránce

// DOM Elementy
const warnsTableBody = document.querySelector('#warnsTable tbody');
const pageStatusSpan = document.getElementById('pageStatus');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const searchInput = document.getElementById('searchInput');
const searchCountInfo = document.getElementById('searchCount');

// Stav aplikace
let allRecords = []; // Uloží všechna načtená data
let filteredRecords = []; // Uloží záznamy po vyhledávání
let currentPage = 1;

/**
 * 🛠️ Pomocná funkce pro formátování data
 * @param {string} timestamp - Timestamp z API (ISO formát).
 * @returns {string} Čitelné datum a čas.
 */
function formatDate(timestamp) {
    const date = new Date(timestamp);
    // Přidáno "|| 'Neznámé datum'" pro případ chyby
    return date.toLocaleString('cs-CZ', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
    }) || 'Neznámé datum';
}

/**
 * 🛠️ Pomocná funkce pro získání CSS třídy pro odznak akce.
 * @param {string} action - Typ akce (ban, warn, kick, mute, unban, atd.).
 * @returns {string} CSS třída.
 */
function getActionClass(action) {
    switch (action ? action.toLowerCase() : 'default') {
        case 'ban':
        case 'tempban':
            return 'action-ban';
        case 'warn':
            return 'action-warn';
        case 'kick':
            return 'action-kick';
        case 'mute':
        case 'tempmute':
            return 'action-mute';
        default:
            return 'action-default';
    }
}

/**
 * 1. Generuje HTML řádek pro jeden záznam.
 */
function createTableRow(record) {
    const actionClass = getActionClass(record.action);
    const actionDisplay = (record.action || 'Default').toUpperCase();

    // Sestavení sloupce Důvod (přidání duration, pokud existuje)
    let reasonText = record.reason || 'Důvod nezadán';
    if (record.duration) {
        reasonText += ` (Trvání: ${record.duration})`;
    }
    
    // Zajištění, že všechny hodnoty jsou stringy, pokud by byly null
    const userName = record.user_name || 'Neznámý uživatel';
    const moderatorName = record.moderator_name || 'Systém';
    const guildName = record.guild_name || 'Neznámý server';

    return `
        <tr>
            <td data-label="Datum">${formatDate(record.timestamp)}</td>
            <td data-label="Uživatel">${userName} (ID: ${record.user_id || 'N/A'})</td>
            <td data-label="Akce"><span class="action-badge ${actionClass}">${actionDisplay}</span></td>
            <td data-label="Důvod">${reasonText}</td>
            <td data-label="Moderátor">${moderatorName}</td>
            <td data-label="Server">${guildName}</td>
        </tr>
    `;
}

/**
 * 2. Vykreslí aktuální stránku tabulky.
 */
function renderTable(records, page) {
    warnsTableBody.innerHTML = ''; 
    
    if (records.length === 0) {
        warnsTableBody.innerHTML = `<tr><td colspan="6" class="loading-row">Nebyly nalezeny žádné záznamy.</td></tr>`;
        updatePaginationControls(0, page);
        return;
    }

    const start = (page - 1) * RECORDS_PER_PAGE;
    const end = start + RECORDS_PER_PAGE;
    const recordsOnPage = records.slice(start, end);

    let html = '';
    recordsOnPage.forEach(record => {
        html += createTableRow(record);
    });
    
    warnsTableBody.innerHTML = html;
    updatePaginationControls(records.length, page);
}

/**
 * 3. Aktualizuje stav ovládacích prvků stránkování.
 */
function updatePaginationControls(totalRecords, page) {
    const totalPages = Math.ceil(totalRecords / RECORDS_PER_PAGE);
    
    pageStatusSpan.textContent = `Strana ${totalRecords > 0 ? page : 0} z ${totalPages}`;
    searchCountInfo.textContent = `Celkem nalezeno ${totalRecords} záznamů.`;
    
    prevPageBtn.classList.toggle('disabled-btn', page <= 1);
    prevPageBtn.disabled = page <= 1;

    nextPageBtn.classList.toggle('disabled-btn', page >= totalPages);
    nextPageBtn.disabled = page >= totalPages;

    if (totalRecords === 0) {
        nextPageBtn.classList.add('disabled-btn');
        prevPageBtn.classList.add('disabled-btn');
    }
}

/**
 * 4. Přejde na určenou stránku a vykreslí tabulku.
 */
function goToPage(newPage) {
    const totalPages = Math.ceil(filteredRecords.length / RECORDS_PER_PAGE);
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderTable(filteredRecords, currentPage);
    } else if (newPage === 1 && totalPages === 0) {
        currentPage = 1;
        renderTable(filteredRecords, currentPage);
    }
}

/**
 * 5. Filtruje záznamy na základě textu v poli pro vyhledávání.
 */
function filterRecords() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (query.length < 2 && allRecords.length > 0) {
        // Při krátkém dotazu, pokud už máme data, zobrazíme vše
        filteredRecords = allRecords;
        searchCountInfo.textContent = `Celkem nalezeno ${allRecords.length} záznamů.`;
    } else if (allRecords.length > 0) {
        filteredRecords = allRecords.filter(record => 
            (record.user_name && record.user_name.toLowerCase().includes(query)) ||
            (record.moderator_name && record.moderator_name.toLowerCase().includes(query)) ||
            (record.user_id && String(record.user_id).includes(query)) ||
            (record.moderator_id && String(record.moderator_id).includes(query)) ||
            (record.reason && record.reason.toLowerCase().includes(query)) ||
            (record.guild_name && record.guild_name.toLowerCase().includes(query))
        );
    } else {
        // Žádná data k filtrování
        filteredRecords = [];
        searchCountInfo.textContent = `Zadejte vyhledávací dotaz pro zobrazení záznamů.`;
    }
    
    // Po filtrování se vždy vrátíme na první stránku
    goToPage(1);
}

/**
 * 6. Načte data z API.
 */
async function loadData() {
    console.log("STARTING API FETCH from:", API_URL); 

    // Reset UI na stav načítání
    warnsTableBody.innerHTML = `<tr><td colspan="6" class="loading-row">Načítání dat... Prosím čekejte.</td></tr>`;
    searchCountInfo.textContent = `Načítání dat...`;
    updatePaginationControls(0, 1);

    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            // Při chybném HTTP kódu (4xx, 5xx) zobrazí chybu
            throw new Error(`Chyba HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
            console.log("Data loaded successfully. Total records:", data.length); 
            // Seřadit data od nejnovějšího po nejstarší (podle timestamp)
            allRecords = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            filteredRecords = allRecords;
            
            // Inicializace zobrazení
            goToPage(1);
        } else {
            throw new Error("API vrátilo neočekávaný formát dat (nebylo pole).");
        }
        
    } catch (error) {
        // Zobrazí chybovou zprávu přímo na stránce
        console.error("Fatal API Fetch Error:", error);
        let errorMsg = error.message;

        // Kontrola, zda se jedná o nejpravděpodobnější chybu CORS/protokol
        if (errorMsg.includes("Failed to fetch") || errorMsg.includes("TypeError: Failed to fetch")) {
             errorMsg = "Nepodařilo se připojit k API. Pravděpodobně jde o chybu CORS nebo HTTPS/HTTP protokolu. Zkontrolujte prosím Konzoli (F12) v prohlížeči pro detaily.";
        }
        
        warnsTableBody.innerHTML = `<tr><td colspan="6" class="loading-row status-err-text">CHYBA PŘI NAČÍTÁNÍ: ${errorMsg}</td></tr>`;
        searchCountInfo.textContent = `Chyba při načítání dat.`;
        updatePaginationControls(0, 1);
    }
}

// --- NASLUCHAČE UDÁLOSTÍ ---

// Stránkování
prevPageBtn.addEventListener('click', () => {
    if (!prevPageBtn.disabled) {
        goToPage(currentPage - 1);
    }
});

nextPageBtn.addEventListener('click', () => {
    if (!nextPageBtn.disabled) {
        goToPage(currentPage + 1);
    }
});

// Vyhledávání
searchInput.addEventListener('input', filterRecords);

// Načíst data při spuštění stránky
document.addEventListener('DOMContentLoaded', loadData);

// *** Logika mobilního menu (zachováno pro konzistenci) ***
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

if (mobileMenuBtn && mobileMenuOverlay && mobileMenu && mobileMenuClose) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
    });

    mobileMenuClose.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
    });

    mobileMenuOverlay.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
    });
}

dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const parentLi = toggle.closest('li.dropdown');
        if (parentLi) {
            parentLi.classList.toggle('open');
        }
    });
});