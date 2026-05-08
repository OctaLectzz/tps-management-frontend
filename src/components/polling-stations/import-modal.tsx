import { Button, Modal, Progress, useToast } from '@/components/ui'
import { useImportPollingStations } from '@/hooks/use-polling-stations'
import type { ImportResult } from '@/types'
import { CheckCircle, FileSpreadsheet, Upload, XCircle } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'

interface ImportModalProps {
  open: boolean
  onClose: () => void
}

const ImportModal: React.FC<ImportModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<ImportResult | null>(null)
  const importMutation = useImportPollingStations()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setResult(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1
  })

  const handleImport = async () => {
    if (!file) return
    try {
      const res = await importMutation.mutateAsync(file)
      setResult(res)
      toast({ type: 'success', title: t('pollingStations.importSuccess') })
    } catch {
      toast({ type: 'error', title: t('notifications.error'), message: t('notifications.unexpectedError') })
    }
  }

  const handleClose = () => {
    setFile(null)
    setResult(null)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('pollingStations.importTitle')} description={t('pollingStations.importDescription')} size="md">
      {!result ? (
        <div className="flex flex-col gap-4">
          {/* Drop zone */}
          <div
            {...getRootProps()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
              isDragActive
                ? 'border-[#1E40AF] bg-blue-50 dark:bg-blue-950'
                : 'border-(--color-border) hover:border-[#1E40AF] hover:bg-(--color-surface-hover)'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mb-3 h-10 w-10 text-(--color-text-muted)" />
            <p className="mb-1 text-sm font-medium text-(--color-text)">{t('pollingStations.importDragDrop')}</p>
            <p className="text-xs text-(--color-text-muted)">{t('pollingStations.importAccepted')}</p>
          </div>

          {/* Selected file */}
          {file && (
            <div className="flex items-center gap-3 rounded-lg border border-(--color-border) bg-(--color-surface-hover) p-3">
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-(--color-text)">{file.name}</p>
                <p className="text-xs text-(--color-text-muted)">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          )}

          {/* Progress during import */}
          {importMutation.isPending && <Progress value={60} label={t('pollingStations.importProgress')} color="primary" showPercent />}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleImport} disabled={!file} loading={importMutation.isPending}>
              {t('pollingStations.importConfirm')}
            </Button>
          </div>
        </div>
      ) : (
        /* Result summary */
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <h3 className="text-lg font-semibold text-(--color-text)">{t('pollingStations.importSuccess')}</h3>

          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-green-600">{result.imported}</span>
              <span className="text-xs text-(--color-text-muted)">Imported</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-amber-500">{result.skipped}</span>
              <span className="text-xs text-(--color-text-muted)">Skipped</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-red-500">{result.errors}</span>
              <span className="text-xs text-(--color-text-muted)">Errors</span>
            </div>
          </div>

          <Button onClick={handleClose} className="mt-2">
            {t('common.close')}
          </Button>
        </div>
      )}
    </Modal>
  )
}

// Suppress unused import
void XCircle

ImportModal.displayName = 'ImportModal'

export { ImportModal }
