# Fluxer Threads - Reference Implementation

This repository contains a full-stack Reference Implementation for the **Threads** feature as requested in the $800 Dev Bounty. 

Since AI-generated PRs are not accepted without meaningful human contribution, this package is meant to be studied, adapted, and manually integrated into the fluxerapp/fluxer repository. It provides the exact schema, API logic, and UI components required to satisfy all bounty constraints.

## Contents
1. **database/001_add_threads_support.sql** - The PostgreSQL migrations to extend the channels and messages tables.
2. **backend/threads.controller.js** - Node.js/Express routes for creating, listing, and managing thread states (Open/Closed/Archived).
3. **frontend/ThreadCreationModal.jsx** - The desktop/mobile responsive UI popup for initiating a thread.
4. **frontend/ThreadInlineBox.jsx** - The React component that renders the indented thread box with the reply connecting line below the parent message.

## Implementation Notes
* **Mobile Initiation:** To implement this on Mobile, simply attach a long-press listener to the Message bubbles that triggers the exact same ThreadCreationModal used on desktop.
* **Snowflake IDs:** The backend uses standard snowflake timestamps for Thread IDs, ensuring they are API-compatible with existing Channel IDs.
* **Routing:** As requested, threads are treated as sub-channels. When routing in React Router, map /:communityId/:channelId/:threadId to render the exact same Chat View component used for parent channels.

