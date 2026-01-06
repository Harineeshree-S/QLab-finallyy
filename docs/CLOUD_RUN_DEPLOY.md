# Deploying to Google Cloud Run (Backend) and Firebase Hosting (Frontend)

This guide walks through deploying the backend to Cloud Run and the frontend to Firebase Hosting.

Prerequisites
- Google Cloud SDK (`gcloud`) installed and authenticated: `gcloud auth login`
- Firebase CLI: `npm install -g firebase-tools` and `firebase login`
- Billing enabled on your GCP project (required for Cloud Run)

Steps (create or pick a project)
1. Create or pick a GCP project:
   - Create: `gcloud projects create <PROJECT_ID> --name="QLab Project"`
   - Or pick existing: `gcloud config set project <PROJECT_ID>`

2. Enable APIs:
   - `gcloud services enable run.googleapis.com cloudbuild.googleapis.com containerregistry.googleapis.com firebase.googleapis.com`

3. Build and deploy backend to Cloud Run (from repo root):
   - Build and push image:
     `gcloud builds submit --tag gcr.io/<PROJECT_ID>/qlab-backend backend/`
   - Deploy to Cloud Run:
     `gcloud run deploy qlab-backend --image gcr.io/<PROJECT_ID>/qlab-backend --platform managed --region us-central1 --allow-unauthenticated`

4. Set environment variables for the service (example for Cloudinary):
   - `gcloud run services update qlab-backend --update-env-vars CLOUDINARY_URL="<your_cloudinary_url>" --region us-central1`

5. Deploy frontend to Firebase Hosting:
   - Build the frontend: `cd frontend && npm run build`
   - Initialize hosting (if not done): `firebase init hosting` (choose or create project)
   - Deploy: `firebase deploy --only hosting`

6. Use Firebase Hosting rewrites to proxy `/api/**` to your Cloud Run service. `firebase.json` contains an example rewrite that routes `/api/**` to `qlab-backend` in `us-central1`.

Notes & tips
- Replace placeholder project IDs and service names in `cloudbuild.yaml` and `firebase.json` before deploying.
- For CI/CD, use `cloudbuild.yaml` to automatically build & deploy the Cloud Run service when pushing to `main`.
- Keep secret keys out of source control; set them using `gcloud run services update --update-env-vars` or Secret Manager.
