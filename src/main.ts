import "./style.css";
import axios from "axios";
import { User } from './type';

export const API_BASE_URL = "http://localhost:3000";

// JWT token that i will use so that a user don't need to login if token is still valid
let token = localStorage.getItem("token");
console.log(token);


// Login and register div
const registerAndLogin = document.getElementById("appRegisterAndLogin");

// registration and login forms and buttons
const registrationForm = document.getElementById("registrationForm");
const registerBtn = document.getElementById("registerButton");
const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginButton");

// User data variables
let userInfo = null;

// Main app div ,welcomeUser H2, progressList, logout button, addProgressForm, addProgressButton, cancelAddProgressButton
//searchForm, searchButton, searchfield
const homeApp = document.getElementById("homeApp");
const welcomeUser = document.getElementById("welcomeUser");
const progressList = document.getElementById("progressListId");
const logoutButton = document.getElementById("logoutButton");
const addProgressButton = document.getElementById("addProgressButton");
const addProgressForm = document.getElementById("addProgressForm");
const cancelAddProgressButton = document.getElementById("cancelAddProgressButton")
const searchForm = document.querySelector("#filterForm");
const searchButton = document.getElementById("search");
const resetSearchButton = document.getElementById("resetSearch");
const searchInput = document.getElementById("filterExercise") as HTMLInputElement;

// Profile button, close profile button, save profile changes button
const profileButton = document.getElementById("profileButton");
const closeProfileButton = document.getElementById("closeProfile");
const saveProfileChangesButton = document.getElementById("saveProfileChanges");

// Profile edit form element
const profileForm = document.getElementById("profileForm");

// Profile input elements
const profileEmail = (document.getElementById("profileEmail") as HTMLInputElement);
const profilePassword = (document.getElementById("profilePassword") as HTMLInputElement);
const confirmProfilePassword = document.getElementById("confirmProfilePassword") as HTMLInputElement;
const profileLastName = document.getElementById("profileLastName") as HTMLInputElement;
const profileFirstName = document.getElementById("profileFirstName") as HTMLInputElement;
const profileWeight = document.getElementById("profileWeight") as HTMLInputElement;
const profileHeight = document.getElementById("profileHeight") as HTMLInputElement;


// View progress button and progress container
const progressButton = document.getElementById("progressButton")!;
const progressTitle = document.getElementById("progressTitle")!;
const progressContainer = document.getElementById("progressContainer")!;

// Edit progress form, cancel edit progress button
const editProgressForm = document.getElementById("editProgressForm")
const cancelProgressButton = document.getElementById("cancelProgressButton")

// Communicate with user via this alert
const showAlert = (message: string) => {
  const alertUser = document.getElementById("alertUser")!;
  const alertContent = document.getElementById("alertContent")!;

  // Display the message in the window
  alertContent.innerHTML = message;

  // Show the window
  alertUser.style.display = "block";
  window.focus()

 // Close the window after 5 seconds
  setTimeout(() => {
      alertUser.style.display = "none";
    }, 5000);
};

// Close the alert window if the button is clicked
document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (target.classList.contains("closeAlert")) {
    const alertUser = document.getElementById("alertUser")!;
    alertUser.style.display = "none";
  }
});

// Toggle the visibility of a element between flex and none
const toggleElement = (element: HTMLElement, isVisible: boolean) => {
  if (element) {
    element.style.display = isVisible ? "flex" : "none";
  }
};

// Initial start, show login form
toggleElement(loginForm!, true);
toggleElement(registrationForm!, false);
toggleElement(homeApp!, false);
toggleElement(editProgressForm!, false);
toggleElement(profileForm!, false)

// Register button event
registerBtn?.addEventListener("click", () => {
  toggleElement(registrationForm!, true);
  toggleElement(loginForm!, false);
});

// Login button event
loginBtn?.addEventListener("click", () => {
  toggleElement(loginForm!, true);
  toggleElement(registrationForm!, false);
});

