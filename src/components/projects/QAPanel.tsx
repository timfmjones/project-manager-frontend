import { useState, useRef, useEffect } from 'react';
import { useQA } from '../../hooks/useQA';
import { formatDateTime } from '../../lib/utils';

interface QAPanelProps {
  projectId: string;
  projectName: string;
  onTasksCreated?: () => void;
}

export function QAPanel({ projectId, projectName, onTasksCreated }: QAPanelProps) {
  const [question, setQuestion] = useState('');
  const [includeExamples, setIncludeExamples] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    history,
    suggestions,
    asking,
    askQuestion,
    provideFeedback,
  } = useQA(projectId);

  const [messages, setMessages] = useState<Array<{ 
    type: 'question' | 'answer' | 'error'; 
    content: any;
    timestamp: Date;
  }>>([]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || asking) return;

    const userQuestion = question.trim();
    setQuestion('');
    
    // Add question to messages
    setMessages(prev => [...prev, { 
      type: 'question', 
      content: userQuestion,
      timestamp: new Date()
    }]);

    try {
      const response = await askQuestion(userQuestion, includeExamples);
      if (response) {
        setMessages(prev => [...prev, { 
          type: 'answer', 
          content: response,
          timestamp: new Date()
        }]);
        
        if (response.suggestedTasks && response.suggestedTasks.length > 0 && onTasksCreated) {
          onTasksCreated();
        }
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { 
        type: 'error', 
        content: err.message,
        timestamp: new Date()
      }]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuestion(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">AI Assistant</h3>
              <p className="text-xs text-blue-100">Ask about {projectName}</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title={showHistory ? "Show chat" : "Show history"}
          >
            {showHistory ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {showHistory ? (
          // History View
          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No previous questions yet.</p>
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-gray-900">{item.question}</p>
                    <span className="text-xs text-gray-500">{formatDateTime(item.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{item.answer}</p>
                  {item.helpful === null && (
                    <div className="flex items-center space-x-2 mt-2 pt-2 border-t">
                      <button
                        onClick={() => provideFeedback(item.id, true)}
                        className="text-xs text-gray-500 hover:text-green-600"
                      >
                        Helpful
                      </button>
                      <button
                        onClick={() => provideFeedback(item.id, false)}
                        className="text-xs text-gray-500 hover:text-red-600"
                      >
                        Not helpful
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          // Chat View
          <>
            {messages.length === 0 ? (
              <div className="text-center py-6">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm text-gray-600 mb-4">
                  I can help you understand your project and suggest next steps
                </p>
                {suggestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-medium">Try asking:</p>
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left p-2 bg-white hover:bg-blue-50 rounded-lg text-sm text-gray-700 transition-colors border border-gray-200"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {messages.map((message, idx) => (
                  <div key={idx} className={`mb-4 ${message.type === 'question' ? 'flex justify-end' : ''}`}>
                    {message.type === 'question' ? (
                      <div className="max-w-[70%] bg-blue-600 text-white p-3 rounded-2xl rounded-br-sm">
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs text-blue-200 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    ) : message.type === 'error' ? (
                      <div className="max-w-[70%] bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
                        <p className="text-sm">{message.content}</p>
                      </div>
                    ) : (
                      <div className="max-w-[85%] space-y-2">
                        <div className="bg-white p-3 rounded-2xl rounded-bl-sm shadow-sm">
                          <p className="text-sm text-gray-800 whitespace-pre-wrap">{message.content.answer}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        
                        {message.content.examples && message.content.examples.length > 0 && (
                          <div className="bg-indigo-50 p-2 rounded-lg ml-2 text-xs">
                            <p className="font-medium text-indigo-700 mb-1">Examples:</p>
                            {message.content.examples.map((example: string, i: number) => (
                              <p key={i} className="text-gray-700">• {example}</p>
                            ))}
                          </div>
                        )}
                        
                        {message.content.suggestedTasks && message.content.suggestedTasks.length > 0 && (
                          <div className="bg-green-50 p-2 rounded-lg ml-2 text-xs">
                            <p className="font-medium text-green-700">✅ Tasks created</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                {asking && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-white p-3 rounded-2xl rounded-bl-sm shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-3">
        <div className="flex items-center mb-2">
          <label className="flex items-center cursor-pointer text-xs text-gray-600">
            <input
              type="checkbox"
              checked={includeExamples}
              onChange={(e) => setIncludeExamples(e.target.checked)}
              className="mr-2"
            />
            Include real-world examples
          </label>
        </div>
        
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <textarea
            ref={inputRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about tasks, progress, or get suggestions..."
            className="flex-1 p-2 border border-gray-300 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
            disabled={asking || showHistory}
            style={{ minHeight: '38px' }}
          />
          <button
            type="submit"
            disabled={!question.trim() || asking || showHistory}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {asking ? (
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}