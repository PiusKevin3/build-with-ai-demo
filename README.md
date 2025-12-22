# Gemini + Cloud Run — Starter

A beginner-friendly AI Web App using **Google Gemini API** with Node.js, ready to deploy locally or on **Google Cloud Run**.

**This is the link to the presentation slides:**
https://docs.google.com/presentation/d/1IDOpgo2d_PK3TDihHhens0VMVFzNtFSqcTJRmBfpxNs/edit?usp=sharing

---

## Quick start (local)

1. Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
# edit .env to add your GEMINI_API_KEY

Install dependencies:

cd server
npm install


Run locally:

npm run start


Open http://localhost:8080
 in your browser.

Docker (optional)

Build the Docker image:

docker build -t gemini-workshop .


Run the container:

docker run -p 8080:8080 --env-file ../.env gemini-workshop


Open http://localhost:8080
 to access the app.

Cloud Run Deployment

Deploy your app to Google Cloud Run in just a few steps:

Authenticate with gcloud:

gcloud auth login
gcloud config set project YOUR_PROJECT_ID


Build and push container to Google Container Registry:

docker build -t gcr.io/YOUR_PROJECT_ID/gemini-workshop .
docker push gcr.io/YOUR_PROJECT_ID/gemini-workshop


Deploy to Cloud Run:

gcloud run deploy gemini-workshop \
  --image gcr.io/YOUR_PROJECT_ID/gemini-workshop \
  --platform managed \
  --region YOUR_REGION \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=YOUR_GEMINI_API_KEY


Access your app:

After deployment, gcloud will output the service URL. Open it in your browser to see your AI Web App live.

Project Structure
gemini-cloudrun-starter/
├── server/                  # Node.js backend
│   ├── geminiClient.js      # Gemini API wrapper
│   ├── index.js             # Express server
│   └── package.json
├── public/                  # Static frontend files
│   └── index.html           # Chat UI
├── Dockerfile
├── .env.example             # Sample environment variables
└── README.md

Notes for Workshop

Use npm run start for local testing

Use Docker or Cloud Run for deployment

License

MIT