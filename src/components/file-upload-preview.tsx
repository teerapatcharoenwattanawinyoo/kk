'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Image as ImageIcon, X } from 'lucide-react'
import Image from 'next/image'

interface FileUploadPreviewProps {
  file: File
  previewUrl: string | null
  onRemove: () => void
}

export function FileUploadPreview({ file, previewUrl, onRemove }: FileUploadPreviewProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileType = (file: File) => {
    if (file.type.startsWith('image/')) return 'image'
    if (file.type === 'application/pdf') return 'pdf'
    return 'other'
  }

  const fileType = getFileType(file)

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Uploaded File</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-6 w-6 p-0 hover:bg-red-100"
          >
            <X className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Preview */}
        <div className="aspect-square w-full overflow-hidden rounded-lg border bg-gray-50">
          {previewUrl && fileType === 'image' ? (
            <Image
              src={previewUrl}
              alt="File preview"
              width={200}
              height={200}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              {fileType === 'pdf' ? (
                <FileText className="h-16 w-16 text-red-500" />
              ) : (
                <ImageIcon className="h-16 w-16 text-gray-400" />
              )}
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="mr-2 flex-1 truncate text-sm font-medium">{file.name}</span>
            <Badge variant="outline" className="text-xs">
              {fileType.toUpperCase()}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Size: {formatFileSize(file.size)}</span>
            <span>Type: {file.type}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
