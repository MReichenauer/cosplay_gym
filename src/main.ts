import "./style.css";
import axios from "axios";
import { User } from './type';

export const API_BASE_URL = "https://testapi-production-f5d2.up.railway.app";

// JWT token that i will use so that a user don't need to login if token is still valid
let token = localStorage.getItem("token");

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

// Profile button, close profile button and profile edit form
const profileButton = document.getElementById("profileButton");
const closeProfileButton = document.getElementById("closeProfile");
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

// Close the alert window if the close button is clicked
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

// Name validation
const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZåäöÅÄÖ\s]+$/;
  return nameRegex.test(name);
}

 // Registration form event
 registrationForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

    // Get registration input field values
    const emailInput = (document.getElementById("email") as HTMLInputElement).value;
    const passwordInput = (document.getElementById("password") as HTMLInputElement).value;
    const confirmPasswordInput = (document.getElementById("confirmPassword") as HTMLInputElement).value;
    const first_nameInput = (document.getElementById("first_name") as HTMLInputElement).value;
    const last_nameInput = (document.getElementById("last_name") as HTMLInputElement).value;
    const weight = parseFloat((document.getElementById("weight") as HTMLInputElement).value);
    const height = parseFloat((document.getElementById("height") as HTMLInputElement).value);

    // Check if the passwords match
    if (passwordInput !== confirmPasswordInput) {
      showAlert("Passwords do not match. Please enter the same password in both fields.");
      return;
    }

    // Get the fields and trim them
    const email = emailInput.trim();
    const password = passwordInput.trim();
    const first_name = first_nameInput.trim();
    const last_name = last_nameInput.trim();

    // Validate email
    if (!isValidEmail(email)) {
      showAlert("Please enter a valid email address.");
    return;
    }

    // Validate first name
    if (!isValidName(first_name)) {
    return;
    }  

    // Validate last name
    if (!isValidName(last_name)) {
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
          showAlert("Failed to register, please check all of the fields and try again.");
        }
      } else {
        showAlert("Failed to register, please reload the page and try again.");
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

    // Store the token
    localStorage.setItem("token", token);

    // Update the token with each login
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Update the token variable
    token = localStorage.getItem("token");

    // Fetch user profile
    const profileResponse = await axios.get(`${API_BASE_URL}/profile`);
    userInfo = profileResponse.data;

    // Update the welcome page so it's adapted for each uniq user
    welcomeUser!.innerHTML = `Welcome ${userInfo.data.first_name}`;

    // When user is logged in, hide registerAndLogin and show homeApp
    toggleElement(homeApp!, true);
    toggleElement(registerAndLogin!, false);
    toggleElement(addProgressForm!, false);
    toggleElement(profileForm!, false);

    // Clear the login fields after a successful login
    (document.getElementById("loginEmail") as HTMLInputElement).value = "";
    (document.getElementById("loginPassword") as HTMLInputElement).value = "";

    // Fetch progress data after successful login
    fetchProgress(token);

  } catch (error) {
    showAlert("Failed to login. Please check your email and password then try again.")
  }
});

