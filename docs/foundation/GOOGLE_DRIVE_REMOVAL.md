# Decommissioning of Google Drive Integration

## Date: 2026-09-12
## Authority: Prompt 01 (Foundation) Section 8 (Eliminación de Google Drive)

### Rationale
In accordance with Rule 7 (Fuente Canónica) and Section 8, the canonical source of truth for EngineeringGuides is exclusively the Git repository (\Engineering guides/\). External cloud synchronization introduces non-determinism, credentials exposure risks, and dependency on out-of-band state.

### Actions Taken
1. \scripts/sync_gdrive.py\ decommissioned and archived to \scripts/archive/sync_gdrive.py.decommissioned\.
   - Verified that all 31 PDF guides are already committed to Git in \Engineering guides/\.
   - No exclusive data or metadata existed solely in Google Drive.
2. \.github/workflows/sync-gdrive.yml\ deleted from the workflow directory.
   - Removed secrets requirements: \GDRIVE_API_KEY\, \GDRIVE_SERVICE_ACCOUNT\, \GDRIVE_FOLDER_ID\.
   - Removed unneeded daily cron.
3. UI text in \src/components/StatsModal.jsx\ updated to reflect Git-based automation.
4. Documentation updated.

### Target Architecture
\Git repository
      ↓
Engineering guides/
      ↓
Pipeline (Deterministic Manifest, IR, Catalog)
      ↓
Generated static artifacts
      ↓
Frontend (Zero runtime API calls)
\
