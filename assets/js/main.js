/**
 * ALGEBRIFY - MAIN JAVASCRIPT
 * 10 Learning Modules Registry, Dynamic Progress Tracking, KaTeX Helper, Theme Manager
 */

// ==========================================================================
// 10 LEARNING MODULES REGISTRY
// ==========================================================================

const ALGEBRIFY_TOPICS = [
    {
        id: "module-1",
        number: "01",
        title: "Algebra of Matrices",
        subtitle: "Order, Types, Equality, Operations & Transpose",
        pageUrl: "pages/matrices.html",
        hash: "theory"
    },
    {
        id: "module-2",
        number: "02",
        title: "Systems of Linear Equations",
        subtitle: "Gaussian & Gauss-Jordan Elimination, Echelon Forms",
        pageUrl: "pages/equations.html",
        hash: "theory"
    },
    {
        id: "module-3",
        number: "03",
        title: "Field",
        subtitle: "Field Axioms, Real, Complex & Galois Field GF(2)",
        pageUrl: "pages/fields.html",
        hash: "theory"
    },
    {
        id: "module-4",
        number: "04",
        title: "Vectors",
        subtitle: "Geometric & Algebraic Vectors, Dot & Cross Products",
        pageUrl: "pages/vectors.html",
        hash: "theory"
    },
    {
        id: "module-5",
        number: "05",
        title: "Vector Spaces",
        subtitle: "Subspaces, Span, Linear Independence, Basis & Dimension",
        pageUrl: "pages/vector-spaces.html",
        hash: "theory"
    },
    {
        id: "module-6",
        number: "06",
        title: "Linear Transformations",
        subtitle: "Kernel, Image, Rank, Nullity & Dimension Theorem",
        pageUrl: "pages/transformations.html",
        hash: "theory"
    },
    {
        id: "module-7",
        number: "07",
        title: "Linear Transformations and Matrices",
        subtitle: "Matrix Representation, Change of Basis & Similarity",
        pageUrl: "pages/transformation-matrices.html",
        hash: "theory"
    },
    {
        id: "module-8",
        number: "08",
        title: "Inner Product Spaces & Orthogonality",
        subtitle: "Inner Products, Cauchy-Schwarz, Gram-Schmidt Process",
        pageUrl: "pages/inner-products.html",
        hash: "theory"
    },
    {
        id: "module-9",
        number: "09",
        title: "Determinants",
        subtitle: "Cofactor Expansion, Properties, Inverses & Cramer's Rule",
        pageUrl: "pages/determinants.html",
        hash: "theory"
    },
    {
        id: "module-10",
        number: "10",
        title: "Diagonalization, Eigenvalues & Eigenvectors",
        subtitle: "Characteristic Polynomial, Cayley-Hamilton & Jordan Form",
        pageUrl: "pages/eigenvalues.html",
        hash: "theory"
    }
];

// ==========================================================================
// PROGRESS MANAGER (LOCAL STORAGE)
// ==========================================================================

