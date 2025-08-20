interface PinToggleProps {
  pinned: boolean;
  onToggle: (pinned: boolean) => void;
}

export function PinToggle({ pinned, onToggle }: PinToggleProps) {
  return (
    <button
      onClick={() => onToggle(!pinned)}
      className="p-1 hover:bg-gray-100 rounded"
      title={pinned ? 'Unpin' : 'Pin'}
    >
      <svg
        className={`w-5 h-5 ${pinned ? 'text-blue-600 fill-current' : 'text-gray-400'}`}
        fill={pinned ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    </button>
  );
}