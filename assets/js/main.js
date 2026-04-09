// ===== LOADER =====
window.addEventListener('load', () => {
    const percentElement = document.getElementById('loaderPercent');
    let currentPercent = 0;
    const interval = setInterval(() => {
        currentPercent += Math.random() * 30;
        if (currentPercent > 100) currentPercent = 100;
        percentElement.textContent = Math.floor(currentPercent) + '%';
        if (currentPercent >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                document.getElementById('loader').classList.add('hidden');
                document.documentElement.style.overflow = '';
            }, 300);
        }
    }, 200);
});
document.documentElement.style.overflow = 'hidden';

// ===== CURSOR GLOW =====
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
}
animateGlow();

// ===== PARTICLES =====
const particlesEl = document.getElementById('particles');
for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 6 + 's';
    p.style.animationDuration = (4 + Math.random() * 4) + 's';
    particlesEl.appendChild(p);
}

// ===== DYNAMIC CODE WIDGET =====
const codeSnippets = [
    {
        file: 'model.py',
        lines: [
            '<span class="tok-k">import</span> <span class="tok-f">tensorflow</span> <span class="tok-k">as</span> tf',
            '<span class="tok-k">from</span> sklearn <span class="tok-k">import</span> pipeline',
            '',
            '<span class="tok-k">def</span> <span class="tok-f">train</span>(X, y):',
            '    model = tf.keras.Sequential([',
            '        tf.keras.layers.<span class="tok-f">Dense</span>(<span class="tok-n">128</span>),',
            '        tf.keras.layers.<span class="tok-f">Dropout</span>(<span class="tok-n">0.2</span>),',
            '        tf.keras.layers.<span class="tok-f">Dense</span>(<span class="tok-n">10</span>)',
            '    ])',
            '    model.<span class="tok-f">compile</span>(optimizer=<span class="tok-s">\'adam\'</span>)',
            '    <span class="tok-k">return</span> model.<span class="tok-f">fit</span>(X, y)',
        ]
    },
    {
        file: 'api.js',
        lines: [
            '<span class="tok-k">const</span> express = <span class="tok-f">require</span>(<span class="tok-s">\'express\'</span>);',
            '<span class="tok-k">const</span> app = <span class="tok-f">express</span>();',
            '',
            'app.<span class="tok-f">post</span>(<span class="tok-s">\'/api/submit\'</span>, <span class="tok-k">async</span> (req, res) => {',
            '    <span class="tok-k">const</span> { code, lang } = req.body;',
            '    <span class="tok-k">const</span> result = <span class="tok-k">await</span> <span class="tok-f">runInSandbox</span>(code, lang);',
            '    res.<span class="tok-f">json</span>({ success: <span class="tok-n">true</span>, result });',
            '});',
            '',
            'app.<span class="tok-f">listen</span>(<span class="tok-n">3000</span>);',
            '<span class="tok-c">// CodeClash judge engine</span>',
        ]
    },
    {
        file: 'pipeline.py',
        lines: [
            '<span class="tok-k">import</span> <span class="tok-f">pandas</span> <span class="tok-k">as</span> pd',
            '<span class="tok-k">from</span> xgboost <span class="tok-k">import</span> XGBRegressor',
            '',
            '<span class="tok-c"># Forecast cost overruns</span>',
            'df = pd.<span class="tok-f">read_csv</span>(<span class="tok-s">\'rows.csv\'</span>)',
            'X = df.<span class="tok-f">drop</span>(<span class="tok-s">\'cost\'</span>, axis=<span class="tok-n">1</span>)',
            '',
            'model = <span class="tok-f">XGBRegressor</span>(',
            '    n_estimators=<span class="tok-n">500</span>,',
            '    learning_rate=<span class="tok-n">0.05</span>',
            ')',
            'model.<span class="tok-f">fit</span>(X, df.cost)',
        ]
    },
    {
        file: 'forecast.py',
        lines: [
            '<span class="tok-k">import</span> <span class="tok-f">numpy</span> <span class="tok-k">as</span> np',
            '<span class="tok-k">from</span> sklearn.ensemble <span class="tok-k">import</span> *',
            '',
            '<span class="tok-k">class</span> <span class="tok-f">InventoryForecaster</span>:',
            '    <span class="tok-k">def</span> <span class="tok-f">__init__</span>(self):',
            '        self.model = <span class="tok-f">RandomForestRegressor</span>()',
            '',
            '    <span class="tok-k">def</span> <span class="tok-f">predict_demand</span>(self, X):',
            '        <span class="tok-k">return</span> self.model.<span class="tok-f">predict</span>(X)',
            '',
            '<span class="tok-c"># Walmart platform</span>',
            'forecaster.<span class="tok-f">train</span>(historical_data)',
        ]
    }
];

