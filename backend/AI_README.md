AI Chat Backend

This backend exposes a simple AI chat endpoint:

- POST /api/ai/chat
  - Body: { message: '...', messages: [{role, content}, ...] }
  - Requires environment: OPENAI_API_KEY
  - Rate-limited (in-memory): default 30 reqs/hour per IP

Development
- Add `OPENAI_API_KEY` to `backend/.env` when testing with the real provider.

Notes
- The implementation uses Node's fetch to call the OpenAI Chat Completions API (gpt-3.5-turbo) and returns { success: true, reply }.
- For production, replace the in-memory rate limiter with a persistent one (Redis) and add authentication.

Storage (Cloudinary)

- A new upload endpoint is available at `POST /api/storage/upload`. It accepts multipart/form-data with a `file` field and optional `folder` field.
- If `CLOUDINARY_URL` or the individual Cloudinary env vars (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) are set, uploads are proxied to Cloudinary and a JSON response with `url` and `public_id` is returned.
- If Cloudinary is not configured, uploads fall back to a local `backend/uploads` folder and the response includes a local `url` (served at `/uploads/<filename>`).
- To enable Cloudinary uploads, add values to `backend/.env` or environment: `CLOUDINARY_URL` or `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