const ProgressManager = {
    STORAGE_KEY: "algebrify_completed_modules",
    VISITED_KEY: "algebrify_visited_modules",
    LAST_VISITED_KEY: "algebrify_last_visited_module",

    getCompletedModules() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.warn("Could not read progress from localStorage", e);
            return [];
        }
    },

    getVisitedModules() {
        try {
            const raw = localStorage.getItem(this.VISITED_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.warn("Could not read visited modules from localStorage", e);
            return [];
        }
    },

    getLastVisitedModule() {
        try {
            const lastId = localStorage.getItem(this.LAST_VISITED_KEY);
            if (!lastId) return null;
            return ALGEBRIFY_TOPICS.find(m => m.id === lastId) || null;
        } catch (e) {
            return null;
        }
    },

    isCompleted(moduleId) {
        const completed = this.getCompletedModules();
        return completed.includes(moduleId);
    },

    isVisited(moduleId) {
        const visited = this.getVisitedModules();
        return visited.includes(moduleId);
    },

    recordVisit(moduleId) {
        if (!moduleId) return;
        let visited = this.getVisitedModules();
        if (!visited.includes(moduleId)) {
            visited.push(moduleId);
            try {
                localStorage.setItem(this.VISITED_KEY, JSON.stringify(visited));
            } catch (e) {
                console.warn("Could not save visited modules to localStorage", e);
            }
        }
        try {
            localStorage.setItem(this.LAST_VISITED_KEY, moduleId);
        } catch (e) {
            console.warn("Could not save last visited module to localStorage", e);
        }
        this.notifyChange();
    },

    setCompleted(moduleId, isCompleted = true) {
        let completed = this.getCompletedModules();

        if (isCompleted) {
            if (!completed.includes(moduleId)) {
                completed.push(moduleId);
            }
        } else {
            completed = completed.filter(id => id !== moduleId);
        }

        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(completed));
        } catch (e) {
            console.warn("Could not save progress to localStorage", e);
        }
        this.notifyChange();
    },

    toggleCompleted(moduleId) {
        const currentlyDone = this.isCompleted(moduleId);
        this.setCompleted(moduleId, !currentlyDone);
        return !currentlyDone;
    },

    getNextIncompleteModule() {
        const completed = this.getCompletedModules();
        for (const module of ALGEBRIFY_TOPICS) {
            if (!completed.includes(module.id)) {
                return module;
            }
        }
        return null; // All 10 completed!
    },

    getStats() {
        const completed = this.getCompletedModules();
        const count = Math.min(completed.length, ALGEBRIFY_TOPICS.length);
        const total = ALGEBRIFY_TOPICS.length;
        const percentage = Math.round((count / total) * 100);
        return { count, total, percentage };
    },

    notifyChange() {
        window.dispatchEvent(new CustomEvent("algebrify_progress_updated"));
        this.updateDashboardUI();
        this.updateModuleButtons();
    },

    updateDashboardUI() {
        const stats = this.getStats();

        // 1. Text e.g. "4 / 10 Modules Completed"
        const countEls = document.querySelectorAll(".progress-count-text");
        countEls.forEach(el => {
            el.textContent = `${stats.count} / ${stats.total} Modules Completed`;
        });

        // 2. Percentage labels e.g. "40%"
        const percentEls = document.querySelectorAll(".progress-percent-text");
        percentEls.forEach(el => {
            el.textContent = `${stats.percentage}%`;
        });

        // 3. Horizontal Progress Fill bar
        const fillBars = document.querySelectorAll(".progress-fill");
        fillBars.forEach(el => {
            el.style.width = `${stats.percentage}%`;
        });

        // 4. Circular SVG Progress Ring (Dashboard card)
        const ringProgressEls = document.querySelectorAll(".ring-progress");
        ringProgressEls.forEach(ring => {
            const circumference = 176;
            const offset = circumference - (stats.percentage / 100) * circumference;
            ring.style.strokeDashoffset = offset;
        });

        const ringTextEls = document.querySelectorAll(".progress-ring span");
        ringTextEls.forEach(span => {
            span.textContent = `${stats.percentage}%`;
        });

        // 4b. Header Circular Progress Ring (Compact navbar indicator)
        const headerRingFillEls = document.querySelectorAll(".header-ring-fill");
        headerRingFillEls.forEach(ring => {
            const circumference = 84.82;
            const offset = circumference - (stats.percentage / 100) * circumference;
            ring.style.strokeDashoffset = offset;
        });

        const headerRingTextEls = document.querySelectorAll(".header-progress-text");
        headerRingTextEls.forEach(span => {
            span.textContent = `${stats.percentage}%`;
        });

        const headerTooltipEls = document.querySelectorAll(".header-progress-tooltip");
        headerTooltipEls.forEach(tooltip => {
            tooltip.textContent = `${stats.percentage}% complete · View Dashboard`;
        });

        const headerRingLinks = document.querySelectorAll(".header-progress-ring");
        headerRingLinks.forEach(link => {
            link.setAttribute("title", `${stats.percentage}% complete · View Dashboard`);
        });

        // 5. Module list checklist in dashboard (clean ✓ or ○, without 'in progress' or 'not started' badges)
        const topicListContainer = document.querySelector(".topic-list");
        if (topicListContainer) {
            topicListContainer.innerHTML = "";

            ALGEBRIFY_TOPICS.forEach((mod) => {
                const isDone = this.isCompleted(mod.id);
                const item = document.createElement("a");
                item.className = `topic-item ${isDone ? "completed" : ""}`;
                
                const isInsidePages = window.location.pathname.includes("/pages/");
                const targetUrl = isInsidePages ? mod.pageUrl.replace("pages/", "") : mod.pageUrl;
                item.href = `${targetUrl}#${mod.hash}`;

                item.innerHTML = `
                    <span><strong>Module ${mod.number}:</strong> ${mod.title}</span>
                    <span class="topic-status">${isDone ? "✓" : "○"}</span>
                `;
                topicListContainer.appendChild(item);
            });
        }

        // 6. Update Module Selection Cards on Homepage (#modules)
        const moduleCards = document.querySelectorAll(".module-card");
        if (moduleCards.length > 0) {
            moduleCards.forEach((card, index) => {
                if (index < ALGEBRIFY_TOPICS.length) {
                    const mod = ALGEBRIFY_TOPICS[index];
                    const isDone = this.isCompleted(mod.id);
                    const wasVisited = this.isVisited(mod.id);
                    const linkEl = card.querySelector(".module-link");
                    if (linkEl) {
                        if (isDone) {
                            linkEl.innerHTML = `Review Module ${index + 1} ✓ <i data-lucide="check"></i>`;
                        } else if (wasVisited) {
                            linkEl.innerHTML = `Continue Module ${index + 1} → <i data-lucide="arrow-right"></i>`;
                        } else {
                            linkEl.innerHTML = `Start Module ${index + 1} <i data-lucide="arrow-right"></i>`;
                        }
                    }
                }
            });
        }

        // 7. Continue Learning Buttons (points to last visited incomplete module or module selection)
        const lastVisited = this.getLastVisitedModule();
        const nextMod = (lastVisited && !this.isCompleted(lastVisited.id)) ? lastVisited : this.getNextIncompleteModule();
        const continueButtons = document.querySelectorAll(".continue-btn, .continue-learning-action");
        const isInsidePages = window.location.pathname.includes("/pages/");

        continueButtons.forEach(btn => {
            if (stats.count === 0 && !lastVisited) {
                btn.href = isInsidePages ? "../index.html#modules" : "#modules";
                btn.innerHTML = `<i data-lucide="play"></i> Start Learning →`;
            } else if (nextMod) {
                const targetUrl = isInsidePages ? nextMod.pageUrl.replace("pages/", "") : nextMod.pageUrl;
                btn.href = `${targetUrl}#${nextMod.hash}`;
                btn.innerHTML = `<i data-lucide="play"></i> Continue: Module ${nextMod.number} →`;
            } else {
                const targetUrl = isInsidePages ? "matrices.html" : "pages/matrices.html";
                btn.href = targetUrl;
                btn.innerHTML = `🎉 All 10 Modules Completed! Review →`;
            }
        });
    },

    updateModuleButtons() {
        const completeButtons = document.querySelectorAll(".complete-topic-btn");
        completeButtons.forEach(btn => {
            const modId = btn.getAttribute("data-module-id") || btn.getAttribute("data-topic-id");
            if (modId) {
                const isDone = this.isCompleted(modId);
                if (isDone) {
                    btn.classList.add("completed");
                    btn.innerHTML = `<i data-lucide="check-circle-2"></i> Module Completed! (Click to Undo)`;
                } else {
                    btn.classList.remove("completed");
                    btn.innerHTML = `<i data-lucide="check"></i> Mark Module as Completed`;
                }
            }
        });
        if (window.lucide && typeof lucide.createIcons === "function") {
            lucide.createIcons();
        }
    },

    autoDetectCurrentModule() {
        const completeBtn = document.querySelector(".complete-topic-btn");
        if (completeBtn) {
            const modId = completeBtn.getAttribute("data-module-id") || completeBtn.getAttribute("data-topic-id");
            if (modId) {
                this.recordVisit(modId);
            }
        }
    }
};

