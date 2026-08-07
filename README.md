# SB LAB website

Static, multi-page homepage for SB LAB at DGIST, recreated from the current public `sblee.org` design and content.

## Local preview

Run any static HTTP server in this directory, for example:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## GitHub Pages

All links and assets use repository-relative paths. Push the files to a GitHub repository and enable Pages from the repository root (or deploy with GitHub Actions). The included `.nojekyll` file keeps the static asset structure unchanged.

Main pages: Announcement, Research, Project, Professor, Member, Alumni, Publications, Gallery, and Contact Info.
