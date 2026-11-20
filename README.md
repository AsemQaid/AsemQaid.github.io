# Asem Ameen Qaid — Portfolio

Live site: **https://asemqaid.github.io** (English) · **https://asemqaid.github.io/ar/** (Arabic)

This site is built with [Astro](https://astro.build). Every change you save to the `main` branch on GitHub rebuilds and publishes the site automatically within about two minutes. You can follow each update in the **Actions** tab of this repository: a green tick means it is live.

You never need to touch the design. Almost everything you will change lives in four places:

| What | Where |
|---|---|
| Projects | `src/content/projects/en/` and `src/content/projects/ar/` — one Markdown file each |
| Reports, code and other downloads | `public/reports/`, `public/code/` |
| Photos, screenshots and diagrams | `public/img/`, `public/diagrams/` |
| Homepage logbook | `src/data/logbook.ts` |
| Publications | `src/data/publications.ts` |
| Honours and certificates | `src/data/honours.ts` and `public/certificates/` |
| Skills (used / learning now) | `src/data/skills.ts` |
| CV PDF | `public/cv/Asem-Ameen-Qaid_CV.pdf` |

---

## Add a new project

1. **Prepare the files.** Export images as `.webp` or `.jpg` (about 1600 px wide is plenty). Name the report `AAQ-P08_Short-Name_Project-Report.pdf`.
2. **Upload them on GitHub.** Open `public/img/`, choose **Add file → Upload files**, drop the images and click **Commit changes**. Do the same for the report in `public/reports/`.
3. **Create the project page.** Open `templates/new-project.md`, copy everything, then go to `src/content/projects/en/`, choose **Add file → Create new file**, name it after the project (for example `solar-mppt.md`) and paste.
4. **Fill in the fields** at the top (title, number, order, status, summary…). `order` ranks projects by strength (1 is shown first on the Work page, homepage and CV); `number` is a permanent ID. Then write the sections below. Keep `draft: true` while you are writing.
5. **Publish.** Change `draft: true` to `draft: false` and commit. The project appears on the Work page and gets its own page at `/work/solar-mppt/`.
6. **Arabic (optional).** Copy the English file into `src/content/projects/ar/` with the **same file name** and translate the text. If there is no Arabic file, the Arabic site shows the English version with a short note.
7. **Logbook (optional).** Add one line at the top of `src/data/logbook.ts`.

### Choosing the status

| Status | Use it when |
|---|---|
| `designed` | Only drawings, schematics or code exist |
| `simulated` | It runs in software or simulation (Proteus, simulated data) |
| `prototyped` | It is physically built and works |
| `tested` | Structured tests were run and the results recorded |
| `deployed` | It is live and anyone can use it |

If hardware and software are at different levels, use `status` for the software and `hardwareStatus` for the hardware.

To show a project on the homepage, set `featured: true`. Keep it to three featured projects.

## Add a publication

Open `src/data/publications.ts`, copy the example block, remove the `//` marks and fill it in. Put the PDF in `public/papers/` if you are allowed to share it. The Research page updates automatically.

## Replace a report, video link or the CV

- **Report or CV:** upload the new PDF with **exactly the same file name** to the same folder. GitHub replaces the old one, and every link keeps working.
- **Video or external link:** edit the `resources` list at the top of the project file and add an entry such as:

  ```yaml
  - type: VID
    label: Demo video
    host: YouTube
    url: https://youtu.be/...
  ```

## Add a certificate or achievement

1. Export the certificate as `.webp` (about 1600 px wide) and upload it to `public/certificates/`, for example `angel-2026.webp`.
2. Open `src/data/honours.ts` and add a line at the top of the list (copy one of the examples). Set `image: "/certificates/angel-2026.webp"`. A **View certificate** button appears on the Leadership page automatically.
3. If it belongs on the CV too, add it to `honours` in `src/data/cv.json` and upload the updated CV PDF.

## Update skills

Open `src/data/skills.ts`. **USED** lists skills with the project numbers that prove them (they become links). **LEARNING** lists what you are studying now. When a project proves a "learning" skill, move it to USED and add the project number.

## Hover picture on project cards (optional)

Each project can have a second picture that wipes in when someone hovers its card: add to the top of the project file

```yaml
reveal:
  src: /diagrams/my-project-arch.svg
  kind: schematic        # schematic | hardware
```

## Homepage measurement badge

The reading on the portrait (RMSE 0.161 m/s, AAQ-P03) is in `src/views/Home.astro`; search for `data-dmm`. Change the value, label and link there if a stronger result comes along.

## Preview on your own computer (optional)

You do not need this to update the site. If you want to see changes before publishing:

```bash
npm install
npm run dev
```

Then open http://localhost:4321.

## Custom domain (optional)

Buy a domain (for example `asemqaid.com`), then in this repository go to **Settings → Pages → Custom domain**, enter it, and follow GitHub's instructions for the DNS records.