// ==========================================================================
// NAVIGATION & DROPDOWN MANAGER
// ==========================================================================

const NavigationManager = {
    init() {
        // 1. Dropdown Toggle Click (for mobile / touch / click)
        const dropdownToggles = document.querySelectorAll(".nav-dropdown-toggle");
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener("click", (e) => {
                const parentDropdown = toggle.closest(".nav-dropdown");
                if (parentDropdown) {
                    const isMobile = window.innerWidth <= 768;
                    if (isMobile) {
                        e.preventDefault();
                    }
                    document.querySelectorAll(".nav-dropdown").forEach(d => {
                        if (d !== parentDropdown) {
                            d.classList.remove("open");
                            const otherToggle = d.querySelector(".nav-dropdown-toggle");
                            if (otherToggle) otherToggle.setAttribute("aria-expanded", "false");
                        }
                    });
                    parentDropdown.classList.toggle("open");
                    const isExpanded = parentDropdown.classList.contains("open");
                    toggle.setAttribute("aria-expanded", isExpanded ? "true" : "false");
                }
            });
        });

        // 2. Close dropdown on click outside
        document.addEventListener("click", (e) => {
            if (!e.target.closest(".nav-dropdown")) {
                document.querySelectorAll(".nav-dropdown.open").forEach(dropdown => {
                    dropdown.classList.remove("open");
                    const toggle = dropdown.querySelector(".nav-dropdown-toggle");
                    if (toggle) toggle.setAttribute("aria-expanded", "false");
                });
            }
        });

        // 3. Mobile Hamburger Menu Toggle
        const mobileToggles = document.querySelectorAll(".mobile-menu-btn");
        const navLinks = document.querySelector(".nav-links");
        mobileToggles.forEach(btn => {
            btn.addEventListener("click", () => {
                if (navLinks) {
                    navLinks.classList.toggle("mobile-open");
                    const isOpen = navLinks.classList.contains("mobile-open");
                    btn.innerHTML = isOpen ? `<i data-lucide="x"></i>` : `<i data-lucide="menu"></i>`;
                    if (window.lucide && typeof lucide.createIcons === "function") {
                        lucide.createIcons();
                    }
                }
            });
        });

        // 4. Close mobile menu when clicking nav links (except dropdown toggle)
        if (navLinks) {
            navLinks.querySelectorAll("a:not(.nav-dropdown-toggle)").forEach(link => {
                link.addEventListener("click", () => {
                    navLinks.classList.remove("mobile-open");
                    mobileToggles.forEach(btn => {
                        btn.innerHTML = `<i data-lucide="menu"></i>`;
                    });
                    if (window.lucide && typeof lucide.createIcons === "function") {
                        lucide.createIcons();
                    }
                });
            });
        }

        // 5. Close on Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                document.querySelectorAll(".nav-dropdown.open").forEach(dropdown => {
                    dropdown.classList.remove("open");
                });
                if (navLinks && navLinks.classList.contains("mobile-open")) {
                    navLinks.classList.remove("mobile-open");
                    mobileToggles.forEach(btn => {
                        btn.innerHTML = `<i data-lucide="menu"></i>`;
                    });
                    if (window.lucide && typeof lucide.createIcons === "function") {
                        lucide.createIcons();
                    }
                }
            }
        });
    }
};

