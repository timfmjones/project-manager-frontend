import { QAQuestion } from '../../lib/types';
import { formatDateTime } from '../../lib/utils';

interface QAHistoryProps {
  history: QAQuestion[];
  loading: boolean;
  onProvideFeedback: (questionId: string, helpful: boolean) => void;
}

export function QAHistory({ history, loading, onProvideFeedback }: QAHistoryProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-gray-500 text-sm">Loading history...</div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p className="text-gray-500 text-sm text-center">
          No questions asked yet.<br />
          Start a conversation to see your history here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      <div className="p-4 space-y-4">
        {history.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4">
              {/* Question */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {item.question}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDateTime(item.createdAt)}
                  </p>
                </div>
                {item.helpful !== null && (
                  <div className="ml-2">
                    {item.helpful ? (
                      <span className="inline-flex items-center text-xs text-green-600">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        Helpful
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                        </svg>
                        Not helpful
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Answer */}
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {item.answer}
                </p>
              </div>

              {/* Examples */}
              {item.examples && item.examples.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">Examples:</p>
                  <ul className="space-y-1">
                    {item.examples.slice(0, 2).map((example, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex">
                        <span className="mr-2">•</span>
                        <span className="line-clamp-1">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Feedback */}
              {item.helpful === null && (
                <div className="flex items-center space-x-2 pt-3 border-t">
                  <p className="text-xs text-gray-500">Was this helpful?</p>
                  <button
                    onClick={() => onProvideFeedback(item.id, true)}
                    className="p-1 hover:bg-green-50 rounded text-gray-500 hover:text-green-600 transition-colors"
                    title="Yes, helpful"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onProvideFeedback(item.id, false)}
                    className="p-1 hover:bg-red-50 rounded text-gray-500 hover:text-red-600 transition-colors"
                    title="Not helpful"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}