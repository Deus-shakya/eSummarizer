document.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password.length < 8) {
    alert("Password must be at least 8 characters long");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const response = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      alert(errorText);
      return;
    }
    if (response.ok) {
      const content = await response.json();
      console.log(content);
      alert("Registration successfull!");
      window.location.href = "/NewUI/login";
    }
  } catch (err) {
    console.log(err.message);
  }
});
