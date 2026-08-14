/**
 * ALGEBRIFY - CHATGPT-STYLE AI LINEAR ALGEBRA TUTOR
 * Live Generative AI (Gemini 2.0/1.5 Flash, OpenAI GPT-4o-mini, Groq Llama 3.3)
 * Full Multi-turn Conversational Memory & Persistent Session Management
 */

const SYSTEM_PROMPT = `You are "Algebrify AI Tutor", an educational AI tutor specializing in Linear Algebra.
Your primary purpose is to help undergraduate/beginner students understand Linear Algebra clearly and correctly.

CORE RULE:
Always answer according to the user's ACTUAL question and the current conversation context.
Never return the same generic/predefined answer for different questions.

SCOPE:
Primarily answer questions related to:
• Algebra of Matrices (Order, Types, Equality, Operations, Transpose, Properties)
• Systems of Linear Equations (Gaussian & Gauss-Jordan Elimination, Echelon forms, Consistency)
• Fields (Field Axioms, Real ℝ, Complex ℂ, Galois Field GF(2))
• Vectors (Geometric & Algebraic vectors, Dot & Cross Products, Norm, Projections)
• Vector Spaces (Axioms, Subspaces, Span, Linear Independence, Basis & Dimension)
• Linear Transformations (Kernel, Image, Rank, Nullity, Rank-Nullity Theorem)
• Linear Transformations and Matrices (Matrix representation, Change of Basis, Similarity)
• Inner Product Spaces and Orthogonality (Inner products, Cauchy-Schwarz, Gram-Schmidt process)
• Determinants (Properties, 2x2 & 3x3 formulas, Cofactor expansion, Invertibility, Cramer's rule)
• Eigenvalues and Eigenvectors (Characteristic polynomial, Eigenspaces)
• Diagonalization (A = PDP⁻¹, Algebraic vs Geometric multiplicity)
• Closely related Linear Algebra concepts

If the user asks something outside Linear Algebra, politely explain that Algebrify AI Tutor is designed specifically for Linear Algebra and redirect them toward the relevant topic when appropriate.

TEACHING STYLE:
• Beginner-friendly and encouraging
• Clear, formal, and mathematically accurate
• Simple wording; explain terminology before using it
• Avoid unnecessarily advanced or convoluted language
• Do not sound robotic or mechanical
• Teach concepts rather than simply giving raw answers
• Use examples when they improve understanding
• Use standard LaTeX formatting: $...$ for inline math and $$...$$ for display math. Format matrices as \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}.

QUESTION HANDLING:
1. Definition Question:
   → Give the precise mathematical definition.
   → Explain it in simple, intuitive language.
   → Give a small illustrative example.

2. "Explain..." Question:
   → Explain the concept step-by-step.
   → Provide geometric/algebraic intuition and a clear example.

3. "Why..." Question:
   → Explain the reasoning/proof/geometric intuition behind the concept rather than just stating the result.

4. Comparison Question:
   → Clearly explain the difference between the concepts.
   → Use a comparison table or concrete example.

5. Numerical / Mathematical Problem:
   → Identify what is given.
   → Identify the relevant concept / method being used.
   → Solve step-by-step showing important calculations and intermediate arithmetic.
   → State the final answer clearly under "**Final Answer:**".
   → Do not provide only the final answer without steps.

6. Example Request:
   → Generate a fresh, relevant example based on the concept currently being discussed.

7. Confusion / Simplification ("I don't understand", "I still don't understand", "Explain again", "Make it simpler"):
   → Understand what was previously being discussed in the conversation.
   → Re-explain the SAME concept using simpler words, analogies, or alternative perspectives.
   → Do not start an unrelated explanation or repeat the identical text.

CONVERSATIONAL MEMORY:
Maintain context throughout the current chat session. Resolve pronouns like "it", "this matrix", "that theorem" based on earlier turns in the conversation.

ADAPTIVE RESPONSES:
The response length should match the question:
• Simple question → concise answer.
• Conceptual question → clear explanation + example.
• Mathematical problem → detailed step-by-step solution.
• Follow-up → concise contextual answer unless more explanation is requested.`;