// Event to logout
logoutButton?.addEventListener("click", () => {

  // Remove token from local storage
  localStorage.removeItem("token");
  token = null;
  console.log(token);

  // Show initial start
  toggleElement(homeApp!, false);
  toggleElement(registerAndLogin!, true);
  
  // Set flex direction on registerAndLogin div
  registerAndLogin!.style.flexDirection = "column";

  // Reset progress button text to initial state
  progressButton.innerText = "Show Progress";
 
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

      // Reset progress button text to initial state
      progressButton.innerText = "Show Progress";
      return;
    }

    // Fetch user profile using the token from local storage
    const response = await axios.get(`${API_BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // User profile fetched successfully
    const profileData = response.data;

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

    // Auto login failed (token most likely expired)
    
    // Remove old token
    localStorage.removeItem("token");

    // Show initial start
    toggleElement(homeApp!, false);
    toggleElement(registerAndLogin!, true);
  
    // Set flex direction on registerAndLogin div
    registerAndLogin!.style.flexDirection = "column";

    // Reset progress button text to initial state
    progressButton.innerText = "Show Progress";
   
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
    } else {
      // if GET fails
      showAlert("Failed get user profile. Please reload the page and then try again.");
    }
  } catch (error) {
    showAlert("Failed get user profile. Try again in a few minutes.");
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
profileForm!.addEventListener("submit", async (e) => {
  e.preventDefault();
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

    // Fetch the original user profile information
    const profileResponse = await axios.get(`${API_BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const originalProfile = profileResponse.data;

    // Send a PATCH request to update the user's profile with the updatedUser object
    await axios.patch(`${API_BASE_URL}/profile/edit`, updatedUser, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // If the request is successful
    showAlert("Profile updated successfully!");

    // Reset the form
    profileEmail.value = "";
    profilePassword.value = "";
    confirmProfilePassword.value = "";
    profileFirstName.value = "";
    profileLastName.value = "";
    profileWeight.value = "";
    profileHeight.value = "";

    // Hide profile form
    toggleElement(profileForm!, false);

    // If the user don't update the email, updatedUser.email will be undefined
    if (updatedUser.email !== undefined) {
    
      // If email is updated, show the alert and force user to log in again with new email
      showAlert("You need to log in again with your new email.");
      
      // Remove token from local storage
      localStorage.removeItem("token");
      
      // Show initial start
      toggleElement(homeApp!, false);
      toggleElement(registerAndLogin!, true);
      
      // Set flex direction on registerAndLogin div
      registerAndLogin!.style.flexDirection = "column";

      // Reset progress button text to initial state
      progressButton.innerText = "Show Progress";
     
      // Remove the user's progress list
      while (progressList!.firstChild) {
        progressList!.removeChild(progressList!.firstChild);
      }
    }

    // Update the welcome page if the user updated first name
    if (updatedUser.first_name !== originalProfile.data.first_name) {
      welcomeUser!.innerHTML = `Welcome ${updatedUser.first_name}`;
    }
  
  } catch (error: any) {
      // If the response contains error data, extract the msg and display in an alert
      if (error.response.data.data.length > 0) {
        const errorMessage = error.response.data.data[0].msg;
        showAlert(errorMessage);
      } else {
        showAlert("Failed to update profile. Please try again.");
      }
    }
});

// Mark so that we can make sure we don't send multiply requests
let deleteInProgress = false; 

const deleteProfileButton = document.getElementById("deleteProfileButton");

// Event to delete the user's profile
deleteProfileButton!.addEventListener("click", async () => {

  // Check if delete is already in progress
  if (deleteInProgress) {
    // Prevent multiple delete attempts
    return; 
  }
  // Mark to indicate delete is starting
  deleteInProgress = true; 

  try {
      // Show confirmation window
      const confirmationProfileDeleteWindow = document.getElementById("confirmationProfileDeleteWindow")!;
      confirmationProfileDeleteWindow.style.display = "block";
      window.focus();

      // Confirmation and cancel buttons
      const confirmProfileButton = document.getElementById("confirmProfileButton")!;
      const cancelConfirmProfileButton = document.getElementById("cancelConfirmProfileButton")!;

      // If confirmed, delete the profile and all of it's progress's
      confirmProfileButton.addEventListener("click", async () => {
          try {
              // Hide confirmation window
              confirmationProfileDeleteWindow.style.display = "none";

              // Make sure we have the newest token
              let token = localStorage.getItem("token");

              // Delete all of the user's progress's
              await deleteAllProgress(token);

              // Once all progress is deleted, move on and delete the profile
              await axios.delete(`${API_BASE_URL}/profile`, {
                  headers: { Authorization: `Bearer ${token}` }
              });

              // If DELETE is successful, remove the token and show initial start
              localStorage.removeItem("token");
              token = null;

              // Hide profile form and show initial start
              toggleElement(profileForm!, false);
              toggleElement(homeApp!, false);
              toggleElement(registerAndLogin!, true);

              // Set flex direction on registerAndLogin div
              registerAndLogin!.style.flexDirection = "column";
              // Alert the user the delete was a success
              showAlert("Your profile was deleted successfully!");

          } catch (error) {
              showAlert("Failed to delete profile, reload the page then try again.");
          } finally {
            // Reset the mark if delete was a success or an error occurred
              deleteInProgress = false; 
          }
      });

      // If canceled, hide the confirmation window
      cancelConfirmProfileButton.addEventListener("click", () => {
        confirmationProfileDeleteWindow.style.display = "none";
        deleteInProgress = false; // Reset deletion flag if cancellation occurs
      });

  } catch (error) {
      showAlert("Failed to delete profile, reload the page then try again.");
      // Reset the mark if delete if an error occurs
      deleteInProgress = false;
  }
});

// Delete all of the user's progress's
const deleteAllProgress = async (token: string | null): Promise<void> => {
  try {
      const response = await axios.get(`${API_BASE_URL}/progress`, {
          headers: { Authorization: `Bearer ${token}` }
      });

      // Get all progress data
      const progressData: any[] = response.data.data;

      // Extract all of the progress's IDs
      const progressIds: string[] = progressData.map((progress: any) => progress.id);

      // Use a Set so we can check if the current progress id has been deleted
      const deletedProgressIds = new Set();

      // Delete all progress items concurrently
      await Promise.all(progressIds.map(async (progressId: string) => {

          // Check if current the progressId has already been deleted
          if (!deletedProgressIds.has(progressId)) {

              // Mark the current progressId as deleted
              deletedProgressIds.add(progressId);
              
              // Delete progress item
              await axios.delete(`${API_BASE_URL}/progress/${progressId}`, {
                  headers: { Authorization: `Bearer ${token}` }
              });
          }
      }));
  } catch (error) {
      throw new Error("Failed to delete progress");
  }
};

// Fetch progress data of the authenticated user
const fetchProgress = async (token: string | null) => {
  try {
      const response = await axios.get(`${API_BASE_URL}/progress`, {
          headers: { Authorization: `Bearer ${token}` }
      });

      // All of the user's progress's
      let progressData = response.data.data;

      // Initially hide progress container
      progressContainer.style.display = "none";

       // Check if there is any progress's for the user
       if (progressData.length === 0) {
        // If there is no progress's, tell the user that they need to add a progress to get started
       progressTitle.textContent = "Add a progress to get started";
    } else {
        // If there is at least 1 progress, display no message
        progressTitle.textContent = "";
    }

      // Sort progress data by date with the most recent first
      progressData.sort((a: { date: Date }, b: { date: Date }) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Loop through the progress's and create a li for each
      progressData.forEach((progress: any) => {
          const { id, date, exercise, weight, reps } = progress;

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
                  showAlert("Progress deleted successfully")
                  
                  // Hide confirmation window
                  confirmationWindow.style.display = "none"; 
                  // Get all of the li's
                  const progressItems = progressList?.querySelectorAll("li");

                  // Check if there is any progress's for the user
                  if (progressItems?.length === 0) {
                    // If there is no progress's, hide the list
                    toggleElement(progressContainer!, false)
                    progressButton.innerText = "Show Progress";  
                  } 
              });
              
              // If canceled hide confirm window
              cancelConfirmButton.addEventListener("click", () => {
                  confirmationWindow.style.display = "none";
              });
              } catch (error) {
                  showAlert("Failed to delete progress, reload the page then try again.");
              }
          });

          // Append the li to the progress's list
          progressList!.appendChild(progressItem);
      });

  } catch (error) {
    showAlert("Failed to get your progress. Please try again.");
  }
};

