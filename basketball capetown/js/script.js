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

$(document).ready(function () {
    // Initialize Select2 for Playing Category
    $("#playingCategory").select2({
        theme: "bootstrap",
        placeholder: "Select Playing Categories",
        multiple: true,
        width: '100%'
    });
    // International Phone Number Input
    const phoneInput = document.querySelector("#phoneNumber");
    const iti = window.intlTelInput(phoneInput, {
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
        initialCountry: "za", // Default to South Africa
        preferredCountries: ["za", "mz"], // Preferred countries
        separateDialCode: true
    });
    // Populate Countries Dynamically
    const countries = [
        { code: "ZA", name: "South Africa", dialCode: "+27" },
        { code: "MZ", name: "Mozambique", dialCode: "+258" },
        // Add more countries as needed
    ];

    const countrySelects = ['#countryOfOrigin', '#currentResidence'];
    countrySelects.forEach(selector => {
        const $select = $(selector);
        $select.append('<option value="">Select Country</option>');
        countries.forEach(country => {
            $select.append(`<option value="${country.code}">${country.name} (${country.dialCode})</option>`);
        });
    });

    // Form Submission Handling
    $('#playerRegistrationForm').on('submit', function (e) {
        // Validate phone number
        if (!iti.isValidNumber()) {
            e.preventDefault();
            alert('Please enter a valid phone number');
            return;
        }

        // Additional form validation logic
        if (!this.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }
        $(this).addClass('was-validated');
    });
    // Profile Image Preview with improved error handling
    $('#profileImage').on('change', function (event) {
        const file = event.target.files[0];

        // Validate file type and size
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (file) {
            // Check file type
            if (!allowedTypes.includes(file.type)) {
                alert('Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP).');
                $(this).val(''); // Clear the file input
                return;
            }

            // Check file size
            if (file.size > maxSize) {
                alert('File is too large. Maximum size is 5MB.');
                $(this).val(''); // Clear the file input
                return;
            }

            // File reader for preview
            const reader = new FileReader();

            reader.onload = function (e) {
                $('#profileImagePreview').attr('src', e.target.result);
            };

            reader.onerror = function () {
                alert('Error reading the file. Please try again.');
            };

            // Read the file
            reader.readAsDataURL(file);
        }
    });

    // Form Validation
    $('#playerRegistrationForm').on('submit', function (e) {
        if (!this.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }
        $(this).addClass('was-validated');
    });

    // Dynamic Age Calculation
    $('#dateOfBirth').change(function () {
        const dob = new Date($(this).val());
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        // Optional: You could add age validation if needed
        if (age < 13) {
            $(this).addClass('is-invalid');
            alert('You must be at least 13 years old to register.');
        } else {
            $(this).removeClass('is-invalid');
        }
    });

    // Phone Number Formatting and Validation
    $('#phoneNumber').on('input', function () {
        // Remove non-digit characters
        let phoneNumber = $(this).val().replace(/\D/g, '');

        // Ensure it starts with the country code or add default
        if (!phoneNumber.startsWith('27')) {
            phoneNumber = '27' + phoneNumber.replace(/^0/, '');
        }

        // Format the phone number
        if (phoneNumber.length > 9) {
            phoneNumber = phoneNumber.slice(0, 11);
        }

        $(this).val(phoneNumber);
    });

    // Social Media URL Validation
    $('#facebook, #instagram, #tiktok').on('input', function () {
        const url = $(this).val();
        const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

        if (url && !urlPattern.test(url)) {
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
        }
    });
});
