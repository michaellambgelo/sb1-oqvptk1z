# sb1-oqvptk1z

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/michaellambgelo/sb1-oqvptk1z)

## Project Overview
A modern web application starter template using Vite, React, and TypeScript. This project provides a robust, performant, and type-safe foundation for building web applications.

## Features
- ⚡ Vite for lightning-fast development and build
- 🔷 TypeScript for type safety
- ⚛️ React for component-based UI
- 🎨 Tailwind CSS for styling
- 🧰 ESLint for code quality

## Prerequisites
- Node.js (v18 or later)
- npm (v9 or later)

## Development

```bash
npm install
npm run dev
```

## Environment Setup

1. Copy `.env.example` to `.env`
2. Register a new application at [Twitch Developer Console](https://dev.twitch.tv/console)
   - Set OAuth Redirect URL to: `http://localhost:5173`
3. Get your credentials:
   - Client ID from your Twitch application
   - Access Token by visiting:
     ```
     https://id.twitch.tv/oauth2/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:5173&response_type=token&scope=channel:read:subscriptions+moderator:read:followers+chat:read
     ```
4. Update `.env` with your:
   - Twitch channel name
   - Client ID
   - Access Token

**Important**: Never commit the `.env` file to version control!

## Environment Variables

This project requires several environment variables to function properly. Create a `.env` file in the root directory with the following variables:

```bash
VITE_TWITCH_CHANNEL=your_channel_name
VITE_TWITCH_CLIENT_ID=your_client_id
VITE_TWITCH_ACCESS_TOKEN=your_access_token
```

For deployment:
1. Never commit the `.env` file
2. Add these variables as repository secrets in GitHub:
   - Go to Repository Settings → Secrets and Variables → Actions
   - Add each variable as a new secret
   - The GitHub Actions workflow will automatically use these secrets during deployment

## License
This project is licensed under the [MIT License](LICENSE).

## Acknowledgments
- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ESLint](https://eslint.org/)

## Author
[Michael Lamb](https://github.com/michaellambgelo)
