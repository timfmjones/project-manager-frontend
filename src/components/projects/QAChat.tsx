import { useState, useRef, useEffect } from 'react';

interface QAChatProps {
  suggestions: string[];
  asking: boolean;
  onAskQuestion: (question: string, includeExamples: boolean) => Promise<any>;
  currentAnswer: any;
  projectName: string;
}

export function QAChat({
  suggestions,
  asking,
  onAskQuestion,
  currentAnswer,
  projectName,
}: QAChatProps) {
  const [question, setQuestion] = useState('');
  const [includeExamples, setIncludeExamples] = useState(true);
  const [messages, setMessages] = useState<Array<{ type: 'question' | 'answer' | 'error'; content: any }>>([]);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
    setError(null);
    
    // Add question to messages
    setMessages(prev => [...prev, { type: 'question', content: userQuestion }]);

    try {
      const response = await onAskQuestion(userQuestion, includeExamples);
      if (response) {
        setMessages(prev => [...prev, { type: 'answer', content: response }]);
      }
    } catch (err: any) {
      setError(err.message);
      setMessages(prev => [...prev, { type: 'error', content: err.message }]);
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
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="mb-6">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h4 className="text-lg font-medium text-gray-700 mb-2">
                Hi! I'm your AI project assistant 
              </h4>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                I can help you understand your project progress, suggest next steps, and share best practices from successful teams.
              </p>
            </div>

            {/* Suggestion Cards */}
            {suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Try asking:</p>
                <div className="space-y-2">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left p-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg text-sm text-gray-700 transition-all hover:shadow-md group"
                    >
                      <span className="flex items-center justify-between">
                        <span>{suggestion}</span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {messages.map((message, idx) => (
              <div key={idx} className={`${message.type === 'question' ? 'flex justify-end' : ''}`}>
                {message.type === 'question' ? (
                  <div className="max-w-[80%] bg-blue-600 text-white p-3 rounded-2xl rounded-br-sm shadow-md">
                    <p className="text-sm">{message.content}</p>
                  </div>
                ) : message.type === 'error' ? (
                  <div className="max-w-[80%] bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
                    <p className="text-sm">{message.content}</p>
                  </div>
                ) : (
                  <div className="max-w-[90%] space-y-3">
                    <div className="bg-gray-50 p-4 rounded-2xl rounded-bl-sm shadow-sm">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{message.content.answer}</p>
                    </div>
                    
                    {message.content.examples && message.content.examples.length > 0 && (
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg ml-2">
                        <p className="text-xs font-medium text-indigo-700 mb-2">💡 Real-world examples:</p>
                        <ul className="space-y-1">
                          {message.content.examples.map((example: string, i: number) => (
                            <li key={i} className="text-xs text-gray-700 flex">
                              <span className="mr-2">•</span>
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {message.content.suggestedTasks && message.content.suggestedTasks.length > 0 && (
                      <div className="bg-green-50 p-3 rounded-lg ml-2">
                        <p className="text-xs font-medium text-green-700 mb-2">✅ Tasks created:</p>
                        <ul className="space-y-1">
                          {message.content.suggestedTasks.map((task: any, i: number) => (
                            <li key={i} className="text-xs text-gray-700">
                              <span className="font-medium">{task.title}</span>
                              {task.description && (
                                <span className="text-gray-500 ml-1">- {task.description}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {message.content.suggestions && message.content.suggestions.length > 0 && (
                      <div className="ml-2 space-y-1">
                        <p className="text-xs text-gray-500 font-medium">Follow-up questions:</p>
                        {message.content.suggestions.map((sug: string, i: number) => (
                          <button
                            key={i}
                            onClick={() => handleSuggestionClick(sug)}
                            className="block w-full text-left text-xs p-2 bg-white hover:bg-gray-50 rounded-lg text-gray-700 transition-colors border border-gray-200"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {asking && (
              <div className="flex justify-start">
                <div className="bg-gray-50 p-4 rounded-2xl rounded-bl-sm shadow-sm">
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
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center space-x-2 text-xs">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeExamples}
                onChange={(e) => setIncludeExamples(e.target.checked)}
                className="mr-2"
              />
              <span className="text-gray-600">Include real-world examples</span>
            </label>
          </div>
          
          <div className="flex space-x-2">
            <textarea
              ref={inputRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your project..."
              className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows={2}
              disabled={asking}
            />
            <button
              type="submit"
              disabled={!question.trim() || asking}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
          </div>
        </form>
      </div>
    </div>
  );
}