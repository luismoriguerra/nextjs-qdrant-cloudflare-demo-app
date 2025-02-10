# NextJS Qdrant Notes App

A modern note-taking application built with Next.js that leverages Qdrant vector database for semantic search capabilities. The application allows users to create notebooks, add notes, and perform semantic searches across their notes using vector embeddings.

## Features

- 📚 Notebook Management: Create, read, update, and delete notebooks
- 📝 Note Taking: Create and manage notes within notebooks
- 🔍 Semantic Search: Search through notes using natural language queries
- 🧠 Vector Embeddings: Automatically generates embeddings for note content
- 🚀 Modern UI: Built with Tailwind CSS and shadcn/ui components
- ☁️ Cloudflare Integration: Deployable to Cloudflare Pages with D1 database

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes (Edge Runtime)
- **Database**: Cloudflare D1 (SQLite)
- **Vector Database**: Qdrant
- **UI Components**: shadcn/ui
- **Deployment**: Cloudflare Pages

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Cloudflare account (for deployment)
- Qdrant instance (local or cloud)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Qdrant Configuration
QDRANT_API_KEY=your_api_key
QDRANT_URL=your_qdrant_url

# Other configurations as needed
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nextjs-qdrant
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
├── server/                 # Backend server code
│   ├── infrastructure/     # Database and external service connections
│   └── services/          # Business logic services
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── api/          # API routes
│   │   └── notebooks/    # Frontend pages
│   ├── components/        # React components
│   └── lib/              # Utility functions
├── migrations/            # Database migrations
└── public/               # Static assets
```

## API Endpoints

- `GET /api/notebooks` - List all notebooks
- `POST /api/notebooks` - Create a new notebook
- `GET /api/notebooks/:id` - Get a specific notebook
- `DELETE /api/notebooks/:id` - Delete a notebook
- `GET /api/notebooks/:id/notes` - List notes in a notebook
- `POST /api/notebooks/:id/notes` - Create a new note
- `GET /api/vectors/search` - Perform semantic search
- `GET /api/vectors/collections` - List vector collections

## Development

The project uses several development tools and scripts:

```bash
# Development
npm run dev          # Start development server

# Linting
npm run lint         # Run ESLint

# Cloudflare Pages
npm run pages:build  # Build for Cloudflare Pages
npm run preview      # Preview Pages deployment locally
npm run deploy       # Deploy to Cloudflare Pages
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Cloudflare integration

Besides the `dev` script mentioned above `c3` has added a few extra scripts that allow you to integrate the application with the [Cloudflare Pages](https://pages.cloudflare.com/) environment, these are:
  - `pages:build` to build the application for Pages using the [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages) CLI
  - `preview` to locally preview your Pages application using the [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI
  - `deploy` to deploy your Pages application using the [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI

> __Note:__ while the `dev` script is optimal for local development you should preview your Pages application as well (periodically or before deployments) in order to make sure that it can properly work in the Pages environment (for more details see the [`@cloudflare/next-on-pages` recommended workflow](https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md#recommended-development-workflow))

### Bindings

Cloudflare [Bindings](https://developers.cloudflare.com/pages/functions/bindings/) are what allows you to interact with resources available in the Cloudflare Platform.

You can use bindings during development, when previewing locally your application and of course in the deployed application:

- To use bindings in dev mode you need to define them in the `next.config.js` file under `setupDevBindings`, this mode uses the `next-dev` `@cloudflare/next-on-pages` submodule. For more details see its [documentation](https://github.com/cloudflare/next-on-pages/blob/05b6256/internal-packages/next-dev/README.md).

- To use bindings in the preview mode you need to add them to the `pages:preview` script accordingly to the `wrangler pages dev` command. For more details see its [documentation](https://developers.cloudflare.com/workers/wrangler/commands/#dev-1) or the [Pages Bindings documentation](https://developers.cloudflare.com/pages/functions/bindings/).

- To use bindings in the deployed application you will need to configure them in the Cloudflare [dashboard](https://dash.cloudflare.com/). For more details see the  [Pages Bindings documentation](https://developers.cloudflare.com/pages/functions/bindings/).

#### KV Example

`c3` has added for you an example showing how you can use a KV binding.

In order to enable the example:
- Search for javascript/typescript lines containing the following comment:
  ```ts
  // KV Example:
  ```
  and uncomment the commented lines below it (also uncomment the relevant imports).
- In the `wrangler.json` file add the following configuration line:
  ```
  "kv_namespaces": [{ "binding": "MY_KV_NAMESPACE", "id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }],
  ```
- If you're using TypeScript run the `cf-typegen` script to update the `env.d.ts` file:
  ```bash
  npm run cf-typegen
  # or
  yarn cf-typegen
  # or
  pnpm cf-typegen
  # or
  bun cf-typegen
  ```

After doing this you can run the `dev` or `preview` script and visit the `/api/hello` route to see the example in action.

Finally, if you also want to see the example work in the deployed application make sure to add a `MY_KV_NAMESPACE` binding to your Pages application in its [dashboard kv bindings settings section](https://dash.cloudflare.com/?to=/:account/pages/view/:pages-project/settings/functions#kv_namespace_bindings_section). After having configured it make sure to re-deploy your application.