// Email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

 // Registration form event
 registrationForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

    // Get registration input field values
    const emailInput = (document.getElementById("email") as HTMLInputElement).value;
    const passwordInput = (document.getElementById("password") as HTMLInputElement).value;
    const first_nameInput = (document.getElementById("first_name") as HTMLInputElement).value;
    const last_nameInput = (document.getElementById("last_name") as HTMLInputElement).value;
    const weight = parseFloat((document.getElementById("weight") as HTMLInputElement).value);
    const height = parseFloat((document.getElementById("height") as HTMLInputElement).value);

    // Get trim them
    const email = emailInput.trim();
    const password = passwordInput.trim();
    const first_name = first_nameInput.trim();
    const last_name = last_nameInput.trim();

    // Validate email
    if (!isValidEmail(email)) {
      showAlert("Please enter a valid email address.");
    return;
    }

    // Validate password
    if (passwordInput.length < 6) {
      showAlert("Password must be at least 6 characters long.");
      return;
    }

    // Validate first name
    if (first_nameInput.length < 3) {
      showAlert("First name must be at least 3 characters long.");
      return;
    }

    // Validate last name
    if (last_nameInput.length < 3) {
      showAlert("Last name must be at least 3 characters long.");
      return;
    }
    
    // Construct registration object
    const registrationData = {
        email,
        password,
        first_name,
        last_name,
        weight,
        height
    };
    console.log("Submitting registration form", registrationData);

    try {
      const response = await axios.post(`${API_BASE_URL}/register`, registrationData);
  
      if (response.status === 201) {
        showAlert("Your registration was successful!");
        toggleElement(loginForm!, true);
        toggleElement(registrationForm!, false);
      } else {
        showAlert("Failed to register account. Please check your inputs and try again.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const response = error.response;
        if (response?.status === 400) {
          const errorMsg = response.data?.data?.[0]?.msg || "Failed to register user. Please try again.";
          showAlert(errorMsg);
        } else {
          console.log("Network error:", error);
          showAlert("Failed to connect to the server. Please check your internet connection and try again.");
        }
      } else {
        console.log("Error registering user:", error);
        showAlert("An unexpected error occurred. Please try again later.");
      }
    }
  });

  // Login form event
  loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Get the email and password from the login form fields and trim them
  const email = (document.getElementById("loginEmail") as HTMLInputElement).value.trim();
  const password = (document.getElementById("loginPassword") as HTMLInputElement).value.trim();

  // Validate email
  if (!isValidEmail(email)) {
    showAlert("Please enter a valid email address.");
  return;
  }

  // Validate password
  if (password.length < 6) {
    showAlert("Password must be at least 6 characters long.");
    return;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password
    });

    // JWT token
    let token  = response.data.token;
    console.log(token);

    // Store the token
    localStorage.setItem("token", token);

    // Update the token with each login
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Update the token variable
    token = localStorage.getItem("token");
    console.log("updated token", token);

    // Fetch user profile
    const profileResponse = await axios.get(`${API_BASE_URL}/profile`);
    userInfo = profileResponse.data;
    console.log("User profile:", userInfo);
    console.log("User's first name:", userInfo.data.first_name);

    // Update the welcome page so it's adapted for each uniq user
    welcomeUser!.innerHTML = `Welcome ${userInfo.data.first_name}`;

    // When user is logged in, hide registerAndLogin and show homeApp
    toggleElement(homeApp!, true);
    toggleElement(registerAndLogin!, false);
    toggleElement(addProgressForm!, false);
    toggleElement(profileForm!, false)

    // Fetch progress data after successful login
    fetchProgress(token);

    

  } catch (error) {
    console.log("Login failed:", error);
    showAlert("Failed to login. Please check your email and password and try again.")
  }
});

// Event to logout
logoutButton?.addEventListener("click", () => {

  // Remove token from local storage
  localStorage.removeItem("token");
  token = null;
  console.log("logout token shall be null", token);

  // Show initial start
  toggleElement(homeApp!, false);
  toggleElement(registerAndLogin!, true);
  
  // Set flex direction on registerAndLogin div
  registerAndLogin!.style.flexDirection = "column";

  // Reset progress window to initial state
  progressButton.innerText = "Show Progress";
  progressTitle.innerText = "View Your Progress";

  // Remove the user's progress list
  while (progressList!.firstChild) {
    progressList!.removeChild(progressList!.firstChild);
  }
});