// Event to show and hide the progress's list
progressButton.addEventListener("click", () => {

  const progressItems = progressList?.querySelectorAll("li");

    // Check if there is any progress's for the user
    if (progressItems?.length === 0) {
      // If there is no progress's, tell the user that they need to add a progress
      showAlert("Looks like there's nothing here. Begin by adding a progress!");
    } else {

    // Display the progress's
    toggleElement(progressContainer, progressContainer.style.display === "none");

    // Change the button text based on if progress list is hidden or visible
    if (progressContainer.style.display === "none") {
        progressButton.innerText = "Show Progress";
    } else {
        progressButton.innerText = "Hide Progress";
    }
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
});

// Submit event to do a POST of the new progress
addProgressForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const token = localStorage.getItem("token");
  if (token) {
    localStorage.getItem(token);
  } else showAlert("Failed to add a new progress, reload the page then try again.")
 
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

    // If the POST is successful, hide the form
    toggleElement(addProgressForm!, false);

    // Remove the user's progress list
    while (progressList!.firstChild) {
      progressList!.removeChild(progressList!.firstChild);
    }
    // Reset progress button text to initial state
    progressButton.innerText = "Show Progress";
   
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

    const progressItem = target.closest("li");
    const id = progressItem?.id.split("-")[1];

    // Extract the value of the fields and slicing it accordingly from the selected item in progress list
    const dateElement = progressItem!.querySelector("p:nth-of-type(1)")!.textContent!.trim()
    const date = dateElement!.slice(6);
      
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

  try {
    // Send a PATCH request to update the selected progress
    await axios.patch(`${API_BASE_URL}/progress/${id}`, updatedProgressData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // If the PATCH is successful, hide the edit form
    toggleElement(editProgressForm!, false);

    // Reset progress button text to initial state
    progressButton.innerText = "Show Progress";

    // Clear search field
    searchInput.value = "";

    // Remove the user's old progress list
    while (progressList!.firstChild) {
      progressList!.removeChild(progressList!.firstChild);
    }

    // Fetch the updated progress list
    fetchProgress(token);

    showAlert("Progress updated successfully!");
  } catch (error) {
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

  // If found exercise this will change to true
  let found = false;

  progressItems.forEach((progressItem) => {
      const exerciseName = progressItem.querySelector("p:nth-of-type(2)")!.innerHTML.toLowerCase().trim().split(" <br> ")[1];
      if (exerciseName.includes(userSearch)) {
          progressItem.style.display = "flex";
          found = true;
      } else {
          progressItem.style.display = "none";
      }
  });

  // if not a single exercise matched the search, reply with showAlert
  if (!found) {
    showAlert("We couldn't find any matching exercises. Please try a different search.");
  }
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