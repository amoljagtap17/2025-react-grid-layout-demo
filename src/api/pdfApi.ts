export async function generatePDF(quadrants: Record<number, string>): Promise<Response> {
  // Replace with your actual API endpoint
  const API_ENDPOINT = 'https://your-api-endpoint/generate-pdf';

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quadrants }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    return response;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}