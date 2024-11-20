export function Toast({ title, description, variant = 'success', onClose }) {
    return (
      <div
        className={`fixed bottom-5 right-5 w-80 p-4 rounded-lg shadow-lg ${
          variant === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}
      >
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-bold">{title}</h4>
            <p>{description}</p>
          </div>
          <button onClick={onClose} className="ml-4">
            ✖
          </button>
        </div>
      </div>
    )
  }
  