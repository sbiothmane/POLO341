import { Button } from './button'


export function Dialog({ isOpen, onClose, onConfirm, title, description }) {
    if (!isOpen) return null
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-gray-600 mt-2">{description}</p>
          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </div>
      </div>
    )
  }
  