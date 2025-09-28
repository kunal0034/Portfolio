        // Hexagonal Background
        function createHexagonGrid() {
            const container = document.getElementById('hexagon-container');
            const hexagonSize = 100;
            const hexagonHeight = hexagonSize * Math.sqrt(3) / 2;

            // Calculate how many hexagons we need to cover the screen
            const cols = Math.ceil(window.innerWidth / (hexagonSize * 0.75)) + 1;
            const rows = Math.ceil(window.innerHeight / hexagonHeight) + 1;

            // Clear existing hexagons
            container.innerHTML = '';

            // Create hexagons
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const hexagon = document.createElement('div');
                    hexagon.className = 'hexagon';

                    // Offset every other row
                    const x = col * hexagonSize * 0.75;
                    const y = row * hexagonHeight;
                    if (col % 2 === 1) {
                        hexagon.style.top = `${y + hexagonHeight / 2}px`;
                    } else {
                        hexagon.style.top = `${y}px`;
                    }
                    hexagon.style.left = `${x}px`;

                    // Add data attributes for position tracking
                    hexagon.setAttribute('data-row', row);
                    hexagon.setAttribute('data-col', col);

                    container.appendChild(hexagon);
                }
            }

            // Store hexagon positions for line drawing
            window.hexagons = document.querySelectorAll('.hexagon');
        }

        // Draw connecting lines between hexagons
        function connectHexagons(clickX, clickY) {
            const container = document.getElementById('hexagon-container');
            const hexagonSize = 100;
            const hexagonHeight = hexagonSize * Math.sqrt(3) / 2;

            // Find the closest hexagon to the click
            let closestHexagon = null;
            let minDistance = Infinity;

            window.hexagons.forEach(hexagon => {
                const rect = hexagon.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const distance = Math.sqrt(
                    Math.pow(centerX - clickX, 2) + Math.pow(centerY - clickY, 2)
                );

                if (distance < minDistance) {
                    minDistance = distance;
                    closestHexagon = hexagon;
                }
            });

            if (!closestHexagon) return;

            // Get position of clicked hexagon
            const row = parseInt(closestHexagon.getAttribute('data-row'));
            const col = parseInt(closestHexagon.getAttribute('data-col'));

            // Connect to neighboring hexagons
            const neighbors = [
                { row: row, col: col - 1 }, // left
                { row: row, col: col + 1 }, // right
                { row: row - 1, col: col % 2 === 0 ? col : col - 1 }, // top-left
                { row: row - 1, col: col % 2 === 0 ? col + 1 : col }, // top-right
                { row: row + 1, col: col % 2 === 0 ? col : col - 1 }, // bottom-left
                { row: row + 1, col: col % 2 === 0 ? col + 1 : col }  // bottom-right
            ];

            // Highlight the clicked hexagon
            closestHexagon.style.backgroundColor = 'rgba(74, 111, 165, 0.3)';
            closestHexagon.style.transition = 'background-color 0.5s ease';

            // Create lines to neighbors
            neighbors.forEach(neighbor => {
                const neighborHexagon = document.querySelector(
                    `.hexagon[data-row="${neighbor.row}"][data-col="${neighbor.col}"]`
                );

                if (neighborHexagon) {
                    // Highlight neighbor
                    neighborHexagon.style.backgroundColor = 'rgba(74, 111, 165, 0.2)';
                    neighborHexagon.style.transition = 'background-color 0.5s ease';

                    // Create line between hexagons
                    const line = document.createElement('div');
                    line.className = 'hexagon-line';

                    const rect1 = closestHexagon.getBoundingClientRect();
                    const rect2 = neighborHexagon.getBoundingClientRect();

                    const x1 = rect1.left + rect1.width / 2;
                    const y1 = rect1.top + rect1.height / 2;
                    const x2 = rect2.left + rect2.width / 2;
                    const y2 = rect2.top + rect2.height / 2;

                    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

                    line.style.width = `${length}px`;
                    line.style.left = `${x1}px`;
                    line.style.top = `${y1}px`;
                    line.style.transform = `rotate(${angle}deg)`;
                    line.style.opacity = '1';

                    container.appendChild(line);

                    // Remove line after animation
                    setTimeout(() => {
                        line.style.opacity = '0';
                        setTimeout(() => {
                            if (line.parentNode) {
                                line.parentNode.removeChild(line);
                            }
                        }, 300);
                    }, 1000);
                }
            });

            // Reset hexagon colors after animation
            setTimeout(() => {
                closestHexagon.style.backgroundColor = 'rgba(74, 111, 165, 0.1)';
                neighbors.forEach(neighbor => {
                    const neighborHexagon = document.querySelector(
                        `.hexagon[data-row="${neighbor.row}"][data-col="${neighbor.col}"]`
                    );
                    if (neighborHexagon) {
                        neighborHexagon.style.backgroundColor = 'rgba(74, 111, 165, 0.1)';
                    }
                });
            }, 1000);
        }

        // Initialize hexagon grid
        window.addEventListener('load', createHexagonGrid);
        window.addEventListener('resize', createHexagonGrid);

        // Click event for connecting hexagons
        document.addEventListener('click', (e) => {
            connectHexagons(e.clientX, e.clientY);
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                if(targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if(targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Navbar background change on scroll
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            if(window.scrollY > 50) {
                navbar.style.backgroundColor = window.matchMedia('(prefers-color-scheme: dark)').matches ?
                    'rgba(26, 26, 46, 0.98)' : 'rgba(255, 255, 255, 0.98)';
                navbar.style.padding = '0.5rem 0';
            } else {
                navbar.style.backgroundColor = window.matchMedia('(prefers-color-scheme: dark)').matches ?
                    'rgba(26, 26, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)';
                navbar.style.padding = '1rem 0';
            }
        });

        // Fade-in animation on scroll
        const fadeElements = document.querySelectorAll('.fade-in');

        const fadeInOnScroll = function() {
            fadeElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;

                if(elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('visible');
                }
            });
        };

        // Check on load and scroll
        window.addEventListener('load', fadeInOnScroll);
        window.addEventListener('scroll', fadeInOnScroll);

        // Form submission
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });

        // Set active nav link based on scroll position
        window.addEventListener('scroll', function() {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-link');

            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;

                if(pageYOffset >= (sectionTop - 100)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if(link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });

        // Theme toggle functionality
        const themeSwitch = document.getElementById('theme-switch');

        // Check for saved theme preference or prefer-color-scheme
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme) {
            document.body.classList.add(currentTheme);
            if (currentTheme === 'dark-mode') {
                themeSwitch.checked = true;
            }
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-mode');
            themeSwitch.checked = true;
        }

        themeSwitch.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light-mode');
            }
        });