// ==========================================================================
// THEME MANAGER (DARK / LIGHT MODE)
// ==========================================================================

const ThemeManager = {
    STORAGE_KEY: "algebrify_theme",

    init() {
        const savedTheme = localStorage.getItem(this.STORAGE_KEY) || 
            (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        this.applyTheme(savedTheme);

        const toggleBtns = document.querySelectorAll(".theme-toggle");
        toggleBtns.forEach(btn => {
            btn.addEventListener("click", () => this.toggleTheme());
        });
    },

    applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(this.STORAGE_KEY, theme);

        const toggleBtns = document.querySelectorAll(".theme-toggle");
        toggleBtns.forEach(btn => {
            btn.innerHTML = theme === "dark" 
                ? `<i data-lucide="sun"></i>` 
                : `<i data-lucide="moon"></i>`;
        });

        if (window.lucide && typeof lucide.createIcons === "function") {
            lucide.createIcons();
        }
    },

    toggleTheme() {
        const current = document.documentElement.getAttribute("data-theme") || "light";
        const nextTheme = current === "dark" ? "light" : "dark";
        this.applyTheme(nextTheme);
    }
};

// ==========================================================================
// KATEX AUTO-RENDER HELPER
// ==========================================================================

function renderAllMath(container = document.body) {
    if (window.renderMathInElement) {
        try {
            renderMathInElement(container, {
                delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "\\[", right: "\\]", display: true },
                    { left: "$", right: "$", display: false },
                    { left: "\\(", right: "\\)", display: false }
                ],
                throwOnError: false
            });
        } catch (err) {
            console.warn("KaTeX rendering error:", err);
        }
    }
}

// ==========================================================================
// QUIZ RUNNER COMPONENT
// ==========================================================================

class AlgebrifyQuiz {
    constructor(containerId, questions, moduleId = null) {
        this.container = document.getElementById(containerId);
        this.questions = questions;
        this.moduleId = moduleId;
        this.currentIndex = 0;
        this.score = 0;
        this.init();
    }

    init() {
        if (!this.container) return;
        this.renderQuestion();
    }