// =============================================================================
// MAIN CHAT APPLICATION CONTROLLER
// =============================================================================

class AlgebrifyAITutor {
    constructor() {
        // UI References
        this.appContainer = document.querySelector(".tutor-chat-app");
        this.sidebar = document.getElementById("tutor-sidebar");
        this.sidebarBackdrop = document.getElementById("sidebar-backdrop");
        this.sidebarToggleBtn = document.getElementById("sidebar-toggle-btn");
        this.sidebarCloseBtn = document.getElementById("sidebar-close-btn");
        this.sessionsListEl = document.getElementById("chat-sessions-list");
        this.newChatBtn = document.getElementById("new-chat-btn");
        this.clearAllSessionsBtn = document.getElementById("clear-all-sessions-btn");

        this.messagesContainer = document.getElementById("tutor-messages");
        this.inputField = document.getElementById("tutor-user-input");
        this.sendBtn = document.getElementById("tutor-send-btn");
        this.statusText = document.getElementById("tutor-status-text");
        this.activeChatTitle = document.getElementById("active-chat-title");
        this.clearChatBtn = document.getElementById("clear-chat-btn");

        // State Management
        this.apiKey = localStorage.getItem("algebrify_ai_key") || sessionStorage.getItem("algebrify_gemini_key") || "";
        this.apiProvider = localStorage.getItem("algebrify_ai_provider") || "auto";
        this.sessions = this.loadSessions();
        this.currentSessionId = localStorage.getItem("algebrify_active_session_id") || "";
        this.isGenerating = false;

        this.init();
    }

    init() {
        if (!this.sessions || this.sessions.length === 0) {
            this.createNewSession("New Conversation");
        } else if (!this.getSession(this.currentSessionId)) {
            this.currentSessionId = this.sessions[0].id;
            this.saveActiveSessionId();
        }

        this.renderSessionsList();
        this.renderActiveSessionMessages();
        this.bindEvents();
        this.updateStatusBadge();
    }

    updateStatusBadge() {
        if (!this.statusText) return;
        if (this.apiKey) {
            const provider = this.detectProvider(this.apiKey, this.apiProvider);
            const label = provider === "gemini" ? "Gemini AI (Live)" 
                        : provider === "openai" ? "ChatGPT (Live)"
                        : provider === "groq" ? "Groq Llama 3 (Live)" 
                        : "Live AI Connected";
            this.statusText.textContent = label;
        } else {
            this.statusText.textContent = "ChatGPT AI Tutor • Online";
        }
    }

