function toggleAccountForm() {
    const header = document.querySelector(".section-header");
    const formContent = document.getElementById("accountFormContent");

    header.classList.toggle("active");
    formContent.classList.toggle("active");
}



// Profile form submission
document.getElementById("profileForm").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Profile updated successfully!");
});
