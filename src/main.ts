import "./style.css";
import axios from "axios";

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

// Main app div ,welcomeUser H2, logout button
const homeApp = document.getElementById("homeApp");
const welcomeUser = document.getElementById("welcomeUser");
const logoutButton = document.getElementById("logoutButton");

// View progress button and progress container
const progressButton = document.getElementById("progressButton")!;
const progressTitle = document.getElementById("progressTitle")!;
const progressContainer = document.getElementById("progressContainer")!;


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
    alert("Please enter a valid email address.");
    return;
    }

    // Validate password
    if (passwordInput.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    // Validate first name
    if (first_nameInput.length < 3) {
      alert("First name must be at least 3 characters long.");
      return;
    }

    // Validate last name
    if (last_nameInput.length < 3) {
      alert("Last name must be at least 3 characters long.");
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
        alert("Your registration was successful!");
        toggleElement(loginForm!, true);
        toggleElement(registrationForm!, false);
      } else {
        alert("Failed to register account. Please check your inputs and try again.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const response = error.response;
        if (response?.status === 400) {
          const errorMsg = response.data?.data?.[0]?.msg || "Failed to register user. Please try again.";
          alert(errorMsg);
        } else {
          console.error("Network error:", error);
          alert("Failed to connect to the server. Please check your internet connection and try again.");
        }
      } else {
        console.error("Error registering user:", error);
        alert("An unexpected error occurred. Please try again later.");
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
  alert("Please enter a valid email address.");
  return;
  }

  // Validate password
  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password
    });

    // JWT token
    let { token } = response.data;
    console.log(token);

    // Store the token
    localStorage.setItem("token", token);

    // Update the token with each login
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Fetch user profile
    const profileResponse = await axios.get(`${API_BASE_URL}/profile`);
    userInfo = profileResponse.data;
    console.log("User profile:", userInfo);
    console.log("User's first name:", userInfo.data.first_name);

    // Update the welcome page so it's adapted for each uniq user
    welcomeUser!.innerHTML = `Welcome ${userInfo.data.first_name} <br><br> Strive to be the best version of yourself!`;

    // When user is logged in, hide registerAndLogin and show homeApp
    toggleElement(homeApp!, true);
    toggleElement(registerAndLogin!, false);

    // Fetch progress data after successful login
    fetchProgress(token);

  } catch (error) {
    console.error("Login failed:", error);
    alert("Failed to login. Please check your email and password and try again.")
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

        // Create a ul for the progress's
        const progressList = document.createElement("ul");
        progressList.id = `progressListId`

        // Loop through the progress's and create a li for each
        progressData.forEach((progress: any) => {
            const { id, date, exercise, weight, reps } = progress;
            console.log(`ID: ${id}, Date: ${date}, Exercise: ${exercise}, Weight: ${weight}, Reps: ${reps}`);

            // Format the date to "YYYY-MM-DD"
            const humanDate = new Date(date).toISOString().split('T')[0];

            // Create a li for each progress
            const progressItem = document.createElement("li");
            progressItem.id = `progress-${id}`;
            progressItem.innerHTML = `
                <p>Date: ${humanDate}</p>
                <p>Exercise: ${exercise}</p>
                <p>Weight: ${weight} kg</p>
                <p>Reps: ${reps}</p>
                <hr>`;

            // Append the li to the ul
            progressList.appendChild(progressItem);
        });

        // Append ul to progressContainer
        document.getElementById("progressContainer")?.appendChild(progressList);

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

// Event to logout
logoutButton?.addEventListener("click", () => {

  // Remove token from local storage
  localStorage.removeItem("token");
  console.log(token);

  // Show initial start
  toggleElement(homeApp!, false);
  toggleElement(registerAndLogin!, true);
  
  // Set flex direction on registerAndLogin div
  registerAndLogin!.style.flexDirection = "column";

  // Remove the user's progress list
  const progressList = document.getElementById("progressListId");
  if (progressList) {
      progressList.remove();
  }
});