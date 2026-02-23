import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: episodeId } = await params
    const targetUrl = `https://www.xiaoyuzhoufm.com/episode/${episodeId}`

    // Fetch the episode page
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch episode page: ${response.status}` },
        { status: 404 }
      )
    }

    const html = await response.text()
    
    // Optimized: Use Regex instead of Cheerio to save CPU time
    const match = html.match(/<script[^>]*name="schema:podcast-show"[^>]*>([\s\S]*?)<\/script>/i)
    
    if (!match || !match[1]) {
      return NextResponse.json(
        { error: 'Could not find podcast schema data' },
        { status: 404 }
      )
    }

    try {
      const scriptContent = match[1]
      const jsonData = JSON.parse(scriptContent)

      // Verify it's the correct type
      if (jsonData['@type'] !== 'PodcastEpisode') {
        return NextResponse.json(
          { error: 'Invalid podcast episode data' },
          { status: 404 }
        )
      }

      // Extract required data from the JSON
      const podcastName = jsonData.partOfSeries?.name || ''
      const episodeTitle = jsonData.name || jsonData.title || ''
      const audioUrl = jsonData.associatedMedia?.contentUrl || ''

      if (!podcastName || !episodeTitle || !audioUrl) {
        return NextResponse.json(
          { error: 'Missing required podcast data' },
          { status: 404 }
        )
      }

      // Extract file extension from audioUrl
      const getExtensionFromUrl = (url: string) => {
        const match = url.match(/\.([a-zA-Z0-9]+)(?:\?.*)?$/)
        return match ? match[1].toLowerCase() : 'mp3' // fallback to mp3 if no extension found
      }

      const fileExtension = getExtensionFromUrl(audioUrl)
      const filename = `${podcastName}_${episodeTitle}.${fileExtension}`

      // Create download headers
      const headers = new Headers()

      // Force download and set filename with RFC 5987 encoding for Chinese characters
      headers.set('Content-Type', 'application/octet-stream')

      const encodedFilename = encodeURIComponent(filename)
      headers.set('Content-Disposition', `attachment; filename*=UTF-8''${encodedFilename}`)

      // -- Optimized Audio Streaming --

      // Prepare headers for fetching from the audio source.
      // We will forward the client's Range request to the source.
      const fetchHeaders = new Headers({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': targetUrl
      });

      const rangeHeader = request.headers.get('range');
      if (rangeHeader) {
        fetchHeaders.set('range', rangeHeader);
      }

      // Fetch the audio from the source, potentially as a partial request
      const audioResponse = await fetch(audioUrl, { headers: fetchHeaders });

      if (!audioResponse.ok) {
        return NextResponse.json(
          { error: `Failed to fetch audio file: ${audioResponse.status}` },
          { status: audioResponse.status }
        );
      }

      // --- Response Headers for the Client ---
      // These headers are sent back to the client (e.g., browser or media player).

      // Use the source's Content-Type, or fallback to a generic one.
      headers.set('Content-Type', audioResponse.headers.get('Content-Type') || 'audio/mpeg');
      
      // The source tells us if it supports range requests. We pass this on.
      headers.set('Accept-Ranges', audioResponse.headers.get('Accept-Ranges') || 'bytes');
      
      // Pass along the Content-Length from the source.
      // For a range request, this will be the length of the partial content.
      const contentLength = audioResponse.headers.get('content-length');
      if (contentLength) {
        headers.set('Content-Length', contentLength);
      }

      // If this is a partial content response, pass along the Content-Range header.
      const contentRange = audioResponse.headers.get('content-range');
      if (contentRange) {
        headers.set('Content-Range', contentRange);
      }

      // Stream the response body directly from the source to the client.
      // The status code (200 for full content, 206 for partial) is also passed through.
      return new NextResponse(audioResponse.body, {
        status: audioResponse.status,
        statusText: audioResponse.statusText,
        headers,
      });

    } catch (parseError) {
      console.error('Error parsing podcast schema data:', parseError)
      return NextResponse.json(
        { error: 'Failed to parse podcast data' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error processing episode:', error)
    return NextResponse.json(
      { error: 'Failed to process episode' },
      { status: 500 }
    )
  }
}