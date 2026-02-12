document.addEventListener('DOMContentLoaded', () => {

    /* --- Chatbot Logic & Configuration --- */

    // Knowledge Base (Simple Keyword Matching)
    // Structure: { keywords: ['word1', 'word2'], response: "Text response" }
    const knowledgeBase = [
        {
            keywords: ['hello', 'hi', 'hey', 'start', 'greet'],
            response: "Hello! I'm the Intentio Assistant. How can I help you learn about our bone biopsy device today?"
        },
        {
            keywords: ['founder', 'who created', 'abhijeet', 'salunke', 'krupa', 'raghavendra', 'kaushal', 'team'],
            response: "Our Core Team:<br><strong>Dr. Abhijeet Salunke (Founder):</strong> Orthopedic Onco Surgeon with fellowships at NUH Singapore, MSKCC USA, and TMH Mumbai. 100+ published articles.<br><strong>Dr. Krupa Shah (Co-Founder):</strong> PhD from IIT Gandhinagar, expert in electrical engineering and diagnostics.<br><strong>Dr. Raghavendra Bhalerao (Co-Founder):</strong> PhD from IIT Bombay, expert in Spatial Information Technology.<br><strong>Mr. Kaushal Panchal (Partner):</strong> Owner of Autus Healthcare with 15+ years in orthopaedic implants."
        },
        {
            keywords: ['what is', 'device', 'product', 'i-bone', 'ibone', 'machine', 'biopsy device'],
            response: "The <strong>I-Bone Biopsy Device</strong> is an intelligent, automated bone drill and biopsy system. It is designed to perform precise bone marrow specimen collection with a single attempt, reducing patient pain and morbidity while ensuring high-quality tissue yield for diagnosis."
        },
        {
            keywords: ['problem', 'limitation', 'current', 'issue', 'challenge', 'pain', 'fracture'],
            response: "<strong>Current System Limitations:</strong><br>• Significant manual effort involved.<br>• Risk of complications: fractures, tumor contamination, bleeding, infection.<br>• It is a painful and complex procedure.<br>• High dependency on surgeon's manual control."
        },
        {
            keywords: ['solution', 'benefit', 'advantage', 'feature', 'why use'],
            response: "<strong>Our Solution (I-Bone Biopsy):</strong><br>• Controlled forward motion and rotation.<br>• Feedback mechanism for force and current.<br>• Automatic stopping upon cortical breach.<br>• Accurate and high yield of specimen in a single attempt.<br>• Reduced patient pain and higher safety."
        },
        {
            keywords: ['patent', 'ip', 'intellectual property', 'granted'],
            response: "We have several granted patents, including the I-Bone Biopsy Device itself. Innovations include designs for Scapula, Metacarpel, and Metaphyseal implants. Our device offers a novel and non-obvious solution."
        },
        {
            keywords: ['contact', 'email', 'phone', 'address', 'location', 'reach'],
            response: "<strong>INTENTIO BIOPSY DEVICE PRIVATE LIMITED</strong><br>210-212, Vrajbhumi Complex, B/h Shilp Bldg, Nr. Tele Exchange, Navrangpura, Ahmedabad-380009, Gujarat.<br>Email: intentiobiosy@gmail.com"
        },
        {
            keywords: ['award', 'grant', 'funding', 'money', 'zydus', 'ssip'],
            response: "<strong>Awards & Grants:</strong><br>🏆 Zydus Innovation Award 2025<br>🏆 SSIP 2.0 IITRAM Cell Grant<br>🏆 Ihub S4 Grant<br>Supported by BIRAC SEED Fund, Start-Up India Seed Fund, NIDHI-SSS."
        },
        {
            keywords: ['news', 'newspaper', 'article', 'media', 'coverage', 'toi', 'zee'],
            response: "You can read about us in the news here: <br><a href='https://timesofindia.indiatimes.com/city/ahmedabad/bone-biopsy-device-to-reduce-damage-to-bone-tissue/articleshow/99003170.cms' target='_blank'>Times of India</a><br><a href='https://tv9gujarati.com/gujarat/ahmedabad/ahmedabad-doctors-from-gujarat-cancer-research-institute-developed-an-intelligent-biopsy-gun-with-the-help-of-engineers-from-iitram-755250.html' target='_blank'>TV9 Gujarati</a>"
        },
        {
            keywords: ['students', 'intern', 'henel', 'dimpi', 'harsh', 'tanisha'],
            response: "<strong>Student Contributors:</strong> Heneel Makwana, Dimpi Gandhi, Harsh Patel, Tanisha."
        },
        {
            keywords: ['director', 'board', 'manisha', 'rajendra', 'prajkta'],
            response: "<strong>Board of Directors:</strong> Dr. (Ms.) Manisha Abhijeet Salunke, Shri. Rajendra Pradyumna Shah, Ms. Prajkta R. Bhalerao."
        },
        {
            keywords: ['extended', 'nandlal', 'hardik', 'dhruv'],
            response: "<strong>Extended Team:</strong> Dr. Nandlal Bharwani, Mr. Hardik Sharma, Dr. Dhruv Patel."
        }
    ];

    // Fallback response for unknown queries
    const defaultResponse = "I'm not exactly sure about that, but I can tell you about our Team, the Device features, or our Patents. What would you like to know?";

    /* --- UI Creation --- */
    const createChatWidget = () => {
        // Create Container
        const container = document.createElement('div');
        container.id = 'chat-widget-container';

        // Create Toggle Button
        const btn = document.createElement('button');
        btn.id = 'chat-toggle-btn';
        btn.innerHTML = `
            <svg class="chat-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path></svg>
            <svg class="close-icon" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
        `;

        // Create Chat Window
        const windowDiv = document.createElement('div');
        windowDiv.id = 'chat-window';
        windowDiv.innerHTML = `
            <div class="chat-header">
                <div class="bot-avatar">🩺</div>
                <div class="chat-header-info">
                    <h3>Intentio Assistant</h3>
                    <p>Ask anything about our device</p>
                </div>
            </div>
            <div id="chat-messages">
                <div class="message bot-message">
                    Hi there! 👋 I am the Intentio Assistant. I can only answer questions related to this website and the I-Bone Biopsy Device. How can I help you?
                </div>
            </div>
            <div class="chat-input-area">
                <input type="text" id="chat-input" placeholder="Type a question...">
                <button id="chat-send-btn">
                    <svg style="width: 24px; height: 24px; fill: currentColor;" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
                </button>
            </div>
        `;

        // Append to DOM
        container.appendChild(windowDiv); // Window first (so it pops up 'above' button visually if using flex column-reverse, but we use absolute or fixed positioning usually. Here flex column is used, so window needs to be first in DOM if flex-direction is column-reverse, OR handle via order. Let's stick to standard flow: Window on top of Button visually means Window is first in DOM if using column-reverse or just verify CSS) 
        // Actually CSS: flex-direction: column; aligns items top to bottom.
        // We want Window TOP, Button BOTTOM.
        // So Window first, then Button.

        container.appendChild(btn);
        document.body.appendChild(container);

        /* --- Event Listeners --- */
        const chatWindow = document.getElementById('chat-window');
        const input = document.getElementById('chat-input');
        const messages = document.getElementById('chat-messages');
        const sendBtn = document.getElementById('chat-send-btn');

        // Toggle Open/Close
        btn.addEventListener('click', () => {
            const isOpen = chatWindow.classList.contains('active');
            if (isOpen) {
                chatWindow.classList.remove('active');
                btn.classList.remove('open');
            } else {
                chatWindow.classList.add('active');
                btn.classList.add('open');
                setTimeout(() => input.focus(), 100); // Focus input on open
            }
        });

        // Send Message Logic
        const sendMessage = () => {
            const text = input.value.trim();
            if (!text) return;

            // Add User Message
            addMessage(text, 'user');
            input.value = '';

            // Simulate Typing Delay
            messages.scrollTop = messages.scrollHeight;

            setTimeout(() => {
                const response = getBotResponse(text);
                addMessage(response, 'bot');
            }, 600);
        };

        const addMessage = (text, sender) => {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
            msgDiv.innerHTML = text;
            messages.appendChild(msgDiv);
            messages.scrollTop = messages.scrollHeight;
        };

        // NLP / Keyword Matching
        const getBotResponse = (input) => {
            const lowerInput = input.toLowerCase();

            // Special Command: Navigation
            if (lowerInput.includes('show') || lowerInput.includes('go to') || lowerInput.includes('take me to') || lowerInput.includes('see')) {
                const autoClose = () => {
                    setTimeout(() => {
                        const chatWindow = document.getElementById('chat-window');
                        const btn = document.getElementById('chat-toggle-btn');
                        if (chatWindow && btn) {
                            chatWindow.classList.remove('active');
                            btn.classList.remove('open');
                        }
                    }, 2500);
                };

                if (lowerInput.includes('media') || lowerInput.includes('video')) {
                    document.getElementById('media').scrollIntoView({ behavior: 'smooth' });
                    autoClose();
                    return "Here is our Media Coverage section! 📺";
                }
                if (lowerInput.includes('ip') || lowerInput.includes('granted') || lowerInput.includes('patent')) {
                    document.getElementById('avenues').scrollIntoView({ behavior: 'smooth' });
                    autoClose();
                    return "Here is our Granted Intellectual Property! 📜";
                }
                if (lowerInput.includes('team') || lowerInput.includes('founder')) {
                    document.getElementById('team').scrollIntoView({ behavior: 'smooth' });
                    autoClose();
                    return "Meet our Core Team! 👨‍⚕️";
                }
                if (lowerInput.includes('contact') || lowerInput.includes('email')) {
                    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                    autoClose();
                    return "Here's how you can reach us! 📧";
                }
                if (lowerInput.includes('product') || lowerInput.includes('device')) {
                    document.getElementById('product').scrollIntoView({ behavior: 'smooth' });
                    autoClose();
                    return "Here is our I-Bone Biopsy Device! 🩺";
                }
                if (lowerInput.includes('awards') || lowerInput.includes('grant') || lowerInput.includes('funding')) {
                    document.getElementById('awards').scrollIntoView({ behavior: 'smooth' });
                    autoClose();
                    return "We are proud of our Awards and Grants! 🏆";
                }
                if (lowerInput.includes('about') || lowerInput.includes('story') || lowerInput.includes('company')) {
                    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
                    autoClose();
                    return "Here is our story and mission! 🏥";
                }
                if (lowerInput.includes('i-bone') || lowerInput.includes('ibone') || lowerInput.includes('biopsy')) {
                    document.getElementById('ibone-biopsy').scrollIntoView({ behavior: 'smooth' });
                    autoClose();
                    return "Learn more about the I-Bone Biopsy procedure! 🦴";
                }
            }
            if (lowerInput.includes('dark mode') || lowerInput.includes('night mode') || lowerInput.includes('change theme')) {
                const body = document.body;
                body.classList.toggle('dark-mode');

                const isDark = body.classList.contains('dark-mode');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');

                // Update icon if necessary (though CSS handles rotation)
                // We let style.css handle the visual toggle of the button via body class

                return isDark ? "I've switched to Dark Mode for you! 🌙" : "I've switched to Light Mode! ☀️";
            }

            // Check for match in Knowledge Base
            for (const item of knowledgeBase) {
                if (item.keywords.some(keyword => lowerInput.includes(keyword))) {
                    return item.response;
                }
            }

            // Intelligent Fallback: Check page content for specific nouns?
            // Advanced: If query contains "about", return summary of #about section
            if (lowerInput.includes('about')) return document.querySelector('#about .glass-panel p').innerText.substring(0, 150) + "...";

            return defaultResponse;
        };

        // Bind Enter Key
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        sendBtn.addEventListener('click', sendMessage);

        // Auto-Hide on Click Outside
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target) && chatWindow.classList.contains('active')) {
                chatWindow.classList.remove('active');
                btn.classList.remove('open');
            }
        });
    };

    // Initialize
    createChatWidget();
});
