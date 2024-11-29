document.addEventListener("DOMContentLoaded", () => {
    // Select all elements that should have scroll animations
    const scrollElements = document.querySelectorAll(
        '.fade-in, .bc-event-card, .bc-player-card, .bc-podcast-card, .bc-social-sidebar, .bc-social-impact-sidebar, .bc-headline-news-sidebar'
    );

    // Intersection Observer options
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    // Create animation effects
    const createScrollAnimations = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Multiple animation classes for variety
                const animationClasses = [
                    'slide-in-left',
                    'slide-in-right',
                    'fade-in-up',
                    'zoom-in'
                ];

                // Randomly select an animation class
                const randomAnimation =
                    animationClasses[Math.floor(Math.random() * animationClasses.length)];

                entry.target.classList.add('animated', randomAnimation);

                // Optional: Stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    };

    // Create Intersection Observer
    const scrollObserver = new IntersectionObserver(
        createScrollAnimations,
        observerOptions
    );

    // Observe elements
    scrollElements.forEach(element => {
        scrollObserver.observe(element);
    });
});
 // Image Upload Previews
 function setupImageUpload(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const container = input.closest('.image-upload-container');
    const placeholder = container.querySelector('.upload-placeholder');

    input.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
                placeholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });
}

// Setup image uploads
setupImageUpload('coverImageUpload', 'coverImagePreview');
setupImageUpload('profileImageUpload', 'profileImagePreview');

// Phone number initialization (similar to previous version)
const phoneInput = document.getElementById('phoneNumber');
const whatsAppInput = document.getElementById('whatsAppNumber');

const phoneIntl = window.intlTelInput(phoneInput, {
    initialCountry: "auto",
    geoIpLookup: function (callback) {
        fetch('https://ipapi.co/json')
            .then(response => response.json())
            .then(data => callback(data.country_code))
            .catch(() => callback('us'));
    },
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js"
});

const whatsAppIntl = window.intlTelInput(whatsAppInput, {
    initialCountry: "auto",
    geoIpLookup: function (callback) {
        fetch('https://ipapi.co/json')
            .then(response => response.json())
            .then(data => callback(data.country_code))
            .catch(() => callback('us'));
    },
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js"
});

// WhatsApp Number Toggle
const sameWhatsAppCheckbox = document.getElementById('sameWhatsAppNumber');
const whatsAppNumberSection = document.getElementById('whatsAppNumberSection');

sameWhatsAppCheckbox.addEventListener('change', function () {
    whatsAppNumberSection.style.display = this.checked ? 'none' : 'block';
});

// Form Submission
document.getElementById('createPlayerProfileForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Collect form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: phoneIntl.getNumber(),
        whatsAppNumber: sameWhatsAppCheckbox.checked
            ? phoneIntl.getNumber()
            : whatsAppIntl.getNumber(),
        // Add other form fields as needed
    };

    // Here you would typically send data to backend
    console.log(formData);
    alert('Profile created successfully!');
});