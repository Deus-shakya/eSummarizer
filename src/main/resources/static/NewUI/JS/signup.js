// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Simulate signup
    alert(`Account created for: ${name} (${email})`);

    // Example redirection after account creation
    setTimeout(() => {
        goToHome();
    }, 1000);
}

function goToLogin() {
    alert('Redirecting to login page...');
    // window.location.href = '/login';
}

function goToHome() {
    alert('Redirecting to main application...');
    // window.location.href = '/';
}