// Auto login with stored token
const autoLogin = async () => {
  try {
    // Check if token exists in local storage
    const token = localStorage.getItem("token");
    if (!token) {

      // Remove old token
      localStorage.removeItem("token");

      // Show initial start
      toggleElement(homeApp!, false);
      toggleElement(registerAndLogin!, true);
      
      // Set flex direction on registerAndLogin div
      registerAndLogin!.style.flexDirection = "column";

      // Reset progress window to initial state
      progressButton.innerText = "Show Progress";
      progressTitle.innerText = "View Your Progress";
      return;
    }

    // Fetch user profile using the token
    const response = await axios.get(`${API_BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // User profile fetched successfully
    const profileData = response.data;
    console.log("Auto login successful. User profile:", profileData);

    // Update the welcome page
    welcomeUser!.innerHTML = `Welcome ${profileData.data.first_name}`;

    // Show homeApp and hide registerAndLogin
    toggleElement(homeApp!, true);
    toggleElement(registerAndLogin!, false);
    toggleElement(addProgressForm!, false);
    toggleElement(profileForm!, false)

    // Fetch progress data after successful login
    fetchProgress(localStorage.getItem("token"));
  } catch (error) {

    // Auto login failed
    console.log("Auto login failed:", error);

    // Remove old token
    localStorage.removeItem("token");

    // Show initial start
    toggleElement(homeApp!, false);
    toggleElement(registerAndLogin!, true);
  
    // Set flex direction on registerAndLogin div
    registerAndLogin!.style.flexDirection = "column";

    // Reset progress window to initial state
    progressButton.innerText = "Show Progress";
    progressTitle.innerText = "View Your Progress";
  }
};

// Event to display profile
profileButton!.addEventListener("click", async () => {
  try {
    // Fetch user profile
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Successful request
    if (response.status === 200) {
      const userProfile = response.data;

      // Populate form fields with user profile's information as the placeholder
      profileEmail.placeholder = userProfile.data.email;
      profileFirstName.placeholder = userProfile.data.first_name;
      profileLastName.placeholder = userProfile.data.last_name;
      profileWeight.placeholder = userProfile.data.weight.toString();
      profileHeight.placeholder = userProfile.data.height.toString();

      // Show the profile form
      toggleElement(progressContainer!, false);
      toggleElement(addProgressForm!, false);
      toggleElement(profileForm!, true)
      
      progressButton.innerText = "Show Progress";
      progressTitle.innerText = "View Your Progress";
    } else {
      // if GET fails
      console.log("Failed to get user profile");
      showAlert("Failed get user profile. Please try again.");
    }
  } catch (error) {
    console.log("Failed to get user profile:", error);
    showAlert("Failed get user profile. Please try again.");
  }
});

closeProfileButton!.addEventListener("click", () => {
 
  // Hide profile form
  toggleElement(profileForm!, false);

  // Reset the form if it's closed
  profileEmail.value = "";
  profilePassword.value = "";
  confirmProfilePassword.value = "";
  profileFirstName.value = "";
  profileLastName.value = "";
  profileWeight.value = "";
  profileHeight.value = "";

});

// Event to save the profile changes to the database
saveProfileChangesButton!.addEventListener("click", async () => {
  try {
    const token = localStorage.getItem("token");

    // Get the values from the input fields
    const newPasswordInput = profilePassword;
    const confirmPasswordInput = confirmProfilePassword;
    
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Check if the passwords match
    if (newPassword !== confirmPassword) {
      showAlert("Passwords do not match. Please enter the same password in both fields.");
      return;
    }

   // Create an empty object
    const updatedUser: User = {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      weight: 0,
      height: 0
    };

    // Fill in the updatedUser object with values
    updatedUser.email = profileEmail.value;
    updatedUser.password = profilePassword.value;
    updatedUser.first_name = profileFirstName.value;
    updatedUser.last_name = profileLastName.value;
    updatedUser.weight = parseInt(profileWeight.value);
    updatedUser.height = parseInt(profileHeight.value);

    // Remove empty fields from the updated user object so that to make sure only the fields the user type's in are sent in the request
    for (const key in updatedUser) {
      if (!updatedUser[key as keyof User]) {
        delete updatedUser[key as keyof User];
      }
    }

    // Send a PATCH request to update the user's profile with the updatedUser object
    await axios.patch(`${API_BASE_URL}/profile/edit`, updatedUser, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // If the request is successful reset the form and hide it, update the H1 with the new username if its updated, and alert the user
    showAlert("Profile updated successfully!");

    // Reset the form
    profileEmail.value = "";
    profilePassword.value = ""
    confirmProfilePassword.value = "";
    profileFirstName.value = "";
    profileLastName.value = "";
    profileWeight.value = "";
    profileHeight.value = "";

    // Hide profile form
    toggleElement(profileForm!, false);
    const response = await axios.get(`${API_BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const userProfile = response.data;

    // Update the welcome page if the user updated first name
    if (updatedUser.first_name !== userProfile.first_name) {
      welcomeUser!.innerHTML = `Welcome ${updatedUser.first_name}`;
    }
  
  } catch (error) {
    console.log("Error updating profile:", error);
    showAlert("Failed to update profile. Please try again.");
  }
});

// Fetch progress data of the authenticated user
const fetchProgress = async (token: string | null) => {
  try {
      const response = await axios.get(`${API_BASE_URL}/progress`, {
          headers: { Authorization: `Bearer ${token}` }
      });

      // progressData will be all of the progress's
      let progressData = response.data.data; 
      console.log(progressData);

      // Initially hide progress container
      progressContainer.style.display = "none";

      // Sort progress data by date with the most recent first
      progressData.sort((a: { date: Date }, b: { date: Date }) => new Date(b.date).getTime() - new Date(a.date).getTime());

      console.log("User progress:", progressData);

      // Loop through the progress's and create a li for each
      progressData.forEach((progress: any) => {
          const { id, date, exercise, weight, reps } = progress;
          console.log(`ID: ${id}, Date: ${date}, Exercise: ${exercise}, Weight: ${weight}, Reps: ${reps}`);

          // Format the date to "YYYY-MM-DD"
          const humanDate = new Date(date).toISOString().split("T")[0];

          // Create a li for each progress
          const progressItem = document.createElement("li");
          progressItem.id = `progress-${id}`;
          progressItem.innerHTML = `
              <p>Date <br> ${humanDate}</p>
              <p>Exercise <br> ${exercise}</p>
              <p>Weight <br> ${weight} kg</p>
              <p>Reps <br> ${reps}</p>
              <div class ="progressActions">
              <span class="editProgress">✏️</span>
              <span class="deleteProgress">🗑️</span>
              </div>
          `;

          // Event to delete a progress
          const deleteButton = progressItem.querySelector(".deleteProgress") as HTMLElement;
          deleteButton.addEventListener("click", async () => {
            try {
              // Show confirmation window
              const confirmationWindow = document.getElementById("confirmationWindow")!;
              confirmationWindow.style.display = "block";
              window.focus();
              
              // Confirmation and cancel buttons
              const confirmButton = document.getElementById("confirmButton")!;
              const cancelConfirmButton = document.getElementById("cancelConfirmButton")!;
              
              // If confirmed, delete the selected progress
              confirmButton.addEventListener("click", async () => {
                  
                // Delete the progress from the database
                  await axios.delete(`${API_BASE_URL}/progress/${id}`, {
                      headers: { Authorization: `Bearer ${token}` }
                  });
                  
                  // If DELETE is successful, delete it from the list as well
                  progressItem.remove();
                  console.log("Progress item deleted successfully");
                  showAlert("Progress deleted successfully")
                  
                  // Hide confirmation window
                  confirmationWindow.style.display = "none"; 
              });
              
              // If canceled hide confirm window
              cancelConfirmButton.addEventListener("click", () => {
                  confirmationWindow.style.display = "none";
              });
              } catch (error) {
                  console.log("Failed to delete progress:", error);
                  showAlert("Failed to delete progress.");
              }
          });

          // Append the li to the progress's list
          progressList!.appendChild(progressItem);
      });

  } catch (error) {
      console.log("Failed to get progress's:", error);
  }
};

// Event to show and hide the progress's list
progressButton.addEventListener("click", () => {

  // Toggle the visibility of the container for the progress's
  toggleElement(progressContainer, progressContainer.style.display === "none");

  // Change the button text and title based on if container is hidden or visible
  if (progressContainer.style.display === "none") {
      progressButton.innerText = "Show Progress";
      progressTitle.innerText = "View Your Progress";
  } else {
      progressButton.innerText = "Hide Progress";
      progressTitle.innerText = "Hide Your Progress";
  }
});

// Initially hide the form to add a new progress 
let isFormVisible = false;

// Toggle the visibility of the form
addProgressButton?.addEventListener("click", () => {
  isFormVisible = !isFormVisible;
  toggleElement(addProgressForm!, true);
  toggleElement(editProgressForm!, false);
  toggleElement(progressContainer!, false);
      progressButton.innerText = "Show Progress";
      progressTitle.innerText = "View Your Progress";
});

// Submit even to do a POST of the new progress
addProgressForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const token = localStorage.getItem("token");
  if (token) {
    localStorage.getItem(token);
  } else showAlert("You need to logout and in to do this.")
 
  // Get the values from the form fields
  const date = (document.getElementById("date") as HTMLInputElement).value;
  const exercise = (document.getElementById("exercise") as HTMLInputElement).value;
  const weight = parseInt((document.getElementById("exerciseWeight") as HTMLInputElement).value);
  const reps = parseInt((document.getElementById("reps") as HTMLInputElement).value);

  // The body of the POST
  const progressData = {
    date,
    exercise,
    weight,
    reps
  };

  try {
    // Send a POST request to add progress
    await axios.post(`${API_BASE_URL}/progress`, progressData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(progressData);

    // If the POST is successful, hide the form
    toggleElement(addProgressForm!, false);

    // Remove the user's progress list
    while (progressList!.firstChild) {
      progressList!.removeChild(progressList!.firstChild);
    }
    // Reset progress button and text to initial state
    progressButton.innerText = "Show Progress";
    progressTitle.innerText = "View Your Progress";

    // Clear search field
    searchInput.value = "";

    // Fetch and update the progress list
    fetchProgress(token);

    // Clear the form fields
    (document.getElementById("date") as HTMLInputElement).value = "";
    (document.getElementById("exercise") as HTMLInputElement).value = "";
    (document.getElementById("exerciseWeight") as HTMLInputElement).value = "";
    (document.getElementById("reps") as HTMLInputElement).value = "";

    showAlert("Progress added successfully!");
  } catch (error) {
    console.log("Error adding progress:", error);
    showAlert("Failed to add progress. Please try again.");
  }
});

