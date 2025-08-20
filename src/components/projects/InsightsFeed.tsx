import { InsightItem } from './InsightItem';
import { Insight } from '../../lib/types';

interface InsightsFeedProps {
  insights: Insight[];
  onPinToggle: (insightId: string, pinned: boolean) => void;
}

export function InsightsFeed({ insights, onPinToggle }: InsightsFeedProps) {
  const pinnedInsights = insights.filter(i => i.pinned);
  const unpinnedInsights = insights.filter(i => !i.pinned);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Insights Feed</h2>
      
      {pinnedInsights.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-600">Pinned</h3>
          {pinnedInsights.map((insight) => (
            <InsightItem
              key={insight.id}
              insight={insight}
              onPinToggle={onPinToggle}
            />
          ))}
        </div>
      )}

      {unpinnedInsights.length > 0 && (
        <div className="space-y-3">
          {pinnedInsights.length > 0 && (
            <h3 className="text-sm font-medium text-gray-600">Recent</h3>
          )}
          {unpinnedInsights.map((insight) => (
            <InsightItem
              key={insight.id}
              insight={insight}
              onPinToggle={onPinToggle}
            />
          ))}
        </div>
      )}

      {insights.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No insights yet. Start recording your thoughts!
        </p>
      )}
    </div>
  );
}