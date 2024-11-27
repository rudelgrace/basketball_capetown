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