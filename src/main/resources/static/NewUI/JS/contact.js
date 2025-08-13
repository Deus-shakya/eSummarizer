document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (name && email && message) {
        alert("Thanks for reaching out! We'll get back to you soon.");
        this.reset();
    } else {
        alert("Please fill in all the fields.");
    }
});


