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
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center border border-teal-200 mt-1">
          <Sparkles className="w-4 h-4 text-teal-700" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[75%] px-5 py-3 rounded-2xl text-sm leading-relaxed",
        isUser 
          ? "bg-teal-600 text-white rounded-br-none shadow-sm" 
          : "bg-white border border-zinc-100 text-zinc-800 rounded-bl-none shadow-sm"
      )}>
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose prose-sm prose-zinc max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center border border-zinc-300 mt-1">
          <User className="w-4 h-4 text-zinc-600" />
        </div>
      )}
    </div>
  );
}
