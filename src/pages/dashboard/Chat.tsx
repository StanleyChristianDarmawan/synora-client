import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontal, Plus, MessageSquare, Trash2, Edit2, Loader2, Check, X } from 'lucide-react';
import { ChatBubble } from '@/components/features/chat-bubble';
import { useAuthStore } from '@/stores/auth.store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatService } from '@/services/chat.service';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const skipNextFetchRef = useRef(false);

  const { data: sessions, isLoading: loadingSessions } = useQuery({
    queryKey: ['chatSessions'],
    queryFn: ChatService.getSessions,
    refetchInterval: (query) => {
      const data = query.state.data as any[];
      if (data && data.length > 0 && data[0].title === "New Chat") {
        return 3000;
      }
      return false;
    }
  });

  useEffect(() => {
    if (activeSessionId) {
      if (skipNextFetchRef.current) {
        skipNextFetchRef.current = false;
        return;
      }
      ChatService.getHistory(activeSessionId).then(history => {
        const formatted = history.map((h: any) => ({
          id: h.id,
          role: h.role,
          content: h.message
        }));
        setMessages(formatted);
      }).catch(err => console.error(err));
    } else {
      setMessages([
        { id: 'welcome', role: 'assistant', content: "Hi! I'm Synora. How are you feeling today? I'm here to listen." }
      ]);
    }
  }, [activeSessionId]);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const startNewChat = () => {
    setActiveSessionId(null);
    setEditingSessionId(null);
  };

  const deleteMutation = useMutation({
    mutationFn: ChatService.deleteSession,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['chatSessions'] });
      if (activeSessionId === deletedId) {
        startNewChat();
      }
    }
  });

  const renameMutation = useMutation({
    mutationFn: ({ id, title }: { id: string, title: string }) => ChatService.updateSession(id, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatSessions'] });
      setEditingSessionId(null);
    }
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    let currentSessionId = activeSessionId;
    let isBrandNewSession = false;

    if (!currentSessionId) {
      currentSessionId = crypto.randomUUID();
      skipNextFetchRef.current = true;
      setActiveSessionId(currentSessionId);
      isBrandNewSession = true;
    }

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const assistantMsgId = (Date.now() + 1).toString();
    let firstChunk = true;

    try {
      const response = await fetch('http://localhost:8000/api/v1/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMsg.content,
          session_id: currentSessionId
        })
      });

      if (isBrandNewSession) {
        queryClient.invalidateQueries({ queryKey: ['chatSessions'] });
      }

      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const raw = decoder.decode(value, { stream: true });
        const chunk = raw.replace(/\n\n$/, '');
        if (!chunk) continue;

        if (firstChunk) {
          setIsTyping(false);
          setMessages((prev) => [...prev, { id: assistantMsgId, role: 'assistant', content: chunk }]);
          firstChunk = false;
        } else {
          setMessages((prev) => prev.map(msg =>
            msg.id === assistantMsgId ? { ...msg, content: msg.content + chunk } : msg
          ));
        }
      }

      if (firstChunk) {
        setIsTyping(false);
      }
    } catch (error) {
      console.error("Chat streaming error:", error);
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: assistantMsgId, role: 'assistant', content: "Sorry, I am having trouble connecting right now." }]);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row">

      <div className="w-full md:w-72 flex-shrink-0 flex flex-col bg-white border-r border-zinc-100 overflow-hidden h-full">
        <div className="p-4 border-b border-zinc-100">
          <Button
            onClick={startNewChat}
            className="w-full flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-12"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">New Chat</span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {loadingSessions ? (
            <div className="flex justify-center p-4 text-zinc-400">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : sessions?.length === 0 ? (
            <div className="text-center p-4 text-sm text-zinc-400 italic">No previous chats.</div>
          ) : (
            sessions?.map((session: any) => (
              <div
                key={session.id}
                className={`group relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${activeSessionId === session.id ? 'bg-teal-50' : 'hover:bg-zinc-50'
                  }`}
                onClick={() => {
                  if (editingSessionId !== session.id) {
                    setActiveSessionId(session.id);
                  }
                }}
              >
                <div className="flex items-center space-x-3 overflow-hidden flex-1">
                  <MessageSquare className={`w-4 h-4 flex-shrink-0 ${activeSessionId === session.id ? 'text-teal-600' : 'text-zinc-400'}`} />

                  {editingSessionId === session.id ? (
                    <div className="flex items-center w-full space-x-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 text-sm bg-white border border-teal-200 rounded px-2 py-1 outline-none"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') renameMutation.mutate({ id: session.id, title: editTitle });
                          if (e.key === 'Escape') setEditingSessionId(null);
                        }}
                      />
                      <button onClick={() => renameMutation.mutate({ id: session.id, title: editTitle })} className="text-teal-600 p-1">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingSessionId(null)} className="text-zinc-400 p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className={`text-sm truncate font-medium ${activeSessionId === session.id ? 'text-teal-900' : 'text-zinc-700'}`}>
                      {session.title}
                    </span>
                  )}
                </div>

                {editingSessionId !== session.id && (
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                    <button
                      className="p-1.5 text-zinc-400 hover:text-teal-600 rounded-md hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditTitle(session.title);
                        setEditingSessionId(session.id);
                      }}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-md hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this chat?')) {
                          deleteMutation.mutate(session.id);
                        }
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full bg-[#FAFAFA] overflow-hidden">
        <div className="px-6 py-3 border-b border-zinc-100 bg-white">
          <h1 className="text-base font-bold text-zinc-900">Synora AI</h1>
          <p className="text-xs text-zinc-400">Your safe space for reflection.</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
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
        </div>

        <div className="px-6 py-3 bg-white border-t border-zinc-100">
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
      </div>
    </div>
  );
}
