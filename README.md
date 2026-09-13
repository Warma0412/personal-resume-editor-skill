# Personal Resume Editor Skill Package

This folder is a portable TRAE workspace package for the `personal-resume-editor` Skill.

## Install

Copy the following directory into the target workspace without changing its relative path:

```text
.trae/skills/personal-resume-editor/
```

Then install the deterministic PDF export dependency:

```bash
cd .trae/skills/personal-resume-editor
npm ci
```

## Included

- Resume intake, rewriting, layout, branding, validation, and PDF export instructions.
- A4 HTML/CSS templates with placeholder-only content.
- PDF/DOCX/text extraction and Chromium PDF export scripts.
- HTML, page-overflow, local-image, and PDF text-layer checks.
- Harvard/Google XYZ/ATS writing guidance.
- Three local fonts and 102 generic company SVG logos.
- Unit tests and a package privacy verifier.

## Excluded

- Real resumes and source documents.
- Generated PDF files and preview images.
- Personal photos, names, contact details, school records, and account handles.
- Per-user change logs and extracted resume text.
- `node_modules/`; restore it with `npm ci`.

Runtime files belong in `output/` and `working/`. Keep those directories empty when sharing this package.

## Verify

```bash
cd .trae/skills/personal-resume-editor
npm run verify:package
npm test
```