    bindEvents() {
        // Send Button Click
        if (this.sendBtn) {
            this.sendBtn.addEventListener("click", () => this.handleSendMessage());
        }

        // Input Field Events (Enter to send, Shift+Enter for new line, Auto-expand)
        if (this.inputField) {
            this.inputField.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSendMessage();
                }
            });

            this.inputField.addEventListener("input", () => {
                this.inputField.style.height = "auto";
                this.inputField.style.height = Math.min(this.inputField.scrollHeight, 160) + "px";
            });
        }

        // Sidebar Toggle for Mobile & Desktop
        if (this.sidebarToggleBtn) {
            this.sidebarToggleBtn.addEventListener("click", () => {
                if (this.sidebar) this.sidebar.classList.toggle("open");
                if (this.sidebarBackdrop) this.sidebarBackdrop.classList.toggle("active");
            });
        }

        if (this.sidebarCloseBtn) {
            this.sidebarCloseBtn.addEventListener("click", () => {
                if (this.sidebar) this.sidebar.classList.remove("open");
                if (this.sidebarBackdrop) this.sidebarBackdrop.classList.remove("active");
            });
        }

        if (this.sidebarBackdrop) {
            this.sidebarBackdrop.addEventListener("click", () => {
                if (this.sidebar) this.sidebar.classList.remove("open");
                if (this.sidebarBackdrop) this.sidebarBackdrop.classList.remove("active");
            });
        }

        // New Chat Button
        if (this.newChatBtn) {
            this.newChatBtn.addEventListener("click", () => {
                this.createNewSession("New Conversation");
                if (window.innerWidth <= 768 && this.sidebar) {
                    this.sidebar.classList.remove("open");
                    if (this.sidebarBackdrop) this.sidebarBackdrop.classList.remove("active");
                }
            });
        }

        // Clear Current Chat Button
        if (this.clearChatBtn) {
            this.clearChatBtn.addEventListener("click", () => {
                if (confirm("Are you sure you want to clear messages in this chat?")) {
                    const session = this.getActiveSession();
                    if (session) {
                        session.messages = [];
                        this.saveSessions();
                        this.renderActiveSessionMessages();
                    }
                }
            });
        }

        // Clear All Sessions Button
        if (this.clearAllSessionsBtn) {
            this.clearAllSessionsBtn.addEventListener("click", () => {
                if (confirm("Are you sure you want to delete ALL chat history?")) {
                    this.sessions = [];
                    this.createNewSession("New Conversation");
                }
            });
        }

        // Prompt Chips
        const chipsContainer = document.getElementById("tutor-prompt-chips");
        if (chipsContainer) {
            chipsContainer.addEventListener("click", (e) => {
                const chip = e.target.closest(".tutor-chip");
                if (chip) {
                    const prompt = chip.getAttribute("data-prompt");
                    if (prompt && this.inputField) {
                        this.inputField.value = prompt;
                        this.handleSendMessage();
                    }
                }
            });
        }
    }

    detectProvider(key, selectedProvider = "auto") {
        if (selectedProvider && selectedProvider !== "auto") return selectedProvider;
        const k = (key || "").trim();
        if (k.startsWith("AIzaSy")) return "gemini";
        if (k.startsWith("gsk_")) return "groq";
        if (k.startsWith("sk-or-")) return "openrouter";
        if (k.startsWith("sk-")) return "openai";
        return "gemini";
    }

    // =========================================================================
    // SESSION & LOCALSTORAGE MANAGEMENT
    // =========================================================================

    loadSessions() {
        try {
            const raw = localStorage.getItem("algebrify_chat_sessions");
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error("Error loading chat sessions:", e);
            return [];
        }
    }

    saveSessions() {
        try {
            localStorage.setItem("algebrify_chat_sessions", JSON.stringify(this.sessions));
        } catch (e) {
            console.error("Error saving chat sessions:", e);
        }
    }

    saveActiveSessionId() {
        try {
            localStorage.setItem("algebrify_active_session_id", this.currentSessionId);
        } catch (e) {
            console.error("Error saving active session ID:", e);
        }
    }

    getActiveSession() {
        return this.sessions.find(s => s.id === this.currentSessionId);
    }

    getSession(id) {
        return this.sessions.find(s => s.id === id);
    }

    createNewSession(title = "New Conversation") {
        const newSession = {
            id: "sess_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
            title: title,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            messages: []
        };

        this.sessions.unshift(newSession);
        this.currentSessionId = newSession.id;
        this.saveSessions();
        this.saveActiveSessionId();
        this.renderSessionsList();
        this.renderActiveSessionMessages();
    }

    switchSession(sessionId) {
        if (this.isGenerating) return;
        this.currentSessionId = sessionId;
        this.saveActiveSessionId();
        this.renderSessionsList();
        this.renderActiveSessionMessages();
    }

    deleteSession(sessionId, event) {
        if (event) event.stopPropagation();
        if (this.sessions.length <= 1) {
            this.sessions = [];
            this.createNewSession("New Conversation");
            return;
        }

        this.sessions = this.sessions.filter(s => s.id !== sessionId);
        if (this.currentSessionId === sessionId) {
            this.currentSessionId = this.sessions[0].id;
            this.saveActiveSessionId();
        }

        this.saveSessions();
        this.renderSessionsList();
        this.renderActiveSessionMessages();
    }

    renameSession(sessionId, newTitle, event) {
        if (event) event.stopPropagation();
        const session = this.getSession(sessionId);
        if (session && newTitle.trim()) {
            session.title = newTitle.trim();
            session.updatedAt = Date.now();
            this.saveSessions();
            this.renderSessionsList();
            if (this.currentSessionId === sessionId && this.activeChatTitle) {
                this.activeChatTitle.textContent = session.title;
            }
        }
    }

    renderSessionsList() {
        if (!this.sessionsListEl) return;
        this.sessionsListEl.innerHTML = "";

        this.sessions.forEach((session) => {
            const isActive = session.id === this.currentSessionId;
            const item = document.createElement("div");
            item.className = `session-item ${isActive ? "active" : ""}`;
            item.setAttribute("data-session-id", session.id);

            const titleSpan = document.createElement("span");
            titleSpan.className = "session-title";
            titleSpan.textContent = session.title || "Conversation";

            const actionsDiv = document.createElement("div");
            actionsDiv.className = "session-actions";

            // Rename button
            const renameBtn = document.createElement("button");
            renameBtn.className = "session-action-btn";
            renameBtn.title = "Rename";
            renameBtn.innerHTML = `<i data-lucide="edit-3"></i>`;
            renameBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const updatedTitle = prompt("Enter conversation title:", session.title);
                if (updatedTitle) this.renameSession(session.id, updatedTitle, e);
            });

            // Delete button
            const delBtn = document.createElement("button");
            delBtn.className = "session-action-btn delete";
            delBtn.title = "Delete";
            delBtn.innerHTML = `<i data-lucide="trash"></i>`;
            delBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (confirm(`Delete "${session.title}"?`)) {
                    this.deleteSession(session.id, e);
                }
            });

            actionsDiv.appendChild(renameBtn);
            actionsDiv.appendChild(delBtn);

            item.appendChild(titleSpan);
            item.appendChild(actionsDiv);

            item.addEventListener("click", () => {
                this.switchSession(session.id);
                if (window.innerWidth <= 768 && this.sidebar) {
                    this.sidebar.classList.remove("open");
                    if (this.sidebarBackdrop) this.sidebarBackdrop.classList.remove("active");
                }
            });

            this.sessionsListEl.appendChild(item);
        });

        if (window.lucide && typeof lucide.createIcons === "function") {
            lucide.createIcons();
        }
    }

    // =========================================================================
    // CHAT MESSAGE RENDERING & ACTIONS
    // =========================================================================

    renderActiveSessionMessages() {
        if (!this.messagesContainer) return;
        this.messagesContainer.innerHTML = "";

        const session = this.getActiveSession();
        if (!session) return;

        if (this.activeChatTitle) {
            this.activeChatTitle.textContent = session.title || "New Conversation";
        }

        if (session.messages.length === 0) {
            this.renderEmptyState();
        } else {
            session.messages.forEach((msg, idx) => {
                this.renderMessageElement(msg, idx);
            });
            this.scrollToBottom();
        }
    }

    renderEmptyState() {
        const emptyState = document.createElement("div");
        emptyState.className = "tutor-empty-state";
        emptyState.innerHTML = `
            <div class="empty-state-icon">
                <i data-lucide="sparkles"></i>
            </div>
            <h2>ChatGPT Linear Algebra Tutor</h2>
            <p class="empty-state-subtitle">Your AI learning companion for Matrices, Vectors, Systems of Equations, Determinants, and Eigenvalues. Ask anything or choose a starting prompt below:</p>
            
            <div class="starter-cards-grid">
                <div class="starter-card" data-prompt="Explain Eigenvalues and Eigenvectors step by step with geometric intuition">
                    <div class="starter-card-icon"><i data-lucide="lightbulb"></i></div>
                    <h4>Concept & Intuition</h4>
                    <p>"Explain Eigenvalues and Eigenvectors using geometric intuition"</p>
                </div>
                <div class="starter-card" data-prompt="Find the inverse of [[1, 2], [3, 4]] with step-by-step Gauss-Jordan elimination">
                    <div class="starter-card-icon"><i data-lucide="calculator"></i></div>
                    <h4>Step-by-Step Solver</h4>
                    <p>"Find the inverse of a 2x2 matrix showing intermediate steps"</p>
                </div>
                <div class="starter-card" data-prompt="What is the difference between a vector space and a subspace?">
                    <div class="starter-card-icon"><i data-lucide="help-circle"></i></div>
                    <h4>Concept Comparison</h4>
                    <p>"What is the difference between a vector space and a subspace?"</p>
                </div>
                <div class="starter-card" data-prompt="Show Python NumPy code to compute matrix multiplication, determinant, and eigenvalues">
                    <div class="starter-card-icon"><i data-lucide="code"></i></div>
                    <h4>Python & NumPy</h4>
                    <p>"How to perform matrix operations and eigen-decomposition in Python"</p>
                </div>
            </div>
        `;

        emptyState.querySelectorAll(".starter-card").forEach(card => {
            card.addEventListener("click", () => {
                const prompt = card.getAttribute("data-prompt");
                if (prompt && this.inputField) {
                    this.inputField.value = prompt;
                    this.handleSendMessage();
                }
            });
        });

        this.messagesContainer.appendChild(emptyState);
        if (window.lucide && typeof lucide.createIcons === "function") {
            lucide.createIcons();
        }
    }

    renderMessageElement(msg, index) {
        const isUser = msg.role === "user";
        const row = document.createElement("div");
        row.className = `chat-message ${isUser ? "user-row" : "tutor-row"}`;
        row.setAttribute("data-msg-index", index);

        // Avatar
        const avatar = document.createElement("div");
        avatar.className = `chat-avatar ${isUser ? "user-avatar" : "tutor-avatar"}`;
        avatar.innerHTML = isUser 
            ? `<i data-lucide="user"></i>` 
            : `<i data-lucide="sparkles"></i>`;

        // Content
        const contentBox = document.createElement("div");
        contentBox.className = `chat-content ${isUser ? "user-content" : "tutor-content"}`;

        const textEl = document.createElement("div");
        textEl.className = "message-body";
        textEl.innerHTML = isUser ? this.escapeHtml(msg.text) : this.formatMarkdownToHtml(msg.text);
        contentBox.appendChild(textEl);

        // Actions toolbar for Tutor responses
        if (!isUser) {
            const actionsBar = document.createElement("div");
            actionsBar.className = "message-actions";

            // Copy Action
            const copyBtn = document.createElement("button");
            copyBtn.className = "msg-action-btn";
            copyBtn.title = "Copy response";
            copyBtn.innerHTML = `<i data-lucide="copy"></i> <span>Copy</span>`;
            copyBtn.addEventListener("click", () => this.copyToClipboard(msg.text, copyBtn));

            // Regenerate Action
            const regenBtn = document.createElement("button");
            regenBtn.className = "msg-action-btn";
            regenBtn.title = "Regenerate response";
            regenBtn.innerHTML = `<i data-lucide="rotate-cw"></i> <span>Regenerate</span>`;
            regenBtn.addEventListener("click", () => this.regenerateResponse(index));

            // Helpful feedback buttons
            const thumbsUp = document.createElement("button");
            thumbsUp.className = `msg-action-btn feedback ${msg.feedback === 'up' ? 'active' : ''}`;
            thumbsUp.title = "Helpful";
            thumbsUp.innerHTML = `<i data-lucide="thumbs-up"></i>`;
            thumbsUp.addEventListener("click", () => {
                msg.feedback = msg.feedback === 'up' ? null : 'up';
                this.saveSessions();
                this.renderActiveSessionMessages();
            });

            const thumbsDown = document.createElement("button");
            thumbsDown.className = `msg-action-btn feedback ${msg.feedback === 'down' ? 'active' : ''}`;
            thumbsDown.title = "Not helpful";
            thumbsDown.innerHTML = `<i data-lucide="thumbs-down"></i>`;
            thumbsDown.addEventListener("click", () => {
                msg.feedback = msg.feedback === 'down' ? null : 'down';
                this.saveSessions();
                this.renderActiveSessionMessages();
            });

            actionsBar.appendChild(copyBtn);
            actionsBar.appendChild(regenBtn);
            actionsBar.appendChild(thumbsUp);
            actionsBar.appendChild(thumbsDown);
            contentBox.appendChild(actionsBar);
        }

        row.appendChild(avatar);
        row.appendChild(contentBox);
        this.messagesContainer.appendChild(row);

        // Render KaTeX Math
        if (window.renderAllMath) {
            renderAllMath(textEl);
        } else if (window.renderMathInElement) {
            renderMathInElement(textEl, {
                delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "$", right: "$", display: false }
                ],
                throwOnError: false
            });
        }

        // Attach Code Copy Listeners
        textEl.querySelectorAll(".copy-code-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const codeBlock = btn.closest(".code-block-wrapper").querySelector("code");
                if (codeBlock) {
                    navigator.clipboard.writeText(codeBlock.innerText).then(() => {
                        const originalText = btn.innerHTML;
                        btn.innerHTML = `<i data-lucide="check"></i> Copied!`;
                        if (window.lucide) lucide.createIcons();
                        setTimeout(() => {
                            btn.innerHTML = originalText;
                            if (window.lucide) lucide.createIcons();
                        }, 2000);
                    });
                }
            });
        });

        if (window.lucide && typeof lucide.createIcons === "function") {
            lucide.createIcons();
        }
    }

    copyToClipboard(text, buttonEl) {
        navigator.clipboard.writeText(text).then(() => {
            const span = buttonEl.querySelector("span");
            const original = span ? span.textContent : "";
            if (span) span.textContent = "Copied!";
            buttonEl.classList.add("copied");
            setTimeout(() => {
                if (span) span.textContent = original;
                buttonEl.classList.remove("copied");
            }, 2000);
        }).catch(err => {
            console.error("Copy error:", err);
        });
    }

    scrollToBottom() {
        if (!this.messagesContainer) return;
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        requestAnimationFrame(() => {
            if (this.messagesContainer) {
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            }
        });

        setTimeout(() => {
            if (this.messagesContainer) {
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            }
        }, 120);
    }

    // =========================================================================
    // DYNAMIC AI GENERATION PIPELINE
    // =========================================================================

    async handleSendMessage() {
        if (this.isGenerating) return;
        const text = this.inputField.value.trim();
        if (!text) return;

        const session = this.getActiveSession();
        if (!session) return;

        // Auto title from first prompt
        if (session.messages.length === 0) {
            session.title = this.generateSessionTitle(text);
            this.saveSessions();
            this.renderSessionsList();
            if (this.activeChatTitle) this.activeChatTitle.textContent = session.title;
        }

        // Add user message to session
        session.messages.push({
            role: "user",
            text: text,
            timestamp: Date.now()
        });
        session.updatedAt = Date.now();
        this.saveSessions();

        // Clear input and adjust height
        this.inputField.value = "";
        this.inputField.style.height = "auto";

        // Render user message immediately
        this.renderActiveSessionMessages();

        // Set generating UI state
        this.setGeneratingState(true);

        try {
            const responseText = await this.generateAIResponse(session);

            // Append AI response
            session.messages.push({
                role: "model",
                text: responseText,
                timestamp: Date.now(),
                feedback: null
            });
            session.updatedAt = Date.now();
            this.saveSessions();

            this.setGeneratingState(false);
            this.renderActiveSessionMessages();
        } catch (err) {
            console.error("AI Generation Error:", err);
            this.setGeneratingState(false);

            session.messages.push({
                role: "model",
                text: "Sorry, I couldn't process that question right now. Please try again.",
                timestamp: Date.now(),
                feedback: null
            });
            session.updatedAt = Date.now();
            this.saveSessions();
            this.renderActiveSessionMessages();
        }
    }

    async regenerateResponse(msgIndex) {
        if (this.isGenerating) return;
        const session = this.getActiveSession();
        if (!session || msgIndex < 0 || msgIndex >= session.messages.length) return;

        // Remove starting from msgIndex
        session.messages.splice(msgIndex, session.messages.length - msgIndex);
        this.saveSessions();
        this.renderActiveSessionMessages();

        this.setGeneratingState(true);

        try {
            const responseText = await this.generateAIResponse(session);

            session.messages.push({
                role: "model",
                text: responseText,
                timestamp: Date.now(),
                feedback: null
            });
            session.updatedAt = Date.now();
            this.saveSessions();

            this.setGeneratingState(false);
            this.renderActiveSessionMessages();
        } catch (err) {
            this.setGeneratingState(false);
            session.messages.push({
                role: "model",
                text: "Sorry, I couldn't process that question right now. Please try again.",
                timestamp: Date.now(),
                feedback: null
            });
            this.saveSessions();
            this.renderActiveSessionMessages();
        }
    }

    setGeneratingState(isGenerating) {
        this.isGenerating = isGenerating;
        if (this.sendBtn) {
            this.sendBtn.disabled = isGenerating;
            this.sendBtn.innerHTML = isGenerating 
                ? `<div class="btn-spinner"></div>` 
                : `<i data-lucide="arrow-up"></i>`;
            if (window.lucide) lucide.createIcons();
        }

        if (isGenerating) {
            const typingRow = document.createElement("div");
            typingRow.className = "chat-message tutor-row typing-row";
            typingRow.id = "tutor-typing-indicator";
            typingRow.innerHTML = `
                <div class="chat-avatar tutor-avatar"><i data-lucide="sparkles"></i></div>
                <div class="chat-content tutor-content">
                    <div class="typing-bubble">
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                        <span class="typing-label">Solving & Verifying Step-by-Step...</span>
                    </div>
                </div>
            `;
            this.messagesContainer.appendChild(typingRow);
            this.scrollToBottom();
            if (window.lucide) lucide.createIcons();
        } else {
            const el = document.getElementById("tutor-typing-indicator");
            if (el) el.remove();
        }
    }

    generateSessionTitle(firstPrompt) {
        const clean = firstPrompt.replace(/[\n\r]/g, " ").trim();
        if (clean.length <= 32) return clean;
        return clean.substring(0, 30) + "...";
    }

    // =========================================================================
    // DYNAMIC AI MODEL API REQUEST
    // =========================================================================

    async generateAIResponse(session) {
        // 1. Try secure server backend endpoint (/api/chat) first
        try {
            const backendRes = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: session.messages,
                    apiKey: this.apiKey,
                    provider: this.apiProvider
                })
            });

            if (backendRes.ok) {
                const data = await backendRes.json();
                if (data && data.response) {
                    return data.response;
                }
            }
        } catch (backendErr) {
            // Backend endpoint not reachable (static file server); proceed to client API if key present
        }

        // 2. Direct client-side AI API request if user configured key in browser session
        if (this.apiKey) {
            const provider = this.detectProvider(this.apiKey, this.apiProvider);
            if (provider === "gemini") {
                return this.queryGeminiAPI(session);
            } else if (provider === "groq") {
                return this.queryGroqAPI(session);
            } else {
                return this.queryOpenAIAPI(session);
            }
        }

        throw new Error("AI service unavailable");
    }

    async queryGeminiAPI(session) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
        
        const contents = [];
        session.messages.forEach(msg => {
            contents.push({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.text }]
            });
        });

        while (contents.length > 0 && contents[0].role !== "user") {
            contents.shift();
        }

        const payload = {
            system_instruction: {
                parts: [{ text: SYSTEM_PROMPT }]
            },
            contents: contents,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2500
            }
        };

        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData?.error?.message || `Gemini API error (Status ${response.status})`);
        }

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) throw new Error("Empty response from Gemini API");
        return rawText;
    }

    async queryOpenAIAPI(session) {
        const endpoint = "https://api.openai.com/v1/chat/completions";
        const messages = [
            { role: "system", content: SYSTEM_PROMPT }
        ];

        session.messages.forEach(msg => {
            messages.push({
                role: msg.role === "user" ? "user" : "assistant",
                content: msg.text
            });
        });

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: messages,
                temperature: 0.7,
                max_tokens: 2500
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData?.error?.message || `OpenAI API error (Status ${response.status})`);
        }

        const data = await response.json();
        return data?.choices?.[0]?.message?.content || "No response generated.";
    }

    async queryGroqAPI(session) {
        const endpoint = "https://api.groq.com/openai/v1/chat/completions";
        const messages = [
            { role: "system", content: SYSTEM_PROMPT }
        ];

        session.messages.forEach(msg => {
            messages.push({
                role: msg.role === "user" ? "user" : "assistant",
                content: msg.text
            });
        });

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: messages,
                temperature: 0.7,
                max_tokens: 2500
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData?.error?.message || `Groq API error (Status ${response.status})`);
        }

        const data = await response.json();
        return data?.choices?.[0]?.message?.content || "No response generated.";
    }

    // =========================================================================
    // MARKDOWN & HTML FORMATTING
    // =========================================================================

    escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    formatMarkdownToHtml(text) {
        if (!text) return "";

        let html = text;

        // 1. Code blocks (```python ... ```)
        html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang.trim() || "text";
            return `
                <div class="code-block-wrapper">
                    <div class="code-header">
                        <span class="code-lang">${language}</span>
                        <button class="copy-code-btn" type="button"><i data-lucide="copy"></i> Copy Code</button>
                    </div>
                    <pre><code class="language-${language}">${this.escapeHtml(code.trim())}</code></pre>
                </div>
            `;
        });

        // 2. Inline code (`code`)
        html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

        // 3. Tables (| Col 1 | Col 2 | ...)
        html = html.replace(/^\|(.+)\|\r?\n\|[-:\s|]+\|\r?\n((?:\|.+\|\r?\n?)+)/gm, (match, header, body) => {
            const headers = header.split('|').filter(c => c.trim().length > 0).map(c => `<th>${c.trim()}</th>`).join('');
            const rows = body.trim().split('\n').map(row => {
                const cells = row.split('|').filter(c => c.trim().length > 0).map(c => `<td>${c.trim()}</td>`).join('');
                return `<tr>${cells}</tr>`;
            }).join('');
            return `<div class="table-responsive"><table class="tutor-table"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
        });

        // 4. Headers
        html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // 5. Bold & Italic
        html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // 6. Blockquotes (> ...)
        html = html.replace(/^\> (.*$)/gim, '<blockquote class="tutor-quote">$1</blockquote>');

        // 7. Horizontal rules (---)
        html = html.replace(/^---$/gim, '<hr class="tutor-divider">');

        // 8. Bullet points & Lists
        html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
        html = html.replace(/<\/ul>\s*<ul>/g, '');

        // 9. Numbered lists (1. ...)
        html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="num-item">$1</li>');

        // 10. Paragraph linebreaks
        html = html.replace(/\n\n/g, '<p></p>');

        return html;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.algebrifyTutor = new AlgebrifyAITutor();
});
