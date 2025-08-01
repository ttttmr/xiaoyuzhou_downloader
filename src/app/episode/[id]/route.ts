import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

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
    const $ = cheerio.load(html)

    // Directly extract the script with name="schema:podcast-show"
    const podcastShowScript = $('script[name="schema:podcast-show"]')

    if (!podcastShowScript.length) {
      return NextResponse.json(
        { error: 'Could not find podcast schema data' },
        { status: 404 }
      )
    }

    try {
      const scriptContent = podcastShowScript.html()
      if (!scriptContent) {
        return NextResponse.json(
          { error: 'Empty podcast schema data' },
          { status: 404 }
        )
      }

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

      // Fetch and stream the audio
      const audioResponse = await fetch(audioUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': targetUrl
        }
      })

      if (!audioResponse.ok) {
        return NextResponse.json(
          { error: `Failed to fetch audio file: ${audioResponse.status}` },
          { status: 404 }
        )
      }

      // Forward content length and create stream
      const contentLength = audioResponse.headers.get('content-length')
      if (contentLength) {
        headers.set('Content-Length', contentLength)
      }

      return new NextResponse(audioResponse.body, {
        status: 200,
        headers
      })

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