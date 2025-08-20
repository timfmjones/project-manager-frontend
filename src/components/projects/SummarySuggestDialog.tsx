interface SummarySuggestDialogProps {
  suggestedSummary: string;
  onAccept: () => void;
  onReject: () => void;
}

export function SummarySuggestDialog({ suggestedSummary, onAccept, onReject }: SummarySuggestDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-3">AI Suggested Summary</h3>
        <div className="bg-gray-50 p-3 rounded mb-4">
          <p className="text-sm">{suggestedSummary}</p>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Would you like to update your project summary with this AI suggestion?
        </p>
        <div className="flex justify-end space-x-2">
          <button onClick={onReject} className="btn-secondary">
            Keep Current
          </button>
          <button onClick={onAccept} className="btn-primary">
            Apply Suggestion
          </button>
        </div>
      </div>
    </div>
  );
}