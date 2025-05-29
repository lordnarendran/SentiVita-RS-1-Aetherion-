document.addEventListener('DOMContentLoaded', () => {
  
  // Hide the loader and show the main content after loading
window.addEventListener('load', function() {
    setTimeout(function() {
        const loader = document.getElementById('neuro-loader');
        const mainContent = document.getElementById('main-content');
        
        if (loader) {
            loader.style.opacity = '0';
            loader.style.pointerEvents = 'none'; // Make sure it's not clickable
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500); // Wait for the fade-out to complete
        }
        
        if (mainContent) {
            mainContent.style.opacity = '1';
        }
    }, 3000); // Adjust this time to match your loading animation duration
});

    //----------------- Video Intro Initialization -------------------
    const videoContainer = document.getElementById('video-container');
    const introVideo = document.getElementById('intro-video');
    const mainContent = document.getElementById('main-content');
    const affirmationBox = document.getElementById('affirmationBox'); // Get the affirmation box element
  

    // Check if the intro video element exists
    if (introVideo) {
        // Start loading the video.
        introVideo.addEventListener('ended', function () {
            videoContainer.style.display = 'none';
            mainContent.style.display = 'flex'; // Use flex for proper layout
        });

        introVideo.addEventListener('error', function () {
            console.warn("The video failed to load.");
            videoContainer.style.display = 'none'; // Hide the video container
            mainContent.style.display = 'flex';   // Show main content
        });

        setTimeout(() => {
            videoContainer.style.display = 'none';
            mainContent.style.display = 'flex'; // Show the main content based on timeout
        }, 12000); // Adjust time as necessary (e.g., 12 seconds)
    }

    //----------------- Status Dot Animation -------------------
    const statusDot = document.getElementById('statusDot');
    function changeStatusDot() {
        if (statusDot) {
            statusDot.classList.toggle('active');
        }
    }
    setInterval(changeStatusDot, 1500);

    //----------------- Heartrate Animation -------------------
    const heartrateCanvas = document.getElementById('heartrateCanvas');
    const ctx = heartrateCanvas.getContext('2d');
    let time = 0;

    function drawHeartrate() {
        ctx.clearRect(0, 0, heartrateCanvas.width, heartrateCanvas.height);
        ctx.strokeStyle = '#00ff9d';
        ctx.lineWidth = 2;

        ctx.beginPath();
        const amplitude = 20;
        const frequency = 0.05;
        const verticalOffset = heartrateCanvas.height / 2;

        for (let i = 0; i < heartrateCanvas.width; i++) {
            const x = i;
            const y = amplitude * Math.sin(frequency * i + time) + verticalOffset;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        time += 0.1;
        requestAnimationFrame(drawHeartrate);
    }

    function resizeCanvas() {
        heartrateCanvas.width = heartrateCanvas.parentElement.clientWidth;
        drawHeartrate();
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    //----------------- Button Interactions -------------------
    const sidebarButtons = document.querySelectorAll('.sidebar-button');
    sidebarButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            console.log(`Sidebar button clicked: ${action}`);

            if (action === "register") {
                openRegistrationInterface();
            } else if (action === "authenticate") {
                openAuthenticationInterface();
            } else if (action === "ambulance") {
                openGoogleMaps("ambulance");
            } else if (action === "clinic") {
                openGoogleMaps("clinic");
            } else if (action === "news") {
                openLiveMedicalNews(); 
            } else if (action === "cognitive") {
                openMemoryMatchGame(); 
            }
        });
    });
  
  
  
function openLiveMedicalNews() {
    // Create the news modal container
    const newsModal = document.createElement('div');
    newsModal.id = 'live-medical-news';
    newsModal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        width: 90vw;
        max-width: 900px; /* Slightly wider for better layout */
        max-height: 85vh; /* Slightly taller */
        background: linear-gradient(135deg, rgba(9, 13, 31, 0.97), rgba(20, 25, 50, 0.97)); /* More opaque background */
        border-radius: 20px; /* More rounded corners */
        border: 2px solid #00ff9d;
        box-shadow: 0 0 40px #00ff9d90, inset 0 0 15px #00ff9d40; /* Stronger shadow */
        padding: 30px; /* More padding */
        z-index: 1000;
        display: flex;
        flex-direction: column;
        overflow: hidden; /* Manage scroll internally */
        backdrop-filter: blur(12px); /* Stronger blur */
        opacity: 0;
        transition: all 0.4s ease; /* Slightly slower transition */
        color: #ffffff;
        font-family: 'Orbitron', sans-serif; /* Futuristic font */
    `;

    // Modal content - Removed the source toggle buttons
    newsModal.innerHTML = `
        <div class="news-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #00ff9d50;">
            <h2 style="margin: 0; font-size: 2em; color: #00ff9d; text-shadow: 0 0 12px #00ff9d;">USA Health News Feed</h2> <!-- Changed title -->

            <button id="close-news" style="background: none; border: none; color: #00ff9d; font-size: 2em; cursor: pointer; text-shadow: 0 0 8px #00ff9d;">×</button>
        </div>

        <div id="news-content" style="flex: 1; overflow-y: auto; padding-right: 10px; /* Add padding for scrollbar */">
            <!-- News articles will be loaded here -->
             <div style="text-align: center; color: #ccc; margin-top: 50px;">Loading news...</div>
        </div>
    `;

    // Append to body
    document.body.appendChild(newsModal);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        /* Add Orbitron font link if not already in your HTML head */
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap');

        #live-medical-news::-webkit-scrollbar {
            width: 8px;
        }
        #live-medical-news::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
        }
        #live-medical-news::-webkit-scrollbar-thumb {
            background: #00ff9d;
            border-radius: 10px;
            box-shadow: 0 0 10px #00ff9d80;
        }

         #news-content::-webkit-scrollbar {
            width: 8px;
        }
        #news-content::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 10px;
        }
        #news-content::-webkit-scrollbar-thumb {
            background: #00ff9d60; /* Semi-transparent */
            border-radius: 10px;
            box-shadow: 0 0 8px #00ff9d40;
        }
         #news-content::-webkit-scrollbar-thumb:hover {
             background: #00ff9d;
         }


        .news-entry {
            margin-bottom: 25px; /* More space between entries */
            padding: 20px; /* More padding */
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px; /* Slightly more rounded */
            border: 1px solid #00ff9d30;
            transition: all 0.3s ease;
            position: relative; /* For pseudo-element glow */
            overflow: hidden; /* Hide pseudo-element overflow */
        }
         .news-entry::before {
             content: '';
             position: absolute;
             top: 0;
             left: 0;
             width: 100%;
             height: 100%;
             background: radial-gradient(circle, #00ff9d50 0%, transparent 60%);
             opacity: 0;
             transition: opacity 0.5s ease;
             pointer-events: none;
             transform: scale(2);
         }
        .news-entry:hover {
            transform: translateY(-5px); /* More pronounced lift */
            box-shadow: 0 8px 20px #00ff9d40; /* Stronger shadow */
            border-color: #00ff9d70; /* More prominent border */
        }
         .news-entry:hover::before {
             opacity: 0.1;
         }


        .news-title {
            font-size: 1.2em; /* Larger title */
            font-weight: bold;
            color: #00ff9d;
            margin-bottom: 8px; /* More space */
            text-shadow: 0 0 8px #00ff9d60;
        }
        .news-date {
            font-size: 0.9em; /* Slightly larger date */
            color: #aaaaaa;
            margin-bottom: 12px; /* More space */
        }
        .news-summary {
            font-size: 1em; /* Larger summary text */
            color: #cccccc;
            line-height: 1.6; /* More readable line height */
        }
         .news-summary a {
             color: #00bfff; /* Link color */
             text-decoration: none;
             transition: color 0.3s ease;
         }
        .news-summary a:hover {
            color: #00ff9d;
            text-decoration: underline;
        }

        #close-news:hover {
            color: #ff3333; /* Redder on hover */
            text-shadow: 0 0 8px #ff333380; /* Stronger red shadow */
        }

        /* Removed source-button styles as the buttons are gone */

        @keyframes neonPulse {
            0% { box-shadow: 0 0 20px #00ff9d80, inset 0 0 10px #00ff9d30; }
            50% { box-shadow: 0 0 40px #00ff9d90, inset 0 0 15px #00ff9d40; }
            100% { box-shadow: 0 0 20px #00ff9d80, inset 0 0 10px #00ff9d30; }
        }
        #live-medical-news {
            animation: neonPulse 2s infinite ease-in-out; /* Smoother pulse */
        }
    `;
    document.head.appendChild(style);

    // Animate modal appearance
    setTimeout(() => {
        newsModal.style.opacity = '1';
        newsModal.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);

    // Close button functionality
    newsModal.querySelector('#close-news').addEventListener('click', () => {
        newsModal.style.opacity = '0';
        newsModal.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(newsModal);
            const dynamicStyle = document.head.querySelector('style'); // Find the dynamically added style
            if (dynamicStyle) {
                 document.head.removeChild(dynamicStyle); // Remove it
            }
        }, 400); // Match transition duration
    });

    const newsContentDiv = newsModal.querySelector('#news-content');
    // Removed sourceButtons variable and event listeners

    // Store fetched news data - Only need USA news now
    let usaNews = [];

    // Function to fetch and parse RSS feed (simplified)
    const fetchNews = async (url, sourceName) => {
        try {
            console.log(`Attempting to fetch news from ${sourceName} at: ${url}`);
            const response = await fetch(url);

            if (!response.ok) {
                 console.error(`HTTP error fetching ${sourceName}: ${response.status} ${response.statusText}`);
                 if (response.status === 0) {
                     throw new Error(`Network or CORS error fetching ${sourceName}. Cannot access external feed directly.`);
                 }
                 throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.text();
            console.log(`Successfully fetched data for ${sourceName}. Parsing...`);

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "application/xml");

             if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
                 console.error(`Parsing error for ${sourceName} feed.`);
                 const parserErrors = xmlDoc.getElementsByTagName("parsererror");
                 let errorText = '';
                 for (let i = 0; i < parserErrors.length; i++) {
                     errorText += parserErrors[i].textContent + '\n';
                 }
                 console.error("Parser Error Details:", errorText);
                 throw new Error(`Error parsing XML for ${sourceName}. Feed might be invalid or not standard RSS.`);
             }


            const items = xmlDoc.getElementsByTagName("item");
            const newsItems = [];

            if (items.length === 0) {
                console.warn(`No <item> elements found in the ${sourceName} RSS feed.`);
                return []; // Return empty array if no items
            }

            for (let i = 0; i < items.length; i++) {
                const titleElement = items[i].getElementsByTagName("title")[0];
                const pubDateElement = items[i].getElementsByTagName("pubDate")[0];
                const summaryElement = items[i].getElementsByTagName("description")[0];
                const linkElement = items[i].getElementsByTagName("link")[0]; // Get link

                const title = titleElement ? titleElement.textContent : 'No title';
                let pubDate = 'No date';
                if (pubDateElement && pubDateElement.textContent) {
                    try {
                         pubDate = new Date(pubDateElement.textContent).toLocaleString('en-US', {
                             year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                         });
                    } catch (e) {
                         console.warn(`Could not parse date for item ${i} from ${sourceName}: ${pubDateElement.textContent}`, e);
                         pubDate = `Invalid Date: ${pubDateElement.textContent}`;
                    }
                }

                let summary = summaryElement ? summaryElement.textContent : 'No summary';
                 summary = summary.replace(/<[^>]*>/g, ''); // Remove HTML tags

                const link = linkElement ? linkElement.textContent : '#'; // Get link URL

                newsItems.push({ title, pubDate, summary, link });
            }
            console.log(`Successfully parsed ${newsItems.length} articles from ${sourceName}`);
            return newsItems;
        } catch (error) {
            console.error(`Detailed error fetching/parsing news from ${sourceName}:`, error);
            return { error: true, message: `Could not load news for ${sourceName}: ${error.message}` };
        }
    };

    // Function to render news (simplified for only USA)
    const renderNews = (newsToDisplay) => {
        newsContentDiv.innerHTML = ''; // Clear current news

        if (newsToDisplay && newsToDisplay.error) {
             newsContentDiv.innerHTML = `<p style="text-align: center; color: #ff5555; margin-top: 50px;">${newsToDisplay.message}</p>`;
             return;
        }

        if (!newsToDisplay || newsToDisplay.length === 0) {
             newsContentDiv.innerHTML = `<p style="text-align: center; color: #ff5555; margin-top: 50px;">Failed to load USA health news or no articles available.</p>`;
            return;
        }

        // Display up to 10 news articles
        for (let i = 0; i < newsToDisplay.length && i < 10; i++) {
            const article = newsToDisplay[i];
            newsContentDiv.innerHTML += `
                <div class="news-entry">
                    <div class="news-title">${article.title}</div>
                    <div class="news-date">${article.pubDate}</div>
                    <div class="news-summary">${article.summary} <a href="${article.link}" target="_blank" style="color: #00bfff;">Read more</a></div>
                </div>
            `;
        }
    };

    // Initial fetch for USA news only
    const fetchUSANews = async () => {
         newsContentDiv.innerHTML = `<div style="text-align: center; color: #ccc; margin-top: 50px;">Loading news...</div>`; // Show loading

        usaNews = await fetchNews("https://rss.nytimes.com/services/xml/rss/nyt/Health.xml", "USA");

        if (usaNews && usaNews.error) {
             console.error("USA news critical failure:", usaNews.message);
             // Pass the error object to renderNews
             renderNews(usaNews);
        } else if (usaNews.length === 0) {
             // Create a message if the fetch succeeded but returned no items
             renderNews([{
                 title: "No Recent USA Health News Found",
                 pubDate: new Date().toLocaleString(),
                 summary: "The USA health feed is active, but no recent articles were found.",
                 link: "#"
             }]);
        }
        else {
             // Render the fetched USA news
             renderNews(usaNews);
        }
    };

    // Start fetching USA news when the modal opens
    fetchUSANews();

     // Add Orbitron font link if not already in your HTML head
    if (!document.head.querySelector('link[href*="Orbitron"]')) {
        const orbitronLink = document.createElement('link');
        orbitronLink.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap";
        orbitronLink.rel = "stylesheet";
        document.head.appendChild(orbitronLink);
    }
}

// Helper function to adjust color (kept for completeness, not used in this version)
function adjustColor(color, amount) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const adjust = (val) => Math.min(255, Math.max(0, val + amount));
    const toHex = (val) => {
        const hex = adjust(val).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + toHex(r) + toHex(g) + toHex(b);
}

// You would call openLiveMedicalNews() from a button or link in your main HTML
// <button onclick="openLiveMedicalNews()">Live Medical News</button>
  
  
  
// Global object to store user information (for demonstration purposes)
// In a real application, this would come from the backend after authentication
const registeredUsers = {}; // Format: { role: { username: { registrationTime: '...', lastLoginTime: '...' } } }

