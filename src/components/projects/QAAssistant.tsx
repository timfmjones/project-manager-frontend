import { useState } from 'react';
import { useQA } from '../../hooks/useQA';
import { QAChat } from './QAChat';
import { QAHistory } from './QAHistory';
import { formatDateTime } from '../../lib/utils';

interface QAAssistantProps {
  projectId: string;
  projectName: string;
  onTasksCreated?: () => void;
}

export function QAAssistant({ projectId, projectName, onTasksCreated }: QAAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'history'>('chat');
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  
  const {
    history,
    suggestions,
    loading,
    asking,
    askQuestion,
    provideFeedback,
  } = useQA(projectId);

  const handleAskQuestion = async (question: string, includeExamples: boolean = true) => {
    const response = await askQuestion(question, includeExamples);
    if (response) {
      setCurrentAnswer(response);
      if (response.suggestedTasks && response.suggestedTasks.length > 0 && onTasksCreated) {
        onTasksCreated();
      }
    }
    return response;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 z-40"
        aria-label="Open Q&A Assistant"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {history.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {history.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Q&A Panel */}
      <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-[450px] h-[90vh] md:h-[600px] bg-white rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col z-50 transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl md:rounded-t-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-lg font-semibold">Project Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-blue-100">Ask me anything about {projectName}</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b bg-gray-50">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'chat'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chat
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History ({history.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'chat' ? (
            <QAChat
              suggestions={suggestions}
              asking={asking}
              onAskQuestion={handleAskQuestion}
              currentAnswer={currentAnswer}
              projectName={projectName}
            />
          ) : (
            <QAHistory
              history={history}
              loading={loading}
              onProvideFeedback={provideFeedback}
            />
          )}
        </div>
      </div>
    </>
  );
}