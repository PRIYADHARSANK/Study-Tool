'use server';

export async function handleFileUpload(formData: FormData): Promise<{ name: string; dataUri: string } | { error: string }> {
  const file = formData.get('pdf') as File;

  if (!file || file.size === 0) {
    return { error: 'No file uploaded.' };
  }

  if (file.type !== 'application/pdf') {
    return { error: 'Invalid file type. Please upload a PDF.' };
  }

  try {
    const buffer = await file.arrayBuffer();
    const base64String = Buffer.from(buffer).toString('base64');
    const dataUri = `data:application/pdf;base64,${base64String}`;

    return { name: file.name, dataUri };
  } catch (error) {
    console.error('File processing error:', error);
    return { error: 'Failed to process file.' };
  }
}
