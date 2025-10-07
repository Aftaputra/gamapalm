# Arsitektur Sistem GAMAPALM ISPO

## Diagram Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐              │
│  │   Admin   │  │  Auditor  │  │   User    │              │
│  │ Dashboard │  │ Dashboard │  │ Dashboard │              │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘              │
│        │              │              │                     │
│        └──────────────┼──────────────┘                     │
│                       │                                    │
│              ┌────────▼────────┐                           │
│              │  Service Layer  │                           │
│              │ supabase-service│                           │
│              └────────┬────────┘                           │
│                       │                                    │
└───────────────────────┼────────────────────────────────────┘
                        │
                        │ Supabase Client
                        │
┌───────────────────────▼────────────────────────────────────┐
│                 SUPABASE (Backend)                         │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │   PostgreSQL     │  │   Auth Service   │               │
│  │                  │  │                  │               │
│  │ • users          │  │ • Login          │               │
│  │ • auditors       │  │ • Session Mgmt   │               │
│  │ • audit_projects │  │ • Permissions    │               │
│  │ • criteria       │  │                  │               │
│  │ • requests       │  └──────────────────┘               │
│  │ • audit_tasks    │                                     │
│  └──────────────────┘                                     │
│                                                            │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │  Row-Level       │  │  File Storage    │               │
│  │  Security (RLS)  │  │  (Future)        │               │
│  │                  │  │                  │               │
│  │ • User policies  │  │ • Documents      │               │
│  │ • Auditor rules  │  │ • Certificates   │               │
│  └──────────────────┘  └──────────────────┘               │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Flow Data

### 1. Authentication Flow

```
User Input (Email/Password)
    │
    ▼
authService.login[Role]()
    │
    ▼
Supabase Query (SELECT from [role]s table)
    │
    ├─ Success ─► Store in localStorage
    │                │
    │                ▼
    │            Redirect to /dashboard
    │
    └─ Failure ─► Show error message
```

### 2. Data Loading Flow (Example: Admin Dashboard)

```
Component Mount (useEffect)
    │
    ▼
requestService.getAllRequests()
auditTaskService.getAllTasks()
auditorService.getAllAuditors()
    │
    ▼
Supabase Client Query
    │
    ├─ Success ─► Update State
    │                │
    │                ▼
    │            Render UI with data
    │
    └─ Failure ─► Fallback to mock data
                     │
                     ▼
                  Render UI with mock
```

### 3. Update Flow (Example: Approve Request)

```
User Click "Approve"
    │
    ▼
requestService.updateRequestStatus(id, 'approved')
    │
    ▼
Supabase UPDATE query
    │
    ├─ Success ─► Update local state
    │                │
    │                ▼
    │            UI updates automatically
    │
    └─ Failure ─► Show error, state unchanged
```

## Layer Architecture

### Presentation Layer (UI Components)
- `src/components/dashboards/AdminDashboard.tsx`
- `src/components/dashboards/AuditorDashboard.tsx`
- `src/components/dashboards/UserDashboard.tsx`
- `src/app/login/page.tsx`

**Responsibility**: Render UI, handle user interactions

### Service Layer (Business Logic)
- `src/lib/supabase-service.ts`

**Responsibility**: 
- Abstract database operations
- Handle authentication logic
- Transform data between DB and UI formats
- Error handling

### Data Layer (Supabase Client)
- `src/lib/supabase.ts`

**Responsibility**: 
- Initialize Supabase client
- Handle low-level API calls

### Database Layer (Supabase/PostgreSQL)
- `supabase-schema.sql`

**Responsibility**: 
- Store persistent data
- Enforce data integrity
- Row-level security
- Triggers and functions

## Security Architecture

```
┌─────────────────────────────────────────┐
│         Client (Browser)                │
│  • NEXT_PUBLIC_SUPABASE_ANON_KEY        │
│  • Limited permissions                  │
└────────────────┬────────────────────────┘
                 │
                 │ HTTPS
                 │
┌────────────────▼────────────────────────┐
│         Supabase API Gateway            │
│  • Validate JWT                         │
│  • Apply RLS policies                   │
└────────────────┬────────────────────────┘
                 │
                 │
┌────────────────▼────────────────────────┐
│         PostgreSQL + RLS                │
│  • User sees only their data            │
│  • Auditor sees assigned tasks          │
│  • Admin needs service key for all      │
└─────────────────────────────────────────┘
```

## Component Dependencies

```
AdminDashboard
├─ requestService (CRUD requests)
├─ auditTaskService (Manage tasks)
└─ auditorService (Get auditor list)

AuditorDashboard
├─ auditorService (Get current user)
├─ projectService (Get assigned projects)
└─ criteriaService (Update criteria status)

UserDashboard
├─ userService (Get current user)
├─ projectService (Get user projects)
└─ criteriaService (Upload documents)
```

## Database Relationships

```
users (1) ──────────────── (*) audit_projects
                               │
                               │
                               (*) criteria
                                    │
                                    │
                               (1) auditors

requests (*) ───────────── (1) users

audit_tasks (*) ──────────── (1) auditors
```

## API Patterns

### Read Pattern
```typescript
// Service method
async getAllProjects() {
  const { data, error } = await supabase
    .from('audit_projects')
    .select('*');
  
  if (error) {
    console.error('Error:', error);
    return [];
  }
  
  return data;
}

// Component usage
useEffect(() => {
  const load = async () => {
    const projects = await projectService.getAllProjects();
    setProjects(projects);
  };
  load();
}, []);
```

### Write Pattern
```typescript
// Service method
async updateCriterion(projectId, criterionId, updates) {
  const { data, error } = await supabase
    .from('criteria')
    .update(updates)
    .eq('project_id', projectId)
    .eq('criterion_id', criterionId);
  
  if (error) return { success: false, error };
  return { success: true, data };
}

// Component usage
const handleUpdate = async () => {
  const result = await criteriaService.updateCriterion(
    projectId, 
    criterionId, 
    { status: 'Approved' }
  );
  
  if (result.success) {
    // Update local state
  }
};
```

## Scalability Considerations

### Current Implementation
- Single database (Supabase)
- Client-side state management
- Direct database queries

### Future Optimizations
1. **Caching**: Use React Query or SWR
2. **Pagination**: Implement for large datasets
3. **Real-time**: Supabase subscriptions for live updates
4. **CDN**: Static assets on Vercel Edge
5. **API Routes**: For complex operations

## Monitoring & Logging

### Client-side
```typescript
try {
  // Operation
} catch (error) {
  console.error('Error:', error);
  // Send to monitoring service (Sentry, etc.)
}
```

### Server-side (Supabase)
- Built-in query logging
- Performance metrics
- Error tracking via Supabase dashboard

## Deployment Architecture

```
┌─────────────────┐
│   GitHub Repo   │
└────────┬────────┘
         │
         │ git push
         │
┌────────▼────────┐
│     Vercel      │ ◄─── Auto Deploy
│  (Next.js Host) │
└────────┬────────┘
         │
         │ API Calls
         │
┌────────▼────────┐
│    Supabase     │
│  (Database +    │
│   Storage +     │
│   Auth)         │
└─────────────────┘
```

## Development vs Production

### Development
- `.env.local` with test Supabase project
- Mock data fallback enabled
- Console logging active

### Production
- Environment variables in Vercel
- Strict RLS policies
- Error monitoring
- Performance tracking

---

**Note**: Diagram ini adalah simplified version. Untuk production, pertimbangkan:
- API rate limiting
- Cache layers
- Load balancing
- Backup strategies
- Disaster recovery