// Close the add progress form
cancelAddProgressButton!.addEventListener("click", () => {
  toggleElement(addProgressForm!, false);

  // Clear the form fields
  (document.getElementById("date") as HTMLInputElement).value = "";
  (document.getElementById("exercise") as HTMLInputElement).value = "";
  (document.getElementById("exerciseWeight") as HTMLInputElement).value = "";
  (document.getElementById("reps") as HTMLInputElement).value = "";
});

// Event to edit a progress
progressList!.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (target.classList.contains("editProgress")) {
    toggleElement(addProgressForm!, false);
    toggleElement(progressContainer!, false);
      progressButton.innerText = "Show Progress";
      progressTitle.innerText = "View Your Progress";
    const progressItem = target.closest("li")
    const id = progressItem?.id.split("-")[1];

    // Extract the value of the fields and slicing it accordingly from the selected item in progress list
    const dateElement = progressItem!.querySelector("p:nth-of-type(1)")!.textContent!.trim()
    console.log("Not sliced date:",dateElement);
    const date = dateElement!.slice(6);
    console.log("Sliced date:", date)
      
    const exercise = progressItem!.querySelector("p:nth-of-type(2)")!.innerHTML!.slice(14);
    const weightString = progressItem!.querySelector("p:nth-of-type(3)")!.textContent!.slice(8);
    const weight = weightString!.slice(0, -3);
    const reps = progressItem!.querySelector("p:nth-of-type(4)")!.textContent!.slice(6);

    // Adding the initial progress data to the edit fields
    (document.getElementById("editProgressId") as HTMLInputElement).value = id!;
    (document.getElementById("editDate") as HTMLInputElement).value = date;
    (document.getElementById("editExercise") as HTMLInputElement).value = exercise;
    (document.getElementById("editExerciseWeight") as HTMLInputElement).value = weight;
    (document.getElementById("editReps") as HTMLInputElement).value = reps;
    console.log("This is the id of the selected progress:", id)
    // Show the edit form
    toggleElement(editProgressForm!, true);
  }
});

