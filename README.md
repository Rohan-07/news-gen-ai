# AI-Powered News Summarization

This project provides a Node.js application that leverages the News API and Gemini AI to deliver summaries of news articles relevant to your interests.

## Installation

**Prerequisites:**

- Node.js and npm (or yarn) installed on your system. Node JS version >= v20.6.0

**Steps:**

1. **Clone the Repository:**

   ```bash
   git clone [https://github.com/Rohan-07/news-gen-ai.git](https://github.com/Rohan-07/news-gen-ai.git)
   cd news-gen-ai
   ```

2. **Create an Environment File:**

   Rename the `.env.template` file to `.env` in the project's root directory.

- Inside the .env file, add the following lines, replacing the placeholders with your actual API keys:
  
  ```
   NEWS_API_KEY=your_news_api_key
   GEMINI_API_KEY=your_gemini_api_key
  ```

- Obtain your News API key from https://newsapi.org/.
- Follow the instructions at [https://cloud.google.com/vertex-ai/docs/create-api-key ](https://makersuite.google.com/app/apikey) to create and get Gemini API key.

3. **Install Dependencies:**

Run below commands inside both `/frontend` and `/backend` directory.

   ```bash
   npm install
   or
   yarn install
  ```

4. **Running the Application:**

***Backend Server:***

  ```bash
  cd backend
  npm start
  ```
This will start the server on port 4000 by default (accessible at http://localhost:4000).

***Fontend Server:***

  ```bash
  cd frontend
  npm run dev
  ```

This will run the frontend development server, typically accessible at `http://localhost:5173/`.

**Application Gif:**

![app](https://github.com/user-attachments/assets/72f6d8b6-f866-495b-952f-81d93f79017d)



