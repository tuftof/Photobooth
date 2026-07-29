# System Context: Photobooth App

This document provides a comprehensive overview of the current state of the Photobooth application.

## Overview
Photobooth is a single-page web application that allows users to take a series of 4 pictures using their webcam. It automatically compiles these pictures into a stylized photo strip template, which users can then print or download as a PNG file. 

## Technology Stack
The project is built on a modern, fast frontend stack:
- **Core:** React 19, TypeScript
- **Build Tool / Dev Server:** Vite
- **Styling:** Tailwind CSS (v4)
- **Routing:** `react-router-dom` (v7)

### Key Dependencies
- `react-webcam`: Used to interface with the user's camera and capture screenshots.
- `ts-audio`: Handles playback of sound effects (countdown and shutter clicks).
- `html-to-image` & `html2canvas`: Used for converting the final DOM-based photo strip template into a downloadable image.
- `react-to-print`: Facilitates native browser printing of the final photo strip.
- `react-icons`: Provides UI icons (Camera, Download, Print).

## Directory Structure
The workspace is centered around the `src/` directory.

```
src/
├── App.tsx             # Main application component & Router definition
├── main.tsx            # Entry point for React
├── App.css             # Global styles
├── audio/              # Sound effects (countdown.mp3, captureSound.mp3)
├── images/             # Static assets (cameraLoad.png, template1.png)
└── pages/
    ├── Photobooth.tsx    # Route `/` - The webcam capture interface
    ├── PhotoTemplate.tsx # Route `/download` - The final photo strip result view
    └── LoadingPage.tsx   # Intermediate loading animation screen
```

## Core Functionalities

### 1. Photo Capture (`Photobooth.tsx`)
- Maps to the root route (`/`).
- Initializes the webcam with a specific constraint (`920x620` resolution, user-facing).
- Features a **Countdown Mechanism**: When the user clicks the capture button, a 5-second countdown starts. It plays a beep (`countdown.mp3`) every second.
- At the end of the countdown, it plays a shutter sound (`captureSound.mp3`) and captures the frame from the webcam.
- This process is manual (user initiates each shot).
- Once 4 pictures are taken, the app automatically waits 1 second and then navigates to the `/download` route, passing the array of captured images via React Router's state.

### 2. Loading Screen (`LoadingPage.tsx`)
- Displayed briefly when transitioning or when rendering the final template.
- Features a simple CSS animation (`animate-fadeIn` and `animate-rotateCam`) to show a camera icon while the user waits.
- There is a known bug/issue here: `LoadingPage.tsx` has a `useEffect` that forces a navigation to `/download` after 1 second, but it doesn't have a dependency array, meaning it might run on every render.

### 3. Template Generation & Export (`PhotoTemplate.tsx`)
- Maps to the `/download` route.
- Receives the 4 captured images from the router state.
- **Loading State:** Intentionally waits for 5 seconds showing the `LoadingPage` before revealing the final template.
- **Template Layout:** 
  - Uses `template1.png` as the background.
  - Places the 4 captured images at hardcoded, specific absolute coordinates and rotations using inline CSS `transform` over the background template to create a cohesive layout.
- **Export Options:**
  - **Print:** Triggered via `react-to-print` targeting the template's wrapping DOM node (`contentRef`).
  - **Download:** Uses `html-to-image`'s `toPng` function to render the DOM node as a base64 data URL, creates a dummy `<a>` tag, and triggers a download for `photo.png`.
  - **Retake:** Simple link back to the `/` route to start over.

## Known Issues / Improvement Areas
1. **`LoadingPage.tsx` useEffect**: The `useEffect` in the loading page component is missing a dependency array `[]`. It also unconditionally navigates to `/download`, which might cause an infinite loop or unexpected behavior if it's already rendered on the `/download` route.
2. **Hardcoded CSS Transformations**: In `PhotoTemplate.tsx`, the images are placed using exact `rem` values for translation and rotation. This makes the layout rigid and might break depending on the screen size if the container scales.
3. **Capture Process**: The user has to click the camera button 4 times. A typical photobooth might take 4 pictures automatically back-to-back after a single initiation.
