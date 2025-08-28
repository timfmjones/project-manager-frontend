import { useState } from 'react';
import { Project } from '../../lib/types';

interface DashboardQAProps {
  projects: Project[];
}

export function DashboardQA({ projects }: DashboardQAProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggestions = [
    "What should I focus on today?",
    "Which project needs the most attention?",
    "How can I improve my productivity?",
    "What are my priorities this week?",
    "Show me my overall progress"
  ];

  const handleAskQuestion = async (q?: string) => {
    const queryText = q || question;
    if (!queryText.trim() || loading) return;

    setLoading(true);
    setError(null);
    setAnswer(null);

    try {
      // For dashboard-level questions, we'll analyze across all projects
      // Since the backend Q&A is project-specific, we provide intelligent responses based on available data
      
      if (projects.length === 0) {
        setAnswer({
          answer: "I notice you don't have any projects yet! Here's how to get started:\n\n1. Click the 'Create Project' button to start your first project\n2. Give it a meaningful name that reflects your goal\n3. Start adding tasks and milestones to track your progress\n4. Use the voice or text input to capture your ideas\n\nOnce you have projects, I can help you analyze progress, suggest priorities, and share best practices from successful teams.",
          suggestions: [
            "How do I create my first project?",
            "What makes a good project structure?",
            "Best practices for task management"
          ]
        });
      } else {
        // For demonstration, provide intelligent responses based on project data
        const mockResponse = getMockDashboardResponse(queryText, projects);
        setAnswer(mockResponse);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to get answer');
    } finally {
      setLoading(false);
      if (q) setQuestion(''); // Clear if it was a suggestion click
    }
  };

  const getMockDashboardResponse = (query: string, projects: Project[]) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('focus') || lowerQuery.includes('today')) {
      const recentProject = projects.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0];
      
      return {
        answer: `Based on your recent activity, focus on "${recentProject.name}" today. This project was last updated ${new Date(recentProject.updatedAt).toLocaleDateString()}.\n\nRecommended actions:\n• Review and update your task list\n• Check upcoming milestones\n• Record any new ideas or progress\n• Complete at least 2-3 tasks to maintain momentum`,
        suggestions: [
          `What's the status of ${recentProject.name}?`,
          "What tasks should I prioritize?",
          "How can I improve my workflow?"
        ]
      };
    } else if (lowerQuery.includes('progress')) {
      return {
        answer: `You have ${projects.length} active project${projects.length !== 1 ? 's' : ''}. Here's your overview:\n\n${projects.slice(0, 3).map(p => 
          `• ${p.name}: ${p.summaryBanner || 'Getting started'}`
        ).join('\n')}\n\nTo track detailed progress:\n1. Visit each project to see task completion rates\n2. Review your milestones for upcoming deadlines\n3. Check insights from your idea recordings`,
        suggestions: [
          "Which project needs attention?",
          "How do I set better milestones?",
          "Tips for staying on track"
        ]
      };
    } else if (lowerQuery.includes('priorit')) {
      return {
        answer: `Here's how to prioritize across your ${projects.length} project${projects.length !== 1 ? 's' : ''}:\n\n1. **Urgency Check**: Review each project's milestones for upcoming deadlines\n2. **Recent Activity**: Projects not updated recently may need attention\n3. **Task Status**: Focus on projects with many "In Progress" tasks\n4. **Weekly Goals**: Set 2-3 key objectives per project\n\nPro tip: Use the Eisenhower Matrix - focus on important AND urgent tasks first.`,
        suggestions: [
          "Show me overdue tasks",
          "How to handle multiple projects",
          "Time management strategies"
        ]
      };
    } else {
      return {
        answer: `I can help you manage your ${projects.length} project${projects.length !== 1 ? 's' : ''} more effectively. Here are some ways I can assist:\n\n• Analyze project progress and suggest priorities\n• Share productivity tips and best practices\n• Help you plan your daily and weekly goals\n• Provide insights on project management strategies\n\nTry asking me about specific projects or what you should focus on today!`,
        suggestions: [
          "What should I work on today?",
          "How can I be more productive?",
          "Best practices for project management"
        ]
      };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAskQuestion();
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg overflow-hidden mb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI Project Assistant</h2>
            <p className="text-blue-100 text-sm">Ask me anything about your projects</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Answer Display */}
        {answer && (
          <div className="mb-4 bg-white rounded-lg p-4 shadow-sm">
            <p className="text-gray-800 whitespace-pre-wrap text-sm">{answer.answer}</p>
            
            {answer.suggestions && answer.suggestions.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500 font-medium mb-2">Follow-up questions:</p>
                <div className="space-y-1">
                  {answer.suggestions.map((sug: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuestion(sug);
                        handleAskQuestion(sug);
                      }}
                      className="block w-full text-left text-xs px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Suggestions (when no answer) */}
        {!answer && !loading && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">Try asking:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuestion(suggestion);
                    handleAskQuestion(suggestion);
                  }}
                  className="text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-all hover:shadow-md border border-gray-100"
                >
                  <span className="flex items-center justify-between">
                    <span>{suggestion}</span>
                    <svg className="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-4 flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about your projects, productivity, or next steps..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!question.trim() || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
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

        {/* Tips */}
        <div className="mt-4 flex items-start space-x-2 text-xs text-gray-500">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>
            {projects.length === 0 
              ? "Create your first project to unlock personalized AI insights and task recommendations."
              : "I can analyze your projects, suggest priorities, and share productivity tips from successful teams."
            }
          </p>
        </div>
      </div>
    </div>
  );
}