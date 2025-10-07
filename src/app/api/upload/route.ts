import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

    if (!file || !userId || !criterionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File terlalu besar' }, { status: 400 });
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipe file tidak diizinkan' }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}_${safeName}`;
    const filePath = `users/${userId}/criteria/${criterionId}/${fileName}`;

    const { data: existingFiles } = await supabaseAdmin.storage
      .from('audit-files')
      .list(`users/${userId}/criteria/${criterionId}`);

    if (existingFiles && existingFiles.length > 0) {
      const filesToDelete = existingFiles.map(f => `users/${userId}/criteria/${criterionId}/${f.name}`);
      await supabaseAdmin.storage.from('audit-files').remove(filesToDelete);
    }

    const { error } = await supabaseAdmin.storage
      .from('audit-files')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: `Upload gagal: ${error.message}` }, { status: 500 });
    }

    const { data: urlData } = supabaseAdmin.storage
      .from('audit-files')
      .getPublicUrl(filePath);

    return NextResponse.json({ 
      success: true, 
      fileUrl: urlData.publicUrl 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}