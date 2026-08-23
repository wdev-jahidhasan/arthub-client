export const imageUpload = async (image) => {

  if (!image) return null;

  const formData = new FormData();
  formData.append('image', image)

  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await res.json();
    return data.data.display_url;
  } catch (error) {
    console.error("Imgbb Upload Error:", error);
    throw error;
  }
}