function openRegistrationInterface() {
    // ... (rest of the function remains the same)
    const regInterface = document.createElement('div');
    regInterface.id = 'registration-interface';
    regInterface.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(26, 34, 56, 0.95);
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 0 25px rgba(0, 255, 157, 0.6);
        z-index: 1000;
        backdrop-filter: blur(10px);
        border: 1px solid #00ff9d;
        width: 500px;
        max-width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        transition: all 0.3s ease;
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
    `;

    regInterface.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h3 style="color: #00ff9d; margin: 0; text-shadow: 0 0 10px #00ff9d;">Register Yourself</h3>
            <p style="color: #ccc; margin-top: 5px;">Select your role to continue</p>
        </div>

        <div class="role-selection" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0;">
            <div class="role-option" data-role="doctor" style="background: rgba(0, 255, 157, 0.1); border: 1px solid #00ff9d; border-radius: 10px; padding: 15px; text-align: center; cursor: pointer; transition: all 0.3s ease;">
                <div style="font-size: 2em;">👨‍⚕️</div>
                <h4 style="color: #00ff9d; margin: 10px 0 5px;">Doctor</h4>
                <p style="color: #aaa; font-size: 0.9em;">Medical professionals</p>
            </div>

            <div class="role-option" data-role="patient" style="background: rgba(0, 191, 255, 0.1); border: 1px solid #00bfff; border-radius: 10px; padding: 15px; text-align: center; cursor: pointer; transition: all 0.3s ease;">
                <div style="font-size: 2em;">🧑‍🦰</div>
                <h4 style="color: #00bfff; margin: 10px 0 5px;">Patient</h4>
                <p style="color: #aaa; font-size: 0.9em;">Healthcare recipients</p>
            </div>

            <div class="role-option" data-role="receptionist" style="background: rgba(255, 0, 255, 0.1); border: 1px solid #ff00ff; border-radius: 10px; padding: 15px; text-align: center; cursor: pointer; transition: all 0.3s ease;">
                <div style="font-size: 2em;">💁‍♀️</div>
                <h4 style="color: #ff00ff; margin: 10px 0 5px;">Receptionist</h4>
                <p style="color: #aaa; font-size: 0.9em;">Front desk staff</p>
            </div>

            <div class="role-option" data-role="pharmacist" style="background: rgba(255, 204, 0, 0.1); border: 1px solid #ffcc00; border-radius: 10px; padding: 15px; text-align: center; cursor: pointer; transition: all 0.3s ease;">
                <div style="font-size: 2em;">💊</div>
                <h4 style="color: #ffcc00; margin: 10px 0 5px;">Pharmacist</h4>
                <p style="color: #aaa; font-size: 0.9em;">Medication specialists</p>
            </div>
        </div>

        <button class="close-button" style="position: absolute; top: 10px; right: 10px; background: none; border: none; color: #00ff9d; font-size: 1.5em; cursor: pointer;">×</button>
    `;

    document.body.appendChild(regInterface);

    const style = document.createElement('style');
    style.textContent = `
        @keyframes neonPulse {
            0% { box-shadow: 0 0 5px rgba(0, 255, 157, 0.5); }
            50% { box-shadow: 0 0 20px rgba(0, 255, 157, 0.9); }
            100% { box-shadow: 0 0 5px rgba(0, 255, 157, 0.5); }
        }
        .role-option:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 5px 15px rgba(0, 255, 157, 0.3);
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        regInterface.style.opacity = '1';
        regInterface.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);

    regInterface.querySelector('.close-button').addEventListener('click', () => {
        regInterface.style.opacity = '0';
        regInterface.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(regInterface);
            document.head.removeChild(style);
        }, 300);
    });

    const roleOptions = regInterface.querySelectorAll('.role-option');
    roleOptions.forEach(option => {
        option.addEventListener('click', () => {
            const role = option.dataset.role;
            openRegistrationForm(role);
            document.body.removeChild(regInterface);
            document.head.removeChild(style);
        });
    });
}

function openRegistrationForm(role) {
    // ... (rest of the function remains the same)
    const formInterface = document.createElement('div');
    formInterface.id = 'registration-form';
    formInterface.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(26, 34, 56, 0.95);
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 0 25px rgba(0, 255, 157, 0.6);
        z-index: 1000;
        backdrop-filter: blur(10px);
        border: 1px solid #00ff9d;
        width: 450px;
        max-width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        transition: all 0.3s ease;
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
    `;

    let roleDisplay = '';
    switch(role) {
        case 'doctor': roleDisplay = 'Doctor'; break;
        case 'patient': roleDisplay = 'Patient'; break;
        case 'receptionist': roleDisplay = 'Receptionist'; break;
        case 'pharmacist': roleDisplay = 'Pharmacist'; break;
    }

    formInterface.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h3 style="color: #00ff9d; margin: 0; text-shadow: 0 0 10px #00ff9d;">Register as ${roleDisplay}</h3>
            <p style="color: #ccc; margin-top: 5px;">Enter your username</p>
        </div>

        <div class="form-group" style="margin-bottom: 20px;">
            <label for="username" style="display: block; margin-bottom: 8px; color: #00ff9d;">Username</label>
            <input type="text" id="username" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.3); border: 1px solid #00ff9d; border-radius: 5px; color: white; outline: none;">
            <div class="input-underline" style="height: 2px; background: #00ff9d; width: 0; transition: width 0.3s ease;"></div>
        </div>

        <button id="register-btn" style="width: 100%; padding: 12px; background: linear-gradient(45deg, #00ff9d, #00bfff); border: none; border-radius: 25px; color: #131836; font-weight: bold; cursor: pointer; transition: all 0.3s ease; margin-top: 10px;">
            Proceed to Face Registration
        </button>

        <button class="close-button" style="position: absolute; top: 10px; right: 10px; background: none; border: none; color: #00ff9d; font-size: 1.5em; cursor: pointer;">×</button>
    `;

    document.body.appendChild(formInterface);

    setTimeout(() => {
        formInterface.style.opacity = '1';
        formInterface.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);

    const inputs = formInterface.querySelectorAll('input');
    inputs.forEach(input => {
        const underline = input.nextElementSibling;

        input.addEventListener('focus', () => {
            underline.style.width = '100%';
            input.style.borderColor = '#00ff9d';
            input.style.boxShadow = '0 0 10px rgba(0, 255, 157, 0.3)';
        });

        input.addEventListener('blur', () => {
            underline.style.width = '0';
            input.style.borderColor = '#00ff9d';
            input.style.boxShadow = 'none';
        });
    });

    formInterface.querySelector('.close-button').addEventListener('click', () => {
        formInterface.style.opacity = '0';
        formInterface.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(formInterface);
        }, 300);
    });

    formInterface.querySelector('#register-btn').addEventListener('click', () => {
        const username = formInterface.querySelector('#username').value;

        if (!username) {
            alert('Please enter a username');
            return;
        }

        console.log(`Proceeding to face registration for ${username} as ${role}`);
        document.body.removeChild(formInterface);
        openFaceRegistration(role, username);
    });
}

function openFaceRegistration(role, username) {
    const faceInterface = document.createElement('div');
    faceInterface.id = 'face-registration';
    faceInterface.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(26, 34, 56, 0.95);
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 0 25px rgba(0, 255, 157, 0.6);
        z-index: 1000;
        backdrop-filter: blur(10px);
        border: 1px solid #00ff9d;
        width: 500px;
        max-width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        transition: all 0.3s ease;
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
    `;

    faceInterface.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h3 style="color: #00ff9d; margin: 0; text-shadow: 0 0 10px #00ff9d;">Face Registration</h3>
            <p style="color: #ccc; margin-top: 5px;">Capture your face for ${role} registration</p>
        </div>

        <div style="text-align: center; margin: 20px 0;">
            <video id="videoFeed" autoplay style="width: 100%; max-width: 400px; border: 2px solid #00ff9d; border-radius: 10px; box-shadow: 0 0 15px rgba(0, 255, 157, 0.5);"></video>
            <canvas id="captureCanvas" style="display: none;"></canvas>
        </div>

        <div style="display: flex; justify-content: center; gap: 15px;">
            <button id="capture-btn" style="padding: 10px 20px; background: linear-gradient(45deg, #00ff9d, #00bfff); border: none; border-radius: 25px; color: #131836; font-weight: bold; cursor: pointer; transition: all 0.3s ease;">
                Capture Face
            </button>
            <button id="cancel-btn" style="padding: 10px 20px; background: rgba(255, 255, 255, 0.1); border: 1px solid #00ff9d; border-radius: 25px; color: #00ff9d; font-weight: bold; cursor: pointer; transition: all 0.3s ease;">
                Cancel
            </button>
        </div>

        <button class="close-button" style="position: absolute; top: 10px; right: 10px; background: none; border: none; color: #00ff9d; font-size: 1.5em; cursor: pointer;">×</button>
    `;

    document.body.appendChild(faceInterface);

    setTimeout(() => {
        faceInterface.style.opacity = '1';
        faceInterface.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);

    const video = faceInterface.querySelector('#videoFeed');
    const canvas = faceInterface.querySelector('#captureCanvas');
    let stream;

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(mediaStream => {
            stream = mediaStream;
            video.srcObject = stream;
            console.log('Webcam access granted and video stream started.');
        })
        .catch(err => {
            console.error('Error accessing webcam:', err);
            alert(`Error accessing webcam: ${err.message}. Please ensure camera permissions are granted and try again.`);
            document.body.removeChild(faceInterface);
        });

    faceInterface.querySelector('#capture-btn').addEventListener('click', () => {
        if (!video.srcObject) {
            alert('Camera is not accessible. Please try again.');
            return;
        }

        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/png');

        // Get current timestamp
        const timestamp = new Date().toISOString();

        fetch(imageData)
            .then(res => res.blob())
            .then(blob => {
                const formData = new FormData();
                formData.append('username', username);
                formData.append('role', role);
                formData.append('face_image', blob, 'face.png');
                formData.append('timestamp', timestamp); // Add timestamp

                console.log(`Sending face registration request for ${username} as ${role} at ${timestamp}`);
                fetch('                    https://e244-210-19-13-180.ngrok-free.app/api/register_face', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        console.error('Face registration error:', data.error);
                        alert(data.error);
                    } else {
                        console.log('Face registration successful:', data.message);
                        alert(data.message);
                        // Optionally store registration time locally (for potential future use)
                        if (!registeredUsers[role]) {
                            registeredUsers[role] = {};
                        }
                        registeredUsers[role][username] = { registrationTime: timestamp };

                        faceInterface.querySelector('#capture-btn').textContent = 'Success!';
                        faceInterface.querySelector('#capture-btn').style.background = 'linear-gradient(45deg, #00cc7a, #0099cc)';
                        setTimeout(() => {
                            faceInterface.style.opacity = '0';
                            faceInterface.style.transform = 'translate(-50%, -50%) scale(0.9)';
                            setTimeout(() => {
                                document.body.removeChild(faceInterface);
                                if (stream) {
                                    stream.getTracks().forEach(track => track.stop());
                                }
                            }, 300);
                        }, 1000);
                    }
                })
                .catch(error => {
                    console.error('Error during face registration:', error);
                    alert('Error occurred during face registration. Please try again.');
                });
            });
    });

    faceInterface.querySelector('#cancel-btn').addEventListener('click', () => {
        faceInterface.style.opacity = '0';
        faceInterface.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(faceInterface);
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        }, 300);
    });

    faceInterface.querySelector('.close-button').addEventListener('click', () => {
        faceInterface.style.opacity = '0';
        faceInterface.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(faceInterface);
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        }, 300);
    });
}

function openAuthenticationInterface() {
    // ... (rest of the function remains the same)
    const authInterface = document.createElement('div');
    authInterface.id = 'authentication-interface';
    authInterface.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(26, 34, 56, 0.95);
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 0 25px rgba(0, 255, 157, 0.6);
        z-index: 1000;
        backdrop-filter: blur(10px);
        border: 1px solid #00ff9d;
        width: 500px;
        max-width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        transition: all 0.3s ease;
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
    `;

    authInterface.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h3 style="color: #00ff9d; margin: 0; text-shadow: 0 0 10px #00ff9d;">Authenticate Yourself</h3>
            <p style="color: #ccc; margin-top: 5px;">Select your role to continue</p>
        </div>

        <div class="role-selection" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0;">
            <div class="role-option" data-role="doctor" style="background: rgba(0, 255, 157, 0.1); border: 1px solid #00ff9d; border-radius: 10px; padding: 15px; text-align: center; cursor: pointer; transition: all 0.3s ease;">
                <div style="font-size: 2em;">👨‍⚕️</div>
                <h4 style="color: #00ff9d; margin: 10px 0 5px;">Doctor</h4>
                <p style="color: #aaa; font-size: 0.9em;">Medical professionals</p>
            </div>

            <div class="role-option" data-role="patient" style="background: rgba(0, 191, 255, 0.1); border: 1px solid #00bfff; border-radius: 10px; padding: 15px; text-align: center; cursor: pointer; transition: all 0.3s ease;">
                <div style="font-size: 2em;">🧑‍🦰</div>
                <h4 style="color: #00bfff; margin: 10px 0 5px;">Patient</h4>
                <p style="color: #aaa; font-size: 0.9em;">Healthcare recipients</p>
            </div>

            <div class="role-option" data-role="receptionist" style="background: rgba(255, 0, 255, 0.1); border: 1px solid #ff00ff; border-radius: 10px; padding: 15px; text-align: center; cursor: pointer; transition: all 0.3s ease;">
                <div style="font-size: 2em;">💁‍♀️</div>
                <h4 style="color: #ff00ff; margin: 10px 0 5px;">Receptionist</h4>
                <p style="color: #aaa; font-size: 0.9em;">Front desk staff</p>
            </div>

            <div class="role-option" data-role="pharmacist" style="background: rgba(255, 204, 0, 0.1); border: 1px solid #ffcc00; border: 1px solid #ffcc00; border-radius: 10px; padding: 15px; text-align: center; cursor: pointer; transition: all 0.3s ease;">
                <div style="font-size: 2em;">💊</div>
                <h4 style="color: #ffcc00; margin: 10px 0 5px;">Pharmacist</h4>
                <p style="color: #aaa; font-size: 0.9em;">Medication specialists</p>
            </div>
        </div>

        <button class="close-button" style="position: absolute; top: 10px; right: 10px; background: none; border: none; color: #00ff9d; font-size: 1.5em; cursor: pointer;">×</button>
    `;

    document.body.appendChild(authInterface);

    setTimeout(() => {
        authInterface.style.opacity = '1';
        authInterface.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);

    authInterface.querySelector('.close-button').addEventListener('click', () => {
        authInterface.style.opacity = '0';
        authInterface.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(authInterface);
        }, 300);
    });

    const roleOptions = authInterface.querySelectorAll('.role-option');
    roleOptions.forEach(option => {
        option.addEventListener('click', () => {
            const role = option.dataset.role;
            openAuthenticationForm(role);
            document.body.removeChild(authInterface);
        });
    });
}

function openAuthenticationForm(role) {
    // ... (rest of the function remains the same)
    const authForm = document.createElement('div');
    authForm.id = 'authentication-form';
    authForm.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(26, 34, 56, 0.95);
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 0 25px rgba(0, 255, 157, 0.6);
        z-index: 1000;
        backdrop-filter: blur(10px);
        border: 1px solid #00ff9d;
        width: 450px;
        max-width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        transition: all 0.3s ease;
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
    `;

    let roleDisplay = '';
    switch(role) {
        case 'doctor': roleDisplay = 'Doctor'; break;
        case 'patient': roleDisplay = 'Patient'; break;
        case 'receptionist': roleDisplay = 'Receptionist'; break;
        case 'pharmacist': roleDisplay = 'Pharmacist'; break;
    }

    authForm.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h3 style="color: #00ff9d; margin: 0; text-shadow: 0 0 10px #00ff9d;">Authenticate as ${roleDisplay}</h3>
            <p style="color: #ccc; margin-top: 5px;">Enter your username</p>
        </div>

        <div class="form-group" style="margin-bottom: 20px;">
            <label for="auth-username" style="display: block; margin-bottom: 8px; color: #00ff9d;">Username</label>
            <input type="text" id="auth-username" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.3); border: 1px solid #00ff9d; border-radius: 5px; color: white; outline: none;">
            <div class="input-underline" style="height: 2px; background: #00ff9d; width: 0; transition: width 0.3s ease;"></div>
        </div>

        <button id="authenticate-btn" style="width: 100%; padding: 12px; background: linear-gradient(45deg, #00ff9d, #00bfff); border: none; border-radius: 25px; color: #131836; font-weight: bold; cursor: pointer; transition: all 0.3s ease; margin-top: 10px;">
            Proceed to Face Authentication
        </button>

        <button class="close-button" style="position: absolute; top: 10px; right: 10px; background: none; border: none; color: #00ff9d; font-size: 1.5em; cursor: pointer;">×</button>
    `;

    document.body.appendChild(authForm);

    setTimeout(() => {
        authForm.style.opacity = '1';
        authForm.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);

    const inputs = authForm.querySelectorAll('input');
    inputs.forEach(input => {
        const underline = input.nextElementSibling;

        input.addEventListener('focus', () => {
            underline.style.width = '100%';
            input.style.borderColor = '#00ff9d';
            input.style.boxShadow = '0 0 10px rgba(0, 255, 157, 0.3)';
        });

        input.addEventListener('blur', () => {
            underline.style.width = '0';
            input.style.borderColor = '#00ff9d';
            input.style.boxShadow = 'none';
        });
    });

    authForm.querySelector('.close-button').addEventListener('click', () => {
        authForm.style.opacity = '0';
        authForm.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(authForm);
        }, 300);
    });

    authForm.querySelector('#authenticate-btn').addEventListener('click', () => {
        const username = authForm.querySelector('#auth-username').value;

        if (!username) {
            alert('Please enter a username');
            return;
        }

        console.log(`Proceeding to face authentication for ${username} as ${role}`);
        document.body.removeChild(authForm);
        openFaceAuthentication(role, username);
    });
}

function openFaceAuthentication(role, username) {
    const faceAuthInterface = document.createElement('div');
    faceAuthInterface.id = 'face-authentication';
    faceAuthInterface.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(26, 34, 56, 0.95);
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 0 25px rgba(0, 255, 157, 0.6);
        z-index: 1000;
        backdrop-filter: blur(10px);
        border: 1px solid #00ff9d;
        width: 500px;
        max-width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        transition: all 0.3s ease;
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
    `;

    faceAuthInterface.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h3 style="color: #00ff9d; margin: 0; text-shadow: 0 0 10px #00ff9d;">Face Authentication</h3>
            <p style="color: #ccc; margin-top: 5px;">Capture your face to authenticate as ${role}</p>
        </div>

        <div style="text-align: center; margin: 20px 0;">
            <video id="videoFeed" autoplay style="width: 100%; max-width: 400px; border: 2px solid #00ff9d; border-radius: 10px; box-shadow: 0 0 15px rgba(0, 255, 157, 0.5);"></video>
            <canvas id="captureCanvas" style="display: none;"></canvas>
        </div>

        <div style="display: flex; justify-content: center; gap: 15px;">
            <button id="capture-btn" style="padding: 10px 20px; background: linear-gradient(45deg, #00ff9d, #00bfff); border: none; border-radius: 25px; color: #131836; font-weight: bold; cursor: pointer; transition: all 0.3s ease;">
                Capture Face
            </button>
            <button id="cancel-btn" style="padding: 10px 20px; background: rgba(255, 255, 255, 0.1); border: 1px solid #00ff9d; border-radius: 25px; color: #00ff9d; font-weight: bold; cursor: pointer; transition: all 0.3s ease;">
                Cancel
            </button>
        </div>

        <button class="close-button" style="position: absolute; top: 10px; right: 10px; background: none; border: none; color: #00ff9d; font-size: 1.5em; cursor: pointer;">×</button>
    `;

    document.body.appendChild(faceAuthInterface);

    setTimeout(() => {
        faceAuthInterface.style.opacity = '1';
        faceAuthInterface.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);

    const video = faceAuthInterface.querySelector('#videoFeed');
    const canvas = faceAuthInterface.querySelector('#captureCanvas');
    let stream;

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(mediaStream => {
            stream = mediaStream;
            video.srcObject = stream;
            console.log('Webcam access granted for authentication.');
        })
        .catch(err => {
            console.error('Error accessing webcam for authentication:', err);
            alert(`Error accessing webcam: ${err.message}. Please ensure camera permissions are granted and try again.`);
            document.body.removeChild(faceAuthInterface);
        });

    faceAuthInterface.querySelector('#capture-btn').addEventListener('click', () => {
        if (!video.srcObject) {
            alert('Camera is not accessible. Please try again.');
            return;
        }

        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/png');

        // Get current timestamp for authentication
        const timestamp = new Date().toISOString();

        fetch(imageData)
            .then(res => res.blob())
            .then(blob => {
                const formData = new FormData();
                formData.append('username', username);
                formData.append('role', role);
                formData.append('face_image', blob, 'face.png');
                formData.append('timestamp', timestamp); // Add timestamp

                console.log(`Sending face authentication request for ${username} as ${role} at ${timestamp}`);
                fetch('                    https://e244-210-19-13-180.ngrok-free.app/api/authenticate_face', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    // Check if response is OK (status 200-299) before parsing as JSON
                    if (!response.ok) {
                        return response.json().then(err => { throw new Error(err.error || 'Authentication failed') });
                    }
                    return response.json();
                })
                .then(data => {
                    // Success case
                    console.log('Face authentication successful:', data.message);
                    alert(data.message);

                    // Store login time locally (for demonstration)
                     if (!registeredUsers[role]) {
                        registeredUsers[role] = {};
                    }
                    if (!registeredUsers[role][username]) {
                         registeredUsers[role][username] = {};
                    }
                    registeredUsers[role][username].lastLoginTime = timestamp;


                    faceAuthInterface.querySelector('#capture-btn').textContent = 'Success!';
                    faceAuthInterface.querySelector('#capture-btn').style.background = 'linear-gradient(45deg, #00cc7a, #0099cc)';

                    setTimeout(() => {
                        faceAuthInterface.style.opacity = '0';
                        faceAuthInterface.style.transform = 'translate(-50%, -50%) scale(0.9)';
                        setTimeout(() => {
                            document.body.removeChild(faceAuthInterface);
                            if (stream) {
                                stream.getTracks().forEach(track => track.stop());
                            }
                            // Pass the timestamp to the user interface function
                            openUserInterface(role, username, timestamp);
                        }, 300);
                    }, 1000);
                })
                .catch(error => {
                    console.error('Error during face authentication:', error);
                    alert(error.message || 'Error occurred during face authentication.');
                });
            });
    });

    faceAuthInterface.querySelector('#cancel-btn').addEventListener('click', () => {
        faceAuthInterface.style.opacity = '0';
        faceAuthInterface.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(faceAuthInterface);
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        }, 300);
    });

    faceAuthInterface.querySelector('.close-button').addEventListener('click', () => {
        faceAuthInterface.style.opacity = '0';
        faceAuthInterface.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(faceAuthInterface);
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        }, 300);
    });
}

// User interfaces object to store the different interfaces (simplified for colors)
const userInterfaceColors = {
    doctor: "#00ff9d", // Neon green
    patient: "#00bfff", // Neon blue
    receptionist: "#ff00ff", // Neon pink
    pharmacist: "#ffcc00" // Neon yellow
};

// Function to open the simplified user interface after successful authentication
function openUserInterface(role, username, loginTime) {
    const userColor = userInterfaceColors[role];
    if (!userColor) {
        console.error("Invalid role provided for user interface:", role);
        return;
    }

    const interfaceWindow = document.createElement('div');
    interfaceWindow.id = 'user-interface';
    interfaceWindow.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90vw;
        max-width: 800px; /* Slightly smaller max width */
        height: 60vh; /* Reduced height */
        background: linear-gradient(135deg, rgba(26, 34, 56, 0.95), rgba(10, 15, 30, 0.95));
        border-radius: 20px;
        box-shadow: 0 0 30px ${userColor}80, inset 0 0 15px ${userColor}30;
        border: 2px solid ${userColor};
        z-index: 1000;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        backdrop-filter: blur(12px);
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
        transition: all 0.3s ease;
        font-family: 'Orbitron', sans-serif; /* Futuristic font (requires adding Orbitron font link) */
    `;

    // Format the login time for better readability
    const formattedLoginTime = new Date(loginTime).toLocaleString();

    interfaceWindow.innerHTML = `
        <div class="interface-header" style="padding: 20px; background: linear-gradient(45deg, ${userColor}, ${adjustColor(userColor, 20)}); color: #131836; display: flex; justify-content: space-between; align-items: center; border-top-left-radius: 18px; border-top-right-radius: 18px; box-shadow: 0 0 15px ${userColor}50;">
            <div>
                <h2 style="margin: 0; font-size: 1.8em; font-weight: bold; text-shadow: 0 0 10px #fff;">QUANTUM MEDICAL SYSTEM</h2>
                <p style="margin: 5px 0 0; font-size: 1em;">Authenticated</p>
            </div>
            <button class="close-interface" style="border: none; background: none; color: #131836; cursor: pointer; font-size: 2em; text-shadow: 0 0 5px #fff;">×</button>
        </div>

        <div class="interface-body" style="flex: 1; padding: 40px; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <div style="font-size: 4em; margin-bottom: 20px; color: ${userColor}; text-shadow: 0 0 15px ${userColor}80;">
                 ${getWelcomeEmoji(role)}
            </div>
            <h3 style="color: #fff; margin-bottom: 10px; font-size: 1.5em; text-shadow: 0 0 8px ${userColor}50;">
                Welcome, <span style="color: ${userColor};">${username}</span>
            </h3>
            <p style="color: #ccc; font-size: 1.1em; margin-bottom: 5px;">
                Role: <span style="color: ${userColor};">${role.charAt(0).toUpperCase() + role.slice(1)}</span>
            </p>
             <p style="color: #aaa; font-size: 0.9em;">
                Login Time: <span style="color: #fff;">${formattedLoginTime}</span>
            </p>
        </div>

         <div class="interface-footer" style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-top: 1px solid ${userColor}30; display: flex; justify-content: flex-end; align-items: center;">
            <button class="footer-button logout-button" style="background: none; border: none; color: #ff5555; cursor: pointer; transition: color 0.3s ease; font-weight: bold;">Logout</button>
        </div>
    `;

    document.body.appendChild(interfaceWindow);

    // Add styles for the interface
    const style = document.createElement('style');
    style.textContent = `
        @keyframes neonPulse {
            0% { box-shadow: 0 0 10px ${userColor}80, inset 0 0 5px ${userColor}30; }
            50% { box-shadow: 0 0 30px ${userColor}80, inset 0 0 15px ${userColor}30; }
            100% { box-shadow: 0 0 10px ${userColor}80, inset 0 0 5px ${userColor}30; }
        }
         #user-interface {
            animation: neonPulse 2s infinite;
        }
         .logout-button:hover {
            color: #ff3333 !important;
        }
        /* Add Orbitron font link if not already in your HTML head */
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap');
    `;
    document.head.appendChild(style);


    // Fade in the interface
    setTimeout(() => {
        interfaceWindow.style.opacity = '1';
        interfaceWindow.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);

    // Close button functionality
    interfaceWindow.querySelector('.close-interface').addEventListener('click', () => {
        interfaceWindow.style.opacity = '0';
        interfaceWindow.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(interfaceWindow);
            document.head.removeChild(style); // Remove the dynamically added style
        }, 300);
    });

    // Logout button functionality
    interfaceWindow.querySelector('.logout-button').addEventListener('click', () => {
        interfaceWindow.style.opacity = '0';
        interfaceWindow.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(interfaceWindow);
             document.head.removeChild(style); // Remove the dynamically added style
            alert(`You have been logged out as ${username}`);
        }, 300);
    });
}

