---
description: "Task list for Supabase Authentication Integration"
---

# Tasks: Integrate Supabase Authentication

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan with auth/, models/, services/, controllers/, views/, utils/ directories
- [x] T002 Install Supabase JavaScript client library with npm install @supabase/supabase-js
- [x] T003 [P] Create configuration files for Supabase in config/supabase.js
- [x] T004 [P] Set up environment variables for SUPABASE_URL and SUPABASE_ANON_KEY in .env file
- [x] T005 [P] Install cookie-parser middleware for session management in Node.js application
- [x] T006 [P] Install http-proxy-middleware for integration with existing ManagerServer application

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 [P] Setup Supabase client configuration in config/supabase.js with createClient using SUPABASE_URL and SUPABASE_ANON_KEY from environment variables
- [x] T007 [P] Implement authentication middleware in middleware/auth.js with requireAuth function that validates JWT tokens using Supabase auth.getUser()
- [x] T008 [P] Setup API routing for authentication endpoints in routes/auth.js with login and logout routes
- [x] T009 Create UserSession model based on data-model.md in src/auth/session/sessionModel.js with fields: sessionId, userId, jwtToken, createdAt, expiresAt, lastAccessed, ipAddress, userAgent
- [x] T010 [P] Configure error handling and logging infrastructure for auth in src/auth/utils/errorHandler.js with specific authentication error responses
- [x] T011 [P] Create SessionManager in src/auth/session/sessionManager.js with session timeout logic for 30-minute inactivity limit
- [x] T012 [P] Create authGuard middleware in src/auth/session/authGuard.js to protect application routes

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Authentication (Priority: P1) 🎯 MVP

**Goal**: Implement login page using Supabase auth that authenticates users before granting access to the main application

**Independent Test**: Users can enter email and password on login page, authenticate against Supabase, and gain access to the application

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T013 [P] [US1] Contract test for login endpoint in tests/auth/contract/test_login.js based on auth-api.yaml specification
- [x] T014 [P] [US1] Integration test for user authentication flow in tests/auth/integration/test_auth_flow.js including email/password validation

### Implementation for User Story 1

- [x] T015 [P] [US1] Create login HTML page in src/views/login.html with email and password fields, form validation, and error display area
- [x] T016 [P] [US1] Create login CSS styling in public/css/login.css with responsive design and error message styling
- [x] T017 [US1] Implement login JavaScript functionality in public/js/login.js with form submission, error handling, and redirect to application after successful login
- [x] T018 [US1] Implement login endpoint in src/controllers/authController.js with signInWithPassword using Supabase client
- [x] T019 [US1] Add validation and error handling for login in src/controllers/authController.js including proper error responses for invalid credentials
- [x] T020 [US1] Implement session token storage in secure cookies with httpOnly, secure, and sameSite flags in authController.js
- [x] T021 [US1] Add logging for authentication operations in src/auth/utils/logger.js with success/failure tracking for security monitoring

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Protected Application Access (Priority: P1)

**Goal**: After successful authentication, the app should function identically to the current server version but operate through Render's infrastructure

**Independent Test**: Authenticated users can access all existing application functionality while unauthenticated users are redirected to login

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [x] T022 [P] [US2] Contract test for protected endpoints in tests/auth/contract/test_protected_routes.js based on auth-api.yaml specification
- [x] T023 [P] [US2] Integration test for protected access flow in tests/auth/integration/test_protected_access.js including redirect behavior for unauthenticated users

### Implementation for User Story 2

- [x] T024 [P] [US2] Update existing route controllers to use auth middleware with requireAuth function
- [x] T025 [US2] Implement route protection middleware in src/middleware/authGuard.js to redirect unauthenticated users to login page
- [x] T026 [US2] Update application entry points to check authentication status and redirect to login if not authenticated
- [x] T027 [US2] Integrate authGuard with existing application routes for /dashboard, /api, /reports, and other protected paths
- [x] T028 [US2] Implement fallback route handler to redirect unauthenticated users to login page

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Session Management (Priority: P2)

**Goal**: Securely manage user sessions with 30-minute timeout as specified in clarifications

**Independent Test**: Authenticated users maintain their session across page navigations but are logged out after 30 minutes of inactivity

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [x] T029 [P] [US3] Contract test for session validation endpoint in tests/auth/contract/test_session.js based on auth-api.yaml specification
- [x] T030 [P] [US3] Integration test for session timeout behavior in tests/auth/integration/test_session_timeout.js with 30-minute inactivity validation

