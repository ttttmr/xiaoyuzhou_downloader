# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js podcast downloader application called "小宇宙播客下载器" (Xiaoyuzhou Podcast Downloader). It's a Chinese-language web application that allows users to download episodes from the Xiaoyuzhou podcast platform by pasting episode URLs.

## Common Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

## Architecture and Structure

### Tech Stack
- **Framework**: Next.js 15.4.5 with App Router
- **Frontend**: React 19.1.0 with TypeScript
- **Styling**: Tailwind CSS v4 with gradient UI design
- **Server**: API routes for backend functionality
- **Parsing**: Cheerio for HTML scraping

### Core Components

#### Frontend (`src/app/`)
- **`page.tsx`** - Main landing page with URL input form and Chinese UI
  - Handles URL parsing for Xiaoyuzhou episode URLs
  - Extracts episode ID from URLs matching pattern `/episode/{24-character-id}`
  - Validates and redirects to episode download page
  - Features responsive design with loading states and error handling

- **`layout.tsx`** - Root layout with Geist font integration

#### Backend API (`src/app/episode/[id]/route.ts`)
- **GET endpoint** - Handles podcast episode downloading
- **Process Flow**:
  1. Fetches episode page from Xiaoyuzhou FM
  2. Parses HTML using Cheerio to extract JSON-LD schema data
  3. Extracts podcast name, episode title, and audio URL from schema
  4. Generates filename in format: `{podcastName}_{title}.{extension}`
  5. Streams audio file with proper headers for Chinese character support
  6. Handles user-agent and referer headers for bypassing restrictions

### Key Features
- URL pattern matching for Xiaoyuzhou episode links
- JSON-LD schema extraction from HTML metadata
- Audio file streaming with proper content disposition headers
- Chinese character filename encoding (RFC 5987)
- Error handling for various failure scenarios

### Dependencies
- `cheerio` - HTML parsing and scraping
- `next` - Framework and API routes
- `react`, `react-dom` - Frontend components
- `@types/*` - TypeScript definitions
- `tailwindcss` - Styling framework
- `eslint` with Next.js configuration

### Configuration
- TypeScript path mapping: `@/*` → `./src/*`
- ESLint extends Next.js core web vital and TypeScript rules
- Next.js configuration is minimal (basic setup)

### Notes for Development
- The application specifically targets Xiaoyuzhou FM podcast platform
- File naming convention is fixed as `{podcastName}_{title}.{extension}`
- Audio streaming includes proper headers for Chinese filenames
- The app uses client-side URL parsing before server-side processing
- Error messages are in Chinese to match the target audience