# Deploy

Production URL:

https://baditaflorin.github.io/witness-attestation/

Repository:

https://github.com/baditaflorin/witness-attestation

## Publishing

GitHub Pages is configured to serve `main:/docs`.

To publish manually:

```sh
npm install
npm run build
git add docs package-lock.json package.json src scripts public index.html vite.config.ts
git commit -m "chore: publish pages build"
git push origin main
```

## Rollback

Revert the publishing commit and push:

```sh
git revert <commit>
git push origin main
```

## Custom Domain

No custom domain is configured. To add one, create `docs/CNAME`, configure DNS with the domain registrar, then enable the custom domain in repository Pages settings.

GitHub Pages custom domain docs:

https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
