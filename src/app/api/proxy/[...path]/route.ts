// src/app/api/proxy/[...path]/route.ts
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxyRequest(request, params, 'GET')
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxyRequest(request, params, 'POST')
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxyRequest(request, params, 'PUT')
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxyRequest(request, params, 'PATCH')
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxyRequest(request, params, 'DELETE')
}

async function handleProxyRequest(
  request: NextRequest,
  params: { path: string[] },
  method: string,
) {
  console.log(`[API] /api/proxy: ${method} request for path:`, params.path)

  if (!API_BASE_URL) {
    console.error('[API] Backend URL not configured')
    return NextResponse.json({ message: 'Backend URL not configured' }, { status: 500 })
  }

  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
      console.warn('[API] /api/proxy: missing access_token cookie')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Construct the backend URL
    const backendPath = params.path.join('/')
    const url = `${API_BASE_URL}/${backendPath}`

    // Get query parameters from the original request
    const searchParams = request.nextUrl.searchParams
    const queryString = searchParams.toString()
    const fullUrl = queryString ? `${url}?${queryString}` : url

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'lang-id': '1', // Default language
    }

    // Copy specific headers from the original request
    const forwardHeaders = ['accept', 'accept-language', 'user-agent']
    forwardHeaders.forEach((headerName) => {
      const value = request.headers.get(headerName)
      if (value) {
        headers[headerName] = value
      }
    })

    // Get request body for POST/PUT/PATCH requests
    let body: string | undefined
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        const requestBody = await request.json()
        body = JSON.stringify(requestBody)
      } catch (e) {
        // If JSON parsing fails, try to get raw body
        try {
          body = await request.text()
        } catch (textError) {
          console.warn('[API] /api/proxy: could not parse request body')
        }
      }
    }

    console.log(`[API] /api/proxy: forwarding ${method} to`, fullUrl)

    // Forward the request to the backend
    const backendResponse = await fetch(fullUrl, {
      method,
      headers,
      body,
      cache: 'no-store',
    })

    const responseText = await backendResponse.text()
    let responseJson: any

    try {
      responseJson = responseText ? JSON.parse(responseText) : {}
    } catch (e) {
      console.error('[API] /api/proxy: invalid JSON from backend:', responseText)
      return NextResponse.json({ message: 'Invalid response from backend' }, { status: 502 })
    }

    if (!backendResponse.ok) {
      console.error('[API] /api/proxy: backend error', backendResponse.status, responseJson)
      // Forward the error response from backend
      return NextResponse.json(responseJson, { status: backendResponse.status })
    }

    console.log('[API] /api/proxy: success from backend')
    return NextResponse.json(responseJson, { status: backendResponse.status })
  } catch (err) {
    console.error('[API] /api/proxy: unexpected error', err)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
