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

    document.getElementById("firstname").value = data.firstName || "";
    document.getElementById("middlename").value = data.middleName || "";
    document.getElementById("lastname").value = data.lastName || "";
    document.getElementById("username").value = data.username || "";
    document.getElementById("email").value = data.email || "";
    document.getElementById("phone").value = data.phone || "";
  } catch (error) {
    console.error(error);
  }
});

document
  .getElementById("profileForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    console.log(formData);
    try {
      const response = await fetch("/api/profile/updateprofile", {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) {
        alert("Error during fetch");
        return;
      }
      alert("Profile updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  });
