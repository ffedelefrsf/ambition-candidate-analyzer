import { type PropsWithChildren } from 'react';

type TooltipProps = {
  children: React.ReactNode;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
};

export function Tooltip({
  children,
  text,
  position = 'top',
}: PropsWithChildren<TooltipProps>) {
  const tooltipPosition = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
  };

  const trianglePosition = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-800 dark:border-t-gray-300',
    bottom:
      'bottom-full left-1/2 -translate-x-1/2 border-b-gray-800 dark:border-b-gray-300',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-800 dark:border-l-gray-300',
    right:
      'right-full top-1/2 -translate-y-1/2 border-r-gray-800 dark:border-r-gray-300',
  };

  const triangleBorder = {
    top: 'border-x-8 border-t-8 border-x-transparent border-t-gray-800 dark:border-t-gray-300',
    bottom:
      'border-x-8 border-b-8 border-x-transparent border-b-gray-800 dark:border-b-gray-300',
    left: 'border-y-8 border-l-8 border-y-transparent border-l-gray-800 dark:border-l-gray-300',
    right:
      'border-y-8 border-r-8 border-y-transparent border-r-gray-800 dark:border-r-gray-300',
  };

  return (
    <div className="group relative inline-block">
      {children}
      <div
        className={`absolute z-20 rounded bg-gray-800 px-3 py-2 text-sm whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 dark:bg-gray-300 dark:text-black ${tooltipPosition[position]} `}
      >
        {text}
        <div
          className={`absolute h-0 w-0 ${triangleBorder[position]} ${trianglePosition[position]}`}
        />
      </div>
    </div>
  );
}
