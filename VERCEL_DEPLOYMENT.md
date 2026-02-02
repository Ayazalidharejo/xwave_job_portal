# Vercel par deploy (Frontend + Backend)

Yeh project Vercel par **ek hi project** mein frontend (Vite/React) aur backend (Express) dono deploy karta hai.

---

## 1. Vercel par project connect karo

1. [vercel.com](https://vercel.com) par login karo.
2. **Add New** → **Project**.
3. GitHub/GitLab/Bitbucket se repo connect karo (ya ZIP upload).
4. **Root Directory** empty rakho (project root hi use hoga).

---

## 2. Build settings (auto-detect)

Vercel ko **Vite** detect ho jana chahiye:

- **Framework Preset:** Vite  
- **Build Command:** `npm run build`  
- **Output Directory:** `dist`  
- **Install Command:** `npm install` (default)

Agar preset nahi mila to `vercel.json` already set hai, woh use hoga.

---

## 3. Environment Variables (zaroori)

Vercel Dashboard → Project → **Settings** → **Environment Variables** mein yeh add karo. **Production**, **Preview**, **Development** sab ke liye set karo (ya kam se kam Production).

### Backend (API ke liye)

| Name | Value | Note |
|------|--------|------|
| `MONGODB_URI` | `mongodb+srv://...` ya Direct connection | MongoDB Atlas connection string |
| `JWT_SECRET` | koi strong random string | JWT sign ke liye |
| `JWT_EXPIRES_IN` | `7d` | Optional |
| `FRONTEND_URL` | `https://your-app.vercel.app` | CORS – apna Vercel app URL (deploy ke baad update kar sakte ho) |
| `CLOUDINARY_CLOUD_NAME` | your_cloud_name | Portfolio/Resume upload ke liye (optional) |
| `CLOUDINARY_API_KEY` | your_api_key | Optional |
| `CLOUDINARY_API_SECRET` | your_api_secret | Optional |

### Frontend (build time – Vite inhe bundle karta hai)

| Name | Value | Note |
|------|--------|------|
| `VITE_GOOGLE_AI_API_KEY` | Gemini API key | AI chat ke liye (optional agar AI use nahi karna) |

**Note:**  
- `VITE_*` sirf **build time** par use hota hai; production mein API same origin par `/api` use karti hai, isliye alag se `VITE_API_URL` set karne ki zaroorat nahi (agar custom domain pe API nahi chal rahi).

---

## 4. Deploy

1. **Deploy** button dabao.
2. Deploy complete hone ke baad URL milega, jaise: `https://marge-xxx.vercel.app`.
3. **FRONTEND_URL** ko isi URL se update karo (agar pehle kuch aur dala tha):  
   `FRONTEND_URL=https://marge-xxx.vercel.app`  
   Phir **Redeploy** karo taake backend CORS sahi ho.

---

## 5. API URLs

- **Frontend:** `https://your-app.vercel.app`  
- **API (same project):** `https://your-app.vercel.app/api`  
  - Health: `https://your-app.vercel.app/api/health`  
  - Login: `https://your-app.vercel.app/api/auth/login`  
  - Baaki routes bhi `/api/...` ke under hain.

Production build mein frontend automatically `baseURL = '/api'` use karti hai, isliye same domain pe sab kaam karega.

---

## 6. Local development

- **Frontend:** `npm run dev` (root par).
- **Backend:** `cd backend && npm run dev` (Express port 5000).
- Vercel par test: `vercel dev` (CLI install: `npm i -g vercel`) – isse local par bhi `/api` routes chalenge.

---

## 7. Agar kuch na chaley

- **API 404:** Check karo `api/[[...slug]].js` repo mein hai aur deploy ho raha hai.
- **CORS error:** `FRONTEND_URL` exact wahi URL ho jo browser mein open hai (trailing slash ke bina).
- **MongoDB connect nahi ho raha:** `MONGODB_URI` sahi hai, aur Atlas mein IP Allow List mein `0.0.0.0/0` (ya Vercel IPs) allow ho.
- **Login/register fail:** Backend env vars (JWT_SECRET, MONGODB_URI) check karo; browser console / Network tab mein exact error dekho.

---

## Summary

- **Frontend:** Vite build → `dist` → Vercel static + SPA rewrite.  
- **Backend:** Express app → `api/[[...slug]].js` → sab `/api/*` requests isi se handle.  
- **Env:** Backend ke liye Vercel env vars set karo; frontend ke liye sirf `VITE_GOOGLE_AI_API_KEY` (agar AI use karna hai).

Is setup ke saath Vercel par frontend + backend dono ek hi project mein live ho jayenge.
