import { useCallback, useState } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'

// Import FilePond plugins
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'

// Import FilePond styles
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'


import { Label } from '@/components/ui/label'
import InputError from '@/components/input-error'
import { cn } from '@/lib/utils'

// Register the plugins - must be called before using FilePond component
registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginImageCrop,
)

interface FileUploadProps {
    name: string
    label?: string
    multiple?: boolean
    acceptedFileTypes?: string[]
    maxFiles?: number
    maxFileSize?: string
    files?: Array<{
        source: string
        options: {
            type: 'input' | 'limbo' | 'local' | 'remote'
            metadata?: {
                date?: string,
                name?: string,
                size?: number,
                type?: string,
            },
        }
    }>
    error?: string
    className?: string
    required?: boolean
    aspectRatio?: string
}

const getCsrfToken = () => {
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (metaToken) return metaToken;
    return '';
}

export default function FileUpload({
    name,
    label,
    multiple = false,
    acceptedFileTypes = ['image/*'],
    maxFiles = 10,
    maxFileSize = '10MB',
    aspectRatio = '1:1',
    files: initialFiles = [],
    error,
    className,
    required = false,
}: FileUploadProps) {
    const [files, setFiles] = useState<any[]>(initialFiles);
    const [tempFileIds, setTempFileIds] = useState<string[]>([]);

    const handleProcessFile = useCallback((error: any, file: any) => {
        if (file.serverId) {
            setTempFileIds(prev => [...prev, file.serverId])
        }
    }, [tempFileIds])

    const handleRemoveFile = useCallback((error: any, file: any) => {
        setTempFileIds(prev => prev.filter((id: string) => id !== String(file.source)))
    }, [tempFileIds])

    return (
        <div className={cn('space-y-2', className)}>
            {label && (
                <Label htmlFor={name}>
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </Label>
            )}
            <FilePond
                name={name}
                files={files}
                allowMultiple={multiple}
                onprocessfile={handleProcessFile}
                onupdatefiles={setFiles}
                onremovefile={handleRemoveFile}
                maxFiles={maxFiles}
                acceptedFileTypes={acceptedFileTypes}
                server={{
                    url: '/api/temp-uploads',
                    process: {
                        url: '',
                        method: 'POST',
                        headers: {
                            'X-CSRF-TOKEN': getCsrfToken(),
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                        onload: (response: string) => {
                            try {
                                const data = JSON.parse(response)
                                return data.media_id || data.id || response
                            } catch {
                                return response
                            }
                        },
                    },

                    revert: {
                        url: '',
                        method: 'DELETE',
                        headers: {
                            'X-CSRF-TOKEN': getCsrfToken(),
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                    },

                    load: (source, load, error) => {
                        fetch(`/api/temp-uploads/${source.split('/')[0]}/${source.split('/')[1]}`, {
                            method: 'GET',
                            headers: {
                                'X-CSRF-TOKEN': getCsrfToken(),
                                'X-Requested-With': 'XMLHttpRequest',
                            },
                        })
                            .then(response => {
                                return response.blob()
                            })
                            .then(blob => {
                                load(new Blob([blob], { type: blob.type }))
                            })
                            .catch(error => {
                                console.error('File loading error:', error)
                                return
                            })
                    },

                    remove: (source, load, error) => {
                        fetch(`/api/temp-uploads/${source}`, {
                            method: 'DELETE',
                            headers: {
                                'X-CSRF-TOKEN': getCsrfToken(),
                                'X-Requested-With': 'XMLHttpRequest',
                            },
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to remove file')
                                }
                                return response.json()
                            })
                            .then(data => {
                                load();
                            })
                            .catch(error => {
                                console.error('File removal error:', error)
                                return
                            })
                    }
                }}
                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                labelFileProcessing='Uploading...'
                labelFileProcessingComplete='Upload complete'
                labelFileProcessingError='Error during upload'
                labelFileProcessingAborted='Upload cancelled'
                labelFileRemoveError='Error during remove'
                labelTapToCancel='tap to cancel'
                labelTapToRetry='tap to retry'
                labelTapToUndo='tap to undo'
                labelButtonRemoveItem='Remove'
                labelButtonAbortItemLoad='Abort'
                labelButtonRetryItemLoad='Retry'
                labelButtonAbortItemProcessing='Cancel'
                labelButtonUndoItemProcessing='Undo'
                labelButtonProcessItem='Upload'

                styleButtonRemoveItemPosition="right"
                styleButtonProcessItemPosition="right"

                // Enable image preview, resize, and crop
                // Note: These plugins process images automatically on upload
                // They don't show interactive edit buttons - images are processed according to settings below
                allowImagePreview={true}
                allowImageResize={true}
                allowImageCrop={true}

                // Image preview settings
                imagePreviewHeight={200}
                imagePreviewMinHeight={100}
                imagePreviewMaxHeight={300}

                // Image crop settings
                // Leave imageCropAspectRatio undefined for free cropping
                // Or set to "1:1", "16:9", etc. for fixed aspect ratio
                imageCropAspectRatio={aspectRatio}

                // Image resize settings
                // Images will be resized to these dimensions before upload
                imageResizeTargetWidth={1200}
                imageResizeTargetHeight={1200}
                imageResizeMode="contain"
                imageResizeUpscale={false}

                credits={false}
            />

            <input
                type="hidden"
                name={'temp_ids'}
                value={tempFileIds}
            />
            {error && <InputError message={error} />}
        </div>
    )
}

