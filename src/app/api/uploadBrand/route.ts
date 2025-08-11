import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

export const POST = async (req: Request) => {
  // Image upload endpoint
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file)
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

    // Validate file type (allow only images)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type))
      return NextResponse.json({ error: 'Invalid file type' }, { status: 415 })

    // Limit file size (e.g., 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize)
      return NextResponse.json({ error: 'File too large' }, { status: 413 })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generate unique filename with original extension
    const ext = file.name.split('.').pop()?.toLowerCase()
    const filename = `${randomUUID()}.${ext}`

    // Save to public/uploads directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'brand')
    const filePath = path.join(uploadDir, filename)

    await writeFile(filePath, buffer)

    // Return the file URL
    const fileUrl = `/uploads/brand/${filename}`
    return NextResponse.json({ url: fileUrl }, { status: 201 })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url)
    const imagePath = searchParams.get('path')

    if (!imagePath)
      return NextResponse.json(
        { error: 'Path parameter is required' },
        { status: 400 }
      )

    // Prevent directory traversal
    if (imagePath.includes('..'))
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })

    const filePath = path.join(process.cwd(), 'public', imagePath)
    const ext = path.extname(filePath).toLowerCase()

    // Only allow images from /uploads
    if (!filePath.startsWith(path.join(process.cwd(), 'public', 'uploads')))
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })

    // Read file
    let fileBuffer: Buffer
    try {
      fileBuffer = await readFileAsync(filePath)
    } catch (err: any) {
      if (err.code === 'ENOENT')
        return NextResponse.json({ error: 'File not found' }, { status: 404 })
      throw err
    }

    // Set content type
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
    }
    const contentType = mimeTypes[ext] || 'application/octet-stream'

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Image fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    )
  }
}

/**
 * Reads a file asynchronously and returns a Buffer.
 */
async function readFileAsync(filePath: string): Promise<Buffer> {
  const { readFile } = await import('fs/promises')
  return readFile(filePath)
}

/**
 * Ensures a directory exists, creates it recursively if not.
 * No external library used.
 */
