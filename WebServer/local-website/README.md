# Local Website Project

This project is a simple local website that includes a homepage and a dashboard. It is structured to provide a clear separation of components, styles, and scripts.

## Project Structure

```
local-website
├── src
│   ├── index.html          # Main entry point of the website
│   ├── dashboard.html      # Dashboard page layout
│   ├── components          # Reusable components
│   │   ├── header.html     # Header component
│   │   └── sidebar.html    # Sidebar component
│   ├── styles              # CSS styles
│   │   └── main.css        # Main stylesheet
│   └── scripts             # JavaScript files
│       └── main.js         # Main script for interactivity
├── package.json            # npm configuration file
├── .gitignore              # Files to ignore in version control
└── README.md               # Project documentation
```

## Features

- **Homepage**: The main entry point that links to the dashboard and other components.
- **Dashboard**: A dedicated page for displaying user-specific data and analytics.
- **Reusable Components**: Includes a header and sidebar for consistent navigation across pages.
- **Styling**: Custom CSS for a cohesive look and feel.
- **Interactivity**: JavaScript to enhance user experience with dynamic content.

## Setup Instructions

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using npm:
   ```
   npm install
   ```
4. Open `src/index.html` in your web browser to view the homepage.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.

...existing code...

## Progress / What we did so far

- Ensured the project can be served locally with `live-server` (npm script `start`).
  - If Node/npm are not installed, install Node.js (LTS) first.
  - If PowerShell blocks npm scripts, use CMD or set PowerShell execution policy for the current user.
  - Start locally:
    ```
    npm install
    npm start
    ```
  - Alternative quick server (if Python is available):
    ```
    cd src
    python -m http.server 8080
    ```

- Fixed serving issues:
  - Confirmed the correct `src` folder and ensured an `index.html` exists (added a minimal redirect index if needed).

- Local hostname for development
  - For a single laptop: add an entry to the hosts file to use `toolhousebit.local`:
    ```
    127.0.0.1    toolhousebit.local
    ```
  - For multiple devices on the LAN:
    - Option A: run a local DNS resolver (dnsmasq/Acrylic/Pi-hole) on a machine and point clients' DNS to it.
    - Option B: edit each device's hosts file.
    - Option C: (advanced) enable and edit dnsmasq on the router (requires SSH/telnet and model support).

- Deployment choice
  - Selected Vercel for free, reliable, zero-maintenance hosting with auto-deploys from Git.
  - Basic deploy workflow:
    1. Push project to a GitHub repository.
    2. Import repo into Vercel and deploy (Vercel auto-deploys on push).
    3. Add a custom domain in Vercel and follow the provided DNS instructions (Vercel issues HTTPS automatically).
  - Benefits: CDN, automatic TLS, automatic builds on push, minimal maintenance and better security than hosting from a laptop.

- Security & maintenance notes
  - Avoid exposing your personal laptop directly to the internet for 24/7 hosting.
  - Enable 2FA on GitHub and Vercel accounts.
  - Keep dependencies updated and limit secrets in the repo (use environment variables in Vercel).

## Next steps (pick one)

- I can generate the repo push commands and a step-by-step Vercel import guide for your project folder.
- I can add a simple redirect index.html if missing.
- I can add local development notes or scripts (build, preview) to package.json.
