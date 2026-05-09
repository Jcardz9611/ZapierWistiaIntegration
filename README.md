# Wistia Zapier CLI Integration

This project implements a Zapier CLI integration for `Wistia` with:

- `custom` authentication using a Wistia API token
- one polling trigger: `New Media`
- one create action: `Create Folder`

The integration was validated locally with `zapier validate`, pushed successfully to Zapier, and tested successfully in the Zapier workflow editor against a real Wistia account.

## High-Level API Description

Wistia is a video hosting and media management platform. Its Data API exposes account metadata, media records, folders, and related resources over HTTPS with Bearer token authentication.

This integration supports two practical use cases:

1. Trigger a Zap when new media appears in a Wistia account.
2. Create a new Wistia folder from Zapier.

## Supported Functionality

### Authentication

The integration uses a Wistia API token entered by the user in Zapier.

- Auth test endpoint: `GET https://api.wistia.com/modern/account`
- Headers:
  - `Authorization: Bearer <token>`
  - `X-Wistia-API-Version: 2026-03`

### Trigger: New Media

The trigger polls Wistia's media list endpoint:

- `GET /modern/medias`

Supported optional inputs:

- `folder_hashed_id`: filter media to a single Wistia folder
- `media_type`: filter by media type

Implementation note: this is a polling trigger rather than a webhook trigger because it is simpler to deliver and verify inside the exercise timebox while still fulfilling the Zapier trigger requirement.

### Action: Create Folder

The action creates a Wistia folder with:

- `POST /modern/folders`

Supported inputs:

- `name` (required)
- `admin_email` (optional)
- `public` (optional boolean)

Implementation note: older Wistia docs and product language may refer to "projects." In the modern Wistia API, projects have been renamed to folders, so this integration uses the current API terminology and endpoint.

## Project Structure

- `index.js`: compatibility re-export for Zapier tooling
- `src/index.js`: Zapier app definition
- `src/authentication.js`: auth fields, connection label, and auth test
- `src/api.js`: shared request helpers and error handling
- `src/triggers/new_media.js`: polling trigger
- `src/actions/create_folder.js`: create action
- `src/samples/`: sample output objects for Zapier schema/UI

## Tradeoffs

1. I used Node.js instead of TypeScript to keep setup lighter and focus more time on the actual integration behavior.
2. I implemented a polling trigger instead of a webhook trigger because it is faster to deliver, easier to validate locally, and sufficient for the requirements.
3. I used the Wistia modern API (`/modern/...`) and current "folder" terminology instead of older v1/project examples, which makes the solution more future-facing but may differ from older tutorials.
4. I pinned the Zapier packages to `17.9.1` rather than the newest `18.x` line because this workspace is running Node 20 and local validation with `18.x` expects Node 22. This choice keeps `zapier validate` working in the current environment.

## Assumptions

1. The evaluator will provide a valid Wistia API token when testing the integration.
2. The token used for the trigger has read access to media, and the token used for the create action has permission to create folders.
3. Wistia account state affects trigger testing. If the account has no media, the `New Media` trigger will not return records until at least one media item exists.
4. The warning about `cleanInputData` shown by `zapier validate` is not actionable in the `17.x` schema line used here; that recommendation applies to newer schema/runtime versions.

## AI Tooling Used

I used AI-assisted tooling during implementation.

### Tools used

- Cursor agent
- Cursor web search/fetch tools

### How the tools were applied

- to check current Wistia API docs for authentication, media listing, and folder creation
- to confirm current Zapier CLI expectations around authentication testing and validation
- to help translate the exercise requirements into a minimal but valid integration structure

### Example prompts used

- `Wistia API authentication bearer token projects create media list endpoint 2026`
- `Zapier CLI integration authentication test request trigger action example 2026`
- `site:docs.wistia.com create folder wistia api modern endpoint post folders 2026`

## Local Validation Status

I successfully ran:

```bash
npm run validate
```

Result:

- local schema validation passed
- integration checks passed with warnings only
- no blocking errors remained

Current warnings are non-blocking and mostly related to:

- Zapier suggesting a dynamic dropdown for `folder_hashed_id`
- Zapier suggesting newer `cleanInputData` config that is not supported in the pinned `17.x` schema line
- Zapier suggesting upgrade to `18.x`, which would require Node 22 locally

## End-to-End Testing Status

The integration was also tested successfully in Zapier's workflow editor with a real Wistia account:

- authentication succeeded using a Wistia API token
- the `New Media` trigger returned a real media record
- the `Create Folder` action created a real folder in Wistia
- the app was pushed successfully to Zapier

Zapier app URL:

- `https://developer.zapier.com/app/241521`

Note: the Zapier app is private and was used to validate the integration during development. The primary delivery artifact for review is the public GitHub repository for this project.

## How To Run

Install dependencies:

```bash
npm install
```

Validate locally:

```bash
npm run validate
```

Optionally test auth locally:

```bash
npx zapier invoke auth test
```

Optionally test the trigger locally:

```bash
npx zapier invoke trigger new_media
```

Optionally test the create action locally:

```bash
npx zapier invoke create create_folder --inputData "{\"name\":\"Zapier Test Folder\"}"
```

## Submission Notes

The project is ready to submit as a public GitHub repository. During development and verification, the following Zapier CLI commands were used:

1. Log in to Zapier CLI:

```bash
zapier login
```

2. Push the integration:

```bash
zapier push
```

3. In the Zapier workflow editor, the integration was tested by:
   - adding the integration
   - connecting a Wistia account with a valid API token
   - testing authentication
   - testing the `New Media` trigger
   - testing the `Create Folder` action

4. For submission, the recommended artifact is the public GitHub repository URL. The private Zapier app URL can be included as supporting context, but it is not the primary review artifact.

## Notes For Reviewers

- The app is intentionally scoped to one trigger and one action to satisfy the exercise cleanly.
- If you want to reduce the `folder_hashed_id` warning later, the next improvement would be adding a dynamic dropdown backed by a `List Folders` search or hidden trigger.
