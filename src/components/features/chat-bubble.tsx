import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { User, Sparkles } from 'lucide-react';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={cn("flex w-full space-x-4 mb-6", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center border border-teal-200 dark:border-teal-800 mt-1">
          <Sparkles className="w-4 h-4 text-teal-700 dark:text-teal-400" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[75%] px-5 py-3 rounded-2xl text-sm leading-relaxed",
        isUser 
          ? "bg-teal-600 dark:bg-teal-700 text-white rounded-br-none shadow-sm" 
          : "bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-bl-none shadow-sm"
      )}>
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center border border-zinc-300 dark:border-zinc-700 mt-1">
          <User className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        </div>
      )}
    </div>
  );
}
