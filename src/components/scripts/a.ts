import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const POST: APIRoute = async ({ request }) => {
  const supabase = createClient(
    import.meta.env.SUPABASE_URL, 
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY // La llave maestra
  );

  try {
    const data = await request.formData();
    const id = data.get('id') as string;
    const title = data.get('title') as string;
    const category = data.get('category') as string;
    const file = data.get('courseImage') as File;

    if (!file) throw new Error("Imagen requerida");

    // 1. Asegurar que el bucket existe (Evita el error "Bucket not found")
    const bucketName = 'course-images';
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find(b => b.name === bucketName)) {
      await supabase.storage.createBucket(bucketName, { public: true });
    }

    // 2. Subir imagen
    const fileName = `${id}-${Date.now()}.${file.name.split('.').pop()}`;
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // 3. Obtener URL pública
    const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(fileName);

    // 4. Guardar en SQL (Asegúrate que tu tabla tiene la columna image_url)
    const { error: dbError } = await supabase
      .from('courses')
      .insert([{ 
        id, 
        title, 
        category, 
        image_url: publicUrl, 
      }]);

    if (dbError) throw dbError;

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};