import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text, targetLanguage } = await request.json();
    
    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }

    // Use Google Translate API
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      const translatedText = data[0][0][0];
      
      return NextResponse.json({
        success: true,
        originalText: text,
        translatedText: translatedText,
        targetLanguage: targetLanguage
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid response from translation API',
        originalText: text
      });
    }
    
  } catch (error) {
    console.error('Translation API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      originalText: text || ''
    }, { status: 500 });
  }
}