### Implementation for User Story 3

- [x] T031 [P] [US3] Enhance SessionManager in src/auth/session/sessionManager.js with session timeout logic for 30-minute inactivity limit
- [x] T032 [US3] Implement session refresh mechanism in src/auth/session/sessionManager.js to update lastAccessed timestamp
- [x] T033 [US3] Add session timeout validation in authentication middleware in src/middleware/auth.js
- [x] T034 [US3] Implement automatic redirect to login when session expires after 30 minutes of inactivity
- [x] T035 [US3] Create session validation endpoint in src/controllers/authController.js to check session status

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Logout Functionality (Priority: P2)

**Goal**: Provide secure logout functionality that invalidates the session

**Independent Test**: Authenticated users can securely log out and subsequent access to protected resources is denied

### Tests for User Story 4 (OPTIONAL - only if tests requested) ⚠️

- [x] T036 [P] [US4] Contract test for logout endpoint in tests/auth/contract/test_logout.js based on auth-api.yaml specification
- [x] T037 [P] [US4] Integration test for logout flow in tests/auth/integration/test_logout_flow.js including session invalidation verification

### Implementation for User Story 4

- [x] T038 [P] [US4] Implement logout endpoint in src/controllers/authController.js with supabase.auth.signOut() and cookie clearing
- [x] T039 [US4] Add logout functionality to login page UI in src/views/login.html with logout button and session status indicator
- [x] T040 [US4] Update authentication middleware to handle logout in middleware/auth.js with proper session cleanup
- [x] T041 [US4] Implement client-side logout functionality in public/js/login.js to call logout endpoint and clear local session data

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Integration with ManagerServer (Priority: P1)

**Goal**: Integrate authentication gateway with existing ManagerServer-linux-x64 application to maintain all existing functionality

### Implementation

- [x] T042 [P] Update server.js to implement proxy functionality using http-proxy-middleware
- [x] T043 [P] Configure proxy to forward authenticated requests to ManagerServer application
- [x] T044 [P] Implement request header modification to pass user information to ManagerServer
- [x] T045 [P] Update Dockerfile to support ManagerServer integration
- [x] T046 [P] Update render.yaml with MANAGER_SERVER_URL environment variable
- [x] T047 [P] Update documentation to reflect ManagerServer integration approach

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T048 [P] Documentation updates in docs/auth-implementation.md with setup and configuration instructions
- [x] T049 Code cleanup and refactoring across auth modules with consistent error handling
- [x] T050 Performance optimization for authentication operations with JWT token validation caching
- [x] T051 [P] Additional unit tests (if requested) in tests/auth/unit/ for authentication utilities
- [x] T052 Security hardening for authentication flow with rate limiting and brute force protection
- [x] T053 Run quickstart.md validation to ensure all functionality works as specified
- [x] T054 Update API documentation based on auth-api.yaml contract

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
 - User stories can then proceed in parallel (if staffed)
 - Or sequentially in priority order (P1 → P2 → P3)
- **Integration (Phase 7)**: Depends on User Stories 1-4 completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2/US3 but should be independently testable
- **Integration (P1)**: Depends on completion of User Stories 1-4

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for login endpoint in tests/auth/contract/test_login.js based on auth-api.yaml specification"
Task: "Integration test for user authentication flow in tests/auth/integration/test_auth_flow.js including email/password validation"

# Launch all implementation tasks for User Story 1 together:
Task: "Create login HTML page in src/views/login.html with email and password fields, form validation, and error display area"
Task: "Create login CSS styling in public/css/login.css with responsive design and error message styling"
Task: "Implement login JavaScript functionality in public/js/login.js with form submission, error handling, and redirect to application after successful login"
```

---

## Implementation Strategy

### MVP First (User Stories 1, 2, and Integration Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (User Authentication)
4. Complete Phase 4: User Story 2 (Protected Application Access)
5. Complete Phase 7: Integration with ManagerServer
6. **STOP and VALIDATE**: Test authentication flow with ManagerServer integration
7. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo
3. Add User Story 2 → Test with US1 → Deploy/Demo 
4. Add Integration → Test with US1/US2 → Deploy/Demo (Complete solution!)
5. Add User Story 3 → Test independently → Deploy/Demo
6. Add User Story 4 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (User Authentication)
   - Developer B: User Story 2 (Protected Application Access)
   - Developer C: User Stories 3 and 4 (Session Management and Logout)
   - Developer D: Integration with ManagerServer
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All tasks marked [x] are completed and ready for deployment