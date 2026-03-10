export const prerender = false; // Importante para que funcione el POST

import { createClient } from "@supabase/supabase-js";

export const POST = async ({ request }) => {
  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  );

  try {
    const data = await request.formData();
    const file = data.get('courseImage');
    const id = data.get('id'); // Lo usamos solo para el nombre del archivo

    if (!file || typeof file === 'string') {
      throw new Error("No se recibió un archivo válido");
    }

    const bucketName = 'course-images';
    const fileExt = file.name.split('.').pop();
    const fileName = `${id}-${Date.now()}.${fileExt}`;

    // 1. Subir únicamente al Storage
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // 2. Obtener la URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    // 3. Responder solo con la URL (Sin tocar ninguna tabla)
    return new Response(JSON.stringify({ 
      success: true, 
      url: publicUrl 
    }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("DEBUG SERVER ERROR:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};