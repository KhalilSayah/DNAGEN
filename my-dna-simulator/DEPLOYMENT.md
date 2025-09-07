# DNA Simulator - Vercel Deployment Guide

This guide will help you deploy the DNA Simulator application to Vercel.

## Prerequisites

- Node.js 18+ installed
- Vercel account (free tier available)
- Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Prepare Your Repository

Ensure your code is pushed to a Git repository:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from project root:
```bash
vercel
```

4. Follow the prompts and your app will be deployed!

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect it's a Vite project
5. Click "Deploy"

### 3. Environment Variables

Set up environment variables in Vercel:

1. Go to your project dashboard on Vercel
2. Navigate to Settings → Environment Variables
3. Add the following variable:
   - **Name**: `VITE_CORRECT_DNA_SEQUENCE`
   - **Value**: `ATGCGTACGTTAG` (or your preferred DNA sequence)
   - **Environment**: Production, Preview, Development

### 4. Custom Domain (Optional)

To use a custom domain:

1. Go to Settings → Domains in your Vercel project
2. Add your domain
3. Follow the DNS configuration instructions

## Project Configuration

The project includes:

- ✅ `vercel.json` - Vercel configuration for SPA routing
- ✅ `.env.example` - Environment variables template
- ✅ Build optimization - TypeScript errors resolved
- ✅ Production build tested locally

## Build Configuration

- **Framework**: Vite + React + TypeScript
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x (recommended)

## Features

- 🧬 Interactive 3D DNA visualization
- 📁 Drag & drop file upload
- 🔍 DNA sequence verification
- 🚨 Emergency mode scenarios
- 📱 Responsive design
- ⚡ Fast Vite build system

## Troubleshooting

### Build Fails
- Check TypeScript errors: `npm run build`
- Ensure all dependencies are installed: `npm install`

### Environment Variables Not Working
- Verify variable names start with `VITE_`
- Check Vercel dashboard environment variables
- Redeploy after adding variables

### 404 Errors on Refresh
- The `vercel.json` file handles SPA routing
- Ensure the file is in your repository root

## Support

For deployment issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Review build logs in Vercel dashboard
- Ensure all files are committed to Git

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Your DNA Simulator is now ready for deployment! 🚀