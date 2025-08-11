document.querySelector(".auth-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;

  if (password.length < 8) {
    alert("Password must be at least 8 characters long");
    return;
  }
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const formData = new FormData(form);

  try {
    const response = await fetch("/signup", {
      method: "POST",
      body: formData,
    });
    console.log(response);
    if (!response.ok) {
      const errorText = await response.text();
      alert(errorText);
      return;
    }
    alert("Registration successful!");
    window.location.href = "/NewUI/login";
  } catch (err) {
    console.log(err.message);
    alert("An error occurred. Please try again.");
  }
});

document
  .getElementById("profileImage")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("profilePreview").src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
