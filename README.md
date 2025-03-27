# AI-Based Trip Planner

An intelligent trip planning application that personalizes travel itineraries based on user preferences. Leveraging AI, it recommends activities, suggests packing lists, and provides weather insights for your chosen destination and dates.

## Features

- **Personalized Itineraries:** Input your destination, travel dates, preferred activities, and companions to receive a customized travel plan.
- **Packing Recommendations:** Get a tailored packing list based on selected activities and expected weather conditions.
- **Weather Forecasts:** Access weather predictions for your destination during your travel period to plan accordingly.
- **User-Friendly Interface:** Navigate effortlessly through a clean and intuitive design.

## Prerequisites

Ensure you have the following installed:

- **Node.js** (v14 or later)
- **npm** (Node Package Manager, comes with Node.js)

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Ujjawal-Sinha/ai-based-smart-travel-assistant.git

2. **Navigate to the Project Directory:**

   ```bash
   cd ai-based-smart-travel-assistant

3. **Install Dependencies:**

   ```bash
   npm install
   ```
   If you encounter issues related to React version compatibility, run:
   ```bash
   npm install react@18 react-dom@18

 4. **Set Up Environment Variables:**  
      The application requires specific environment variables for configuration. Follow these steps to set them up:

      - **Install the dotenv Package (if not already installed):**
      
       ```bash
       npm install dotenv --save
       ```

      - **Create a .env File:**  
      In the root directory of your project, create a file named .env and add your API keys and endpoints:

      ```bash
      ENDPOINT=your_end_point
      API_KEY=your_api_key
      GOOGLE_API_KEY=your_google_api_key
      ```
    *Replace your_end_point, your_api_key, and your_google_api_key with your actual credentials.*


## Usage

  1. **Start the Development Server:**

     ```bash
     npm run dev
     ```
     
  Alternatively, you can use:
    ```bash
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

  1. **Start the Development Server:**

   Open http://localhost:3000 in your web browser to use the AI-Based Trip Planner.


  Enjoy your AI-planned trip! 😊  
