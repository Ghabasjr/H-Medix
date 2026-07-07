# VicadoAgent Platform — WeShare API Guide

This guide covers all WeShare (co-tenant marketplace) endpoints. WeShare allows tenants to list properties for sharing and clients to apply for co-tenant spots.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Tenant Profile](#tenant-profile)
- [Tenant Properties](#tenant-properties)
- [Share Listings](#share-listings)
- [Co-Tenant Preferences](#co-tenant-preferences)
- [Applications](#applications)
- [Dashboards](#dashboards)
- [Notifications](#notifications)
- [Enum Reference](#enum-reference)
- [Error Handling](#error-handling)

---

## Overview

WeShare operates with two roles:

| Role | Capabilities |
|------|-------------|
| TENANT | Create profile, manage properties, create/manage listings, set preferences, accept/reject applications |
| CLIENT | Browse listings, apply to listings, track applications, view applicant dashboard |

**Flow:**
1. Register as tenant → Create profile → Add properties → Create share listings → Set preferences
2. Clients browse listings → Apply → Tenant reviews → Shortlist/Accept/Reject

---

## Authentication

### Register as Tenant

```bash
curl -X POST http://localhost:8080/api/auth/register/tenant \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Response** (201 Created):

```json
{
  "status": 201,
  "message": "Tenant registered successfully",
  "success": true,
  "data": {
    "id": 1,
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "TENANT"
  }
}
```

---

## Tenant Profile

All profile endpoints require `ROLE_TENANT`.

### Create Profile

```bash
curl -X POST http://localhost:8080/api/weshare/profile \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=<session>" \
  -d '{
    "fullName": "John Doe",
    "gender": "MALE",
    "age": 28,
    "occupation": "Software Engineer",
    "employer": "TechCorp",
    "maritalStatus": "SINGLE",
    "phoneNumber": "+2348012345678",
    "email": "john@example.com",
    "country": "Nigeria",
    "state": "Lagos",
    "lga": "Ikeja",
    "street": "Allen Avenue",
    "smokingPreference": "Non-Smoker",
    "drinkingPreference": "Social Drinker",
    "petPreference": "No Pets",
    "religiousPreference": "Christian",
    "genderPreference": "Male",
    "workSchedule": "MORNING"
  }'
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| fullName | string | Yes | Max 150 characters |
| gender | enum | No | MALE, FEMALE, OTHER |
| age | integer | No | 18-120 |
| occupation | string | No | Max 150 characters |
| employer | string | No | Max 150 characters |
| maritalStatus | enum | No | SINGLE, MARRIED, DIVORCED, WIDOWED |
| phoneNumber | string | No | Max 30 characters |
| email | string | No | Valid email, max 150 characters |
| country | string | No | Max 100 characters |
| state | string | No | Max 100 characters |
| lga | string | No | Max 100 characters |
| street | string | No | Max 255 characters |
| profileImageUrl | string | No | Max 500 characters |
| smokingPreference | string | No | Max 50 characters |
| drinkingPreference | string | No | Max 50 characters |
| petPreference | string | No | Max 50 characters |
| religiousPreference | string | No | Max 100 characters |
| genderPreference | string | No | Max 50 characters |
| workSchedule | enum | No | MORNING, AFTERNOON, NIGHT, FLEXIBLE, REMOTE |

**Response** (201 Created):

```json
{
  "status": 201,
  "message": "Tenant profile created successfully",
  "success": true,
  "data": {
    "id": "uuid-string",
    "userId": 1,
    "fullName": "John Doe",
    "gender": "MALE",
    "age": 28,
    "occupation": "Software Engineer",
    "workSchedule": "MORNING",
    "verified": false,
    "createdAt": "2025-01-15T10:30:00",
    "updatedAt": "2025-01-15T10:30:00"
  }
}
```

### Update Profile

```bash
curl -X PUT http://localhost:8080/api/weshare/profile \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=<session>" \
  -d '{
    "occupation": "Senior Engineer",
    "age": 29
  }'
```

Only non-null fields are updated (partial update).

### Get Profile

```bash
curl -X GET http://localhost:8080/api/weshare/profile \
  -H "Cookie: JSESSIONID=<session>"
```

### Delete Profile

```bash
curl -X DELETE http://localhost:8080/api/weshare/profile \
  -H "Cookie: JSESSIONID=<session>"
```

---

## Tenant Properties

All property endpoints require `ROLE_TENANT`.

### Create Property

```bash
curl -X POST http://localhost:8080/api/weshare/properties \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=<session>" \
  -d '{
    "title": "3-Bedroom Flat in Ikeja",
    "description": "Spacious flat with modern amenities",
    "propertyType": "APARTMENT",
    "country": "Nigeria",
    "state": "Lagos",
    "lga": "Ikeja",
    "street": "Allen Avenue",
    "streetNo": "15",
    "bedrooms": 3,
    "bathrooms": 2,
    "monthlyRent": 250000.00,
    "yearlyRent": 2800000.00
  }'
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Max 255 characters |
| description | string | No | Text |
| propertyType | enum | Yes | APARTMENT, HOUSE, VILLA, TOWNHOUSE, PENTHOUSE, STUDIO, OFFICE, SHOP, WAREHOUSE, LAND_PLOT, FARM |
| country | string | No | Max 100 characters |
| state | string | No | Max 100 characters |
| lga | string | No | Max 100 characters |
| street | string | No | Max 255 characters |
| streetNo | string | No | Max 50 characters |
| bedrooms | integer | No | >= 0 |
| bathrooms | integer | No | >= 0 |
| monthlyRent | decimal | No | >= 0.00 |
| yearlyRent | decimal | No | >= 0.00 |

**Response** (201 Created):

```json
{
  "status": 201,
  "message": "Tenant property created successfully",
  "success": true,
  "data": {
    "propertyId": "uuid-string",
    "tenantId": 1,
    "title": "3-Bedroom Flat in Ikeja",
    "propertyType": "APARTMENT",
    "bedrooms": 3,
    "bathrooms": 2,
    "monthlyRent": 250000.00,
    "yearlyRent": 2800000.00,
    "imageUrls": [],
    "createdAt": "2025-01-15T10:30:00"
  }
}
```

### Update Property

```bash
curl -X PUT http://localhost:8080/api/weshare/properties/{propertyId} \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=<session>" \
  -d '{"monthlyRent": 280000.00, "yearlyRent": 3100000.00}'
```

### Get Property

```bash
curl -X GET http://localhost:8080/api/weshare/properties/{propertyId} \
  -H "Cookie: JSESSIONID=<session>"
```

### List My Properties

```bash
curl -X GET http://localhost:8080/api/weshare/properties \
  -H "Cookie: JSESSIONID=<session>"
```

### Upload Property Images

Upload one or more images for a property. Accepted formats: JPG, JPEG, PNG, WebP. Max file size: 5 MB per image.

```bash
curl -X POST http://localhost:8080/api/weshare/properties/{propertyId}/images \
  -H "Cookie: JSESSIONID=<session>" \
  -F "images=@photo1.jpg" \
  -F "images=@photo2.png"
```

**Response** (201 Created):

```json
{
  "status": 201,
  "message": "Property images uploaded successfully",
  "success": true,
  "data": {
    "propertyId": "uuid-string",
    "tenantId": 1,
    "title": "3-Bedroom Flat in Ikeja",
    "propertyType": "APARTMENT",
    "bedrooms": 3,
    "bathrooms": 2,
    "monthlyRent": 250000.00,
    "yearlyRent": 2800000.00,
    "imageUrls": [
      "https://minio.example.com/property-images/uuid1.jpg?...",
      "https://minio.example.com/property-images/uuid2.png?..."
    ],
    "createdAt": "2025-01-15T10:30:00"
  }
}
```

### Delete Property

```bash
curl -X DELETE http://localhost:8080/api/weshare/properties/{propertyId} \
  -H "Cookie: JSESSIONID=<session>"
```

---

## Share Listings

### Create Listing (TENANT)

```bash
curl -X POST http://localhost:8080/api/weshare/listings \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=<session>" \
  -d '{
    "propertyId": "property-uuid",
    "title": "Looking for 2 roommates in Ikeja",
    "description": "Friendly household, looking for clean and respectful co-tenants",
    "monthlyContribution": 85000.00,
    "securityDeposit": 170000.00,
    "availableFrom": "2025-02-01",
    "maxOccupants": 3,
    "availableSlots": 2
  }'
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| propertyId | string | Yes | UUID of tenant's property |
| title | string | Yes | Max 255 characters |
| description | string | No | Text |
| monthlyContribution | decimal | Yes | > 0 |
| securityDeposit | decimal | No | >= 0 |
| availableFrom | date | No | YYYY-MM-DD |
| maxOccupants | integer | Yes | >= 1 |
| availableSlots | integer | Yes | >= 1, must be <= maxOccupants |

**Response** (201 Created):

```json
{
  "status": 201,
  "message": "Listing created successfully",
  "success": true,
  "data": {
    "listingId": "uuid-string",
    "tenantId": 1,
    "title": "Looking for 2 roommates in Ikeja",
    "monthlyContribution": 85000.00,
    "securityDeposit": 170000.00,
    "availableFrom": "2025-02-01",
    "maxOccupants": 3,
    "availableSlots": 2,
    "status": "OPEN",
    "property": { ... },
    "preference": null,
    "createdAt": "2025-01-15T10:30:00"
  }
}
```

### Update Listing (TENANT)

```bash
curl -X PUT http://localhost:8080/api/weshare/listings/{listingId} \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=<session>" \
  -d '{"monthlyContribution": 90000.00}'
```

### Get Listing (Authenticated)

```bash
curl -X GET http://localhost:8080/api/weshare/listings/{listingId} \
  -H "Cookie: JSESSIONID=<session>"
```

### Browse Listings (Authenticated)

```bash
curl -X GET "http://localhost:8080/api/weshare/listings?country=Nigeria&state=Lagos&propertyType=APARTMENT&minContribution=50000&maxContribution=100000&status=OPEN&page=0&size=20" \
  -H "Cookie: JSESSIONID=<session>"
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| country | string | Filter by property country |
| state | string | Filter by property state |
| lga | string | Filter by property LGA |
| propertyType | enum | Filter by property type |
| minContribution | decimal | Minimum monthly contribution |
| maxContribution | decimal | Maximum monthly contribution |
| availableFrom | date | Available from date (YYYY-MM-DD) |
| status | enum | OPEN, CLOSED, FULL |
| page | integer | Page number (0-based) |
| size | integer | Page size |

### My Listings (TENANT)

```bash
curl -X GET http://localhost:8080/api/weshare/listings/my-listings \
  -H "Cookie: JSESSIONID=<session>"
```

### Close Listing (TENANT)

```bash
curl -X PUT http://localhost:8080/api/weshare/listings/{listingId}/close \
  -H "Cookie: JSESSIONID=<session>"
```

### Reopen Listing (TENANT)

```bash
curl -X PUT http://localhost:8080/api/weshare/listings/{listingId}/reopen \
  -H "Cookie: JSESSIONID=<session>"
```

---

## Co-Tenant Preferences

### Save Preferences (TENANT)

```bash
curl -X POST http://localhost:8080/api/weshare/listings/{listingId}/preferences \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=<session>" \
  -d '{
    "preferredGender": "MALE",
    "minimumAge": 22,
    "maximumAge": 35,
    "preferredOccupation": "Professional",
    "studentAllowed": false,
    "professionalAllowed": true,
    "smokerAllowed": false,
    "petAllowed": false,
    "religiousPreference": "Any",
    "houseRules": "No loud music after 10pm. Clean shared spaces weekly."
  }'
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| preferredGender | string | No | Max 20 characters |
| minimumAge | integer | No | >= 18 |
| maximumAge | integer | No | <= 120 |
| preferredOccupation | string | No | Max 150 characters |
| studentAllowed | boolean | No | |
| professionalAllowed | boolean | No | |
| smokerAllowed | boolean | No | |
| petAllowed | boolean | No | |
| religiousPreference | string | No | Max 100 characters |
| houseRules | string | No | Text |

### Update Preferences (TENANT)

```bash
curl -X PUT http://localhost:8080/api/weshare/listings/{listingId}/preferences \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=<session>" \
  -d '{"smokerAllowed": true}'
```

### Get Preferences (Authenticated)

```bash
curl -X GET http://localhost:8080/api/weshare/listings/{listingId}/preferences \
  -H "Cookie: JSESSIONID=<session>"
```

---

## Applications

### Apply to Listing (CLIENT)

```bash
curl -X POST http://localhost:8080/api/weshare/applications \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=<session>" \
  -d '{
    "listingId": "listing-uuid",
    "message": "Hi, I am interested in sharing this space. I am a clean and respectful person.",
    "occupation": "Graphic Designer",
    "monthlyIncomeRange": "200000-350000",
    "moveInDate": "2025-02-15"
  }'
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| listingId | string | Yes | UUID of the listing |
| message | string | No | Max 2000 characters |
| occupation | string | No | Max 150 characters |
| monthlyIncomeRange | string | No | Max 50 characters |
| moveInDate | date | No | YYYY-MM-DD |

**Response** (201 Created):

```json
{
  "status": 201,
  "message": "Application submitted successfully",
  "success": true,
  "data": {
    "applicationId": "uuid-string",
    "listingId": "listing-uuid",
    "applicantId": 2,
    "message": "Hi, I am interested...",
    "occupation": "Graphic Designer",
    "monthlyIncomeRange": "200000-350000",
    "moveInDate": "2025-02-15",
    "status": "PENDING",
    "createdAt": "2025-01-15T11:00:00"
  }
}
```

**Business Rules:**
- Listing must be OPEN
- Cannot apply to your own listing
- One application per client per listing

### List Applications for Tenant (TENANT)

```bash
curl -X GET "http://localhost:8080/api/weshare/applications/tenant?page=0&size=20" \
  -H "Cookie: JSESSIONID=<session>"
```

Returns all applications across all of the tenant's listings.

### List Applications for Applicant (CLIENT)

```bash
curl -X GET "http://localhost:8080/api/weshare/applications/applicant?page=0&size=20" \
  -H "Cookie: JSESSIONID=<session>"
```

Returns all applications submitted by the authenticated client.

### Shortlist Applicant (TENANT)

```bash
curl -X PUT http://localhost:8080/api/weshare/applications/{applicationId}/shortlist \
  -H "Cookie: JSESSIONID=<session>"
```

### Accept Application (TENANT)

```bash
curl -X PUT http://localhost:8080/api/weshare/applications/{applicationId}/accept \
  -H "Cookie: JSESSIONID=<session>"
```

**Side Effects:**
- Decrements `availableSlots` on the listing
- If slots reach 0, listing status auto-changes to `FULL`
- Applicant receives acceptance notification

### Reject Application (TENANT)

```bash
curl -X PUT http://localhost:8080/api/weshare/applications/{applicationId}/reject \
  -H "Cookie: JSESSIONID=<session>"
```

---

## Dashboards

### Tenant Dashboard (TENANT)

```bash
curl -X GET http://localhost:8080/api/weshare/dashboard/tenant \
  -H "Cookie: JSESSIONID=<session>"
```

**Response** (200 OK):

```json
{
  "status": 200,
  "message": "Tenant dashboard retrieved successfully",
  "success": true,
  "data": {
    "activeListingsCount": 3,
    "pendingApplicationsCount": 7,
    "totalApplicationsCount": 12,
    "recentNotifications": [...],
    "listingSummaries": [...]
  }
}
```

### Applicant Dashboard (CLIENT)

```bash
curl -X GET http://localhost:8080/api/weshare/dashboard/applicant \
  -H "Cookie: JSESSIONID=<session>"
```

**Response** (200 OK):

```json
{
  "status": 200,
  "message": "Applicant dashboard retrieved successfully",
  "success": true,
  "data": {
    "totalApplications": 5,
    "pendingCount": 2,
    "acceptedCount": 1,
    "rejectedCount": 2,
    "applications": [...],
    "recentNotifications": [...]
  }
}
```

---

## Notifications

All notification endpoints require authentication.

### List Notifications

```bash
curl -X GET "http://localhost:8080/api/weshare/notifications?page=0&size=20" \
  -H "Cookie: JSESSIONID=<session>"
```

**Response** (200 OK):

```json
{
  "status": 200,
  "message": "Notifications retrieved successfully",
  "success": true,
  "data": {
    "content": [
      {
        "notificationId": "uuid-string",
        "message": "A new tenant application has been received for listing: ...",
        "readStatus": false,
        "notificationType": "NEW_APPLICATION",
        "createdAt": "2025-01-15T11:00:00"
      }
    ],
    "totalElements": 15,
    "totalPages": 1,
    "number": 0
  }
}
```

### Mark as Read

```bash
curl -X PUT http://localhost:8080/api/weshare/notifications/{notificationId}/read \
  -H "Cookie: JSESSIONID=<session>"
```

---

## Enum Reference

### Gender
`MALE`, `FEMALE`, `OTHER`

### MaritalStatus
`SINGLE`, `MARRIED`, `DIVORCED`, `WIDOWED`

### WorkSchedule
`MORNING`, `AFTERNOON`, `NIGHT`, `FLEXIBLE`, `REMOTE`

### ListingStatus
`OPEN`, `CLOSED`, `FULL`

### ApplicationStatus
`PENDING`, `SHORTLISTED`, `ACCEPTED`, `REJECTED`

### WeShareNotificationType
`NEW_APPLICATION`, `APPLICATION_ACCEPTED`, `APPLICATION_REJECTED`, `APPLICANT_SHORTLISTED`, `LISTING_CLOSED`

### PropertyType
`APARTMENT`, `HOUSE`, `VILLA`, `TOWNHOUSE`, `PENTHOUSE`, `STUDIO`, `OFFICE`, `SHOP`, `WAREHOUSE`, `LAND_PLOT`, `FARM`

---

## Error Handling

All WeShare errors follow this structure:

```json
{
  "timestamp": "2025-01-15T11:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Descriptive error message",
  "path": "/api/weshare/..."
}
```

| Scenario | HTTP Status | Message |
|----------|-------------|---------|
| Resource not found | 404 | "Listing not found with id: ..." |
| Duplicate profile | 400 | "Tenant profile already exists for this user" |
| Incomplete profile | 400 | "Tenant must complete their profile before creating a listing" |
| Not listing owner | 403 | "You do not own this listing" |
| Listing not OPEN | 400 | "Cannot apply to a listing that is CLOSED" |
| Self-application | 409 | "You cannot apply to your own listing" |
| Duplicate application | 409 | "You have already applied to this listing" |
| Slots full | 400 | "No available slots. Listing is full." |
| Slots exceed max | 400 | "Available slots cannot exceed max occupants" |
| Reopen FULL listing | 400 | "Cannot reopen a listing that is FULL..." |
| Validation error | 400 | Field-level validation messages |
| Unauthorized | 401 | "Authentication is required..." |
| Forbidden | 403 | "You do not have permission..." |
