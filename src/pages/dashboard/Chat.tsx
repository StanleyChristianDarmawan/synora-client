
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontal } from 'lucide-react';
import { ChatBubble } from '@/components/features/chat-bubble';
import { useAuthStore } from '@/stores/auth.store';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Hi! I'm Synora. How are you feeling today? I'm here to listen." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { token } = useAuthStore();
  const sessionIdRef = useRef<string>(`session-${Date.now()}`);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const assistantMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);

    try {
      const response = await fetch('http://localhost:8000/api/v1/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMsg.content,
          session_id: sessionIdRef.current
        })
      });

      setIsTyping(false);

      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        // The backend streams raw text tokens, not SSE formatted JSON yet.
        // Assuming raw text stream chunks from ChatService.
        setMessages((prev) => prev.map(msg => 
          msg.id === assistantMsgId ? { ...msg, content: msg.content + chunk } : msg
        ));
      }
    } catch (error) {
      console.error("Chat streaming error:", error);
      setIsTyping(false);
      setMessages((prev) => prev.map(msg => 
        msg.id === assistantMsgId ? { ...msg, content: "Sorry, I am having trouble connecting right now." } : msg
      ));
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-zinc-900">Synora AI Companion</h1>
        <p className="text-sm text-zinc-500">Your safe space for reflection.</p>
      </div>

      <Card className="flex-1 border-0 shadow-sm flex flex-col overflow-hidden bg-zinc-50/50">
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-2">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
          ))}
          
          {isTyping && (
            <div className="flex w-full space-x-4 mb-6 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center border border-teal-200 mt-1 animate-pulse">
                <div className="w-2 h-2 bg-teal-600 rounded-full" />
              </div>
              <div className="px-5 py-3 rounded-2xl bg-white border border-zinc-100 rounded-bl-none shadow-sm flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </CardContent>

        <div className="p-4 bg-white border-t border-zinc-100">
          <form onSubmit={handleSend} className="flex space-x-3 items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 rounded-full h-12 bg-zinc-50 focus-visible:ring-1 focus-visible:ring-teal-500 border-zinc-200"
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || isTyping} 
              className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-teal-600 hover:bg-teal-700"
            >
              <SendHorizontal className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