function adjustColor(color, amount) {
    // Remove the # and parse into RGB components
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Adjust each component and clamp between 0-255
    const adjust = (val) => Math.min(255, Math.max(0, val + amount));

    // Convert back to hex and pad with leading 0 if needed
    const toHex = (val) => {
        const hex = adjust(val).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return '#' + toHex(r) + toHex(g) + toHex(b);
}

// Helper function to get welcome emoji based on role
function getWelcomeEmoji(role) {
    switch(role) {
        case 'doctor': return '👨‍⚕️';
        case 'patient': return '🧑‍🦰';
        case 'receptionist': return '💁‍♀️';
        case 'pharmacist': return '💊';
        default: return '👋';
    }
}



  
const languageData = {
    English: {
        register: "👤 Register",
        authenticate: "🔐 Authenticate",
        heal: "💊 Heal Yourself",
        cognitive: "🧠 Cognitive Enhancement",
        medicine: "💉 Medicine Stock",
        ambulance: "🚑 Nearest Ambulance",
        clinic: "🏥 Nearest Clinic",
        news: "📰 Live Medical News", 
        preview: "🖥️ System Preview",
    },
    Bahasa: {
        register: "👤 Daftar",
        authenticate: "🔐 Autentikasi",
        heal: "💊 Sembuhkan Diri Anda",
        cognitive: "🧠 Peningkatan Kognitif",
        medicine: "💉 Stok Obat",
        ambulance: "🚑 Ambulans Terdekat",
        clinic: "🏥 Klinik Terdekat",
        news: "📰 Berita Medis Langsung",
        preview: "🖥️ Prabaca Sistem",
    },
    Tamil: {
        register: "👤 பதிவு செய்யவும்",
        authenticate: "🔐 அணுகல் உறுதிப்படுத்துங்கள்",
        heal: "💊 நீங்கள் சொந்தமாக குணமடைக",
        cognitive: "🧠 சிந்தனை மேம்படும்",
        medicine: "💉 மருந்துத் துறை",
        ambulance: "🚑 அருகிலுள்ள ஆம்புலன்ஸ்",
        clinic: "🏥 அருகிலுள்ள கிளினிக்",
        news: "📰 நேரடி மருத்துவ செய்திகள்",
        preview: "🖥️ முறைவடிவ முன்னணி",
    },
    Telugu: {
        register: "👤 రిజిస్టర్ చేయండి",
        authenticate: "🔐 ధృవీకరించండి",
        heal: "💊 నువ్వు నువ్వు heal",
        cognitive: "🧠 మేథోావిశ్లేషణ ఎలా పనిచేస్తుంది",
        medicine: "💉 వైద్య భద్రతా",
        ambulance: "🚑 సమీప యాంబులెన్స్",
        clinic: "🏥 సమీప క్లినిక్",
        news: "📰 ప్రత్యక్ష వైద్య వార్తలు",
        preview: "🖥️ వ్యవస్థా ప్రాంతం",
    },
    Hindi: {
        register: "👤 पंजीकरण करें",
        authenticate: "🔐 प्रमाणीकरण करें",
        heal: "💊 खुद को ठीक करें",
        cognitive: "🧠 संज्ञानात्मक सुधार",
        medicine: "💉 चिकित्सा भंडार",
        ambulance: "🚑 निकटतम एम्बुलेंस",
        clinic: "🏥 निकटतम क्लिनिक",
        news: "📰 लाइव मेडिकल न्यूज़",
        preview: "🖥️ सिस्टम पूर्वावलोकन",
    },
    Urdu: {
        register: "👤 رجسٹر کریں",
        authenticate: "🔐 توثیق کریں",
        heal: "💊 خود کو صحت مند کریں",
        cognitive: "🧠 ذہنی بہتری",
        medicine: "💉 دواؤں کا ذخیرہ",
        ambulance: "🚑 قریبی ایمبولینس",
        clinic: "🏥 قریبی کلینک",
        news: "📰 براہ راست طبی خبریں",
        preview: "🖥️ سسٹم کا پیش نظارہ",
    },
    Punjabi: {
        register: "👤 ਰਜਿਸਟਰ ਕਰੋ",
        authenticate: "🔐 ਪ੍ਰਮਾਣਿਤ ਕਰੋ",
        heal: "💊 ਆਪਣੇ ਆਪ ਨੂੰ ਥੀਕ ਕਰੋ",
        cognitive: "🧠 ਸਿਧਾਂਤਕ ਸੁਧਾਰ",
        medicine: "💉 ਦਵਾਈ ਸਟਾਕ",
        ambulance: "🚑 ਨਜ਼ਦੀਕੀ ਐਮਬੂਲੈਂਸ",
        clinic: "🏥 ਨਜ਼ਦੀਕੀ ਕਲਿਨਿਕ",
        news: "📰 ਲਾਈਵ ਮੈਡੀਕਲ ਨਿਊਜ਼",
        preview: "🖥️ ਸਿਸਟਮ ਦਾ ਪੂਰਵਦ੍ਰਿਸ਼",
    },
    Russian: {
        register: "👤 Зарегистрироваться",
        authenticate: "🔐 Аутентификация",
        heal: "💊 Излечите себя",
        cognitive: "🧠 Когнитивное улучшение",
        medicine: "💉 Запас лекарства",
        ambulance: "🚑 Ближайшая скорая помощь",
        clinic: "🏥 Ближайшая клиника",
        news: "📰 Прямые медицинские новости",
        preview: "🖥️ Предварительный просмотр системы",
    },
    French: {
        register: "👤 S'inscrire",
        authenticate: "🔐 Authentifier",
        heal: "💊 Soignez-vous",
        cognitive: "🧠 Amélioration cognitive",
        medicine: "💉 Stock de médicaments",
        ambulance: "🚑 Ambulance la plus proche",
        clinic: "🏥 Clinique la plus proche",
        news: "📰 Actualités médicales en direct",
        preview: "🖥️ Aperçu du système",
    },
};

const languageSwitcherButton = document.getElementById('language-switcher');
let currentLanguage = 'English'; // Track current language

// Create neon window container
const languageWindow = document.createElement('div');
languageWindow.id = 'language-window';
languageWindow.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    background: rgba(10, 15, 30, 0.9);
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 0 30px rgba(0, 174, 255, 0.7), 0 0 30px rgba(255, 0, 128, 0.7);
    z-index: 1000;
    display: none;
    backdrop-filter: blur(15px);
    border: 2px solid #00aeff;
    width: 400px;
    min-height: 300px;
    max-width: 90%;
    max-height: 90vh;
    transition: transform 0.5s ease, opacity 0.5s ease;
    opacity: 0;
`;

// Add neon window HTML
languageWindow.innerHTML = `
    <div style="text-align: center; margin-bottom: 30px;">
        <h3 style="color: #00aeff; margin: 0; text-shadow: 0 0 10px #00aeff, 0 0 20px #ff0080; font-family: 'Orbitron', sans-serif;">
            Select Language
        </h3>
    </div>
    <div class="dropdown-container" style="position: relative;">
        <select id="languageDropdown" style="
            width: 100%;
            padding: 15px;
            background: linear-gradient(45deg, #00aeff, #ff0080);
            border: none;
            border-radius: 10px;
            color: #ffffff;
            font-size: 16px;
            font-family: 'Orbitron', sans-serif;
            appearance: none;
            cursor: pointer;
            text-shadow: 0 0 5px #ffffff;
            box-shadow: 0 0 15px rgba(0, 174, 255, 0.5), 0 0 15px rgba(255, 0, 128, 0.5);
            transition: all 0.3s ease;">
            ${Object.keys(languageData).map(lang => `<option value="${lang}">${lang}</option>`).join('')}
        </select>
        <div style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); pointer-events: none;">
            <svg width="20" height="20" fill="#ffffff" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5H7z"/>
            </svg>
        </div>
    </div>
`;

// Append Google Fonts for futuristic typography
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

// Append window to body
document.body.appendChild(languageWindow);

const languageDropdown = document.getElementById('languageDropdown');

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes neonPulse {
        0% { box-shadow: 0 0 10px #00aeff, 0 0 10px #ff0080; }
        50% { box-shadow: 0 0 30px #00aeff, 0 0 30px #ff0080; }
        100% { box-shadow: 0 0 10px #00aeff, 0 0 10px #ff0080; }
    }
    @keyframes windowOpen {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    @keyframes windowClose {
        0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
    }
    #languageDropdown option {
        background: #0a0f1e;
        color: #ffffff;
        padding: 10px;
        font-family: 'Orbitron', sans-serif;
    }
    #languageDropdown option:hover {
        background: linear-gradient(45deg, #00aeff, #ff0080);
    }
`;
document.head.appendChild(style);

// Toggle language window visibility
languageSwitcherButton.addEventListener('click', () => {
    if (languageWindow.style.display === 'none' || languageWindow.style.display === '') {
        languageDropdown.value = currentLanguage; // Set dropdown to current language
        languageWindow.style.display = 'block';
        languageWindow.style.animation = 'windowOpen 0.5s forwards';
    } else {
        languageWindow.style.animation = 'windowClose 0.5s forwards';
        setTimeout(() => {
            languageWindow.style.display = 'none';
            languageWindow.style.animation = '';
        }, 500);
    }
});

// Preview language on hover
languageDropdown.addEventListener('mouseover', (e) => {
    if (e.target.tagName === 'OPTION') {
        const previewLang = e.target.value;
        updateLanguage(previewLang, true);
    }
});

// Revert to selected language when hover ends
languageDropdown.addEventListener('mouseout', () => {
    updateLanguage(currentLanguage, false);
});

// Change language on selection
languageDropdown.addEventListener('change', () => {
    const selectedLang = languageDropdown.value;
    updateLanguage(selectedLang, false);
    // Close window with animation
    languageWindow.style.animation = 'windowClose 0.5s forwards';
    setTimeout(() => {
        languageWindow.style.display = 'none';
        languageWindow.style.animation = '';
    }, 500);
});

// Update language function
function updateLanguage(selectedLanguage, isPreview = false) {
    const buttons = document.querySelectorAll('.sidebar-button');
    buttons.forEach(button => {
        const action = button.dataset.action;
        if (languageData[selectedLanguage][action]) {
            button.style.transition = 'all 0.3s ease';
            button.style.opacity = '0';
            setTimeout(() => {
                button.textContent = languageData[selectedLanguage][action];
                button.style.opacity = '1';
                if (!isPreview) {
                    button.style.animation = 'neonPulse 1s';
                    setTimeout(() => {
                        button.style.animation = '';
                    }, 1000);
                }
            }, 300);
        }
    });
    if (!isPreview) {
        currentLanguage = selectedLanguage; // Update current language
    }
}
function openSystemPreview() {
    const previewWindow = document.createElement('div');
    previewWindow.id = 'system-preview';
    previewWindow.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90vw;
        max-width: 1000px;
        height: 80vh;
        background: linear-gradient(135deg, rgba(10, 15, 30, 0.95), rgba(5, 10, 32, 0.95));
        border-radius: 20px;
        box-shadow: 0 0 60px rgba(0, 247, 255, 0.8), inset 0 0 30px rgba(0, 247, 255, 0.5), 0 0 120px rgba(123, 45, 255, 0.6);
        border: 3px solid #00f7ff;
        z-index: 1000;
        overflow: hidden;
        backdrop-filter: blur(20px);
        display: flex;
        flex-direction: column;
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
        transition: all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
        animation: pulseBorder 2s infinite;
    `;

    previewWindow.innerHTML = `
        <div class="preview-header" style="padding: 20px; border-bottom: 1px solid rgba(0, 247, 255, 0.4); display: flex; justify-content: space-between; align-items: center; background: rgba(19, 27, 77, 0.7);">
            <h3 style="margin: 0; font-family: 'Orbitron', sans-serif; color: #00f7ff; letter-spacing: 4px; text-shadow: 0 0 20px #00f7ff, 0 0 40px #7b2dff; font-size: 1.8em;">AETHERION VZ™ NEURAL CORE</h3>
            <button class="close-preview" style="background: none; border: none; color: #ff2d5e; font-size: 2em; cursor: pointer; transition: all 0.3s ease; text-shadow: 0 0 15px #ff2d5e;">×</button>
        </div>
        <div class="preview-content" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; position: relative; overflow: hidden; background: radial-gradient(circle, rgba(0, 247, 255, 0.15), transparent);">
            <div id="preview-stage" style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; perspective: 1000px;">
                <!-- Content will be dynamically added here -->
            </div>
            <div class="preview-progress" style="position: absolute; bottom: 20px; width: 80%; height: 8px; background: rgba(0, 247, 255, 0.3); border-radius: 4px; box-shadow: 0 0 15px rgba(0, 247, 255, 0.6);">
                <div class="progress-fill" style="height: 100%; width: 0%; background: linear-gradient(90deg, #00f7ff, #7b2dff, #ff2d5e); border-radius: 4px; transition: width 0.5s ease; box-shadow: 0 0 20px #00f7ff;"></div>
            </div>
            <audio id="preview-audio" loop src="https://cdn.glitch.global/4ee563e8-e9aa-4c03-ae76-df793d0640f9/cyberpunk-inspirational-futuristic-music-272636.mp3?v=1745596383176"></audio>
            <audio id="transition-sound" src="https://cdn.pixabay.com/audio/2022/03/10/audio_4c38d4798d.mp3"></audio>
        </div>
    `;

    document.body.appendChild(previewWindow);

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulseBorder {
            0% { border-color: #00f7ff; box-shadow: 0 0 60px rgba(0, 247, 255, 0.8), inset 0 0 30px rgba(0, 247, 255, 0.5), 0 0 120px rgba(123, 45, 255, 0.6); }
            50% { border-color: #7b2dff; box-shadow: 0 0 80px rgba(123, 45, 255, 0.8), inset 0 0 40px rgba(123, 45, 255, 0.5), 0 0 140px rgba(0, 247, 255, 0.6); }
            100% { border-color: #00f7ff; box-shadow: 0 0 60px rgba(0, 247, 255, 0.8), inset 0 0 30px rgba(0, 247, 255, 0.5), 0 0 120px rgba(123, 45, 255, 0.6); }
        }
        @keyframes textGlow {
            0% { text-shadow: 0 0 15px currentColor, 0 0 30px currentColor; }
            50% { text-shadow: 0 0 40px currentColor, 0 0 60px currentColor; }
            100% { text-shadow: 0 0 15px currentColor, 0 0 30px currentColor; }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(40px) rotateX(20deg); }
            to { opacity: 1; transform: translateY(0) rotateX(0deg); }
        }
        @keyframes scaleIn {
            from { transform: scale(0.7) rotateY(30deg); opacity: 0; }
            to { transform: scale(1) rotateY(0deg); opacity: 1; }
        }
        @keyframes particleBurst {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(3); opacity: 0; }
        }
        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }
        .preview-item {
            opacity: 0;
            transform: translateY(40px) rotateX(20deg);
            transition: all 0.7s ease;
            position: absolute;
            width: 100%;
            padding: 20px;
            transform-style: preserve-3d;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .preview-item.active {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
        }
        .preview-item[data-index="2"] .project-name {
            margin-top: 40px;
        }
        .feature-highlight {
            font-size: 1.4em;
            margin-top: 20px;
            padding: 12px 24px;
            border-radius: 30px;
            display: inline-block;
            animation: textGlow 1.5s infinite;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 1px solid currentColor;
        }
        .feature-highlight:hover {
            transform: scale(1.1);
            box-shadow: 0 0 30px currentColor;
        }
        .project-name {
            font-family: 'Orbitron', sans-serif;
            font-size: 4em;
            font-weight: bold;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #00f7ff, #7b2dff, #ff2d5e);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 0 30px rgba(0, 247, 255, 0.8), 0 0 60px rgba(123, 45, 255, 0.6);
            animation: textGlow 2s infinite;
        }
        .feature-image {
            max-width: 400px;
            max-height: 300px;
            margin: 20px auto;
            border-radius: 15px;
            border: 2px solid rgba(0, 247, 255, 0.7);
            box-shadow: 0 0 50px rgba(0, 247, 255, 0.5), 0 0 80px rgba(123, 45, 255, 0.4);
            opacity: 0;
            transform: scale(0.9) rotateY(15deg);
            transition: all 0.7s ease 0.4s;
        }
        .feature-image.active {
            opacity: 1;
            transform: scale(1) rotateY(0deg);
        }
        .visualization-demo {
            width: 100%;
            height: 350px;
            background: rgba(0, 247, 255, 0.2);
            border-radius: 15px;
            border: 2px dashed rgba(0, 247, 255, 0.7);
            margin: 10px 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: rgba(0, 247, 255, 0.9);
            font-family: 'Orbitron', sans-serif;
            opacity: 0;
            transition: all 0.7s ease 0.4s;
            box-shadow: 0 0 40px rgba(0, 247, 255, 0.5);
            position: relative;
            overflow: hidden;
        }
        .visualization-demo.active {
            opacity: 1;
        }
        .visualization-item {
            font-size: 1.4em;
            margin: 10px 0;
            color: #00f7ff;
            text-shadow: 0 0 15px #00f7ff;
            animation: fadeIn 0.6s ease forwards;
            animation-delay: calc(0.15s * var(--index));
            transition: transform 0.3s ease, text-shadow 0.3s ease;
            cursor: pointer;
        }
        .visualization-item:hover {
            transform: scale(1.1);
            text-shadow: 0 0 25px #00f7ff;
        }
        .particle {
            position: absolute;
            width: 6px;
            height: 6px;
            background: radial-gradient(circle, #00f7ff, transparent);
            border-radius: 50%;
            pointer-events: none;
            animation: particleBurst 0.5s ease forwards;
        }
        .scanline {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(to bottom, transparent, rgba(0, 247, 255, 0.3), transparent);
            animation: scanline 5s infinite linear;
            pointer-events: none;
        }
        .metric {
            transition: transform 0.3s ease, text-shadow 0.3s ease;
        }
        .metric:hover {
            transform: scale(1.15);
            text-shadow: 0 0 20px currentColor;
        }
        .metric-value {
            animation: countUp 2s ease-out forwards;
        }
        @keyframes countUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Play audio
    const audio = previewWindow.querySelector('#preview-audio');
    audio.play().catch(error => console.error('Audio playback failed:', error));

    // Add transition sound
    const transitionSound = previewWindow.querySelector('#transition-sound');

    // Fade in the preview window
    setTimeout(() => {
        previewWindow.style.opacity = '1';
        previewWindow.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);

    // Add scanlines and particles
    const previewContent = previewWindow.querySelector('.preview-content');
    for (let i = 0; i < 3; i++) {
        const scanline = document.createElement('div');
        scanline.className = 'scanline';
        scanline.style.animationDelay = `${i * 1.5}s`;
        previewContent.appendChild(scanline);
    }

    function addParticleBurst(x, y) {
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.animationDelay = `${i * 0.05}s`;
            previewContent.appendChild(particle);
            setTimeout(() => particle.remove(), 500);
        }
    }

    // Close button functionality
    previewWindow.querySelector('.close-preview').addEventListener('click', () => {
        audio.pause();
        audio.currentTime = 0;
        previewWindow.style.opacity = '0';
        previewWindow.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(previewWindow);
            document.head.removeChild(style);
        }, 400);
    });

    // Define the preview stages
    const stages = [
        {
            name: "AETHERION VZ™ Alpha-1B",
            feature: "22 Million structured Instruction and Response Fine Tuning ( Medical Data of 5,500 Books ) ",
            featureColor: "#ff2d5e",
            description: "PubMedQA,MedConceptsQA,MedMCQA,Clinical-Coding, MedQuad, and etc.",
            type: "text"
        },
        {
            name: "AETHERION VZ™ Alpha-1B",
            feature: "ResNet50 Image Prediction with visualizations",
            featureColor: "#00f7ff",
            description: "Image Prediction with 6 visualizations.",
            type: "text",
        },
        {
            name: "AETHERION VZ™ Alpha-1B",
            feature: "VISUALIZATIONS",
            featureColor: "#7b2dff",
            description: "Immersive holographic and analytical suite for multidimensional medical data representation",
            type: "visualization",
            visualizations: [
                "Edge Detection",
                "Gradient Magnitude",
                "Histogram Equalization",
                "Region of Interest",
                "Thermal Imaging",
                "3D Holography"
            ]
        },
        {
            name: "AETHERION VZ™ Alpha-1B",
            feature: "ASMR NeuroSync Interface",
            featureColor: "#ff9d00",
            description: "Bio-resonant audio frequencies for enhanced patient neural relaxation and recovery optimization",
            type: "text"
        },
        {
            name: "AETHERION VZ™ Alpha-B",
            feature: "Cognitive Enhancement Game",
            featureColor: "#00ff9d",
            description: "Quantum-driven neural augmentation for hyper-accelerated cognitive processing and medical decision-making",
            type: "final"
        }
    ];

    // Create DOM elements for each stage
    const previewStage = previewWindow.querySelector('#preview-stage');
    const progressFill = previewWindow.querySelector('.progress-fill');
    
    stages.forEach((stage, index) => {
        const stageElement = document.createElement('div');
        stageElement.className = 'preview-item';
        stageElement.dataset.index = index;
        
        let content = `
            <div class="project-name" style="animation-delay: 0.1s">${stage.name}</div>
        `;
        
        if (stage.type === 'text') {
            content += `
                <div class="feature-highlight" style="background: rgba(${hexToRgb(stage.featureColor)}, 0.3); border: 1px solid ${stage.featureColor}; color: ${stage.featureColor}; animation-delay: 0.2s;">
                    ${stage.feature}
                </div>
                <p style="max-width: 600px; margin: 20px auto; color: #a0a8d0; line-height: 1.6; font-size: 1.2em; animation: fadeIn 0.7s ease forwards; animation-delay: 0.3s;">${stage.description}</p>
            `;
        } else if (stage.type === 'image') {
            content += `
                <div class="feature-highlight" style="background: rgba(${hexToRgb(stage.featureColor)}, 0.3); border: 1px solid ${stage.featureColor}; color: ${stage.featureColor}; animation-delay: 0.2s;">
                    ${stage.feature}
                </div>
                <img src="${stage.imageUrl}" class="feature-image" alt="${stage.feature}">
                <p style="max-width: 600px; margin: 20px auto; color: #a0a8d0; line-height: 1.6; font-size: 1.2em; animation: fadeIn 0.7s ease forwards; animation-delay: 0.3s;">${stage.description}</p>
            `;
        } else if (stage.type === 'visualization') {
            content += `
                <div class="feature-highlight" style="background: rgba(${hexToRgb(stage.featureColor)}, 0.3); border: 1px solid ${stage.featureColor}; color: ${stage.featureColor}; animation-delay: 0.2s;">
                    ${stage.feature}
                </div>
                <div class="visualization-demo">
                    <div style="text-align: center;">
                        ${stage.visualizations.map((viz, i) => `
                            <div class="visualization-item" style="--index: ${i}">${viz}</div>
                        `).join('')}
                    </div>
                </div>
                <p style="max-width: 600px; margin: 10px auto; color: #a0a8d0; line-height: 1.6; font-size: 1.2em; animation: fadeIn 0.7s ease forwards; animation-delay: 0.3s;">${stage.description}</p>
            `;
        } else if (stage.type === 'final') {
            content += `
                <div style="margin-bottom: 30px;">
                    <div class="feature-highlight" style="background: rgba(${hexToRgb(stage.featureColor)}, 0.3); border: 1px solid ${stage.featureColor}; color: ${stage.featureColor}; margin-bottom: 30px; animation-delay: 0.2s;">
                        ${stage.feature}
                    </div>
                    <p style="max-width: 600px; margin: 0 auto 30px; color: #a0a8d0; line-height: 1.6; font-size: 1.3em; animation: fadeIn 0.7s ease forwards; animation-delay: 0.3s;">${stage.description}</p>
                    <div style="display: flex; justify-content: center; gap: 30px; margin-top: 40px;">
                        <div class="metric" style="text-align: center;">
                            <div class="metric-value" style="font-family: 'Orbitron', sans-serif; color: #00f7ff; margin-bottom: 5px; font-size: 1.8em;" data-value="14.2B">14.2B</div>
                            <div style="font-size: 1em; color: #a0a8d0;">Parameters</div>
                        </div>
                        <div class="metric" style="text-align: center;">
                            <div class="metric-value" style="font-family: 'Orbitron', sans-serif; color: #7b2dff; margin-bottom: 5px; font-size: 1.8em;" data-value="99.99%">99.99%</div>
                            <div style="font-size: 1em; color: #a0a8d0;">Accuracy</div>
                        </div>
                        <div class="metric" style="text-align: center;">
                            <div class="metric-value" style="font-family: 'Orbitron', sans-serif; color: #ff2d5e; margin-bottom: 5px; font-size: 1.8em;" data-value="Q-OS">Q-OS</div>
                            <div style="font-size: 1em; color: #a0a8d0;">v4.7.2</div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        stageElement.innerHTML = content;
        previewStage.appendChild(stageElement);
    });

    // Animation sequence
    let currentStage = 0;
    const totalStages = stages.length;
    const stageElements = previewStage.querySelectorAll('.preview-item');
    const featureImages = previewStage.querySelectorAll('.feature-image');
    const visualizationDemos = previewStage.querySelectorAll('.visualization-demo');

    function showStage(index) {
        // Play transition sound
        transitionSound.currentTime = 0;
        transitionSound.play().catch(error => console.error('Transition sound failed:', error));

        // Add particle burst at center
        addParticleBurst(previewContent.offsetWidth / 2, previewContent.offsetHeight / 2);

        // Hide all stages
        stageElements.forEach(el => {
            el.classList.remove('active');
        });
        
        // Show current stage
        stageElements[index].classList.add('active');
        
        // Activate images/visualizations for current stage
        if (stages[index].type === 'image') {
            const currentImage = stageElements[index].querySelector('.feature-image');
            if (currentImage) currentImage.classList.add('active');
        }
        
        if (stages[index].type === 'visualization') {
            const currentViz = stageElements[index].querySelector('.visualization-demo');
            if (currentViz) currentViz.classList.add('active');
        }
        
        // Update progress
        progressFill.style.width = `${((index + 1) / totalStages) * 100}%`;
        
        // Move to next stage or loop
        currentStage = (index + 1) % totalStages;
    }

    // Start with first stage
    showStage(0);
    
    // Auto-advance every 3.5 seconds for dynamic pacing
    const stageInterval = setInterval(() => {
        showStage(currentStage);
    }, 3500);

    // Clear interval when window is closed
    previewWindow.querySelector('.close-preview').addEventListener('click', () => {
        clearInterval(stageInterval);
    });

    // Helper function to convert hex to rgb
    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
    }
}