// Submit event for the edited progress to update it in database
editProgressForm!.addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");

  // Get the values from the edit form fields
  const id = (document.getElementById("editProgressId") as HTMLInputElement).value;
  const date = (document.getElementById("editDate") as HTMLInputElement).value;
  const exercise = (document.getElementById("editExercise") as HTMLInputElement).value;
  const weight = parseInt((document.getElementById("editExerciseWeight") as HTMLInputElement).value);
  const reps = parseInt((document.getElementById("editReps") as HTMLInputElement).value);

  // The body of the PATCH request
  const updatedProgressData = {
    date: date + "T00:00:00.000Z",
    weight,
    exercise,
    reps
  };

  console.log(updatedProgressData);

  try {
    // Send a PATCH request to update the selected progress
    await axios.patch(`${API_BASE_URL}/progress/${id}`, updatedProgressData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // If the PATCH is successful, hide the edit form
    toggleElement(editProgressForm!, false);

    // Reset progress button and text to initial state
    progressButton.innerText = "Show Progress";
    progressTitle.innerText = "View Your Progress";

    // Clear search field
    searchInput.value = "";

    // Remove the user's old progress list from DOM
    while (progressList!.firstChild) {
      progressList!.removeChild(progressList!.firstChild);
    }

    // Update the progress list and send it to DOM
    fetchProgress(token);

    showAlert("Progress updated successfully!");
  } catch (error) {
    console.log("Error updating progress:", error);
    showAlert("Failed to update progress. Please try again.");
  }
});

