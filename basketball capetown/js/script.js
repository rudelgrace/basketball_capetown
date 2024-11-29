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

// International Phone Number Input
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

// Cover Image Upload Preview
document.querySelector('.cover-image-upload .upload-overlay').addEventListener('click', function () {
    document.getElementById('coverImageUpload').click();
});

document.getElementById('coverImageUpload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        document.getElementById('coverImage').src = e.target.result;
    };

    reader.readAsDataURL(file);
});

// Profile Image Upload Preview (previous code remains the same)
document.querySelector('.profile-image-upload .upload-overlay').addEventListener('click', function () {
    document.getElementById('profileImageUpload').click();
});

document.getElementById('profileImageUpload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        document.getElementById('profileImage').src = e.target.result;
    };

    reader.readAsDataURL(file);
});

// WhatsApp Number Toggle
const sameWhatsAppCheckbox = document.getElementById('sameWhatsAppNumber');
const whatsAppNumberSection = document.getElementById('whatsAppNumberSection');

sameWhatsAppCheckbox.addEventListener('change', function () {
    if (this.checked) {
        whatsAppNumberSection.style.display = 'none';
        whatsAppInput.value = phoneInput.value;
    } else {
        whatsAppNumberSection.style.display = 'block';
    }
});

// Form Submission Handler
document.getElementById('createPlayerProfileForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Validate phone numbers
    const phoneNumber = phoneIntl.getNumber();
    const whatsAppNumber = sameWhatsAppCheckbox.checked
        ? phoneIntl.getNumber()
        : whatsAppIntl.getNumber();

    // Here you would typically send the form data to a backend server
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: phoneNumber,
        whatsAppNumber: whatsAppNumber
        // Add other form fields
    };

    // Show success modal
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
});