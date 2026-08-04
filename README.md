# Visual Drill

Standalone offline-capable Visual Drill app extracted from the NBA Dashboard.

## Local development

```sh
npm install
npm run dev
```

## GitHub Pages

The default build base path is `/visual-drill/`, which matches a repository named `visual-drill`.

For a different GitHub Pages repository name, set `VITE_BASE_PATH` in the workflow build step:

```sh
VITE_BASE_PATH=/your-repo-name/ npm run build
```

## Offline use on iOS

Open the deployed app once while online, then use Safari Share > Add to Home Screen. After the first online load, the app shell, generated JS/CSS assets, and icons are cached for offline use.

Local browser favorites work offline. Supabase account favorites and Supabase image upload require an authenticated app and network access.
