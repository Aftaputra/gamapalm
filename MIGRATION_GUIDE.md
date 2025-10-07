# Panduan Migrasi ke Supabase

Dokumen ini menjelaskan bagaimana data dari mock data di-migrasi ke Supabase dan perubahan yang dilakukan pada kode.

## Perubahan Utama

### 1. Struktur Data

#### Sebelum (Mock Data)
Data disimpan di `src/lib/mockdata.ts` sebagai array JavaScript:
```typescript
export const users: User[] = [...]
export const auditors: Auditor[] = [...]
export const auditProjects: AuditProject[] = [...]
```

#### Sesudah (Supabase)
Data disimpan di database PostgreSQL dengan tabel terpisah:
- `users` - Data perusahaan
- `auditors` - Data auditor
- `audit_projects` - Proyek audit
- `criteria` - Kriteria per project

### 2. Authentication Flow

#### Sebelum
Login menggunakan array lookup:
```typescript
const foundUser = users.find(u => u.email === email && u.password === password);
```

#### Sesudah
Login menggunakan Supabase service:
```typescript
const result = await authService.loginUser(email, password);
```

### 3. Data Operations

#### Sebelum
State management lokal dengan useState:
```typescript
const [projects, setProjects] = useState(mockProjects);
```

#### Sesudah
Fetch dari Supabase dengan fallback ke mock:
```typescript
useEffect(() => {
  const loadData = async () => {
    const data = await projectService.getAllProjects();
    if (data.length > 0) setProjects(data);
  };
  loadData();
}, []);
```

## Mapping ID

Untuk konsistensi, gunakan ID dari seed data:

### Auditors
```
AUD001 -> a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d (Budi Santoso)
AUD002 -> b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e (Dewi Lestari)
AUD003 -> c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f (Ahmad Subagja)
```

### Users
```
USR001 -> d4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a (Rina Aprilia / PT Sawit Maju)
USR002 -> e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b (Joko Susilo / PT Agro Lestari)
```

### Projects
```
PROJ-001 -> f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c (PT Sawit Maju)
```

## File Updates

### Files Modified
1. `src/app/login/page.tsx` - Updated to use authService
2. `src/app/login/perusahaan/page.tsx` - Updated to use authService
3. `src/app/login/staf/page.tsx` - Updated to use authService
4. `src/components/dashboards/AdminDashboard.tsx` - Updated to use Supabase services
5. `src/components/dashboards/AuditorDashboard.tsx` - Updated to use Supabase services
6. `src/components/dashboards/UserDashboard.tsx` - Updated to use Supabase services

### Files Created
1. `src/lib/supabase.ts` - Supabase client configuration
2. `src/lib/supabase-service.ts` - Service layer for database operations
3. `supabase-schema.sql` - Database schema
4. `supabase-seed.sql` - Initial seed data
5. `SUPABASE_SETUP.md` - Setup instructions
6. `.env.example` - Environment variables template

## Breaking Changes

### 1. ID Format
- **Before**: String IDs seperti "AUD001", "USR001"
- **After**: UUID format seperti "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d"

### 2. Request/Task IDs
- **Before**: Number IDs (1, 2, 3)
- **After**: UUID strings

### 3. Async Operations
Semua data operations sekarang async:
```typescript
// Before
const user = users.find(u => u.id === userId);

// After
const user = await userService.getUserById(userId);
```

## Backward Compatibility

Aplikasi tetap bisa berjalan tanpa Supabase dengan fallback ke mock data:
```typescript
try {
  const data = await supabaseService.getData();
  if (data.length > 0) setData(data);
} catch (error) {
  console.error('Supabase error, using mock data');
  // Fallback to mock data
}
```

## Testing

### Unit Testing
```bash
npm test
```

### Integration Testing dengan Supabase
1. Setup test Supabase project
2. Run seed data
3. Test authentication
4. Test CRUD operations

## Deployment

### Environment Variables
Pastikan set di Vercel/Netlify:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### Database Migration
1. Backup existing data (jika ada)
2. Run `supabase-schema.sql`
3. Run `supabase-seed.sql`
4. Verify data

## Troubleshooting

### Error: "Invalid API key"
- Check `.env.local` file
- Restart dev server

### Error: "relation does not exist"
- Run `supabase-schema.sql` di SQL Editor

### Data tidak muncul
- Check RLS policies
- Verify seed data di Table Editor

### Performance issues
- Add indexes (sudah ada di schema)
- Use pagination
- Enable Supabase caching

## Rollback Plan

Jika ada masalah, rollback dengan:
1. Revert ke commit sebelum Supabase integration
2. Restore mock data usage
3. Remove Supabase dependencies

```bash
git revert <commit-hash>
npm install
```

## Future Improvements

1. **Real-time subscriptions**:
```typescript
supabase
  .from('criteria')
  .on('UPDATE', payload => {
    // Update UI in real-time
  })
  .subscribe();
```

2. **File upload to Supabase Storage**:
```typescript
const { data } = await supabase.storage
  .from('documents')
  .upload(filePath, file);
```

3. **Full Supabase Auth**:
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});
```

4. **Row-level security refinement**
5. **Database triggers for notifications**
6. **Audit logging**

## Questions?

Contact the development team atau buka issue di GitHub.
