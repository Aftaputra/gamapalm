import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Buat client dengan service role key untuk bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const criterionId = formData.get('criterionId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file received' }, { status: 400 });
    }

    if (!userId || !criterionId) {
      return NextResponse.json({ error: 'Missing userId or criterionId' }, { status: 400 });
    }

    // Validasi ukuran file (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File terlalu besar. Maksimal 10MB.' }, { status: 400 });
    }

    // Validasi tipe file
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipe file tidak diizinkan. Gunakan PDF, JPG, atau PNG.' }, { status: 400 });
    }

    // Buat path yang unik per user dan criterion
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestamp = Date.now();
    const fileName = `${timestamp}_${safeName}`;
    
    // Structure: users/{userId}/criteria/{criterionId}/{fileName}
    const filePath = `users/${userId}/criteria/${criterionId}/${fileName}`;

    console.log('Uploading to path:', filePath);

    // Cek apakah sudah ada file untuk criterion ini
    const { data: existingFiles, error: listError } = await supabaseAdmin.storage
      .from('audit-files')
      .list(`users/${userId}/criteria/${criterionId}`);

    if (listError) {
      console.warn('Error listing files (folder might not exist):', listError);
    }

    // Hapus file lama jika ada (untuk mengganti file)
    if (existingFiles && existingFiles.length > 0) {
      const filesToDelete = existingFiles.map(f => `users/${userId}/criteria/${criterionId}/${f.name}`);
      const { error: deleteError } = await supabaseAdmin.storage
        .from('audit-files')
        .remove(filesToDelete);
      
      if (deleteError) {
        console.warn('Error deleting old files:', deleteError);
      } else {
        console.log('Removed old files:', filesToDelete);
      }
    }

    // Upload file baru
    const { data, error } = await supabaseAdmin.storage
      .from('audit-files')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json({ error: `Upload gagal: ${error.message}` }, { status: 500 });
    }

    // Ambil public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('audit-files')
      .getPublicUrl(filePath);

    console.log('Upload successful:', urlData.publicUrl);

    return NextResponse.json({ 
      success: true, 
      fileUrl: urlData.publicUrl,
      fileName: fileName,
      filePath: filePath
    });

  } catch (error) {
    console.error('API upload error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}