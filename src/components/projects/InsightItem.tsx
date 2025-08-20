import { Insight } from '../../lib/types';
import { formatDateTime } from '../../lib/utils';
import { PinToggle } from './PinToggle';

interface InsightItemProps {
  insight: Insight;
  onPinToggle: (insightId: string, pinned: boolean) => void;
}

export function InsightItem({ insight, onPinToggle }: InsightItemProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs text-gray-500">
          {formatDateTime(insight.createdAt)}
        </span>
        <PinToggle
          pinned={insight.pinned}
          onToggle={(pinned) => onPinToggle(insight.id, pinned)}
        />
      </div>

      {insight.ideaDump && (insight.ideaDump.contentText || insight.ideaDump.transcript) && (
        <div className="mb-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
          <p className="italic">
            "{(insight.ideaDump.contentText || insight.ideaDump.transcript || '').slice(0, 150)}..."
          </p>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Summary</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {insight.shortSummary.map((item, idx) => (
              <li key={idx} className="flex">
                <span className="mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Recommendations</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {insight.recommendations.map((item, idx) => (
              <li key={idx} className="flex">
                <span className="mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {insight.suggestedTasks.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Suggested Tasks</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {insight.suggestedTasks.map((task, idx) => (
                <li key={idx} className="flex">
                  <span className="mr-2">→</span>
                  <span>{task.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}