# Vercel Deployment Guide

Deploying your Next.js application to Vercel is the fastest and most optimized way to get it into production. The application is completely production-ready and utilizes Vercel's zero-config setup for Next.js.

Follow these exact steps to push the Docket platform live.

---

## Step 1: Push to GitHub

Vercel deploys directly from your Git repository. Ensure your latest code is pushed to a remote repository.

```bash
git add .
git commit -m "chore: production ready for vercel"
git push origin main
```

> [!TIP]
> If you haven't created a GitHub repository yet, you can do so at [github.com/new](https://github.com/new) and follow the instructions to push an existing repository from the command line.

---

## Step 2: Import Project to Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click the **"Add New..."** button and select **"Project"**.
3. Locate your newly pushed GitHub repository in the list and click **"Import"**.
4. In the **"Configure Project"** screen, leave the Framework Preset as **Next.js**. Vercel will automatically detect the build commands (`npm run build`).

---

## Step 3: Configure Environment Variables

Before clicking Deploy, you **MUST** configure the production environment variables.

> [!CAUTION]
> If these variables are not set during deployment, the AI features and external APIs will fail to load in production!

Expand the **"Environment Variables"** section and add the following keys (matching your `.env.local` file):

| Key | Value / Description |
|:---|:---|
| `NVIDIA_API_KEY` | Your production NVIDIA NIM API key. |
| `MANUS_API_KEY` | Your Manus API key (if applicable). |
| `USE_MANUS_WATCHER` | `true` |
| `NIM_BASE_URL` | `https://integrate.api.nvidia.com/v1` |
| `NIM_MODEL` | `meta/llama-3.1-70b-instruct` |
| `REDIS_URL` | Since Vercel is serverless, use a managed Redis like [Upstash](https://upstash.com) instead of `localhost:6379`. (e.g., `redis://default:password@us1-server.upstash.io:33456`) |

---

## Step 4: Deploy

1. Once the variables are added, click the **"Deploy"** button.
2. Vercel will now clone your repo, install dependencies, run the optimized production build (`npm run build`), and deploy the app to their global Edge Network.
3. Once complete, you will be given a live production URL (e.g., `slks-compliance.vercel.app`).

> [!SUCCESS]
> **Congratulations!** Your app is now live. Any future pushes to the `main` branch on GitHub will automatically trigger a new deployment.
