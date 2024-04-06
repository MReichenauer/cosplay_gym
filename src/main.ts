import "./style.css";
import axios from "axios";

export const API_BASE_URL = "http://localhost:3000";

// Login and register div
const registerAndLogin = document.getElementById("appRegisterAndLogin");
// User data variables
let userInfo = null;
// Main app references
const homeApp = document.getElementById("homeApp");
const welcomeUser = document.getElementById("welcomeUser");

// registration and login forms and buttons
const registrationForm = document.getElementById("registrationForm");
const registerBtn = document.getElementById("registerButton");
const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginButton");


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

    // Get input field values
    const emailInput = (document.getElementById("email") as HTMLInputElement).value;
    const passwordInput = (document.getElementById("password") as HTMLInputElement).value;
    const first_nameInput = (document.getElementById("first_name") as HTMLInputElement).value;
    const last_nameInput = (document.getElementById("last_name") as HTMLInputElement).value;
    const weight = parseFloat((document.getElementById("weight") as HTMLInputElement).value);
    const height = parseFloat((document.getElementById("height") as HTMLInputElement).value);

    // Get values from input fields and trim them
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

  // Get the email and password from the login form fields
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
    const response = await axios.post("http://localhost:3000/login", {
      email,
      password
    });

    const { token } = response.data;
    console.log(token);

    // Store the token
    localStorage.setItem("token", token);

    // Set the authorization header
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Fetch user profile
    const profileResponse = await axios.get("http://localhost:3000/profile");
    userInfo = profileResponse.data;
    console.log("User profile:", userInfo);
    console.log("User's first name:", userInfo.data.first_name);

    // Update the page so its adapted for each uniq user
    welcomeUser!.innerHTML = `Welcome ${userInfo.data.first_name} <br><br> strive to be the best version of yourself!`;

    // When user is logged in, hide registerAndLogin and show homeApp
    toggleElement(homeApp!, true);
    toggleElement(registerAndLogin!, false);
  } catch (error) {
    console.error("Login failed:", error);
    alert("Failed to login. Please check your email and password and try again.")
    
  }
});