    renderQuestion() {
        if (this.currentIndex >= this.questions.length) {
            this.renderScoreSummary();
            return;
        }

        const q = this.questions[this.currentIndex];
        this.container.innerHTML = `
            <div class="quiz-header">
                <span class="quiz-progress-text">Question ${this.currentIndex + 1} of ${this.questions.length}</span>
                <span class="quiz-score-badge">Score: ${this.score} / ${this.questions.length}</span>
            </div>
            <div class="quiz-question">${q.question}</div>
            <div class="quiz-answers-list">
                ${q.answers.map((ans, idx) => `
                    <button class="quiz-option-btn" data-index="${idx}">
                        <span>${String.fromCharCode(65 + idx)}.</span>
                        <span>${ans}</span>
                    </button>
                `).join("")}
            </div>
            <div class="quiz-feedback" id="quiz-feedback-box"></div>
            <div class="quiz-actions">
                <button class="btn-primary" id="quiz-next-action-btn" style="display: none;">
                    ${this.currentIndex + 1 === this.questions.length ? "Finish Quiz →" : "Next Question →"}
                </button>
            </div>
        `;

        renderAllMath(this.container);

        const optionButtons = this.container.querySelectorAll(".quiz-option-btn");
        optionButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const selectedIdx = parseInt(btn.getAttribute("data-index"), 10);
                this.handleAnswer(selectedIdx, optionButtons);
            });
        });

        const nextBtn = this.container.querySelector("#quiz-next-action-btn");
        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                this.currentIndex++;
                this.renderQuestion();
            });
        }
    }

    handleAnswer(selectedIdx, buttons) {
        const q = this.questions[this.currentIndex];
        const feedbackBox = this.container.querySelector("#quiz-feedback-box");
        const nextBtn = this.container.querySelector("#quiz-next-action-btn");

        buttons.forEach((btn, idx) => {
            btn.disabled = true;
            if (idx === q.correct) {
                btn.classList.add("selected-correct");
            } else if (idx === selectedIdx && selectedIdx !== q.correct) {
                btn.classList.add("selected-incorrect");
            }
        });

        const isCorrect = selectedIdx === q.correct;
        if (isCorrect) {
            this.score++;
            feedbackBox.className = "quiz-feedback correct";
            feedbackBox.innerHTML = `<strong>✅ Correct!</strong> ${q.explanation || "Well done! You understood this concept."}`;
        } else {
            feedbackBox.className = "quiz-feedback incorrect";
            feedbackBox.innerHTML = `<strong>❌ Not quite.</strong> ${q.explanation || "Review the step-by-step textbook notes above and try again!"}`;
        }

        renderAllMath(feedbackBox);
        if (nextBtn) nextBtn.style.display = "inline-flex";
    }

    renderScoreSummary() {
        const percentage = Math.round((this.score / this.questions.length) * 100);
        const passed = percentage >= 60;

        if (passed && this.moduleId) {
            ProgressManager.setCompleted(this.moduleId, true);
        }

        this.container.innerHTML = `
            <div class="quiz-score-summary">
                <h3>${passed ? "🎉 Well Done!" : "📚 Keep Practicing!"}</h3>
                <p>You scored <strong>${this.score} out of ${this.questions.length}</strong> (${percentage}%)</p>
                <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
                    <button class="btn-secondary" id="quiz-retake-btn">
                        <i data-lucide="rotate-ccw"></i> Retake Quiz
                    </button>
                    ${this.moduleId ? `
                        <button class="btn-primary complete-topic-btn ${ProgressManager.isCompleted(this.moduleId) ? "completed" : ""}" data-module-id="${this.moduleId}">
                            <i data-lucide="check-circle"></i> ${ProgressManager.isCompleted(this.moduleId) ? "Module Completed ✓" : "Mark as Completed"}
                        </button>
                    ` : ""}
                </div>
            </div>
        `;

        if (window.lucide && typeof lucide.createIcons === "function") {
            lucide.createIcons();
        }

        const retakeBtn = this.container.querySelector("#quiz-retake-btn");
        if (retakeBtn) {
            retakeBtn.addEventListener("click", () => {
                this.currentIndex = 0;
                this.score = 0;
                this.renderQuestion();
            });
        }

        const completeBtn = this.container.querySelector(".complete-topic-btn");
        if (completeBtn) {
            completeBtn.addEventListener("click", () => {
                ProgressManager.toggleCompleted(this.moduleId);
                this.renderScoreSummary();
            });
        }
    }
}

// ==========================================================================
// INITIALIZATION ON DOM READY
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Theme
    ThemeManager.init();

    // 2. Initialize Navigation & Dropdown
    NavigationManager.init();

    // 3. Initialize Dashboard & Progress
    ProgressManager.autoDetectCurrentModule();
    ProgressManager.updateDashboardUI();
    ProgressManager.updateModuleButtons();

    // 4. Module Completion Buttons handler
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".complete-topic-btn");
        if (btn) {
            const modId = btn.getAttribute("data-module-id") || btn.getAttribute("data-topic-id");
            if (modId) {
                ProgressManager.toggleCompleted(modId);
            }
        }
    });

    // 5. Render Math on load
    renderAllMath();

    // 6. Initialize Lucide Icons
    if (window.lucide && typeof lucide.createIcons === "function") {
        lucide.createIcons();
    }
});
