# Quick Reference Guide - GAMAPALM Supabase Integration

## 🎯 Quick Commands

### Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=your-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

## 🔑 Test Credentials

| Role | Email | Password | Notes |
|------|-------|----------|-------|
| Admin | admin@ispo.com | admin | Hardcoded in authService |
| Auditor | budi.s@email.com | - | Check Supabase database |
| Auditor | dewi.l@email.com | - | Check Supabase database |
| Auditor | ahmad.s@email.com | - | Check Supabase database |
| User | rina.a@sawitmaju.com | - | Check Supabase database |
| User | joko.s@agrolestari.com | - | Check Supabase database |

## 📂 Key Files Reference

### Configuration
- `.env.local` - Environment variables
- `package.json` - Dependencies
- `next.config.ts` - Next.js config

### Database
- `supabase-schema.sql` - Create tables (run first)
- `supabase-seed.sql` - Insert test data (run second)

### Code
- `src/lib/supabase.ts` - Supabase client
- `src/lib/supabase-service.ts` - All database operations
- `src/types/index.ts` - TypeScript types

### Login Pages
- `src/app/login/page.tsx` - Main login (3 roles)
- `src/app/login/perusahaan/page.tsx` - Company login
- `src/app/login/staf/page.tsx` - Staff (Admin/Auditor) login

### Dashboards
- `src/components/dashboards/AdminDashboard.tsx`
- `src/components/dashboards/AuditorDashboard.tsx`
- `src/components/dashboards/UserDashboard.tsx`

### Documentation
- `README.md` - Main documentation
- `SUPABASE_SETUP.md` - Setup guide
- `ARCHITECTURE.md` - System architecture
- `MIGRATION_GUIDE.md` - Migration info
- `INTEGRATION_SUMMARY.md` - What was done

## 🗄️ Database Tables Quick Reference

| Table | Description | Key Fields |
|-------|-------------|------------|
| users | Companies | id, email, name, company |
| auditors | Auditors | id, email, name, location |
| admins | Administrators | id, email, name |
| audit_projects | Audit projects | id, project_id, company_name, status |
| criteria | Audit criteria | id, project_id, criterion_id, status |
| requests | Cert requests | id, company, status |
| audit_tasks | Audit tasks | id, auditor_id, company, status |

## 🔧 Common Service Functions

### Authentication
```typescript
// Login
await authService.loginAdmin(email, password)
await authService.loginAuditor(email, password)
await authService.loginUser(email, password)

// Register
await authService.registerUser(userData)
```

### Projects
```typescript
// Get all projects
await projectService.getAllProjects()

// Get user's projects
await projectService.getProjectsByUserId(userId)

// Create project
await projectService.createProject(projectData)
```

### Criteria
```typescript
// Update criterion
await criteriaService.updateCriterion(projectId, criterionId, {
  status: 'Disetujui',
  auditorNotes: 'Approved'
})

// Assign auditor
await criteriaService.assignAuditor(projectId, criterionId, auditorId)
```

### Requests
```typescript
// Get all requests
await requestService.getAllRequests()

// Update status
await requestService.updateRequestStatus(requestId, 'approved')
```

## 🚀 Deployment Checklist

### Before Deployment
- [ ] Setup Supabase production project
- [ ] Run schema SQL
- [ ] Run seed SQL (or real data)
- [ ] Set environment variables in Vercel
- [ ] Test all login flows
- [ ] Test all workflows
- [ ] Review RLS policies

### Vercel Deployment
1. Connect GitHub repository
2. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy

### Post-Deployment
- [ ] Test production login
- [ ] Test database operations
- [ ] Monitor errors
- [ ] Check performance

## 🐛 Troubleshooting

### Login fails
- Check Supabase credentials in `.env.local`
- Verify user exists in database
- Check browser console for errors

### Data not loading
- Check Supabase project is active
- Verify RLS policies
- Check network tab in DevTools

### Build fails
- May fail in CI/CD due to font loading
- This is expected in restricted networks
- Will work in production with internet access

## 📊 Status Tracking

### Criterion Status Flow
```
Belum Ada Berkas 
  ↓ (User uploads)
Menunggu Verifikasi
  ↓ (Auditor reviews)
Revisi Diperlukan OR Disetujui
```

### Request Status Flow
```
pending
  ↓ (Admin reviews)
approved OR rejected
```

## 🔗 Useful Links

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 💡 Tips

### Development
- Use mock data fallback for offline development
- Check browser console for errors
- Use React DevTools for debugging

### Database
- Use Supabase Table Editor to view data
- SQL Editor for running queries
- Logs for debugging queries

### Performance
- Use indexes (already in schema)
- Add pagination for large lists
- Consider caching with React Query

## 📞 Getting Help

1. Read the error message carefully
2. Check documentation:
   - `SUPABASE_SETUP.md` for setup issues
   - `ARCHITECTURE.md` for understanding
   - `MIGRATION_GUIDE.md` for changes
3. Check Supabase logs
4. Open GitHub issue with details

---

**Quick Start**: `npm install` → Setup Supabase → Update `.env.local` → `npm run dev` → Login at localhost:3000
