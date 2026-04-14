import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Loader2, Trash2, Copy, RefreshCw, Mic, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { auth, db } from '@/src/lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc, getDocs, doc } from 'firebase/firestore';
import { generateSwarmResponse } from '@/src/lib/swarm';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: any;
}

export function AjikeChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userEmail = auth.currentUser?.email || 'anonymous';
  const userPhoto = auth.currentUser?.photoURL;
  const userName = auth.currentUser?.displayName || 'User';

  useEffect(() => {
    if (!userEmail) return;

    const q = query(
      collection(db, `users/${userEmail}/chat_history`),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [userEmail]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToProcess: string = input) => {
    if (!textToProcess.trim() || !userEmail) return;

    const userMessage = textToProcess.trim();
    setInput('');
    setIsLoading(true);

    try {
      // Save user message
      await addDoc(collection(db, `users/${userEmail}/chat_history`), {
        role: 'user',
        content: userMessage,
        timestamp: serverTimestamp()
      });

      // Generate AI response via Swarm
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      let responseText = "";
      await generateSwarmResponse(userMessage, history, (chunk) => { responseText += chunk; });

      // Save AI response
      await addDoc(collection(db, `users/${userEmail}/chat_history`), {
        role: 'model',
        content: responseText,
        timestamp: serverTimestamp()
      });

    } catch (error) {
      console.error("Chat error:", error);
      await addDoc(collection(db, `users/${userEmail}/chat_history`), {
        role: 'model',
        content: "I encountered a neural disruption while processing your request. Please try again.",
        timestamp: serverTimestamp()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (!userEmail) return;
    try {
      const q = query(collection(db, `users/${userEmail}/chat_history`));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (!userEmail) return;
    try {
      await deleteDoc(doc(db, `users/${userEmail}/chat_history`, msgId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleRetry = (content: string) => {
    handleSend(content);
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
            <Bot className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">AJIKE Terminal</h3>
            <p className="text-[10px] text-indigo-400 uppercase tracking-widest">Swarm Link Active</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClearChat}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 text-xs"
        >
          <Trash2 className="w-3 h-3 mr-2" /> Clear History
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
            <Bot className="w-12 h-12 text-white" />
            <p className="text-sm text-white">I am AJIKE. Connected to the Swarm. How may I assist you?</p>
          </div>
        )}
        
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 group ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden ${
                  isUser 
                    ? 'bg-orange-500/20 border border-orange-500/50' 
                    : 'bg-indigo-500/20 border border-indigo-500/50'
                }`}>
                  {isUser ? (
                    userPhoto ? <img src={userPhoto} alt="User" className="w-full h-full object-cover" /> : <User className="w-4 h-4 text-orange-400" />
                  ) : (
                    <Bot className="w-4 h-4 text-indigo-400" />
                  )}
                </div>
                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
                  <div className="flex items-center gap-2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-white/40">{isUser ? userName : 'AJIKE'}</span>
                    <span className="text-[10px] text-white/30">{formatTime(msg.timestamp)}</span>
                  </div>
                  <div className={`rounded-2xl p-4 text-sm relative ${
                    isUser
                      ? 'bg-orange-500/10 border border-orange-500/20 text-orange-50'
                      : 'bg-white/5 border border-white/10 text-white/90'
                  }`}>
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                    
                    {/* Action Icons */}
                    <div className={`absolute -bottom-8 ${isUser ? 'right-0' : 'left-0'} flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md rounded-lg border border-white/10 p-1`}>
                      <button onClick={() => handleCopy(msg.content)} className="p-1.5 hover:bg-white/10 rounded-md text-white/50 hover:text-white transition-colors" title="Copy">
                        <Copy className="w-3 h-3" />
                      </button>
                      {isUser && (
                        <button onClick={() => handleRetry(msg.content)} className="p-1.5 hover:bg-white/10 rounded-md text-white/50 hover:text-white transition-colors" title="Retry">
                          <RefreshCw className="w-3 h-3" />
                        </button>
                      )}
                      <button onClick={() => handleDeleteMessage(msg.id)} className="p-1.5 hover:bg-red-500/20 rounded-md text-white/50 hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span className="text-xs text-white/50">AJIKE is processing via Swarm...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} className="h-8" />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="relative flex items-end gap-2">
          <div className="flex flex-col gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-white/50 hover:text-white hover:bg-white/10 rounded-xl">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 text-white/50 hover:text-white hover:bg-white/10 rounded-xl">
              <Mic className="w-5 h-5" />
            </Button>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Transmit message to AJIKE Swarm..."
            className="min-h-[88px] max-h-[200px] bg-white/5 border-white/10 text-sm resize-none focus:border-indigo-500/50 rounded-xl"
          />
          <Button 
            onClick={() => handleSend()} 
            disabled={!input.trim() || isLoading}
            className="h-[88px] px-6 bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 rounded-xl"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
        <div className="text-[10px] text-white/30 text-center mt-3 uppercase tracking-widest">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