// Add event listener for the System Preview button
const previewButton = document.querySelector('.sidebar-button[data-action="preview"]');
if (previewButton) {
    previewButton.addEventListener('click', openSystemPreview);
}
  
  
  
  
  
console.log('Three.js loaded:', typeof THREE !== 'undefined');

const diseaseClassifierButton = document.querySelector('.quantum-button.secondary[data-action="disease-classifier"]');
if (diseaseClassifierButton) {
    diseaseClassifierButton.addEventListener('click', () => {
        console.log("Pathogen Detection button clicked!");
        openDiseaseClassifier();
    });
}

function openDiseaseClassifier() {
    const datasetChangeSound = new Audio("https://cdn.glitch.global/4ee563e8-e9aa-4c03-ae76-df793d0640f9/Dataset%20Slider.wav?v=1743852565692");
    const visualizationClickSound = new Audio("https://cdn.glitch.global/4ee563e8-e9aa-4c03-ae76-df793d0640f9/Visualization%20Click.wav?v=1743852566152");

    const mainContainer = document.createElement('div');
    mainContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        gap: 20px;
        z-index: 1000;
        width: 90vw;
        max-width: 1400px;
        max-height: 90vh;
        transition: all 0.3s ease;
        opacity: 0;
        font-family: 'Orbitron', sans-serif;
    `;
    setTimeout(() => {
        mainContainer.style.opacity = '1';
    }, 10);

    const classifierInterface = document.createElement('div');
    classifierInterface.classList.add('disease-classifier-interface');
    classifierInterface.style.cssText = `
        flex: 1;
        background: linear-gradient(135deg, rgba(26, 34, 56, 0.95), rgba(10, 15, 30, 0.95));
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 0 30px rgba(0, 255, 157, 0.8), inset 0 0 15px rgba(0, 255, 157, 0.3);
        border: 2px solid #00ff9d;
        max-height: 90vh;
        overflow-y: auto;
        backdrop-filter: blur(12px);
        min-width: 500px;
    `;
    classifierInterface.innerHTML = `
        <div class="classifier-content" style="display: flex; flex-direction: column; gap: 20px;">
            <h2 style="color: #00ff9d; text-align: center; text-shadow: 0 0 10px #00ff9d; margin: 0;">Disease Classifier</h2>
            <div id="imageInputBox" class="upload-box" style="border: 3px dashed #00ff9d; border-radius: 15px; padding: 40px; text-align: center; cursor: pointer; background: rgba(0, 255, 157, 0.05); transition: all 0.3s ease;">
                <span style="color: #00ff9d; font-size: 1.2em; text-shadow: 0 0 5px #00ff9d;">Drag & Drop or Click to Upload Image</span>
            </div>
            <input type="file" id="fileInput" accept="image/*" style="display: none;">
            <div id="imagePreview" style="margin-top: 20px; display: none; position: relative; max-width: 400px; align-self: center;">
                <div class="neon-box" style="position: absolute; top: -10px; left: -10px; right: -10px; bottom: -10px; border: 3px solid #00ff9d; border-radius: 15px; box-shadow: 0 0 20px #00ff9d, inset 0 0 10px #00ff9d; animation: neonPulse 1.5s infinite;"></div>
                <img id="previewImage" style="max-width: 100%; max-height: 300px; border-radius: 10px; position: relative; z-index: 1;" />
            </div>
            <div style="margin-top: 20px; position: relative;">
                <input type="range" id="modelSlider" min="0" max="13" value="0" step="1" 
                    style="width: 100%; -webkit-appearance: none; height: 12px; background: linear-gradient(90deg, #00ff9d, #00bfff, #ff00ff); border-radius: 6px; outline: none; cursor: pointer; box-shadow: 0 0 10px rgba(0, 255, 157, 0.5);">
                <div id="modelName" style="text-align: center; font-size: 1.6em; color: #00ff9d; margin-top: 15px; text-shadow: 0 0 10px #00ff9d; transition: all 0.3s ease;">Diabetic Retinopathy Dataset</div>
            </div>
            <div id="classLabels" class="class-labels-container" style="margin-top: 20px;">
                <h4 style="color: #00ff9d; margin-bottom: 15px; text-shadow: 0 0 5px #00ff9d;">Possible Classes:</h4>
                <div id="classLabelList" class="class-label-list" style="display: flex; flex-wrap: wrap; gap: 10px;"></div>
            </div>
            <button class="predict-button" style="margin-top: 20px; padding: 12px 25px; background: linear-gradient(45deg, #00ff9d, #00bfff); border: none; border-radius: 30px; color: #131836; font-weight: bold; cursor: pointer; box-shadow: 0 0 15px #00ff9d; transition: all 0.3s ease;">Predict</button>
            <div id="predictionBox" class="prediction-box" style="display: none; margin-top: 20px; padding: 20px; background: rgba(0, 255, 157, 0.1); border-radius: 15px; border: 2px solid #00ff9d; box-shadow: 0 0 15px #00ff9d;">
                <h4 style="color: #00ff9d; margin-top: 0; text-shadow: 0 0 5px #00ff9d;">Prediction Result</h4>
                <p id="predictionText" style="font-size: 1.4em; font-weight: bold; color: #fff; text-shadow: 0 0 5px #fff;"></p>
            </div>
            <div style="margin-top: 30px;">
                <h3 style="color: #00ff9d; margin-bottom: 15px; text-shadow: 0 0 10px #00ff9d;">Advanced Visualizations</h3>
                <div class="visualization-buttons" style="display: flex; flex-wrap: wrap; gap: 12px;">
                    <button class="visualization-button" id="Edge Detection Visualization" style="padding: 10px 20px; background: rgba(0, 255, 157, 0.2); border: 2px solid #00ff9d; color: #fff; border-radius: 25px; cursor: pointer; transition: all 0.3s ease;">Edge Detection</button>
                    <button class="visualization-button" id="Histogram Equalization Visualization" style="padding: 10px 20px; background: rgba(0, 191, 255, 0.2); border: 2px solid #00bfff; color: #fff; border-radius: 25px; cursor: pointer; transition: all 0.3s ease;">Histogram Equalization</button>
                    <button class="visualization-button" id="Gradient Magnitude Visualization" style="padding: 10px 20px; background: rgba(255, 0, 255, 0.2); border: 2px solid #ff00ff; color: #fff; border-radius: 25px; cursor: pointer; transition: all 0.3s ease;">Gradient Magnitude</button>
                    <button class="visualization-button" id="Region of Interest (ROI) Visualization" style="padding: 10px 20px; background: rgba(255, 204, 0, 0.2); border: 2px solid #ffcc00; color: #fff; border-radius: 25px; cursor: pointer; transition: all 0.3s ease;">ROI Visualization</button>
                    <button class="visualization-button" id="Thermal Visualization" style="padding: 10px 20px; background: rgba(255, 102, 153, 0.2); border: 2px solid #ff6699; color: #fff; border-radius: 25px; cursor: pointer; transition: all 0.3s ease;">Thermal Visualization</button>
                    <button class="visualization-button" id="3D Hologram Visualization" style="padding: 10px 20px; background: rgba(153, 102, 255, 0.2); border: 2px solid #9966ff; color: #fff; border-radius: 25px; cursor: pointer; transition: all 0.3s ease;">3D Hologram</button>
                </div>
            </div>
        </div>
        <button class="close-button" style="position: absolute; top: 15px; right: 15px; background: none; border: none; color: #00ff9d; font-size: 2em; cursor: pointer; text-shadow: 0 0 5px #00ff9d;">×</button>
    `;

    const dashboardContainer = document.createElement('div');
    dashboardContainer.style.cssText = `
        flex: 1;
        background: linear-gradient(135deg, rgba(26, 34, 56, 0.95), rgba(10, 15, 30, 0.95));
        border-radius: 20px;
        box-shadow: 0 0 30px rgba(0, 191, 255, 0.8), inset 0 0 15px rgba(0, 191, 255, 0.3);
        border: 2px solid #00bfff;
        padding: 30px;
        max-height: 90vh;
        overflow-y: auto;
        backdrop-filter: blur(12px);
        min-width: 500px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    `;
    dashboardContainer.innerHTML = `
        <h2 style="color: #00bfff; text-align: center; text-shadow: 0 0 10px #00bfff; margin: 0;">MEDICAL ANALYTICS DASHBOARD</h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            <div class="viz-box" data-viz="edge" style="background: rgba(0, 255, 157, 0.1); border: 2px solid #00ff9d; border-radius: 15px; padding: 15px; position: relative; overflow: hidden;">
                <h3 style="color: #00ff9d; margin-top: 0; text-shadow: 0 0 5px #00ff9d;">Edge Detection</h3>
                <div class="viz-content" style="display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.3);">
                    <p>Edge visualization will appear here</p>
                </div>
                <button class="maximize-button" style="display: none; position: absolute; top: 10px; right: 10px; background: rgba(0, 255, 157, 0.3); border: 1px solid #00ff9d; color: #fff; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Maximize</button>
            </div>
            <div class="viz-box" data-viz="histogram" style="background: rgba(0, 191, 255, 0.1); border: 2px solid #00bfff; border-radius: 15px; padding: 15px; position: relative; overflow: hidden;">
                <h3 style="color: #00bfff; margin-top: 0; text-shadow: 0 0 5px #00bfff;">Histogram Equalization</h3>
                <div class="viz-content" style="display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.3);">
                    <p>Histogram visualization will appear here</p>
                </div>
                <button class="maximize-button" style="display: none; position: absolute; top: 10px; right: 10px; background: rgba(0, 191, 255, 0.3); border: 1px solid #00bfff; color: #fff; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Maximize</button>
            </div>
            <div class="viz-box" data-viz="gradient" style="background: rgba(255, 0, 255, 0.1); border: 2px solid #ff00ff; border-radius: 15px; padding: 15px; position: relative; overflow: hidden;">
                <h3 style="color: #ff00ff; margin-top: 0; text-shadow: 0 0 5px #ff00ff;">Gradient Magnitude</h3>
                <div class="viz-content" style="display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.3);">
                    <p>Gradient visualization will appear here</p>
                </div>
                <button class="maximize-button" style="display: none; position: absolute; top: 10px; right: 10px; background: rgba(255, 0, 255, 0.3); border: 1px solid #ff00ff; color: #fff; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Maximize</button>
            </div>
            <div class="viz-box" data-viz="roi" style="background: rgba(255, 204, 0, 0.1); border: 2px solid #ffcc00; border-radius: 15px; padding: 15px; position: relative; overflow: hidden;">
                <h3 style="color: #ffcc00; margin-top: 0; text-shadow: 0 0 5px #ffcc00;">Region of Interest</h3>
                <div class="viz-content" style="display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.3);">
                    <p>ROI visualization will appear here</p>
                </div>
                <button class="maximize-button" style="display: none; position: absolute; top: 10px; right: 10px; background: rgba(255, 204, 0, 0.3); border: 1px solid #ffcc00; color: #fff; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Maximize</button>
            </div>
            <div class="viz-box" data-viz="thermal" style="background: rgba(255, 102, 153, 0.1); border: 2px solid #ff6699; border-radius: 15px; padding: 15px; position: relative; overflow: hidden;">
                <h3 style="color: #ff6699; margin-top: 0; text-shadow: 0 0 5px #ff6699;">Thermal Visualization</h3>
                <div class="viz-content" style="display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.3);">
                    <p>Thermal visualization will appear here</p>
                </div>
                <button class="maximize-button" style="display: none; position: absolute; top: 10px; right: 10px; background: rgba(255, 102, 153, 0.3); border: 1px solid #ff6699; color: #fff; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Maximize</button>
            </div>
            <div class="viz-box" data-viz="hologram" style="background: rgba(153, 102, 255, 0.1); border: 2px solid #9966ff; border-radius: 15px; padding: 15px; position: relative; overflow: hidden;">
                <h3 style="color: #9966ff; margin-top: 0; text-shadow: 0 0 5px #9966ff;">3D Hologram</h3>
                <div class="viz-content" style="display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.3);">
                    <p>3D visualization will appear here</p>
                </div>
                <button class="maximize-button" style="display: none; position: absolute; top: 10px; right: 10px; background: rgba(153, 102, 255, 0.3); border: 1px solid #9966ff; color: #fff; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Maximize</button>
            </div>
        </div>
    `;
    mainContainer.appendChild(classifierInterface);
    mainContainer.appendChild(dashboardContainer);
    document.body.appendChild(mainContainer);

    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
        @keyframes neonPulse {
            0% { box-shadow: 0 0 10px #00ff9d, inset 0 0 5px #00ff9d; }
            50% { box-shadow: 0 0 30px #00ff9d, inset 0 0 15px #00ff9d; }
            100% { box-shadow: 0 0 10px #00ff9d, inset 0 0 5px #00ff9d; }
        }
        @keyframes vizPulse {
            0% { box-shadow: 0 0 5px currentColor; }
            50% { box-shadow: 0 0 15px currentColor; }
            100% { box-shadow: 0 0 5px currentColor; }
        }
        #modelSlider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 25px;
            height: 25px;
            background: #00ff9d;
            border-radius: 50%;
            box-shadow: 0 0 15px #00ff9d;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        #modelSlider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
        }
        .class-label {
            padding: 8px 15px;
            background: rgba(0, 255, 157, 0.2);
            border-radius: 20px;
            border: 2px solid #00ff9d;
            color: #fff;
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(10px);
        }
        .visualization-button:hover, .viz-box:hover {
            transform: translateY(-3px);
            box-shadow: 0 0 20px currentColor;
        }
        .viz-box:hover .maximize-button {
            display: block;
        }
        #imageInputBox:hover {
            background: rgba(0, 255, 157, 0.2);
            box-shadow: 0 0 20px rgba(0, 255, 157, 0.5);
        }
        .predict-button:hover {
            transform: scale(1.05);
            box-shadow: 0 0 25px #00ff9d;
        }
        .viz-box {
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
        }
        .viz-content {
            flex: 1;
            overflow: hidden;
            position: relative;
        }
        .viz-content img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }
        .viz-content canvas {
            width: 100% !important;
            height: 100% !important;
            object-fit: contain;
        }
        .modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(26, 34, 56, 0.95), rgba(10, 15, 30, 0.95));
            border: 2px solid #00ff9d;
            border-radius: 20px;
            box-shadow: 0 0 30px rgba(0, 255, 157, 0.8);
            padding: 20px;
            z-index: 2000;
            width: 80vw;
            height: 80vh;
            max-width: 1200px;
            max-height: 800px;
            display: flex;
            flex-direction: column;
        }
        .modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            color: #00ff9d;
            font-size: 2em;
            cursor: pointer;
            text-shadow: 0 0 5px #00ff9d;
        }
        .modal-content {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        .modal-content img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        .modal-content canvas {
            max-width: 100%;
            max-height: 100%;
        }
    `;
    document.head.appendChild(style);

    const imageInputBox = classifierInterface.querySelector('#imageInputBox');
    const fileInput = classifierInterface.querySelector('#fileInput');
    const imagePreview = classifierInterface.querySelector('#imagePreview');
    const previewImage = classifierInterface.querySelector('#previewImage');
    const predictionBox = classifierInterface.querySelector('#predictionBox');
    const predictionText = classifierInterface.querySelector('#predictionText');
    const modelSlider = classifierInterface.querySelector('#modelSlider');
    const modelNameDisplay = classifierInterface.querySelector('#modelName');
    const classLabelList = classifierInterface.querySelector('#classLabelList');
    const predictButton = classifierInterface.querySelector('.predict-button');
    const closeButton = classifierInterface.querySelector('.close-button');
    const vizBoxes = dashboardContainer.querySelectorAll('.viz-box');

    const models = [
        { name: "Diabetic Retinopathy Dataset", labels: ["Mild", "Moderate", "No_DR", "Proliferate_DR", "Severe"], color: "#00ff9d" },
        { name: "Acne Level Classification", labels: ["Level_0", "Level_1", "Level_2"], color: "#ff5733" },
        { name: "Kvasir (GastroIntestinal)", labels: ["dyed-lifted-polyps", "dyed-resection-margins", "esophagitis", "normal-cecum", "normal-pylorus", "normal-z-line", "polyps", "ulcerative-colitis"], color: "#3355ff" },
        { name: "Lung Cancer MRI Dataset", labels: ["cancerous", "non-cancerous"], color: "#ff33cc" },
        { name: "Brain Tumor MRI", labels: ["no_tumor", "tumor"], color: "#33ff8c" },
        { name: "Pneumonia X-Ray Dataset", labels: ["NORMAL", "PNEUMONIA"], color: "#ffcc33" },
        { name: "Covid 19 X Ray", labels: ["COVID19", "NORMAL"], color: "#ff6699" },
        { name: "Breast Cancer Ultrasound", labels: ["benign", "malignant"], color: "#9933ff" },
        { name: "Tuberculosis Dataset", labels: ["Normal", "Tuberculosis"], color: "#ff3300" },
        { name: "Skin Cancer Classification", labels: ["benign", "malignant", "no disease"], color: "#ffc300" },
        { name: "Augmented Skin Conditions", labels: ["Acne", "Carcinoma", "Eczema", "Keratosis", "Milia", "Rosacea"], color: "#00ccff" },
        { name: "Alzheimer's MRI Scan", labels: ["Mild Impairment", "Moderate Impairment", "No Impairment", "Very Mild Impairment"], color: "#ff00cc" },
        { name: "Breast Cancer Histopathology", labels: ["benign", "malignant"], color: "#ff007f" },
        { name: "Advanced Brain Cancer Classification", labels: ["glioma", "meningioma", "notumor", "pituitary"], color: "#7f00ff" }
    ];

    modelSlider.max = models.length - 1;
    modelSlider.addEventListener('input', function() {
        datasetChangeSound.play();
        const value = this.value;
        const percent = (value / (models.length - 1)) * 100;
        const currentModel = models[value];
        this.style.background = `linear-gradient(to right, #00ff9d 0%, #00bfff ${percent / 2}%, #ff00ff ${percent}%, #3b3b3b ${percent}%)`;
        modelNameDisplay.style.opacity = 0;
        setTimeout(() => {
            modelNameDisplay.textContent = currentModel.name;
            modelNameDisplay.style.color = currentModel.color;
            modelNameDisplay.style.opacity = 1;
            modelNameDisplay.style.animation = 'neonPulse 0.5s';
        }, 150);
        classLabelList.innerHTML = "";
        currentModel.labels.forEach((label, index) => {
            const labelDiv = document.createElement('div');
            labelDiv.className = 'class-label';
            labelDiv.textContent = label;
            labelDiv.style.borderColor = currentModel.color;
            classLabelList.appendChild(labelDiv);
            setTimeout(() => {
                labelDiv.style.opacity = 1;
                labelDiv.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    });
    modelSlider.dispatchEvent(new Event('input'));

    imageInputBox.addEventListener('click', () => fileInput.click());
    imageInputBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageInputBox.style.background = 'rgba(0, 255, 157, 0.2)';
    });
    imageInputBox.addEventListener('dragleave', () => {
        imageInputBox.style.background = 'rgba(0, 255, 157, 0.05)';
    });
    imageInputBox.addEventListener('drop', (e) => {
        e.preventDefault();
        imageInputBox.style.background = 'rgba(0, 255, 157, 0.05)';
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelect();
        }
    });
    fileInput.addEventListener('change', handleFileSelect);

    function handleFileSelect() {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                imagePreview.style.display = 'block';
                imagePreview.style.opacity = 0;
                setTimeout(() => {
                    imagePreview.style.opacity = 1;
                }, 10);
            };
            reader.readAsDataURL(file);
        }
    }

    predictButton.addEventListener('click', () => {
        const file = fileInput.files[0];
        if (!file) {
            alert("Please upload an image first.");
            return;
        }
        predictButton.disabled = true;
        predictButton.innerHTML = 'Predicting...';
        const formData = new FormData();
        formData.append('model_index', modelSlider.value);
        formData.append('image', file);
        fetch(`                    https://e244-210-19-13-180.ngrok-free.app/api/predict`, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            predictionText.textContent = data.prediction;
            predictionBox.style.display = 'block';
            predictionBox.style.opacity = 0;
            setTimeout(() => {
                predictionBox.style.opacity = 1;
                predictionBox.style.animation = 'neonPulse 1s';
            }, 10);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while making the prediction.');
        })
        .finally(() => {
            predictButton.disabled = false;
            predictButton.textContent = 'Predict';
        });
    });

    function render3DHologram(container, depthData, isModal = false) {
        if (typeof THREE === 'undefined') {
            console.error('Three.js is not loaded.');
            container.innerHTML = `<p style="color: #ff5555; text-align: center;">Error: 3D visualization requires Three.js. Please ensure it is loaded.</p>`;
            return;
        }
        const width = container.clientWidth;
        const height = isModal ? container.clientHeight : container.clientHeight;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        const geometry = new THREE.PlaneGeometry(5, 5, 49, 49);
        const vertices = geometry.attributes.position.array;
        for (let i = 0, j = 0; i < vertices.length; i += 3, j++) {
            vertices[i + 2] = depthData[j] / 255 * 2;
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();

        const material = new THREE.ShaderMaterial({
            uniforms: {
                color1: { value: new THREE.Color(0x9966ff) },
                color2: { value: new THREE.Color(0x00ccff) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color1;
                uniform vec3 color2;
                varying vec2 vUv;
                void main() {
                    gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
                }
            `,
            wireframe: true
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableZoom = isModal;
        controls.enablePan = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2.0;

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        if (isModal) {
            window.addEventListener('resize', () => {
                const newWidth = container.clientWidth;
                const newHeight = container.clientHeight;
                renderer.setSize(newWidth, newHeight);
                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();
            });
        }
    }

    function openMaximizedVisualization(type, data) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <button class="modal-close">×</button>
            <div class="modal-content"></div>
        `;
        document.body.appendChild(modal);

        const modalContent = modal.querySelector('.modal-content');
        if (type === '3D Hologram Visualization') {
            if (typeof THREE === 'undefined') {
                modalContent.innerHTML = `<p style="color: #ff5555; text-align: center;">Error: 3D visualization requires Three.js. Please ensure it is loaded.</p>`;
            } else {
                render3DHologram(modalContent, data, true);
            }
        } else {
            const img = document.createElement('img');
            img.src = data;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            img.style.objectFit = 'contain';
            modalContent.appendChild(img);
        }

        const closeButton = modal.querySelector('.modal-close');
        closeButton.addEventListener('click', () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });

        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }

    const visualizationButtons = classifierInterface.querySelectorAll('.visualization-button');
    visualizationButtons.forEach(button => {
        button.addEventListener('click', () => {
            visualizationClickSound.play();
            const file = fileInput.files[0];
            if (!file) {
                alert("Please upload an image first.");
                return;
            }
            const visualizationType = button.id;
            const originalText = button.textContent;
            button.disabled = true;
            button.textContent = 'Processing...';
            const formData = new FormData();
            formData.append('image', file);
            formData.append('visualization_type', visualizationType);
            fetch(`                    https://e244-210-19-13-180.ngrok-free.app/api/visualize`, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                updateDashboardVisualization(visualizationType, data);
            })
            .catch(error => {
                console.error('Error during visualization:', error);
                alert('Error occurred while fetching visualization.');
            })
            .finally(() => {
                button.disabled = false;
                button.textContent = originalText;
            });
        });
    });

    function updateDashboardVisualization(type, data) {
        let vizBox;
        switch(type) {
            case "Edge Detection Visualization":
                vizBox = dashboardContainer.querySelector('[data-viz="edge"]');
                break;
            case "Histogram Equalization Visualization":
                vizBox = dashboardContainer.querySelector('[data-viz="histogram"]');
                break;
            case "Gradient Magnitude Visualization":
                vizBox = dashboardContainer.querySelector('[data-viz="gradient"]');
                break;
            case "Region of Interest (ROI) Visualization":
                vizBox = dashboardContainer.querySelector('[data-viz="roi"]');
                break;
            case "Thermal Visualization":
                vizBox = dashboardContainer.querySelector('[data-viz="thermal"]');
                break;
            case "3D Hologram Visualization":
                vizBox = dashboardContainer.querySelector('[data-viz="hologram"]');
                break;
            default:
                return;
        }
        if (vizBox) {
            const vizContent = vizBox.querySelector('.viz-content');
            const maximizeButton = vizBox.querySelector('.maximize-button');
            vizContent.innerHTML = '';
            
            // Dynamic height based on visualization type
            let boxHeight = 180; // Default height
            if (type === '3D Hologram Visualization') {
                boxHeight = 250; // Larger for 3D
            } else if (type === 'Histogram Equalization Visualization') {
                boxHeight = 200; // Medium for histogram
            }
            
            vizBox.style.height = `${boxHeight}px`;
            vizContent.style.height = `${boxHeight - 60}px`; // Adjust for header
            
            if (type === '3D Hologram Visualization') {
                if (typeof THREE === 'undefined') {
                    vizContent.innerHTML = `<p style="color: #ff5555; text-align: center;">Error: 3D visualization requires Three.js.</p>`;
                } else {
                    render3DHologram(vizContent, data.visualization_data);
                }
            } else {
                const img = document.createElement('img');
                img.src = data.visualization;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'contain';
                vizContent.appendChild(img);
            }
            maximizeButton.style.display = 'none';
            vizBox.style.animation = 'vizPulse 1s';
            setTimeout(() => {
                vizBox.style.animation = '';
                maximizeButton.style.display = 'none';
            }, 1000);
            maximizeButton.onclick = () => {
                openMaximizedVisualization(type, type === '3D Hologram Visualization' ? data.visualization_data : data.visualization);
            };
        }
    }

    vizBoxes.forEach(vizBox => {
        vizBox.addEventListener('mouseenter', () => {
            const maximizeButton = vizBox.querySelector('.maximize-button');
            if (vizBox.querySelector('.viz-content').children.length > 0) {
                maximizeButton.style.display = 'block';
            }
        });
        vizBox.addEventListener('mouseleave', () => {
            const maximizeButton = vizBox.querySelector('.maximize-button');
            maximizeButton.style.display = 'none';
        });
    });

    closeButton.addEventListener('click', () => {
        mainContainer.style.opacity = '0';
        mainContainer.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(mainContainer);
        }, 300);
    });
}
  
  
  
