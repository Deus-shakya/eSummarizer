const displayUsername = document.getElementById("displayName");
const displayEmail = document.getElementById("displayEmail");
const displayDate = document.getElementById("displayDate");
const displayProfileImage = document.getElementById("profileImage");
function toggleAccountForm() {
  const header = document.querySelector(".section-header");
  const formContent = document.getElementById("accountFormContent");

  header.classList.toggle("active");
  formContent.classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", async (e) => {
  try {
    const response = await fetch("/api/profile");
    if (!response.ok) {
      alert("Error while fetching data!");
    }

    const data = await response.json();
    displayUsername.innerHTML = data.username;
    displayEmail.innerHTML = data.email;
    displayDate.innerHTML = `Member since ${new Date(
      data.createdAt
    ).toLocaleDateString("en-GB")}`;

    displayProfileImage.src = data.profileImageUrl;

    // Pre-fill form fields
    document.getElementById("firstName").value = data.firstName || "";
    document.getElementById("middleName").value = data.middleName || "";
    document.getElementById("lastName").value = data.lastName || "";
    document.getElementById("username").value = data.username || "";
    document.getElementById("email").value = data.email || "";
    document.getElementById("phone").value = data.phone || "";
  } catch (error) {
    console.error(error);
  }
});
// Profile form submission
document.getElementById("profileForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Profile updated successfully!");
});
