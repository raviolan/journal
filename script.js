document.getElementById('login-button').addEventListener('click', async () => {
    const passwordField = document.getElementById('password-field');
    const password = passwordField.value;

    try {
        // Send password to backend for verification
        const response = await fetch('http://localhost:3000/api/verify-password', { // Full backend URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        console.log('Response Status:', response.status); // Log the HTTP response status

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();
        console.log('API Response:', result); // Log the API response

        if (result.success) {
            console.log('Password correct. Starting animation...');

            const journalCover = document.getElementById('journal-cover');

            // Start the unlock animation
            journalCover.style.animation = 'open-journal 1.5s forwards';

            // Show the journal content and render the first page after the animation
            setTimeout(() => {
                console.log('Animation complete. Displaying journal...');
                document.getElementById('login-container').style.display = 'none';
                document.getElementById('journal').style.display = 'flex';
                renderPage(); // Call renderPage after the journal is visible
            }, 1500); // Matches the animation duration
        } else {
            console.log('Incorrect password:', result.message);
            alert('Incorrect Password!');
        }
    } catch (error) {
        console.error('Error verifying password:', error); // Log any errors
        alert('An error occurred. Please try again.');
    }
});

// Page Navigation Buttons
document.getElementById('prev-page').addEventListener('click', () => {
    console.log('Previous page clicked.');
    if (currentPage > 1) {
        currentPage--;
        renderPage();
    } else {
        console.log('Already on the first page.');
        alert('You’re on the first page!');
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    console.log('Next page clicked.');
    if (currentPage < journalEntries.length) {
        currentPage++;
        renderPage();
    } else {
        console.log('Already on the last page.');
        alert('You’re on the last page!');
    }
});

// Variables for Current Page and Entries
let currentPage = 1;
const journalEntries = [
    { title: "First Entry", content: "Today was great!", media: "" },
    { title: "Second Entry", content: "Don't forget to...", media: "" },
];

// Render Page Function
function renderPage() {
    const journal = document.getElementById('journal');
    if (journal.style.display === 'flex') {
        console.log(`Rendering page ${currentPage}...`);

        const leftPage = document.querySelector('.left-page .journal-input');
        const rightPage = document.querySelector('.right-page .media-placeholder');

        const entry = journalEntries[currentPage - 1];
        console.log('Current entry data:', entry);

        leftPage.value = entry.content || "This is a placeholder text for the left page.";
        rightPage.innerHTML = entry.media || "<p>Drop images or drag items here!</p>";
    } else {
        console.log('Journal is not visible. Skipping render.');
    }
}

// Debugging the Initial State
console.log('Script loaded. Waiting for password input...');

let isScrollMode = false;

document.getElementById('toggle-mode').addEventListener('click', () => {
    isScrollMode = !isScrollMode;

    const journalPages = document.getElementById('journal-pages');
    const toggleButton = document.getElementById('toggle-mode');

    if (isScrollMode) {
        // Enable Scroll Mode
        journalPages.style.flexDirection = 'column'; // Stack pages vertically
        document.querySelectorAll('.page').forEach(page => {
            page.style.height = 'auto'; // Adjust height for scrolling
        });
        toggleButton.textContent = 'Switch to Page Turning Mode';
        document.getElementById('prev-page').style.display = 'none';
        document.getElementById('next-page').style.display = 'none';
    } else {
        // Enable Page Turning Mode
        journalPages.style.flexDirection = 'row'; // Restore side-by-side
        document.querySelectorAll('.page').forEach(page => {
            page.style.height = '100%'; // Restore fixed height
        });
        toggleButton.textContent = 'Switch to Scroll Mode';
        document.getElementById('prev-page').style.display = 'block';
        document.getElementById('next-page').style.display = 'block';
    }

    console.log(`Mode switched: ${isScrollMode ? 'Scroll' : 'Page Turning'}`);
});

document.getElementById('close-button').addEventListener('click', () => {
    console.log('Closing the journal and redirecting to the password page...');

    const journal = document.getElementById('journal');
    const loginContainer = document.getElementById('login-container');
    const journalCover = document.getElementById('journal-cover');

    // Start the closing animation
    journal.style.animation = 'close-journal 1.5s forwards';

    // Listen for the animation end
    journal.addEventListener('animationend', () => {
        console.log('Closing animation complete.');

        // Reset the journal's visibility for the next use
        journal.style.display = 'none'; // Temporarily hide the journal
        journal.style.animation = ''; // Reset animation property

        // Show the login container
        loginContainer.style.display = 'flex';

        // Reset the journal cover position
        journalCover.style.top = '55%'; // Adjust as needed
        journalCover.scrollIntoView({ behavior: 'smooth' });

        // Clear the password field for a fresh start
        document.getElementById('password-field').value = '';
    }, { once: true }); // Ensure the listener runs only once
});
