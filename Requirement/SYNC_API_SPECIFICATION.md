# Crewport Sync API Specification

## Purpose

This document defines the **API endpoints required for synchronizing ship data with the central Crewport system**.

The APIs support:

* offline-first operation
* delta synchronization
* bulk synchronization
* conflict resolution
* satellite bandwidth optimization

These APIs will be implemented in the **Node.js backend** and consumed by the **React / Next.js frontend running onboard vessels**.

---

# 1. Authentication

All sync APIs require authentication.

## Method

JWT token authentication.

## Request Header

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

Each request must include the following metadata.

```
{
  "vessel_id": "UUID",
  "device_id": "UUID",
  "user_id": "UUID"
}
```

---

# 2. API Base Path

```
/api/sync
```

---

# 3. Bulk Sync Upload

## Endpoint

```
POST /api/sync/bulk
```

## Purpose

Upload multiple locally stored records when the ship reconnects to the internet.

## Request Payload

```
{
  "vessel_id": "uuid",
  "device_id": "uuid",
  "crew": [],
  "purchases": [],
  "victualling": [],
  "bond_store": [],
  "portage_entries": []
}
```

### Example Payload

```
{
  "vessel_id": "VES123",
  "device_id": "SHIP-LAPTOP-01",
  "crew": [
    {
      "id": "crew-89347",
      "name": "John",
      "rank": "AB",
      "sign_on_date": "2026-02-12",
      "updated_at": "2026-03-10T10:00:00"
    }
  ]
}
```

## Server Processing

1. Validate vessel access.
2. Start database transaction.
3. Insert or update records.
4. Return success response.

## Response

```
{
  "status": "success",
  "records_processed": 10
}
```

---

# 4. Delta Sync Download

## Endpoint

```
GET /api/sync/delta
```

## Purpose

Download only the records that have changed since the last sync.

## Query Parameters

```
vessel_id
last_sync_timestamp
```

### Example Request

```
GET /api/sync/delta?vessel_id=VES123&last_sync=2026-03-10T09:00:00
```

## Server Logic

```
SELECT * FROM crew
WHERE vessel_id = ?
AND updated_at > last_sync_timestamp
```

## Response

```
{
  "crew_updates": [],
  "purchase_updates": [],
  "victualling_updates": [],
  "bond_store_updates": [],
  "server_time": "2026-03-10T10:30:00"
}
```

---

# 5. Entity Sync Endpoint

## Endpoint

```
POST /api/sync/entity
```

## Purpose

Used when only one entity needs to be synced.

## Request Payload

```
{
  "entity_type": "crew",
  "operation": "CREATE",
  "data": {}
}
```

## Allowed Entity Types

```
crew
purchase
victualling
bond_store
portage
```

## Allowed Operations

```
CREATE
UPDATE
DELETE
```

---

# 6. Sync Status Endpoint

## Endpoint

```
GET /api/sync/status
```

## Purpose

Check if server is reachable and retrieve server timestamp.

## Response

```
{
  "server_status": "online",
  "server_time": "2026-03-10T10:45:00"
}
```

---

# 7. Sync Logs Upload

## Endpoint

```
POST /api/sync/logs
```

## Purpose

Upload client-side sync logs for debugging.

## Request Payload

```
{
  "vessel_id": "VES123",
  "logs": []
}
```

Example:

```
{
  "event": "sync_started",
  "timestamp": "2026-03-10T10:00"
}
```

---

# 8. File Upload API

Large files should not be included in bulk sync.

## Endpoint

```
POST /api/sync/upload
```

## Supported Files

```
crew_contract
purchase_invoice
delivery_note
```

## Request

Multipart upload.

```
file
entity_id
entity_type
```

---

# 9. Conflict Resolution API

## Endpoint

```
POST /api/sync/conflict
```

## Purpose

Resolve data conflicts when ship and office modify the same record.

## Request

```
{
  "entity_type": "crew",
  "entity_id": "crew-89347",
  "client_version": {},
  "server_version": {}
}
```

## Resolution Strategies

```
SERVER_OVERRIDE
CLIENT_OVERRIDE
MERGE
```

---

# 10. Sync Configuration API

## Endpoint

```
GET /api/sync/config
```

## Purpose

Provide sync settings to the vessel system.

## Response

```
{
  "sync_interval_minutes": 5,
  "bulk_sync_limit": 500,
  "compression_enabled": true
}
```

---

# 11. Error Response Format

All APIs must return standardized error messages.

Example:

```
{
  "status": "error",
  "error_code": "SYNC_VALIDATION_FAILED",
  "message": "Invalid payload"
}
```

---

# 12. Database Requirements

Each table must include these fields.

```
id (UUID)
vessel_id
created_at
updated_at
sync_version
device_id
```

These fields enable delta sync and conflict resolution.

---

# 13. Recommended API Rate Limits

To protect satellite bandwidth:

```
bulk_sync: 1 request per minute
delta_sync: 1 request per 30 seconds
file_upload: 5 files per minute
```

---

# 14. Example Sync Workflow

```
User creates crew entry
↓
Saved locally in IndexedDB
↓
Sync queue updated
↓
Internet available
↓
POST /api/sync/bulk
↓
Server processes records
↓
Client receives success response
↓
Local records marked synced
```

---

# 15. Security Requirements

All sync APIs must enforce:

```
JWT authentication
vessel-level access control
input validation
rate limiting
```

Optional enhancements:

```
request compression
payload hashing
device registration
```

---

# Summary

The Crewport Sync API supports reliable maritime data synchronization through:

```
bulk upload
delta sync
entity sync
file upload
conflict resolution
sync configuration
```

These APIs enable ships to operate offline while ensuring the shore system remains synchronized once connectivity is restored.
