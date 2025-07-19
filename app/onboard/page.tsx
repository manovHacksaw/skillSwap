"use client"
import { useAuth, useUser } from '@clerk/nextjs'
import { useElementScroll } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

// Helper function to convert comma-separated string to an array of trimmed strings
const refactorStringToArray = (inputString) => {
  if (typeof inputString === 'string' && inputString.trim() !== '') {
    return inputString.split(',').map(item => item.trim()).filter(item => item !== '');
  }
  return []; // Return an empty array if input is not a non-empty string
};

const OnboardingPage = () => {

  const {userId } = useAuth();
  const { user } = useUser();

  // Initialize formData with all relevant fields from the User model
  const [formData, setFormData] = React.useState({
    name: "",
    username: "",
    bio: "",
    avatarUrl: "",
    interests: "", // Stored as a comma-separated string for input
    socialLinks: "", // Stored as a string, expecting JSON format
    preferredLanguages: "", // Stored as a comma-separated string for input
    occupation: "",
    location: "",
    timezone: "",
    ageGroup: "", // Changed from 'age' to 'ageGroup'
    skillsOffered: "", // Stored as a comma-separated string for input
    learningGoals: "", // Stored as a comma-separated string for input
    userIntent: "", // Stored as a comma-separated string for input
    userAvailability: "", // Stored as a comma-separated string for input
    walletAddress: "",
  })

  const router = useRouter();

  useEffect(()=>{
    const checkOnboardingStatus = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        console.log("Onboarding status:", data.user.hasOnboarded);
        // You can handle the onboarding status here, e.g., redirect if already onboarded

        if (data.user.hasOnboarded) {
          // Redirect to a different page or show a message
         
          // Example: window.location.href = '/dashboard'; // Redirect to dashboard
          router.push("/dashboard")
        } else {
          console.log("User has not completed onboarding yet.");
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      }
    }
    checkOnboardingStatus();
  }, []);

  // Generic onChange handler for all input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };


  const getUsername = async () => {
        try {
          const response = await fetch(`/api/user`);
          const data = await response.json();
          console.log("FETCHING THE USERNAME FROM API:", data);
          if(data.user && data.user.username) {
            setFormData((prev) => ({ ...prev, username: data.user.username }));
          }
        } catch (error) {
          console.error("Failed to fetch username:", error); // Added error logging
        }
      }

      useEffect(() => {
        // Fetch the username when the component mounts
         const checkUsername = async()=>{
          // Only check username uniqueness if username is not empty
          if (formData.username) {
            try {
              const response = await fetch(`/api/user/check-username`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: formData.username }),
              });

              const data = await response.json();
              console.log("Username check response:", data);
              if (!data.isUnique) {
                // Handle non-unique username case (e.g., display an error message to the user)
                console.warn("Username is not unique");
                // You might want to set an error state here, e.g., setUsernameError(true)
              } else {
                 // Username is unique
                 // setUsernameError(false)
              }
            } catch (error) {
              console.error("Error checking username uniqueness:", error);
            }
          }
         }

         // Debounce the username check to avoid too many API calls
         const handler = setTimeout(() => {
           checkUsername();
         }, 500); // Check after 500ms of inactivity

         return () => {
           clearTimeout(handler); // Cleanup the timeout on unmount or re-render
         };
      }, [formData.username]); // Dependency array: run when formData.username changes

  useEffect(() => {
    console.log("Current User:", user, userId);
    // If userId is available, pre-fill the form with current user data
    if (userId && user) {

      setFormData(prev => ({ // Use functional update to ensure latest state
        ...prev,
        name: user.fullName || "",
        avatarUrl: user.imageUrl || "",
        // You might also want to pre-fill other fields if they exist in the user object
        // e.g., bio: user.publicMetadata?.bio || "",
      }));

      getUsername();
    }
  }, [userId, user]); // Added userId and user to dependencies for completeness

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Refactor array-like fields before submission
    const dataToSend = {
      ...formData,
      interests: refactorStringToArray(formData.interests),
      preferredLanguages: refactorStringToArray(formData.preferredLanguages),
      skillsOffered: refactorStringToArray(formData.skillsOffered),
      learningGoals: refactorStringToArray(formData.learningGoals),
      userIntent: refactorStringToArray(formData.userIntent),
      userAvailability: refactorStringToArray(formData.userAvailability),
      // Parse socialLinks if it's expected as a JSON object in the backend
      socialLinks: formData.socialLinks ? JSON.parse(formData.socialLinks) : null,
      // ageGroup is already a string in formData and schema, no refactoring needed unless specific format is required
    };

    console.log("Form submitted with refactored data:", dataToSend);
    // Here you would typically send this data to your backend API
    // For example: fetch('/api/onboard', { method: 'POST', body: JSON.stringify(dataToSend) });

    fetch('/api/onboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData: dataToSend }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Onboarding response:", data);
        // Handle successful onboarding, e.g., redirect or show a success message
      })
      .catch(error => {
        console.error("Error during onboarding:", error);
        // Handle error, e.g., show an error message to the user
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Onboarding Page</h1>

        <form onSubmit={handleSubmit} className="space-y-4"> {/* Added onSubmit handler */}
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              id="bio"
              name="bio"
              placeholder="Tell us about yourself"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>

          {/* Avatar URL */}
          <div>
            <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
            <input
              type="text"
              id="avatarUrl"
              name="avatarUrl"
              placeholder="Enter your avatar image URL"
              value={formData.avatarUrl}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Interests (comma-separated) */}
          <div>
            <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">Interests (comma-separated)</label>
            <input
              type="text"
              id="interests"
              name="interests"
              placeholder="e.g., coding, reading, hiking"
              value={formData.interests}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Social Links (JSON string) */}
          <div>
            <label htmlFor="socialLinks" className="block text-sm font-medium text-gray-700 mb-1">Social Links (JSON string)</label>
            <textarea
              id="socialLinks"
              name="socialLinks"
              placeholder='e.g., {"github": "your_github", "linkedin": "your_linkedin"}'
              value={formData.socialLinks}
              onChange={handleChange}
              rows="2"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>

          {/* Preferred Languages (comma-separated) */}
          <div>
            <label htmlFor="preferredLanguages" className="block text-sm font-medium text-gray-700 mb-1">Preferred Languages (comma-separated)</label>
            <input
              type="text"
              id="preferredLanguages"
              name="preferredLanguages"
              placeholder="e.g., English, Spanish, French"
              value={formData.preferredLanguages}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Occupation */}
          <div>
            <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
            <input
              type="text"
              id="occupation"
              name="occupation"
              placeholder="e.g., Software Engineer, Student"
              value={formData.occupation}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="e.g., New York, USA"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Timezone */}
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <input
              type="text"
              id="timezone"
              name="timezone"
              placeholder="e.g., UTC-5, Europe/London"
              value={formData.timezone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Age Group */}
          <div>
            <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
            <input
              type="text" // Changed type to text for age group
              id="ageGroup"
              name="ageGroup"
              placeholder="e.g., 18-24, 25-34, 35-44"
              value={formData.ageGroup}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Skills Offered (comma-separated) */}
          <div>
            <label htmlFor="skillsOffered" className="block text-sm font-medium text-gray-700 mb-1">Skills Offered (comma-separated)</label>
            <input
              type="text"
              id="skillsOffered"
              name="skillsOffered"
              placeholder="e.g., JavaScript, React, Python"
              value={formData.skillsOffered}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Learning Goals (comma-separated) */}
          <div>
            <label htmlFor="learningGoals" className="block text-sm font-medium text-gray-700 mb-1">Learning Goals (comma-separated)</label>
            <input
              type="text"
              id="learningGoals"
              name="learningGoals"
              placeholder="e.g., Machine Learning, Web3, Data Science"
              value={formData.learningGoals}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* User Intent (comma-separated) */}
          <div>
            <label htmlFor="userIntent" className="block text-sm font-medium text-gray-700 mb-1">User Intent (comma-separated)</label>
            <input
              type="text"
              id="userIntent"
              name="userIntent"
              placeholder="e.g., teach, learn, both"
              value={formData.userIntent}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* User Availability (comma-separated) */}
          <div>
            <label htmlFor="userAvailability" className="block text-sm font-medium text-gray-700 mb-1">User Availability (comma-separated)</label>
            <input
              type="text"
              id="userAvailability"
              name="userAvailability"
              placeholder="e.g., Mon 9-11 AM, Wed 2-4 PM"
              value={formData.userAvailability}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Wallet Address */}
          <div>
            <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 mb-1">Wallet Address</label>
            <input
              type="text"
              id="walletAddress"
              name="walletAddress"
              placeholder="Enter your wallet address (optional)"
              value={formData.walletAddress}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Onboarding
          </button>
        </form>
      </div>
    </div>
  )
}

export default OnboardingPage
