const toggleBtn = document.getElementById("themeToggle");
    const body = document.body;

    if (localStorage.getItem("theme") === "dark") {
      body.classList.add("dark-mode");
      toggleBtn.textContent = "☀️";
    }

    toggleBtn.addEventListener("click", () => {
      body.classList.toggle("dark-mode");

      if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        toggleBtn.textContent = "☀️";
      } else {
        localStorage.setItem("theme", "light");
        toggleBtn.textContent = "🌙";
      }
    });

 (function(){
      emailjs.init("Whxte6kLgmrpUBmHu"); 
    })();

    const form = document.getElementById("contactForm");
    const statusMsg = document.getElementById("statusMsg");

    form.addEventListener("submit", function(e) {
      e.preventDefault();

      statusMsg.textContent = "Sending...";

      emailjs.sendForm(
        "service_lp4ykc8", 
        "template_deejuvs",  
        this
      ).then(() => {
        statusMsg.textContent = "✅ Message sent successfully!";
        form.reset();
      }, (error) => {
        statusMsg.textContent = "❌ Failed to send. Try again.";
        console.error(error);
      });
    });
function toggleMenu() {
    const menu = document.getElementById("socialMenu");
    menu.classList.toggle("active");
  }