// Close the edit progress form
cancelProgressButton!.addEventListener("click", () => {
  toggleElement(editProgressForm!, false);
});

// Filter in the list of progress's 
const filterExercise = (e: any) => {
  e.preventDefault(); 

  const searchInput = document.getElementById("filterExercise") as HTMLInputElement;
  const userSearch = searchInput.value.toLowerCase();
  const progressItems = progressList!.querySelectorAll("li");

  if (!progressItems) {
      return;
  }

  progressItems.forEach((progressItem) => {
      const exerciseName = progressItem.querySelector("p:nth-of-type(2)")!.innerHTML.toLowerCase().trim().split(" <br> ")[1];
      if (exerciseName.includes(userSearch)) {
          progressItem.style.display = "flex";
      } else {
          progressItem.style.display = "none";
      }
  });
};

// Adding the event to both as a submit and click on the search button
searchForm?.addEventListener("submit", filterExercise);
searchButton?.addEventListener("click", filterExercise);

// Reset the search field and show all progress's
const resetSearch = () => {
  
  // Clear search field
  searchInput.value = "";

  // Show all progress's
  const progressItems = progressList!.querySelectorAll("li");
  progressItems.forEach((progressItem) => {
      progressItem.style.display = "flex";
  });
};

// Adding the event to reset the search to the reset button
resetSearchButton?.addEventListener("click", resetSearch);

// Call autoLogin initially when page load
window.addEventListener("DOMContentLoaded", autoLogin);