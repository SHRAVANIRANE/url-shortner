import supabase from "./supabase";
export async function getUrls(user_id) {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user_id);
  if (error) {
    console.error(error.message);
    throw new Error("Unable to fetch URLs");
  }
  return data;
}
export async function deleteUrl(id) {
  const { data, error } = await supabase.from("urls").delete("*").eq("id", id);
  if (error) {
    console.error(error.message);
    throw new Error("Unable to delete URLs");
  }
  return data;
}
export async function createUrl(
  { title, longUrl, customUrl, user_id },
  qrcode
) {
  const short_url = Math.random().toString(36).substring(2, 6);
  const fileName = `qr-${short_url}`;
  const { error: storagaeError } = await supabase.storage
    .from("qrs")
    .upload(fileName, qrcode);
  if (storagaeError) throw new Error(storagaeError.message);
  const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;

  const { data, error } = await supabase
    .from("urls")
    .insert([
      {
        title,
        original_url: longUrl,
        custom_url: customUrl || null,
        short_url,
        user_id,
        qr,
      },
    ])
    .select("*");

  if (error) {
    console.error(error.message);
    throw new Error("Error creating short URL");
  }
  return data;
}
