const displayUsername = document.getElementById("displayName");
const displayEmail = document.getElementById("displayEmail");
const displayDate = document.getElementById("displayDate");
const displayProfileImage = document.getElementById("profileImage");
const summaryCount = document.getElementById("summarycount");
const wordcount = document.getElementById("wordcount");
let savedHours = document.getElementById("hours")

let totalDocuments = ""
let totalWords = ""

function toggleSection(headerId, contentId) {
    const header = document.getElementById(headerId);
    const formContent = document.getElementById(contentId);

    if (header && formContent) {
        header.classList.toggle("active");
        formContent.classList.toggle("active");
        setTimeout(() => {
            formContent.scrollIntoView({behavior: "smooth", block: "center"});
        }, 250);
    }
}

// Usage:
function toggleAccountForm() {
    toggleSection("accountHeader", "accountFormContent");
}

function togglePasswordForm() {
    toggleSection("passwordHeader", "passwordFormContent");
}

function toggleOthersForm() {
    toggleSection("othersHeader", "othersFormContent");
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
        totalWords = data.wordCount;
        totalDocuments = data.summary_count;
        summaryCount.innerHTML = totalDocuments;
        wordcount.innerHTML = totalWords;
        savedHours.innerHTML = calculateHoursSaved(totalWords, totalDocuments);

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
        if (!confirm("Are you sure for change?")) {
            window.location.reload();
            return;
        }
        const form = e.target;
        const formData = new FormData(form);

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

document
    .getElementById("passwordForm")
    .addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!confirm("Are you sure for change?")) {
            window.location.reload();
            return;
        }
        const form = e.target;
        const formData = new FormData(form);

        const newPassword = form.newPassword.value;
        const confirmPassword = form.confirmPassword.value;

        if (newPassword !== confirmPassword || newPassword.length < 8) {
            alert("Password didn't match criteria!");
            return;
        }

        try {
            const response = await fetch("/api/profile/updatepassword", {
                method: "PATCH",
                body: formData,
            });
            if (!response.ok) {
                alert("Error while fetching!");
                return;
            }
            alert("Successfully updated the password!");
        } catch (error) {
            console.error(error);
        }
    });

// Modal open/close logic
function openAvatarModal() {
    document.getElementById("avatarModal").classList.add("active");
    document.getElementById("avatarPreview").src =
        document.getElementById("profileImage").src;
}

function closeAvatarModal() {
    document.getElementById("avatarModal").classList.remove("active");
}

// Preview selected image
document.getElementById("avatarInput").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (ev) {
            document.getElementById("avatarPreview").src = ev.target.result;
        };
        reader.readAsDataURL(file);
    }
});

//avatar upload
document
    .getElementById("avatarForm")
    .addEventListener("submit", async function (e) {
        e.preventDefault();
        const input = document.getElementById("avatarInput");
        if (!input.files[0]) {
            alert("Please select an image.");
            return;
        }
        const formData = new FormData();
        formData.append("avatar", input.files[0]);
        try {
            const response = await fetch("/api/profile/updateavatar", {
                method: "PATCH",
                body: formData,
            });
            if (!response.ok) {
                alert("Failed to upload image.");
                return;
            }
            const data = await response.json();
            document.getElementById("profileImage").src = data.profileImageUrl;
            closeAvatarModal();
            alert("Avatar updated!");
        } catch (err) {
            console.error(err);
            alert("Error uploading image.");
        }
    });

function deleteAccount() {
    if (
        confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
        )
    ) {
        fetch("/api/profile/deleteuser", {method: "DELETE"})
            .then((res) => {
                if (!res.ok) {
                    alert("Failed to delete account.");
                    return;
                }
                alert("Account deleted successfully.");
                window.location.href = "/NewUI";
            })
            .catch((err) => {
                console.error(err);
                alert("Error deleting account.");
            });
    }
}

function calculateHoursSaved(totalWords, totalDocuments, wordsPerMinute = 100, docOverhead = 2) {
    // Time spent on words
    const minutesFromWords = totalWords / wordsPerMinute;

    // Extra time per document
    const minutesFromDocs = totalDocuments * docOverhead;

    // Total minutes
    const totalMinutes = minutesFromWords + minutesFromDocs;

    // Convert to hours and round to 1 decimal
    const hoursSaved = Math.round((totalMinutes / 60) * 10) / 10;

    return hoursSaved;
}