const codeContent = document.getElementById('codeContent');
const codeFilename = document.getElementById('codeFilename');
let snippetIndex = 0;
let lineIndex = 0;
let charIndex = 0;
let phase = 'typing'; // typing → pause → erasing → switch
let currentLines = [];

function renderCode() {
    const visible = currentLines.slice(0, lineIndex).join('\n');
    const currentLine = currentLines[lineIndex] || '';
    // Strip HTML to get actual length of current line
    const stripped = currentLine.replace(/<[^>]*>/g, '');
    const partial = stripped.slice(0, charIndex);
    // Re-apply highlighting up to charIndex using approximate reconstruction
    // Simpler: just show full tagged line once charIndex reaches full length, otherwise plain
    const currentDisplay = charIndex >= stripped.length ? currentLine : partial;
    codeContent.innerHTML = (visible ? visible + '\n' : '') + currentDisplay + '<span class="code-cursor"></span>';
}

function typeStep() {
    if (phase === 'typing') {
        if (lineIndex >= currentLines.length) {
            phase = 'pause';
            setTimeout(typeStep, 2000);
            return;
        }
        const currentLine = currentLines[lineIndex] || '';
        const stripped = currentLine.replace(/<[^>]*>/g, '');
        if (charIndex < stripped.length) {
            charIndex++;
            renderCode();
            setTimeout(typeStep, 25 + Math.random() * 35);
        } else {
            lineIndex++;
            charIndex = 0;
            renderCode();
            setTimeout(typeStep, 60);
        }
    } else if (phase === 'pause') {
        phase = 'switch';
        setTimeout(typeStep, 300);
    } else if (phase === 'switch') {
        snippetIndex = (snippetIndex + 1) % codeSnippets.length;
        currentLines = codeSnippets[snippetIndex].lines;
        codeFilename.textContent = codeSnippets[snippetIndex].file;
        lineIndex = 0;
        charIndex = 0;
        codeContent.innerHTML = '<span class="code-cursor"></span>';
        phase = 'typing';
        setTimeout(typeStep, 200);
    }
}

currentLines = codeSnippets[0].lines;
codeFilename.textContent = codeSnippets[0].file;
setTimeout(typeStep, 1500);

// ===== PAGE DOTS & NAV =====
const snapContainer = document.getElementById('snapContainer');
const pages = document.querySelectorAll('.page');
const dotsContainer = document.getElementById('pageDots');
const pageIds = [];
pages.forEach((page, i) => {
    const dot = document.createElement('div');
    dot.className = 'page-dot';
    dot.title = page.id;
    dot.addEventListener('click', () => {
        snapContainer.scrollTo({ top: page.offsetTop, behavior: 'smooth' });
    });
    dotsContainer.appendChild(dot);
    pageIds.push(page.id);
});
const dots = dotsContainer.querySelectorAll('.page-dot');

// Make in-page anchor links scroll inside snapContainer
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            snapContainer.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
        }
    });
});

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
});
function closeMobile() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
}
window.closeMobile = closeMobile;

function updateActiveState() {
    const scrollTop = snapContainer.scrollTop;
    navbar.classList.toggle('scrolled', scrollTop > 50);

    let currentIdx = 0;
    pages.forEach((page, i) => {
        if (page.offsetTop <= scrollTop + window.innerHeight / 2) {
            currentIdx = i;
        }
    });

    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIdx));
    pages.forEach((p, i) => p.classList.toggle('in-view', i === currentIdx));
}
snapContainer.addEventListener('scroll', updateActiveState);
const pageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            updateActiveState();
        }
    });
}, { threshold: [0.5], root: snapContainer });
pages.forEach(page => pageObserver.observe(page));

// ===== REVEAL =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== COUNTERS =====
function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const start = performance.now();
        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target) + '+';
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}
const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        animateCounters();
        heroObserver.disconnect();
    }
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

// anchor scroll handled above via snapContainer

// ===== SKILLS FILTER =====
const filterChips = document.querySelectorAll('.filter-chip');
const skillBoxes = document.querySelectorAll('.skill-box');
filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.dataset.filter;
        skillBoxes.forEach(box => {
            if (filter === 'all' || box.dataset.cat === filter) {
                box.classList.remove('hidden');
            } else {
                box.classList.add('hidden');
            }
        });
    });
});

// Initial
updateActiveState();
