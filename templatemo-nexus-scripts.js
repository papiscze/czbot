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
            const mobileMenuLinks = document.querySelectorAll('.mobile-menu-nav a');
            const mobileMenuCta = document.querySelector('.mobile-menu-cta');
            const mobileMenuCtaButton = document.querySelector('.mobile-menu-cta a');
            const mobileMenuLogo = document.querySelector('.mobile-menu-logo');

            // Check if essential elements exist
            if (!mobileMenuBtn || !mobileMenu || !mobileMenuOverlay || !mobileMenuClose) {
                return;
            }

            // Logika pro Dropdown v mobilním menu (NOVÝ KÓD)
            const dropdownLinks = document.querySelectorAll('.dropdown-link');
            
            dropdownLinks.forEach(dropdown => {
                const dropBtn = dropdown.querySelector('.dropbtn');
                const dropdownContent = dropdown.querySelector('.dropdown-content');

                if (dropBtn && dropdownContent) {
                    dropBtn.addEventListener('click', function(e) {
                        // Zabrání navigaci na '#' a zabrání zavření hlavního menu
                        e.preventDefault(); 
                        e.stopPropagation();

                        // Skryje všechny ostatní otevřené dropdowny
                        document.querySelectorAll('.dropdown-link .dropdown-content').forEach(content => {
                            if (content !== dropdownContent) {
                                content.style.display = 'none';
                            }
                        });

                        // Přepne zobrazení aktuálního dropdownu
                        const isCurrentlyHidden = dropdownContent.style.display === 'block';
                        dropdownContent.style.display = isCurrentlyHidden ? 'none' : 'block';
                    });
                    
                    // Zajistí, že kliknutí na pododkaz dropdownu menu zavře
                    dropdownContent.querySelectorAll('a').forEach(link => {
                        link.addEventListener('click', () => {
                            closeMobileMenu();
                            // Dodatečně skryje i samotný podmenu
                            dropdownContent.style.display = 'none'; 
                        });
                    });
                }
            });
            // Konec NOVÉHO KÓDU pro Dropdown


            function openMobileMenu() {
                mobileMenuBtn.classList.add('active');
                mobileMenu.classList.add('active');
                mobileMenuOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Reset a trigger animace pro odkazy
                mobileMenuLinks.forEach((link, index) => {
                    if (link) {
                        link.style.animation = 'none';
                        link.style.opacity = '0';
                        link.style.transform = 'translateX(20px)';
                        
                        // Aplikace animace se zpožděním
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
                
                // Zajistí, že se zavřou i všechny otevřené dropdowny při zavření celého menu
                document.querySelectorAll('.dropdown-link .dropdown-content').forEach(content => {
                    content.style.display = 'none';
                });
            }

            // Přepínání mobilního menu
            mobileMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (mobileMenu.classList.contains('active')) {
                    closeMobileMenu();
                } else {
                    openMobileMenu();
                }
            });

            // Zavření mobilního menu
            mobileMenuClose.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeMobileMenu();
            });
            
            mobileMenuOverlay.addEventListener('click', (e) => {
                e.stopPropagation();
                closeMobileMenu();
            });

            // Zavření menu při kliknutí na navigační odkazy
            mobileMenuLinks.forEach(link => {
                if (link) {
                    link.addEventListener('click', () => {
                        // Tuto logiku už zpracovává kód dropdownu pro pododkazy,
                        // ale necháváme to zde pro klasické odkazy
                        if (!link.closest('.dropdown-link')) { 
                            closeMobileMenu();
                        }
                    });
                }
            });

            // Zavření menu při kliknutí na CTA tlačítko
            if (mobileMenuCtaButton) {
                mobileMenuCtaButton.addEventListener('click', (e) => {
                    if (mobileMenuCtaButton.getAttribute('href') === '#') {
                        e.preventDefault();
                    }
                    closeMobileMenu();
                });
            }

            // Zavření menu při kliknutí na logo
            if (mobileMenuLogo) {
                mobileMenuLogo.addEventListener('click', () => {
                    closeMobileMenu();
                });
            }

            // Zavření mobilního menu na klávesu Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            });

            // Zamezení scrollování těla stránky, když je menu otevřené
            if (mobileMenu) {
                mobileMenu.addEventListener('touchmove', (e) => {
                    e.stopPropagation();
                });
            }
        }

        // Inicializace mobilního menu, když je DOM připraven
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeMobileMenu);
        } else {
            initializeMobileMenu();
        }

        // Generování Matrix Rain efektu
        function generateMatrixRain() {
            const matrixRain = document.getElementById('matrixRain');
            // Zajištění, že element existuje před spuštěním
            if (!matrixRain) return;

            const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
            const columns = Math.floor(window.innerWidth / 20);
            
            // Vyčistí staré sloupce, pokud už existují
            matrixRain.innerHTML = '';

            for (let i = 0; i < columns; i++) {
                const column = document.createElement('div');
                column.className = 'matrix-column';
                column.style.left = `${i * 20}px`;
                column.style.animationDuration = `${Math.random() * 5 + 10}s`;
                column.style.animationDelay = `${Math.random() * 5}s`;
                
                // Generování náhodných znaků pro sloupec
                let text = '';
                const charCount = Math.floor(Math.random() * 20 + 10);
                for (let j = 0; j < charCount; j++) {
                    text += characters[Math.floor(Math.random() * characters.length)] + ' ';
                }
                column.textContent = text;
                
                matrixRain.appendChild(column);
            }
        }

        // Generování plovoucích částic
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

        // Generování datových proudů
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

        // Inicializace pozadí efektů
        document.addEventListener('DOMContentLoaded', () => {
            generateMatrixRain();
            generateParticles();
            generateDataStreams();
        });

        // Regenerace matrix rain při změně velikosti okna
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                generateMatrixRain();
            }, 250);
        });

        // Interaktivní efekt myši (throttle pro výkon)
        let mouseTimer;
        document.addEventListener('mousemove', (e) => {
            if (!mouseTimer) {
                mouseTimer = setTimeout(() => {
                    const mouseX = e.clientX;
                    const mouseY = e.clientY;
                    
                    // Pohyb orbů
                    const orbs = document.querySelectorAll('.orb');
                    orbs.forEach((orb, index) => {
                        const speed = (index + 1) * 0.02;
                        const x = (mouseX - window.innerWidth / 2) * speed;
                        const y = (mouseY - window.innerHeight / 2) * speed;
                        orb.style.transform = `translate(${x}px, ${y}px)`;
                    });
                    
                    // Rozjasnění okolních částic (pouze desktop)
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

        // Přidání záře, která sleduje kurzor (pouze desktop)
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

        // Plynulé scrollování
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                // Zabrání defaultní akci a scrolluje, jen pokud href není jen '#'
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

        // Efekt navigace při scrollování
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

        // Animace při scrollování (fade-up)
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

        // Efekty tlačítek
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.6)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.boxShadow = '';
            });
        });

        // Animace počítadla statistik
        const animateStats = () => {
            const stats = document.querySelectorAll('.stat-number');
            stats.forEach(stat => {
                // Přeskočí botStatus
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
                    const suffix = initialText.replace(/[\d\s,.]/g, ''); // Uchová jen nečísla
                    // Použijeme localeString pro formátování velkých čísel
                    stat.textContent = Math.floor(count).toLocaleString('cs-CZ') + suffix;
                }, 20);
            });
        };

        // Spuštění animace statistik, když je sekce viditelná
        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            const statsObserver = new IntersectionObserver((entries, observerInstance) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateStats();
                        observerInstance.unobserve(entry.target); // Zastaví pozorování po spuštění
                    }
                });
            }, { threshold: 0.5 });
            statsObserver.observe(statsSection);
        }

        // Glitch efekt při najetí na feature karty
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.animation = 'glitch1 0.3s ease-in-out';
                setTimeout(() => {
                    this.style.animation = '';
                }, 300);
            });
        });

        // Náhodné cyber textové efekty
        const cyberTexts = ['CONNECTING...', 'NEURAL LINK ESTABLISHED', 'QUANTUM SYNC ACTIVE', 'REALITY MATRIX LOADED'];

        setInterval(() => {
            const randomText = cyberTexts[Math.floor(Math.random() * cyberTexts.length)];
            const tempElement = document.createElement('div');
            tempElement.textContent = randomText;
            tempElement.style.cssText = `
                position: fixed;
                top: ${Math.random() * 100}vh;
                left: ${Math.random() * 100}vw;
                color: var(--color-primary); /* Používáme CSS proměnnou, pokud existuje */
                font-size: 0.8rem;
                font-weight: 700;
                z-index: 1000;
                opacity: 0.7;
                pointer-events: none;
                animation: fadeOut 3s ease-out forwards;
                text-shadow: 0 0 10px var(--color-primary);
            `;
            document.body.appendChild(tempElement);

            setTimeout(() => {
                if (tempElement.parentNode) {
                    document.body.removeChild(tempElement);
                }
            }, 3000);
        }, 5000);

        // Přidání fadeOut animace (CSS Keyframes)
        document.addEventListener('DOMContentLoaded', () => {
            const style = document.createElement('style');
            // Zajištění, že se keyframes definují jen jednou
            if (!document.querySelector('style[data-keyframes="fadeOut"]')) {
                style.textContent = `
                    @keyframes fadeOut {
                        0% { opacity: 0.7; transform: translateY(0); }
                        100% { opacity: 0; transform: translateY(-50px); }
                    }
                `;
                style.setAttribute('data-keyframes', 'fadeOut');
                document.head.appendChild(style);
            }
        });


        // Odeslání kontaktního formuláře
        const submitButton = document.querySelector('.btn-submit');
        if (submitButton) {
            submitButton.addEventListener('click', function(e) {
                e.preventDefault();

                const name = document.getElementById('name')?.value;
                const email = document.getElementById('email')?.value;
                const message = document.getElementById('message')?.value;

                if (name && email && message) {
                    // Simulace odeslání formuláře
                    this.textContent = 'TRANSMITTING...';
                    this.style.background = 'linear-gradient(135deg, var(--primary-cyan), var(--primary-pink))';

                    setTimeout(() => {
                        this.textContent = 'TRANSMISSION COMPLETE';
                        this.style.background = 'var(--primary-cyan)';

                        // Vyčištění formuláře
                        if (document.getElementById('name')) document.getElementById('name').value = '';
                        if (document.getElementById('email')) document.getElementById('email').value = '';
                        if (document.getElementById('message')) document.getElementById('message').value = '';

                        // Reset tlačítka po 3 sekundách
                        setTimeout(() => {
                            this.textContent = 'Transmit Message';
                            this.style.background = '';
                        }, 3000);
                    }, 2000);
                }
            });
        }