function open3DLimbReconstruction() {
    const mainContainer = document.createElement('div');
    mainContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90vw;
        max-width: 1200px;
        height: 80vh;
        background: linear-gradient(135deg, rgba(26, 34, 56, 0.95), rgba(10, 15, 30, 0.95));
        border-radius: 20px;
        box-shadow: 0 0 60px rgba(0, 247, 255, 0.8), inset 0 0 30px rgba(0, 247, 255, 0.5);
        border: 3px solid #00f7ff;
        z-index: 1000;
        overflow: hidden;
        backdrop-filter: blur(20px);
        display: flex;
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
        transition: all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
        animation: pulseBorder 2s infinite;
    `;

    mainContainer.innerHTML = `
        <div style="flex: 1; padding: 30px; border-right: 1px solid rgba(0, 247, 255, 0.3); display: flex; flex-direction: column;">
            <h3 style="color: #00f7ff; margin: 0 0 20px 0; text-shadow: 0 0 10px #00f7ff; font-family: 'Orbitron', sans-serif; letter-spacing: 2px;">
                ORIGINAL IMAGE
            </h3>
            <div id="imageUploadBox" style="flex: 1; border: 3px dashed #00f7ff; border-radius: 15px; display: flex; justify-content: center; align-items: center; cursor: pointer; background: rgba(0, 247, 255, 0.05); transition: all 0.3s ease; position: relative; overflow: hidden;">
                <div style="text-align: center;">
                    <i class="fas fa-cloud-upload-alt" style="font-size: 3em; color: #00f7ff; margin-bottom: 15px;"></i>
                    <p style="color: #00f7ff; font-size: 1.2em; text-shadow: 0 0 5px #00f7ff;">Click or Drop Limb Image Here</p>
                </div>
                <div id="originalImagePreview" style="display: none; width: 100%; height: 100%; position: absolute; top: 0; left: 0; background-size: contain; background-position: center; background-repeat: no-repeat;"></div>
            </div>
            <input type="file" id="limbImageInput" accept="image/*" style="display: none;">
            <div style="margin-top: 20px; display: flex; justify-content: space-between;">
                <button id="captureBtn" style="padding: 12px 25px; background: linear-gradient(45deg, #00f7ff, #7b2dff); border: none; border-radius: 25px; color: #131836; font-weight: bold; cursor: pointer; box-shadow: 0 0 15px #00f7ff; transition: all 0.3s ease; opacity: 0.5; pointer-events: none;">
                    CAPTURE IMAGE
                </button>
                <button id="uploadBtn" style="padding: 12px 25px; background: linear-gradient(45deg, #00f7ff, #7b2dff); border: none; border-radius: 25px; color: #131836; font-weight: bold; cursor: pointer; box-shadow: 0 0 15px #00f7ff; transition: all 0.3s ease;">
                    UPLOAD IMAGE
                </button>
            </div>
        </div>
        <div style="flex: 1; padding: 30px; display: flex; flex-direction: column;">
            <h3 style="color: #7b2dff; margin: 0 0 20px 0; text-shadow: 0 0 10px #7b2dff; font-family: 'Orbitron', sans-serif; letter-spacing: 2px;">
                3D RECONSTRUCTION
            </h3>
            <div id="reconstructionView" style="flex: 1; border-radius: 15px; background: rgba(123, 45, 255, 0.05); border: 3px dashed #7b2dff; display: flex; justify-content: center; align-items: center; position: relative; overflow: hidden;">
                <div id="reconstructionPlaceholder" style="text-align: center;">
                    <i class="fas fa-cube" style="font-size: 3em; color: #7b2dff; margin-bottom: 15px;"></i>
                    <p style="color: #7b2dff; font-size: 1.2em; text-shadow: 0 0 5px #7b2dff;">3D Reconstruction will appear here</p>
                </div>
                <canvas id="reconstructionCanvas" style="display: none; width: 100%; height: 100%; max-width: 100%; max-height: 100%; object-fit: contain;"></canvas>
                <canvas id="reconstructionResult" style="display: none; width: 100%; height: 100%; max-width: 100%; max-height: 100%; object-fit: contain;"></canvas>
            </div>
            <div style="margin-top: 20px; display: flex; justify-content: space-between;">
                <button id="toggleViewBtn" style="padding: 12px 25px; background: linear-gradient(45deg, #7b2dff, #ff2d5e); border: none; border-radius: 25px; color: #131836; font-weight: bold; cursor: pointer; box-shadow: 0 0 15px #7b2dff; transition: all 0.3s ease; opacity: 0.5; pointer-events: none;">
                    TOGGLE 3D VIEW
                </button>
                <button id="exportBtn" style="padding: 12px 25px; background: linear-gradient(45deg, #7b2dff, #ff2d5e); border: none; border-radius: 25px; color: #131836; font-weight: bold; cursor: pointer; box-shadow: 0 0 15px #7b2dff; transition: all 0.3s ease; opacity: 0.5; pointer-events: none;">
                    EXPORT MODEL
                </button>
            </div>
        </div>
        <button class="close-button" style="position: absolute; top: 15px; right: 15px; background: none; border: none; color: #00f7ff; font-size: 2em; cursor: pointer; text-shadow: 0 0 5px #00f7ff;">×</button>
    `;

    document.body.appendChild(mainContainer);

    // Load Three.js and OrbitControls
    const threeScript = document.createElement('script');
    threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    document.head.appendChild(threeScript);

    const orbitScript = document.createElement('script');
    orbitScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
    document.head.appendChild(orbitScript);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulseBorder {
            0% { border-color: #00f7ff; box-shadow: 0 0 60px rgba(0, 247, 255, 0.8), inset 0 0 30px rgba(0, 247, 255, 0.5); }
            50% { border-color: #7b2dff; box-shadow: 0 0 80px rgba(123, 45, 255, 0.8), inset 0 0 40px rgba(123, 45, 255, 0.5); }
            100% { border-color: #00f7ff; box-shadow: 0 0 60px rgba(0, 247, 255, 0.8), inset 0 0 30px rgba(0, 247, 255, 0.5); }
        }
        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        #imageUploadBox:hover {
            background: rgba(0, 247, 255, 0.1);
            box-shadow: 0 0 20px rgba(0, 247, 255, 0.3);
        }
        #reconstructionView:hover {
            background: rgba(123, 45, 255, 0.1);
            box-shadow: 0 0 20px rgba(123, 45, 255, 0.3);
        }
        button:hover {
            transform: scale(1.05);
            box-shadow: 0 0 25px currentColor !important;
        }
        .scanline {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(to bottom, transparent, rgba(0, 247, 255, 0.3), transparent);
            animation: scanline 5s infinite linear;
            pointer-events: none;
        }
        .processing-animation {
            width: 200px;
            height: 200px;
            background: conic-gradient(#00f7ff, #7b2dff, #ff2d5e, #00f7ff);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: spin 2s linear infinite;
        }
        .processing-inner {
            width: 180px;
            height: 180px;
            background: rgba(10, 15, 30, 0.9);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #reconstructionView > * {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    `;
    document.head.appendChild(style);

    // Add scanlines
    const scanline1 = document.createElement('div');
    scanline1.className = 'scanline';
    scanline1.style.animationDelay = '0s';
    mainContainer.querySelector('#imageUploadBox').appendChild(scanline1);

    const scanline2 = document.createElement('div');
    scanline2.className = 'scanline';
    scanline2.style.animationDelay = '1.5s';
    mainContainer.querySelector('#reconstructionView').appendChild(scanline2);

    // Fade in the container
    setTimeout(() => {
        mainContainer.style.opacity = '1';
        mainContainer.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);

    // Close button functionality
    mainContainer.querySelector('.close-button').addEventListener('click', () => {
        mainContainer.style.opacity = '0';
        mainContainer.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(mainContainer);
            document.head.removeChild(style);
            document.head.removeChild(threeScript);
            document.head.removeChild(orbitScript);
        }, 400);
    });

    // Image upload functionality
    const imageUploadBox = mainContainer.querySelector('#imageUploadBox');
    const limbImageInput = mainContainer.querySelector('#limbImageInput');
    const originalImagePreview = mainContainer.querySelector('#originalImagePreview');
    const uploadBtn = mainContainer.querySelector('#uploadBtn');
    const captureBtn = mainContainer.querySelector('#captureBtn');
    const toggleViewBtn = mainContainer.querySelector('#toggleViewBtn');
    const exportBtn = mainContainer.querySelector('#exportBtn');
    const reconstructionView = mainContainer.querySelector('#reconstructionView');
    const reconstructionPlaceholder = mainContainer.querySelector('#reconstructionPlaceholder');
    const reconstructionCanvas = mainContainer.querySelector('#reconstructionCanvas');
    const reconstructionResult = mainContainer.querySelector('#reconstructionResult');

    let uploadedImageData = null;
    let threeJSInitialized = false;
    let scene, camera, renderer, controls, mesh;
    let is3DView = false;

    imageUploadBox.addEventListener('click', () => limbImageInput.click());
    imageUploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUploadBox.style.background = 'rgba(0, 247, 255, 0.1)';
        imageUploadBox.style.boxShadow = '0 0 20px rgba(0, 247, 255, 0.3)';
    });
    imageUploadBox.addEventListener('dragleave', () => {
        imageUploadBox.style.background = 'rgba(0, 247, 255, 0.05)';
        imageUploadBox.style.boxShadow = 'none';
    });
    imageUploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploadBox.style.background = 'rgba(0, 247, 255, 0.05)';
        imageUploadBox.style.boxShadow = 'none';
        if (e.dataTransfer.files.length) {
            limbImageInput.files = e.dataTransfer.files;
            handleImageUpload();
        }
    });

    limbImageInput.addEventListener('change', handleImageUpload);
    uploadBtn.addEventListener('click', () => limbImageInput.click());

    function handleImageUpload() {
        const file = limbImageInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            originalImagePreview.style.backgroundImage = `url(${e.target.result})`;
            originalImagePreview.style.display = 'block';
            imageUploadBox.querySelector('div').style.display = 'none';
            uploadedImageData = { original: e.target.result };
            captureBtn.style.opacity = '1';
            captureBtn.style.pointerEvents = 'auto';
        };
        reader.readAsDataURL(file);
    }

    // Capture button functionality
    captureBtn.addEventListener('click', async () => {
        if (!limbImageInput.files.length) return;

        reconstructionPlaceholder.style.display = 'none';
        reconstructionCanvas.style.display = 'none';
        reconstructionResult.style.display = 'none';

        reconstructionView.innerHTML = `
            <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
                <div class="processing-animation">
                    <div class="processing-inner">
                        <i class="fas fa-cube" style="font-size: 2em; color: #7b2dff;"></i>
                    </div>
                </div>
                <div style="position: absolute; bottom: 20px; color: #7b2dff; text-align: center;">
                    <p>Processing image for 3D reconstruction...</p>
                    <p>This may take a few moments</p>
                </div>
            </div>
        `;

        captureBtn.disabled = true;
        captureBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PROCESSING...';

        const minAnimationTime = 7000;
        const animationStart = Date.now();

        try {
            const formData = new FormData();
            formData.append('image', limbImageInput.files[0]);

            const response = await fetch('     https://e244-210-19-13-180.ngrok-free.app/api/limb_reconstruction', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            uploadedImageData = {
                original: uploadedImageData.original,
                reconstruction: data.reconstruction,
                depth_data: data.depth_data
            };

            const elapsed = Date.now() - animationStart;
            const remaining = minAnimationTime - elapsed;
            if (remaining > 0) {
                await new Promise(resolve => setTimeout(resolve, remaining));
            }

            initializeThreeJS(data.depth_data);

            reconstructionView.innerHTML = '';
            reconstructionResult.style.display = 'block';
            reconstructionView.appendChild(reconstructionResult);
            render2DDepthMap();

            captureBtn.innerHTML = 'CAPTURE COMPLETE';
            toggleViewBtn.style.opacity = '1';
            toggleViewBtn.style.pointerEvents = 'auto';
            exportBtn.style.opacity = '1';
            exportBtn.style.pointerEvents = 'auto';

        } catch (error) {
            console.error('Error during limb reconstruction:', error);
            reconstructionView.innerHTML = `
                <div style="text-align: center; color: #ff2d5e;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3em; margin-bottom: 15px;"></i>
                    <p>Error processing image: ${error.message}</p>
                    <p>Please try again.</p>
                </div>
            `;
            captureBtn.innerHTML = 'CAPTURE FAILED';
        } finally {
            captureBtn.disabled = false;
        }
    });

    // Toggle view button functionality
    toggleViewBtn.addEventListener('click', () => {
        if (!uploadedImageData || !uploadedImageData.reconstruction) {
            alert('Please capture an image first.');
            return;
        }

        is3DView = !is3DView;
        reconstructionView.innerHTML = '';
        reconstructionPlaceholder.style.display = 'none';
        reconstructionCanvas.style.display = is3DView ? 'block' : 'none';
        reconstructionResult.style.display = is3DView ? 'none' : 'block';
        reconstructionView.appendChild(reconstructionCanvas);
        reconstructionView.appendChild(reconstructionResult);

        if (is3DView) {
            toggleViewBtn.innerHTML = 'SHOW 2D DEPTH MAP';
            animate();
        } else {
            toggleViewBtn.innerHTML = 'SHOW 3D VIEW';
            render2DDepthMap();
        }
    });

    // Render 2D depth map
    function render2DDepthMap() {
        const img = new Image();
        img.onload = function() {
            const ctx = reconstructionResult.getContext('2d');
            reconstructionResult.width = reconstructionView.clientWidth;
            reconstructionResult.height = reconstructionView.clientHeight;
            const aspect = img.width / img.height;
            let drawWidth = reconstructionResult.width;
            let drawHeight = drawWidth / aspect;
            if (drawHeight > reconstructionResult.height) {
                drawHeight = reconstructionResult.height;
                drawWidth = drawHeight * aspect;
            }
            ctx.clearRect(0, 0, reconstructionResult.width, reconstructionResult.height);
            ctx.drawImage(img, (reconstructionResult.width - drawWidth) / 2, (reconstructionResult.height - drawHeight) / 2, drawWidth, drawHeight);
        };
        img.onerror = function() {
            reconstructionView.innerHTML = `
                <div style="text-align: center; color: #ff2d5e;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3em; margin-bottom: 15px;"></i>
                    <p>Error loading reconstruction image.</p>
                    <p>Please try again.</p>
                </div>
            `;
        };
        img.src = uploadedImageData.reconstruction;
    }

    // Export button functionality
    exportBtn.addEventListener('click', () => {
        if (!uploadedImageData || !uploadedImageData.reconstruction) {
            alert('No reconstruction to export.');
            return;
        }

        const link = document.createElement('a');
        link.href = uploadedImageData.reconstruction;
        link.download = 'limb_reconstruction.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Three.js initialization
    function initializeThreeJS(depthData) {
        if (threeJSInitialized || !depthData) return;

        if (!window.THREE || !window.THREE.OrbitControls) {
            console.error('Three.js or OrbitControls not loaded.');
            reconstructionView.innerHTML = `
                <div style="text-align: center; color: #ff2d5e;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3em; margin-bottom: 15px;"></i>
                    <p>Error: 3D visualization requires Three.js.</p>
                </div>
            `;
            return;
        }

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, reconstructionView.clientWidth / reconstructionView.clientHeight, 0.1, 1000);

        renderer = new THREE.WebGLRenderer({ canvas: reconstructionCanvas, antialias: true, alpha: true });
        renderer.setSize(reconstructionView.clientWidth, reconstructionView.clientHeight);
        renderer.setClearColor(0x000000, 0);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const pointLight1 = new THREE.PointLight(0xffffff, 0.8, 10);
        pointLight1.position.set(5, 5, 5);
        scene.add(pointLight1);
        const pointLight2 = new THREE.PointLight(0xffffff, 0.8, 10);
        pointLight2.position.set(-5, -5, 5);
        scene.add(pointLight2);

        // Create high-resolution mesh
        const geometry = new THREE.PlaneGeometry(5, 5, 99, 99); // 100x100 grid
        const vertices = geometry.attributes.position.array;
        for (let i = 0, j = 0; i < vertices.length; i += 3, j++) {
            vertices[i + 2] = depthData[j] / 255 * 3; // Increased depth scaling
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();

        // Light blue material
        const material = new THREE.MeshStandardMaterial({
            color: 0x66ccff, // Light blue
            metalness: 0.7,
            roughness: 0.3,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.85
        });

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        camera.position.set(7, 7, 7);
        camera.lookAt(0, 0, 0);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.5;

        threeJSInitialized = true;

        // Handle window resize
        window.addEventListener('resize', () => {
            const newWidth = reconstructionView.clientWidth;
            const newHeight = reconstructionView.clientHeight;
            renderer.setSize(newWidth, newHeight);
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
        });
    }

    // Animation loop
    function animate() {
        if (!threeJSInitialized || !is3DView) return;

        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
}

// Update the button event listener
const limbReconButton = document.querySelector('.quantum-button[data-action="genome-scan"]');
if (limbReconButton) {
    limbReconButton.addEventListener('click', open3DLimbReconstruction);
}
  
 //----------------- Cognitive Enhancement Game Logic -------------------
// Function to open Memory Match Game
function openMemoryMatchGame() {
    const flipSound = new Audio("https://cdn.glitch.global/2508eb66-3414-4a92-9b98-f5a7a4c95ef8/flipcard-91468.mp3?v=1740027421872");
    const matchSound = new Audio("https://cdn.glitch.global/2508eb66-3414-4a92-9b98-f5a7a4c95ef8/yay-6120.mp3?v=1740027422991");
    const successSound = new Audio("https://cdn.glitch.global/2508eb66-3414-4a92-9b98-f5a7a4c95ef8/success-fanfare-trumpets-6185.mp3?v=1740027423210");

    // Create neon modal
    const gameModal = document.createElement('div');
    gameModal.id = "gameModal";
    document.body.appendChild(gameModal);

    // Add futuristic font
    const fontLink = document.createElement('link');
    fontLink.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    // Add CSS for ultra-futuristic neon styling
    const style = document.createElement('style');
    style.textContent = `
        #gameModal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 900px;
            height: 700px;
            max-height: 90vh;
            background: linear-gradient(135deg, #1a1c2c, #0f1123);
            border: 3px solid #00ff9d;
            border-radius: 20px;
            box-shadow: 
                0 0 20px #00ff9d,
                0 0 40px #00bfff,
                0 0 60px #ff00ff,
                inset 0 0 15px rgba(255, 255, 255, 0.2);
            z-index: 1000;
            overflow-y: auto;
            overflow-x: hidden;
            animation: neonPulse 2s infinite alternate;
            flex-direction: column;
            align-items: center;
            font-family: 'Orbitron', sans-serif;
        }
        #gameModal.hard {
            height: 800px;
        }
        #gameModal.show {
            display: flex;
        }
        #particleCanvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
        h2 {
            color: #00ff9d;
            text-shadow: 
                0 0 10px #00ff9d,
                0 0 20px #00ff9d,
                0 0 30px #00bfff;
            font-size: 32px;
            margin: 20px 0;
            letter-spacing: 2px;
            text-transform: uppercase;
            animation: flicker 3s infinite;
        }
        #gameBoard {
            display: grid;
            gap: 15px;
            margin: 20px auto;
            perspective: 1000px;
        }
        .card {
            width: 90px;
            height: 130px;
            font-size: 30px;
            font-weight: bold;
            cursor: pointer;
            border-radius: 12px;
            transition: transform 0.5s, box-shadow 0.3s;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 2px solid rgba(255, 255, 255, 0.2);
            background: linear-gradient(45deg, #131836, #1a1c2c);
            box-shadow: 
                0 0 10px rgba(0, 255, 255, 0.5),
                inset 0 0 5px rgba(0, 255, 255, 0.3);
            position: relative;
            transform-style: preserve-3d;
            color: transparent;
        }
        .card:before {
            content: "?";
            position: absolute;
            font-size: 40px;
            color: #00ff9d;
            text-shadow: 0 0 10px #00ff9d;
            transition: opacity 0.3s;
        }
        .card.revealed:before {
            opacity: 0;
        }
        .card.revealed {
            color: #ffffff;
            transform: rotateY(180deg) scale(1.05);
            box-shadow: 
                0 0 20px rgba(255, 255, 255, 0.7),
                0 0 30px rgba(0, 255, 255, 0.5);
        }
        .card.easy.revealed {
            background: linear-gradient(45deg, #00ff9d, #00cc7a);
        }
        .card.medium.revealed {
            background: linear-gradient(45deg, #00bfff, #0099cc);
        }
        .card.hard.revealed {
            background: linear-gradient(45deg, #ff00ff, #cc00cc);
        }
        .card.matched {
            animation: neonGlow 1.5s infinite;
        }
        .card:hover:not(.matched):not(.revealed) {
            transform: translateZ(20px);
            box-shadow: 
                0 0 20px #00ff9d,
                0 0 30px #00bfff;
        }
        @keyframes neonPulse {
            0% { box-shadow: 0 0 20px #00ff9d, 0 0 40px #00bfff, 0 0 60px #ff00ff; }
            100% { box-shadow: 0 0 30px #00ff9d, 0 0 50px #00bfff, 0 0 80px #ff00ff; }
        }
        @keyframes flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }
        @keyframes neonGlow {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        #message {
            height: 50px;
            margin: 10px 0;
            color: #ffffff;
            font-size: 20px;
            text-shadow: 0 0 10px #00bfff;
            text-align: center;
            padding: 10px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 10px;
            max-width: 80%;
            opacity: 0;
            transition: opacity 0.5s;
        }
        #message.show {
            opacity: 1;
        }
        #level-selector {
            display: flex;
            gap: 15px;
            margin: 15px 0;
        }
        .level-btn {
            padding: 12px 20px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            color: #0a0b1e;
            transition: all 0.3s;
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
        }
        .level-btn.easy {
            background: linear-gradient45deg, #00ff9d, #00cc7a);
        }
        .level-btn.medium {
            background: linear-gradient(45deg, #00bfff, #0099cc);
        }
        .level-btn.hard {
            background: linear-gradient(45deg, #ff00ff, #cc00cc);
        }
        .level-btn:hover {
            transform: scale(1.1);
            box-shadow: 
                0 0 15px #ffffff,
                0 0 25px #00ff9d;
        }
        #stats {
            margin: 10px 0;
            font-size: 18px;
            color: #00ff9d;
            text-shadow: 0 0 5px #00ff9d;
            text-align: center;
        }
        #close-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: linear-gradient(45deg, #ff3333, #cc0000);
            color: #ffffff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            font-size: 16px;
            transition: all 0.3s;
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
            box-shadow: 0 0 10px rgba(255, 51, 51, 0.7);
        }
        #close-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 0 15px rgba(255, 51, 51, 0.9);
            background: linear-gradient(45deg, #ff6666, #ff3333);
        }
    `;
    document.head.appendChild(style);

    // Create particle canvas
    const particleCanvas = document.createElement('canvas');
    particleCanvas.id = "particleCanvas";
    gameModal.appendChild(particleCanvas);

    // Particle effect
    const ctx = particleCanvas.getContext('2d');
    particleCanvas.width = 900;
    particleCanvas.height = 700; // Match default modal height
    const particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * particleCanvas.width,
            y: Math.random() * particleCanvas.height,
            radius: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            color: ['#00ff9d', '#00bfff', '#ff00ff'][Math.floor(Math.random() * 3)]
        });
    }
    function animateParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0 || p.x > particleCanvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > particleCanvas.height) p.speedY *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Create header
    const header = document.createElement('h2');
    header.textContent = "NEON MEMORY MATRIX";
    gameModal.appendChild(header);

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.id = "close-btn";
    closeButton.textContent = "Exit Matrix";
    closeButton.addEventListener('click', () => {
        gameModal.classList.remove('show');
        gameModal.remove();
    });
    gameModal.appendChild(closeButton);

    // Create level selector
    const levelSelector = document.createElement('div');
    levelSelector.id = "level-selector";
    gameModal.appendChild(levelSelector);

    // Define difficulty levels
    const difficultyLevels = {
        easy: {
            title: "Quantum Initiate",
            pairs: 4,
            columns: 4,
            timeout: 1500,
            encouragements: [
                "Quantum sync achieved!",
                "Neural pathways optimized!",
                "Memory matrix stabilizing!",
                "Synaptic connection secured!"
            ],
            scoreMultiplier: 10
        },
        medium: {
            title: "Cyber Adept",
            pairs: 6,
            columns: 4,
            timeout: 1200,
            encouragements: [
                "Cybernetic focus enhanced!",
                "Data streams aligned!",
                "Memory core upgraded!",
                "Neural interface boosted!"
            ],
            scoreMultiplier: 20
        },
        hard: {
            title: "Neon Master",
            pairs: 8,
            columns: 4,
            timeout: 1000,
            encouragements: [
                "Master-level sync complete!",
                "Quantum core overclocked!",
                "Memory matrix perfected!",
                "Neural transcendence achieved!"
            ],
            scoreMultiplier: 30
        }
    };

    // Create level buttons
    Object.keys(difficultyLevels).forEach(level => {
        const btn = document.createElement('button');
        btn.className = `level-btn ${level}`;
        btn.textContent = difficultyLevels[level].title;
        btn.addEventListener('click', () => startGame(level));
        levelSelector.appendChild(btn);
    });

    // Create message display
    const messageDisplay = document.createElement('div');
    messageDisplay.id = "message";
    gameModal.appendChild(messageDisplay);

    // Create game board
    const gameBoard = document.createElement('div');
    gameBoard.id = "gameBoard";
    gameModal.appendChild(gameBoard);

    // Create stats display
    const statsDisplay = document.createElement('div');
    statsDisplay.id = "stats";
    gameModal.appendChild(statsDisplay);

    let currentLevel = null;
    let firstChoice = null;
    let secondChoice = null;
    let matches = 0;
    let canClick = true;
    let attempts = 0;
    let score = 0;
    let timer = 0;
    let timerInterval = null;

    function startGame(level) {
        // Reset game state
        gameBoard.innerHTML = '';
        messageDisplay.textContent = '';
        messageDisplay.classList.remove('show');
        firstChoice = null;
        secondChoice = null;
        matches = 0;
        attempts = 0;
        score = 0;
        timer = 0;
        canClick = true;
        currentLevel = level;

        // Adjust modal height for hard level
        if (level === 'hard') {
            gameModal.classList.add('hard');
            particleCanvas.height = 800; // Match modal height
        } else {
            gameModal.classList.remove('hard');
            particleCanvas.height = 700; // Default height
        }

        // Start timer
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timer++;
            updateStats();
        }, 1000);

        // Update stats
        updateStats();

        const levelConfig = difficultyLevels[level];

        // Set grid columns
        gameBoard.style.gridTemplateColumns = `repeat(${levelConfig.columns}, 1fr)`;

        // Create cards
        const cardNames = Array.from({ length: levelConfig.pairs }, (_, i) => 
            String.fromCharCode(65 + i)
        );

        const cards = [...cardNames, ...cardNames];
        randomizeCards(cards);

        cards.forEach((cardValue, index) => {
            const cardButton = document.createElement('button');
            cardButton.className = `card ${level}`;
            cardButton.dataset.value = cardValue;
            cardButton.dataset.index = index;
            cardButton.textContent = cardValue;

            cardButton.addEventListener('click', () => {
                if (!canClick || cardButton.classList.contains('revealed') || 
                    cardButton.classList.contains('matched')) {
                    return;
                }

                if (!firstChoice) {
                    flipCard(cardButton, cardValue);
                    firstChoice = { card: cardButton, value: cardValue, index: index };
                } else if (firstChoice.index !== index) {
                    flipCard(cardButton, cardValue);
                    secondChoice = { card: cardButton, value: cardValue, index: index };
                    canClick = false;
                    attempts++;
                    updateStats();

                    setTimeout(() => {
                        if (firstChoice.value === secondChoice.value) {
                            matchedCards(firstChoice.card, secondChoice.card);
                            showEncouragement();
                        } else {
                            unflipCards(firstChoice.card, secondChoice.card);
                        }
                        firstChoice = null;
                        secondChoice = null;
                        canClick = true;
                    }, levelConfig.timeout);
                }
            });

            gameBoard.appendChild(cardButton);
        });

        // Show welcome message
        showMessage(`Initializing ${levelConfig.title} protocol. Sync ${levelConfig.pairs} neural nodes!`);

        // Show modal
        gameModal.classList.add('show');
    }

    function flipCard(card, value) {
        flipSound.play();
        card.textContent = value;
        card.classList.add('revealed');
    }

    function matchedCards(card1, card2) {
        matchSound.play();
        card1.classList.add('matched');
        card2.classList.add('matched');
        matches++;
        score += difficultyLevels[currentLevel].scoreMultiplier * (100 - timer);
        if (score < 0) score = 0;

        updateStats();

        const totalPairs = difficultyLevels[currentLevel].pairs;

        if (matches === totalPairs) {
            clearInterval(timerInterval);
            setTimeout(() => {
                successSound.play();
                const message = `Neural sync complete! Score: ${score} in ${timer} seconds!`;
                showMessage(message);

                if (currentLevel === 'easy') {
                    setTimeout(() => {
                        showMessage("Ready for Cyber Adept protocol?");
                    }, 3000);
                } else if (currentLevel === 'medium') {
                    setTimeout(() => {
                        showMessage("Initiate Neon Master protocol?");
                    }, 3000);
                } else {
                    setTimeout(() => {
                        showMessage("Matrix mastery achieved! Neural core optimized!");
                    }, 3000);
                }
            }, 500);
        }
    }

    function unflipCards(card1, card2) {
        setTimeout(() => {
            card1.classList.remove('revealed');
            card2.classList.remove('revealed');
            card1.textContent = '?';
            card2.textContent = '?';
        }, 300);
    }

    function randomizeCards(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function showEncouragement() {
        const encouragements = difficultyLevels[currentLevel].encouragements;
        const message = encouragements[Math.floor(Math.random() * encouragements.length)];
        showMessage(message);
    }

    function showMessage(text) {
        messageDisplay.textContent = text;
        messageDisplay.classList.add('show');

        setTimeout(() => {
            messageDisplay.classList.remove('show');
        }, 3000);
    }

    function updateStats() {
        const totalPairs = currentLevel ? difficultyLevels[currentLevel].pairs : 0;
        statsDisplay.textContent = currentLevel ? 
            `Nodes: ${matches}/${totalPairs} | Attempts: ${attempts} | Score: ${score} | Time: ${timer}s` : '';
    }

    // Start with easy level
    startGame('easy');
}
  
  
  
  
//----------------- Chatbot Functionality -------------------
const openChatbotButton = document.getElementById('openChatbot');

