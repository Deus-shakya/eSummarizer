function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    alert(`Login attempt for: ${email}`);
    setTimeout(() => {
        goToHome();
    }, 1000);
}

function showForgotPassword() {
    const email = prompt('Enter your email address to reset password:');
    if (email) {
        alert(`Password reset link sent to: ${email}`);
    }
}

function goToHome() {
    alert('Redirecting to main application...');
    // window.location.href = '/';
}

function goToSignup() {
    alert('Redirecting to signup page...');
    // window.location.href = '/signup';
}
