import { useCallback, useEffect, useRef, useState } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import { router } from '@inertiajs/react'
import { Label } from '@/components/ui/label'
import InputError from '@/components/input-error'
import { cn } from '@/lib/utils'

// Register the plugins
registerPlugin(FilePondPluginImagePreview, FilePondPluginImageResize, FilePondPluginImageCrop)

interface FileUploadProps {
    name: string
    label?: string
    multiple?: boolean
    acceptedFileTypes?: string[]
    maxFiles?: number
    maxFileSize?: string
    server?: any
    files?: Array<{
        source: string
        options: {
            type: 'local' | 'limbo' | 'remote'
            file?: {
                name: string
                size: number
                type: string
            }
        }
    }>
    onupdatefiles?: (files: any[]) => void
    error?: string
    className?: string
    required?: boolean
}

export default function FileUpload({
    name,
    label,
    multiple = false,
    acceptedFileTypes = ['image/*'],
    maxFiles = 1,
    maxFileSize = '10MB',
    server,
    files: initialFiles = [],
    onupdatefiles,
    error,
    className,
    required = false,
}: FileUploadProps) {
    const [files, setFiles] = useState<any[]>([]);
    const [tempFileIds, setTempFileIds] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    console.log(initialFiles);
    // Initialize files from props
    useEffect(() => {
        if (initialFiles && initialFiles.length > 0) {
            // const formattedFiles = initialFiles.map((file) => {
            //     if (typeof file === 'string') {
            //         // If it's just a URL string
            //         return {
            //             source: file,
            //             options: {
            //                 type: 'remote' as const,
            //             },
            //         }
            //     }
            //     return file
            // })
            setFiles(initialFiles)
        }
    }, [initialFiles])

    const handleUpdateFiles = useCallback(
        (fileItems: any[]) => {
            setFiles(fileItems)

            // Extract temporary file IDs from server response
            const ids = fileItems
                .map((fileItem) => {
                    if (fileItem.serverId) {
                        return fileItem.serverId
                    }
                    return null
                })
                .filter((id): id is string => id !== null)

            setTempFileIds(ids)

            // Update hidden input with temporary file IDs
            if (fileInputRef.current) {
                if (multiple) {
                    fileInputRef.current.value = JSON.stringify(ids)
                } else {
                    fileInputRef.current.value = ids[0] || ''
                }
            }

            // Call parent callback if provided
            if (onupdatefiles) {
                onupdatefiles(fileItems)
            }
        },
        [multiple, onupdatefiles]
    )

    const handleProcessFile = useCallback((error: any, file: any) => {
        if (error) {
            console.error('File processing error:', error)
            return
        }
        // The server response should contain the temporary file ID
        // FilePond will automatically set file.serverId with the response
        if (file.serverId) {
            const ids = multiple ? [...tempFileIds, file.serverId] : [file.serverId]
            setTempFileIds(ids)

            if (fileInputRef.current) {
                if (multiple) {
                    fileInputRef.current.value = JSON.stringify(ids)
                } else {
                    fileInputRef.current.value = ids[0] || ''
                }
            }
        }
    }, [multiple, tempFileIds])

    const handleRemoveFile = useCallback((error: any, file: any) => {
        if (error) {
            console.error('File removal error:', error)
            return
        }

        // Remove the file ID from the list
        const updatedIds = tempFileIds.filter((id) => id !== file.serverId)
        setTempFileIds(updatedIds)

        if (fileInputRef.current) {
            if (multiple) {
                fileInputRef.current.value = JSON.stringify(updatedIds)
            } else {
                fileInputRef.current.value = updatedIds[0] || ''
            }
        }
    }, [multiple, tempFileIds])

    // Get CSRF token from meta tag or cookie
    const getCsrfToken = () => {
        const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        if (metaToken) return metaToken

        // Fallback to XSRF-TOKEN cookie (Laravel default)
        const cookies = document.cookie.split(';')
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=')
            if (name === 'XSRF-TOKEN') {
                return decodeURIComponent(value)
            }
        }
        return ''
    }

    const defaultServer = {
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
                    return data.temp_id || data.id || response
                } catch {
                    return response
                }
            },
        },
        revert: (uniqueFileId: string, load: () => void, error: () => void) => {
            // Delete temporary file
            router.delete(`/api/temp-uploads/${uniqueFileId}`, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => load(),
                onError: () => error(),
            })
        },
    }

    return (
        <div className={cn('space-y-2', className)}>
            {label && (
                <Label htmlFor={name}>
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </Label>
            )}
            <FilePond
                files={files}
                onupdatefiles={handleUpdateFiles}
                onprocessfile={handleProcessFile}
                onremovefile={handleRemoveFile}
                allowMultiple={multiple}
                // maxFiles={maxFiles}
                // acceptedFileTypes={acceptedFileTypes}
                // maxFileSize={maxFileSize}
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
                                return data.temp_id || data.id || response
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
                    }
                }}
                name={name}
            // labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
            // labelFileProcessing='Uploading...'
            // labelFileProcessingComplete='Upload complete'
            // labelFileProcessingError='Error during upload'
            // labelFileProcessingAborted='Upload cancelled'
            // labelFileRemoveError='Error during remove'
            // labelTapToCancel='tap to cancel'
            // labelTapToRetry='tap to retry'
            // labelTapToUndo='tap to undo'
            // labelButtonRemoveItem='Remove'
            // labelButtonAbortItemLoad='Abort'
            // labelButtonRetryItemLoad='Retry'
            // labelButtonAbortItemProcessing='Cancel'
            // labelButtonUndoItemProcessing='Undo'
            // labelButtonProcessItem='Upload'
            // imagePreviewHeight={200}
            // imageCropAspectRatio={"1"}
            // imageResizeTargetWidth={1200}
            // imageResizeTargetHeight={1200}
            // imageResizeMode="contain"
            // stylePanelLayout="integrated"
            // styleButtonRemoveItemPosition="right"
            // styleButtonProcessItemPosition="right"
            />
            <input
                ref={fileInputRef}
                type="hidden"
                name={name}
                value={multiple ? JSON.stringify(tempFileIds) : tempFileIds[0] || ''}
            />
            {error && <InputError message={error} />}
        </div>
    )
}

