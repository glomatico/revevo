# Revevo

A music video streaming website that revives the old Vevo experience using their still active APIs.

Although the official Vevo website shut down years ago, many parts of its backend remain online. Revevo bridges the gap by using those APIs to revive the classic Vevo experience, offering a vast library of high-quality music videos enriched with detailed metadata.

## Features

- Home page sections powered by Vevo's TV GraphQL API.
- Search for videos, artists, and playlists.
- Artist and playlist pages with infinite scrolling.
- Video playback with HLS/MP4 fallback, captions, and continuous play queues.
- Download support with metadata and captions packaged into MKV files.
- Settings for playback method, captions, explicit filtering, and autoplay.

## Tech Stack

- [Vue](https://vuejs.org/) - Application framework.
- [Vite](https://vite.dev/) - Development server and build tooling.
- [Vue Router](https://router.vuejs.org/) - Client-side routing.
- [Vue I18n](https://vue-i18n.intlify.dev/) - Localized interface text.
- [Vuetify](https://vuetifyjs.com/) - UI components and layout.
- [Vidstack Player](https://vidstack.io/) - Video playback.
- [Mediabunny](https://mediabunny.dev/) - Video download/remux support.

## Project Structure

- `src/pages` - Route-level views.
- `src/layouts` - Shared page shells.
- `src/components` - Reusable UI components.
- `src/composables` - Feature state, API loading, player, queue, settings, and title logic.
- `src/lib` - Vevo and Vevo TV API clients and GraphQL queries.
- `src/locales` - Translation messages.

## Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/glomatico/revevo
   ```
2. Navigate to the project directory:
   ```bash
   cd revevo
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` - Start the Vite development server.
- `npm run type-check` - Run Vue/TypeScript type checking.
- `npm run build-only` - Build the app with Vite.
- `npm run build` - Run type checking and production build.
- `npm run preview` - Preview the production build locally.

## Online Deployment

The website is deployed at <https://revevo.glomatico.me>.
