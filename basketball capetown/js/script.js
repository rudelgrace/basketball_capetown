document.addEventListener("DOMContentLoaded", () => {
    const fadeIns = document.querySelectorAll(".fade-in");
  
    const handleScroll = () => {
        fadeIns.forEach((element) => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  
            if (rect.top <= windowHeight - 50 && !element.classList.contains("visible")) { 
                element.classList.add("visible");  // Add 'visible' class only once
            }
        });
    };
  
    // Trigger on page load and scroll
    handleScroll();
    window.addEventListener("scroll", handleScroll);
  });
  