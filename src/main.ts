import './style.css';
import axios from 'axios';

export const API_BASE_URL = 'http://localhost:3000';
const registrationForm = document.getElementById('registrationForm');
const registerBtn = document.getElementById('registerButton');


// Event listener for the register button
registerBtn?.addEventListener('click', () => {
  registrationForm?.classList.toggle('hide');
});

// Email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

 // Registration form
 registrationForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

    // Get input field values
    const emailInput = (document.getElementById('email') as HTMLInputElement).value;
    const passwordInput = (document.getElementById('password') as HTMLInputElement).value;
    const first_nameInput = (document.getElementById('first_name') as HTMLInputElement).value;
    const last_nameInput = (document.getElementById('last_name') as HTMLInputElement).value;
    const weight = parseFloat((document.getElementById('weight') as HTMLInputElement).value);
    const height = parseFloat((document.getElementById('height') as HTMLInputElement).value);

    // Get values from input fields and trim whitespace
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

    // Validate first name and last name
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
    console.log('Submitting registration form', registrationData);

    try {
      const response = await axios.post(`${API_BASE_URL}/register`, registrationData);
  
      if (response.status === 201) {
        alert("Your registration was successful!");
        registrationForm?.classList.add('hide')
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