openChatbotButton.addEventListener('click', openChatbot);

function openChatbot() {
    const chatbotInterface = document.createElement('div');
    chatbotInterface.classList.add('chatbot-interface');
    chatbotInterface.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        width: 650px;
        max-width: 95vw;
        max-height: 90vh;
        background: linear-gradient(135deg, rgba(26, 34, 56, 0.95), rgba(10, 15, 30, 0.95));
        border-radius: 20px;
        box-shadow: 0 0 30px rgba(0, 255, 157, 0.8), inset 0 0 15px rgba(0, 255, 157, 0.3);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 1000;
        transition: transform 0.3s ease, opacity 0.3s ease;
        opacity: 0;
        border: 2px solid #00ff9d;
        animation: neonPulse 1.5s infinite;
    `;
    setTimeout(() => {
        chatbotInterface.style.opacity = '1';
        chatbotInterface.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 50);

    chatbotInterface.innerHTML = `
        <div class="chatbot-header" style="background: linear-gradient(45deg, #00ff9d, #00bfff); color: #131836; padding: 20px; display: flex; justify-content: space-between; align-items: center; border-top-left-radius: 20px; border-top-right-radius: 20px; box-shadow: 0 0 15px rgba(0, 255, 157, 0.5);">
           <h2 style="margin: 0; font-size: 1.8em; font-weight: bold; text-shadow: 0 0 10px #fff; color: blue;">VZ-LlamaTron1B</h2>
            <button class="close-chatbot" style="border: none; background: none; color: #131836; cursor: pointer; font-size: 2em; text-shadow: 0 0 5px #fff;">×</button>
        </div>
        <div id="responseText" class="response-text" style="padding: 20px; flex-grow: 1; overflow-y: auto; background: rgba(0, 0, 0, 0.2); border-bottom: 2px solid #00ff9d; height: 450px; color: #fff; text-shadow: 0 0 5px #fff;"></div>
        <div id="thinkingLabel" style="text-align: center; color: #00ff9d; font-weight: bold; font-size: 1.4em; padding: 10px; display: none; text-shadow: 0 0 10px #00ff9d; background: rgba(0, 255, 157, 0.1);">VZ-SentraThink...</div>
        <div id="inputContainer" style="display: flex; padding: 15px; background: rgba(0, 255, 157, 0.05); border-bottom-left-radius: 20px; border-bottom-right-radius: 20px;">
            <input type="text" id="userQuestion" placeholder="Ask your medical question..." style="padding: 12px; border: 2px solid #00ff9d; border-radius: 10px; flex: 1; background: rgba(255, 255, 255, 0.1); color: #fff; outline: none; box-shadow: 0 0 10px rgba(0, 255, 157, 0.3); transition: all 0.3s ease;" />
            <button id="askButton" style="padding: 12px 25px; border: none; background: linear-gradient(45deg, #00ff9d, #00bfff); color: #131836; cursor: pointer; border-radius: 10px; margin-left: 15px; font-size: 1.2em; font-weight: bold; box-shadow: 0 0 15px #00ff9d; transition: all 0.3s ease;">Ask</button>
        </div>
    `;

    document.body.appendChild(chatbotInterface);

    const style = document.createElement('style');
    style.textContent = `
        @keyframes neonPulse {
            0% { box-shadow: 0 0 10px #00ff9d, inset 0 0 5px #00ff9d; }
            50% { box-shadow: 0 0 30px #00ff9d, inset 0 0 15px #00ff9d; }
            100% { box-shadow: 0 0 10px #00ff9d, inset 0 0 5px #00ff9d; }
        }
        #userQuestion:focus {
            border-color: #00bfff;
            box-shadow: 0 0 20px rgba(0, 191, 255, 0.5);
        }
        #askButton:hover {
            transform: scale(1.05);
            box-shadow: 0 0 25px #00ff9d;
        }
        .response-text > div {
            margin: 10px 0;
            padding: 15px;
            background: rgba(0, 255, 157, 0.1);
            border-radius: 15px;
            border: 2px solid #00ff9d;
            box-shadow: 0 0 10px rgba(0, 255, 157, 0.3);
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    const closeButton = chatbotInterface.querySelector('.close-chatbot');
    const askButton = chatbotInterface.querySelector('#askButton');
    const userQuestion = chatbotInterface.querySelector('#userQuestion');
    const responseText = chatbotInterface.querySelector('#responseText');
    const thinkingLabel = chatbotInterface.querySelector('#thinkingLabel');

    closeButton.addEventListener('click', () => {
        chatbotInterface.style.opacity = '0';
        chatbotInterface.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => {
            document.body.removeChild(chatbotInterface);
        }, 300);
    });

    askButton.addEventListener('click', () => {
        const question = userQuestion.value;
        if (!question) {
            alert("Please enter a question.");
            return;
        }

        thinkingLabel.style.display = 'block';

        fetch(`                    https://e244-210-19-13-180.ngrok-free.app/api/infer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ input: question })
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const responseDiv = document.createElement('div');
            responseDiv.style.opacity = '0';
            responseDiv.innerHTML = data.output;
            responseText.appendChild(responseDiv);
            setTimeout(() => {
                responseDiv.style.opacity = '1';
                typeEffect(responseDiv, data.output, 50);
            }, 10);

            thinkingLabel.style.display = 'none';
            userQuestion.value = "";
            responseText.scrollTop = responseText.scrollHeight;

            if (responseText.childNodes.length > 10) {
                responseText.removeChild(responseText.firstChild);
            }
        })
      
        .catch(error => {
            console.error('Error fetching response from the API:', error);
            const errorDiv = document.createElement('div');
            errorDiv.textContent = 'Error: Unable to fetch response from the server.';
            errorDiv.style.background = 'rgba(255, 87, 87, 0.2)';
            errorDiv.style.border = '2px solid #ff5757';
            responseText.appendChild(errorDiv);
            thinkingLabel.style.display = 'none';
        });
    });
}
// Function to create the typing effect
function typeEffect(element, text, delay) {
    let index = 0;
    element.innerHTML = ""; // Clear previous content before typing starts

    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index); // Append character by character
            index++;
            setTimeout(type, delay);
        }
    }
    
    type();
}
  
  
  
  
  
  
function initializeHealYourself() {
    const healButton = document.querySelector('.sidebar-button[data-action="heal"]'); 

    if (healButton) {  
        healButton.addEventListener('click', () => {
            openHealingModal();
        });
    }

    function openHealingModal() {
        // Create the healing modal container
        const healingModal = document.createElement('div');
        healingModal.id = 'heal-yourself-modal';
        healingModal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            width: 90vw;
            max-width: 1024px;
            height: 80vh;
            background: linear-gradient(135deg, rgba(9, 13, 31, 0.95), rgba(26, 34, 56, 0.95));
            border-radius: 15px;
            border: 2px solid #00ff9d;
            box-shadow: 0 0 30px rgba(0, 255, 157, 0.5), inset 0 0 10px rgba(0, 255, 157, 0.3);
            padding: 15px;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            backdrop-filter: blur(10px);
            opacity: 0;
            transition: all 0.3s ease;
            font-family: 'Orbitron', sans-serif;
            color: #ffffff;
        `;

        // Modal content
        healingModal.innerHTML = `
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h2 style="margin: 0; font-size: 1.8em; color: #00ff9d; text-shadow: 0 0 10px #00ff9d;">Heal Yourself</h2>
                <button id="close-heal" style="background: none; border: none; color: #ff55ff; font-size: 1.5em; cursor: pointer; text-shadow: 0 0 5px #ff55ff;">×</button>
            </div>
            <div class="main-container" style="flex: 1; display: flex; height: calc(100% - 50px); gap: 10px;">
                <div class="left-panel" style="flex: 1; padding: 10px; background: rgba(19, 24, 54, 0.5); border-radius: 10px;">
                    <div class="control-panel" style="max-height: 100%; overflow-y: auto; background: rgba(26, 34, 56, 0.7); padding: 10px; border-radius: 8px; border: 1px solid #00ff9d30;">
                        <label for="themeSelect" style="color: #00bfff; font-size: 1.2em; text-shadow: 0 0 5px #00bfff; margin-bottom: 5px; display: block;">Select Theme:</label>
                        <select id="themeSelect" style="width: 100%; min-width: 220px; padding: 6px; margin-bottom: 8px; background: #1a2238; color: #ffffff; border: 1px solid #00ff9d; border-radius: 5px; font-size: 1em;"></select>
                        <label for="songList" style="color: #00bfff; font-size: 1.2em; text-shadow: 0 0 5px #00bfff; margin-bottom: 5px; display: block;">Select ASMR:</label>
                        <select id="songList" size="3" style="width: 100%; min-width: 220px; padding: 6px; margin-bottom: 8px; background: #1a2238; color: #ffffff; border: 1px solid #00ff9d; border-radius: 5px; font-size: 1em;"></select>
                        <div class="video-frame" style="height: 200px; background: #090d1f; margin-bottom: 8px; display: flex; justify-content: center; align-items: center; overflow: hidden; border-radius: 8px; border: 2px solid #00bfff; box-shadow: 0 0 10px #00bfff80;">
                            <video id="videoPlayer" autoplay muted loop style="max-width: 100%; max-height: 100%;"></video>
                        </div>
                        <div style="display: flex; justify-content: space-around; margin-bottom: 8px;">
                            <button class="control-button" id="playButton">Play</button>
                            <button class="control-button" id="pauseButton">Pause</button>
                        </div>
                        <input type="range" id="volumeSlider" min="0" max="1" step="0.01" value="0.5" class="volume-slider">
                    </div>
                </div>
                <div class="right-panel" style="flex: 1; padding: 10px; background: rgba(19, 24, 54, 0.5); border-radius: 10px; display: flex; flex-direction: column;">
                    <div class="gesture-label" style="font-size: 1.2em; font-weight: bold; color: #ff55ff; text-shadow: 0 0 5px #ff55ff; margin-bottom: 10px;">Gesture Control Active</div>
                    <div class="affirmation-box" id="affirmationBox" style="flex: 1; background: rgba(19, 24, 54, 0.5); padding: 10px; border-radius: 8px; overflow-y: auto; font-size: 1.4em; color: #00ff9d; text-shadow: 0 0 5px #00ff9d;"></div>
                </div>
            </div>
        `;

        // Append to body
        document.body.appendChild(healingModal);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
            #heal-yourself-modal::-webkit-scrollbar {
                width: 8px;
            }
            #heal-yourself-modal::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 10px;
            }
            #heal-yourself-modal::-webkit-scrollbar-thumb {
                background: #00ff9d;
                border-radius: 10px;
                box-shadow: 0 0 10px #00ff9d80;
            }
            .control-panel::-webkit-scrollbar {
                width: 6px;
            }
            .control-panel::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 10px;
            }
            .control-panel::-webkit-scrollbar-thumb {
                background: #00ff9d;
                border-radius: 10px;
                box-shadow: 0 0 10px #00ff9d80;
            }
            .control-panel::-webkit-scrollbar-thumb:hover {
                background: #00bfff;
                box-shadow: 0 0 15px #00bfff80;
            }
            .affirmation-box::-webkit-scrollbar {
                width: 6px;
            }
            .affirmation-box::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.3);
            }
            .affirmation-box::-webkit-scrollbar-thumb {
                background: #ff55ff;
                border-radius: 10px;
            }
            .control-button {
                background: linear-gradient(45deg, #00bfff, #00ff9d);
                border: none;
                color: #ffffff;
                padding: 6px 10px;
                margin: 2px;
                cursor: pointer;
                border-radius: 4px;
                text-shadow: 0 0 5px #00000050;
                transition: all 0.3s ease;
                font-size: 0.9em;
            }
            .control-button:hover {
                background: linear-gradient(45deg, #ff55ff, #00bfff);
                box-shadow: 0 0 10px #ff55ff80;
            }
            .volume-slider {
                width: 100%;
                margin: 8px 0;
                -webkit-appearance: none;
                appearance: none;
                height: 6px;
                background: #1a2238;
                border: 1px solid #00ff9d;
                border-radius: 5px;
                outline: none;
                transition: all 0.3s ease;
            }
            .volume-slider:hover {
                box-shadow: 0 0 10px #00ff9d80;
            }
            .volume-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 16px;
                height: 16px;
                background: #ff55ff;
                cursor: pointer;
                border-radius: 50%;
                box-shadow: 0 0 10px #ff55ff80;
            }
            .volume-slider::-moz-range-thumb {
                width: 16px;
                height: 16px;
                background: #ff55ff;
                cursor: pointer;
                border-radius: 50%;
                box-shadow: 0 0 10px #ff55ff80;
            }
            #close-heal:hover {
                color: #ff5555;
                text-shadow: 0 0 5px #ff555580;
            }
            @keyframes neonPulse {
                0% { box-shadow: 0 0 10px #00ff9d80, inset 0 0 5px #00ff9d30; }
                50% { box-shadow: 0 0 30px #00ff9d80, inset 0 0 15px #00ff9d30; }
                100% { box-shadow: 0 0 10px #00ff9d80, inset 0 0 5px #00ff9d30; }
            }
            #heal-yourself-modal {
                animation: neonPulse 2s infinite;
            }
        `;
        document.head.appendChild(style);

        // Animate modal appearance
        setTimeout(() => {
            healingModal.style.opacity = '1';
            healingModal.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);

        // Initialize controls and get audio reference
        let audio = null;
        initializeHealingControls(healingModal, (createdAudio) => {
            audio = createdAudio; // Capture the audio object
        });

        // Close button functionality
        healingModal.querySelector('#close-heal').addEventListener('click', () => {
            // Pause audio if it exists
            if (audio) {
                audio.pause();
                audio.currentTime = 0; // Reset audio to start
            }
            healingModal.style.opacity = '0';
            healingModal.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => {
                document.body.removeChild(healingModal);
                document.head.removeChild(style);
            }, 300);
        });
    }

function initializeHealingControls(healingModal, audioCallback) {
    const videoPlayer = healingModal.querySelector('#videoPlayer');
    const themeSelect = healingModal.querySelector('#themeSelect');
    const songList = healingModal.querySelector('#songList');
    const playButton = healingModal.querySelector('#playButton');
    const pauseButton = healingModal.querySelector('#pauseButton');
    const volumeSlider = healingModal.querySelector('#volumeSlider');
    const affirmationBox = healingModal.querySelector('#affirmationBox');

    console.log('Initializing controls:', { videoPlayer, themeSelect, songList, playButton, pauseButton, volumeSlider, affirmationBox });

    // Song and video paths
    const songPaths = [
        "https://cdn.glitch.global/4ee563e8-e9aa-4c03-ae76-df793d0640f9/calming-rain-257596.mp3?v=1745593894906",
        "https://cdn.glitch.global/4ee563e8-e9aa-4c03-ae76-df793d0640f9/fireplace-loop-original-noise-178209.mp3?v=1745593898371",
        "https://cdn.glitch.global/4ee563e8-e9aa-4c03-ae76-df793d0640f9/forest-ambience-296528.mp3?v=1745593900870",
        "https://cdn.glitch.global/4ee563e8-e9aa-4c03-ae76-df793d0640f9/ocean-waves-sound-01-321570.mp3?v=1745593903207",
        "https://cdn.glitch.global/4ee563e8-e9aa-4c03-ae76-df793d0640f9/rain-and-thunder-ambient-spring-rain-sound-331714.mp3?v=1745593905200"
    ];

    const themePaths = [
        "https://cdn.glitch.me/2508eb66-3414-4a92-9b98-f5a7a4c95ef8/Theme%201.mp4?v=1739996604196",
        "https://cdn.glitch.me/2508eb66-3414-4a92-9b98-f5a7a4c95ef8/Theme%202.mp4?v=1739996628473",
        "https://cdn.glitch.me/2508eb66-3414-4a92-9b98-f5a7a4c95ef8/Theme%203.mp4?v=1739996628681",
        "https://cdn.glitch.global/2508eb66-3414-4a92-9b98-f5a7a4c95ef8/Theme%204.mp4?v=1739996631803",
        "https://cdn.glitch.global/2508eb66-3414-4a92-9b98-f5a7a4c95ef8/Theme%205.mp4?v=1739996627476"
    ];

    // Medical affirmations array
    const medicalAffirmations = [
        "Your body knows how to heal itself.",
        "Every cell in your body is working toward your wellness.",
        "Healing is happening within you right now.",
        "You are stronger than you think.",
        "Your immune system is powerful and resilient.",
        "With each breath, you invite healing energy.",
        "You are surrounded by healing light.",
        "Your body is a temple of health and vitality.",
        "Every day, in every way, you are getting better and better.",
        "You deserve complete health and wellness.",
        "Your mind and body are in perfect harmony.",
        "Healing comes naturally to you.",
        "You are filled with energy and vitality.",
        "Your body is restoring itself to perfect health.",
        "You are grateful for your body's ability to heal.",
        "Perfect health is your natural state.",
        "You release all resistance to healing.",
        "Your cells are vibrant with health.",
        "You are healing more and more every day.",
        "Your body responds positively to healing thoughts.",
        "You are surrounded by love that supports your healing.",
        "Your body is wise and knows exactly what to do.",
        "Healing flows through you effortlessly.",
        "You trust in your body's healing process.",
        "You are a picture of perfect health.",
        "Your vitality is increasing every moment.",
        "You are free from pain and full of peace.",
        "Your body is a self-healing organism.",
        "You are getting stronger with each passing day.",
        "Your health is improving right now.",
        "You welcome healing energy into every cell.",
        "Your body is balanced and healthy.",
        "You are in perfect alignment with wellness.",
        "Every organ in your body is functioning perfectly.",
        "You are filled with healing light.",
        "Your body is constantly renewing itself.",
        "You are healthy, whole, and complete.",
        "Your healing is happening now.",
        "You are at peace with your body.",
        "Your body is a miracle of healing.",
        "You honor your body with loving care.",
        "Your health is your greatest wealth.",
        "You radiate health and happiness.",
        "Your body is a fountain of youth and vitality.",
        "You are blessed with abundant health.",
        "Your healing journey is sacred.",
        "You are surrounded by healing energy.",
        "Your body responds to love with healing.",
        "You are a magnet for health and wellness.",
        "Every system in your body works in perfect harmony.",
        "You are healthy, strong, and full of life.",
        "Your body is always working for your highest good.",
        "You embrace health as your natural state.",
        "Your healing is unfolding perfectly.",
        "You are patient with your body's healing process.",
        "Your body is a masterpiece of health.",
        "You celebrate every sign of healing.",
        "Your health improves with each positive thought.",
        "You are grateful for your body's wisdom.",
        "Your healing is supported by the universe.",
        "You are becoming healthier every moment.",
        "Your body is a temple of divine healing.",
        "You trust your body's innate intelligence.",
        "Your health is flourishing.",
        "You are aligned with perfect health.",
        "Every breath brings healing energy.",
        "Your body is resilient and strong.",
        "You are healing at the deepest level.",
        "Your wellness is your priority.",
        "You are filled with healing vibrations.",
        "Your body is restoring balance naturally.",
        "You are open to receiving complete healing.",
        "Your cells are filled with life and energy.",
        "You are worthy of perfect health.",
        "Your healing journey is blessed.",
        "You are surrounded by healing intentions.",
        "Your body is a vessel of wellness.",
        "You are committed to your health and healing.",
        "Your vitality is increasing every day.",
        "You are in tune with your body's needs.",
        "Your health is transforming for the better.",
        "You are a living example of vibrant health.",
        "Your body is a sanctuary of healing.",
        "You embrace each day with healing energy.",
        "Your systems are functioning optimally.",
        "You are grateful for your ongoing healing.",
        "Your body is a reflection of divine health.",
        "You are peaceful and healthy.",
        "Your healing is manifesting now.",
        "You are connected to infinite healing power.",
        "Your body is regenerating with ease.",
        "You are blessed with robust health.",
        "Your wellness is expanding every day.",
        "You are in perfect health and harmony.",
        "Your body is a wellspring of vitality.",
        "You are healing beautifully.",
        "Your health is a precious gift.",
        "You are filled with healing love.",
        "Your body is returning to its natural state of health.",
        "You are a beacon of health and wellness.",
        "Your healing process is divinely guided.",
        "You are strong, healthy, and vibrant.",
        "Your body is a miracle of nature.",
        "You are grateful for your healing journey.",
        "Your health is your natural inheritance.",
        "You are surrounded by healing forces.",
        "Your body is a garden of wellness.",
        "You are becoming healthier and stronger.",
        "Your healing is unfolding in perfect timing.",
        "You are aligned with your body's wisdom.",
        "Your cells are dancing with health.",
        "You are a masterpiece of wellbeing.",
        "Your body is a fortress of health.",
        "You are worthy of complete healing.",
        "Your health is blooming like a flower.",
        "You are filled with healing gratitude.",
        "Your body is a symphony of wellness.",
        "You are patient with your healing process.",
        "Your health is improving moment by moment.",
        "You are a vessel of healing energy.",
        "Your body is a canvas of vibrant health.",
        "You are blessed with healing grace.",
        "Your wellness is your birthright.",
        "You are connected to universal healing.",
        "Your body is a reflection of perfect health.",
        "You are grateful for every healing moment.",
        "Your health is a sacred journey.",
        "You are surrounded by healing blessings.",
        "Your body is a temple of renewal.",
        "You are committed to your wellness.",
        "Your healing is a beautiful process.",
        "You are aligned with healing vibrations.",
        "Your cells are singing with health.",
        "You are a miracle of healing energy.",
        "Your body is a fountain of wellbeing.",
        "You are worthy of vibrant health.",
        "Your health is growing stronger.",
        "You are filled with healing light.",
        "Your body is a sanctuary of peace.",
        "You are grateful for your body's healing power.",
        "Your wellness is expanding in all ways.",
        "You are connected to divine health.",
        "Your body is a mirror of wellbeing.",
        "You are blessed with healing strength.",
        "Your health is your greatest treasure.",
        "You are surrounded by healing love.",
        "Your body is a vessel of vitality.",
        "You are becoming whole and healthy.",
        "Your healing is a sacred gift.",
        "You are aligned with perfect wellbeing.",
        "Your cells are radiating health.",
        "You are a testament to healing power.",
        "Your body is a garden of vitality.",
        "You are worthy of complete wellness.",
        "Your health is flourishing daily.",
        "You are filled with healing joy.",
        "Your body is a masterpiece of nature.",
        "You are grateful for your healing path.",
        "Your wellness is your divine right.",
        "You are connected to healing wisdom.",
        "Your body is a reflection of wholeness.",
        "You are blessed with healing peace.",
        "Your health is transforming beautifully.",
        "You are surrounded by healing energy.",
        "Your body is a temple of strength.",
        "You are committed to your healing journey.",
        "Your healing is unfolding gracefully.",
        "You are aligned with health and harmony.",
        "Your cells are vibrant with life.",
        "You are a beacon of healing light.",
        "Your body is a well of wellbeing.",
        "You are worthy of radiant health.",
        "Your health is improving continuously.",
        "You are filled with healing power.",
        "Your body is a sanctuary of health.",
        "You are grateful for your body's resilience.",
        "Your wellness is your natural state.",
        "You are connected to universal wellbeing.",
        "Your body is a mirror of health.",
        "You are blessed with healing vitality.",
        "Your health is your sacred responsibility.",
        "You are surrounded by healing support.",
        "Your body is a vessel of wellbeing.",
        "You are becoming healthier every day.",
        "Your healing is a beautiful journey.",
        "You are aligned with healing forces.",
        "Your cells are thriving with health.",
        "You are a miracle of wellbeing.",
        "Your body is a garden of healing.",
        "You are worthy of perfect wellbeing.",
        "Your health is blossoming beautifully.",
        "You are filled with healing grace.",
        "Your body is a masterpiece of creation.",
        "You are grateful for your healing progress.",
        "Your wellness is expanding wonderfully.",
        "You are connected to divine wellbeing.",
        "Your body is a reflection of vitality.",
        "You are blessed with healing abundance.",
        "Your health is your greatest blessing.",
        "You are surrounded by healing miracles.",
        "Your body is a temple of life.",
        "You are committed to your perfect health.",
        "Your healing is manifesting beautifully.",
        "You are aligned with health and happiness.",
        "Your cells are celebrating life.",
        "You are a beacon of health and healing.",
        "Your body is a fountain of health.",
        "You are worthy of complete wellbeing.",
        "Your health is thriving gloriously.",
        "You are filled with healing miracles.",
        "Your body is a sanctuary of vitality.",
        "You are grateful for your healing journey.",
        "Your wellness is your greatest joy.",
        "You are connected to infinite wellbeing.",
        "Your body is a mirror of perfect health.",
        "You are blessed with healing energy.",
        "Your health is your divine expression.",
        "You are surrounded by healing light.",
        "Your body is a vessel of perfect health.",
        "You are becoming more vibrant every day.",
        "Your healing is a sacred process.",
        "You are aligned with universal health.",
        "Your cells are glowing with wellness.",
        "You are a miracle of perfect health."
    ];

    // Populate theme options
    themePaths.forEach((path, index) => {
        const option = document.createElement('option');
        option.value = path;
        option.textContent = `Theme ${index + 1}`;
        themeSelect.appendChild(option);
    });

    // Set initial video source
    if (videoPlayer) {
        videoPlayer.src = themePaths[0];
        videoPlayer.play().catch(error => {
            console.error('Error playing video:', error);
            affirmationBox.textContent = 'Error loading video.';
        });
    } else {
        console.error('Video player not found');
    }

    // Change video source on theme change
    themeSelect.addEventListener('change', () => {
        if (videoPlayer) {
            videoPlayer.src = themeSelect.value;
            videoPlayer.play().catch(error => {
                console.error('Error playing video:', error);
                affirmationBox.textContent = 'Error loading video.';
            });
        }
    });

    // Map song paths to descriptive names
    const asmrNames = songPaths.map(path => {
        const fileName = path.split('/').pop().split('?')[0];
        const name = fileName.replace(/[-0-9]/g, ' ').replace('.mp3', '').trim();
        return name.charAt(0).toUpperCase() + name.slice(1);
    });

    // Populate song options
    songPaths.forEach((path, index) => {
        const option = document.createElement('option');
        option.value = path;
        option.textContent = asmrNames[index];
        songList.appendChild(option);
    });

    let audio = new Audio();
    audio.loop = true;
    audioCallback(audio); // Pass audio object to caller

    // Play button
    playButton.addEventListener('click', () => {
        if (songList.value) {
            audio.src = songList.value;
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
                affirmationBox.textContent = 'Error playing audio.';
            });
        }
    });

    // Pause button
    pauseButton.addEventListener('click', () => {
        audio.pause();
    });

    // Volume control
    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value;
    });

    // Display affirmations
    displayAffirmations(affirmationBox, medicalAffirmations);
}

function displayAffirmations(affirmationBox, affirmations) {
    let currentAffirmationIndex = 0;

    function showNextAffirmation() {
        if (affirmations.length === 0) {
            affirmationBox.textContent = "No affirmations found.";
            return;
        }
        let affirmation = affirmations[currentAffirmationIndex];
        animateText(affirmation, 0);
        currentAffirmationIndex = (currentAffirmationIndex + 1) % affirmations.length;
    }

    function animateText(text, index) {
        if (index < text.length) {
            affirmationBox.textContent = text.substring(0, index + 1);
            setTimeout(() => {
                animateText(text, index + 1);
            }, 50);
        } else {
            setTimeout(showNextAffirmation, 2000);
        }
    }
    showNextAffirmation();
}
}
// Initialize when the script loads
initializeHealYourself();
  
    //----------------- Emergency Services Functionality -------------------
    function openGoogleMaps(serviceType) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const query = serviceType === "ambulance" ? "ambulance" : "clinic";
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}&center=${latitude},${longitude}`; // Fixed query parameter
                window.open(mapsUrl, "_blank");
            }, (error) => {
                alert("Unable to retrieve your location. Please allow location access.");
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    const ambulanceButton = document.querySelector('.sidebar-button[data-action="ambulance"]');
    if (ambulanceButton) {
        ambulanceButton.addEventListener('click', () => {
            openGoogleMaps("ambulance");
        });
    }

    const clinicButton = document.querySelector('.sidebar-button[data-action="clinic"]');
    if (clinicButton) {
        clinicButton.addEventListener('click', () => {
            openGoogleMaps("clinic");
        });
    }
});





