cd "$(dirname "$0")/.." && npx esbuild agri-check/check.ts --bundle --platform=node --format=esm --outfile=agri-check/out.mjs --log-level=error && node agri-check/out.mjs "$@"
