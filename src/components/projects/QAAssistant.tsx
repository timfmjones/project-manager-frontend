import { useState } from 'react';
import { useQA } from '../../hooks/useQA';
import { QAChat } from './QAChat';
import { QAHistory } from './QAHistory';

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
      <div className="fixed bottom-6 right-6 z-40">
        {/* Pulsing ring animation */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 animate-ping opacity-20"></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 animate-ping animation-delay-200 opacity-15"></div>
        
        {/* Main button */}
        <button
          onClick={() => setIsOpen(true)}
          className="relative group bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-full shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Open Q&A Assistant"
        >
          {/* Sparkle effect on hover */}
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          
          {/* Icon with subtle animation */}
          <svg className="w-8 h-8 relative z-10 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} 
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          
          {/* Badge for message count */}
          {history.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[24px] h-6 px-1 flex items-center justify-center shadow-lg animate-bounce">
              {history.length}
            </span>
          )}
          
          {/* "NEW" label for first-time users */}
          {history.length === 0 && (
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
              NEW!
            </span>
          )}
        </button>
        
        {/* Tooltip on hover */}
        <div className="absolute bottom-full right-0 mb-3 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            <div className="font-semibold">AI Project Assistant ✨</div>
            <div className="text-xs text-gray-300 mt-1">Ask anything about your project</div>
            <div className="absolute bottom-0 right-8 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
          </div>
        </div>
        
        {/* Mobile-specific call-to-action text */}
        <div className="md:hidden absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1.5 rounded-full shadow-lg border-2 border-blue-600 animate-bounce">
          <span className="text-xs font-medium text-blue-600 whitespace-nowrap">Tap for AI help!</span>
        </div>
      </div>
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