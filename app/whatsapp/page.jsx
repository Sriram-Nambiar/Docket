"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MoreVertical, Phone, Video, Smile, Mic, Paperclip, CheckCheck, Bot } from "lucide-react";

const initialMessages = [
  {
    id: "msg-init-1",
    text: "👋 Welcome to Docket Compliance Bot\n\nI'm your AI-powered compliance assistant. I'll send you automated alerts before every statutory deadline.\n\n🔔 Active Alerts: 5 obligations in next 30 days\n📊 Compliance Score: 78% (High Readiness)",
    timestamp: "9:00 AM",
    from: "bot",
    status: "delivered",
  },
  {
    id: "msg-init-2",
    text: "⚙️ Alert cadence configured:\n• 30 days before deadline\n• 15 days before deadline  \n• 7 days before deadline\n• 1 day before deadline (URGENT)\n\nYou'll receive alerts for: GSTR-3B, EPF ECR, DIR-3 KYC, Form AOC-4, Board Meeting Minutes",
    timestamp: "9:01 AM",
    from: "bot",
    status: "delivered",
  },
];

// A short "ding" sound encoded in base64
const notificationSound = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU..."; 

export default function WhatsAppClonePage() {
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [seenIds, setSeenIds] = useState(new Set(initialMessages.map((m) => m.id)));
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const playDing = () => {
      try {
        // Fallback to a simple oscillator if data URI is truncated or invalid
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } catch (e) {
        console.log("Audio play error", e);
      }
    };

    const pollMessages = async () => {
      try {
        const res = await fetch("/api/whatsapp/messages");
        if (!res.ok) return;
        const data = await res.json();
        const newMessages = data.messages || [];

        const unseen = newMessages.filter((m) => !seenIds.has(m.id));

        if (unseen.length > 0) {
          // New messages found! Show typing indicator first
          setIsTyping(true);
          
          setTimeout(() => {
            setIsTyping(false);
            setMessages((prev) => [...prev, ...unseen]);
            
            // Update seen IDs
            setSeenIds((prev) => {
              const newSeen = new Set(prev);
              unseen.forEach((m) => newSeen.add(m.id));
              return newSeen;
            });
            
            playDing();
          }, 1500);
        }
      } catch (error) {
        console.error("Error polling messages:", error);
      }
    };

    const intervalId = setInterval(pollMessages, 1500);
    return () => clearInterval(intervalId);
  }, [seenIds]);

  return (
    <div className="flex min-h-screen w-full bg-[#111a21] text-[#d1d7db] font-sans selection:bg-[#00a884] selection:text-white">
      {/* Absolute badge */}
      <div className="absolute top-4 right-4 z-50 bg-[#005c4b] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg border border-[#00a884]/30 flex items-center gap-2">
        <Bot size={14} />
        Docket Demo — WhatsApp Simulation
      </div>

      {/* LEFT SIDEBAR - 30% width */}
      <div className="w-[30%] min-w-[300px] border-r border-[#222d34] flex flex-col bg-[#111a21]">
        {/* Header */}
        <div className="h-[60px] bg-[#202c33] flex items-center justify-between px-4 py-2 shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#6b7c85] flex items-center justify-center text-white font-medium text-sm">
            AS
          </div>
          <div className="flex items-center gap-4 text-[#aebac1]">
            <Search size={20} className="cursor-pointer" />
            <MoreVertical size={20} className="cursor-pointer" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-2 border-b border-[#222d34] bg-[#111a21]">
          <div className="bg-[#202c33] rounded-lg flex items-center px-3 py-1.5 h-[35px]">
            <Search size={18} className="text-[#8696a0] mr-4" />
            <input
              type="text"
              placeholder="Search or start new chat"
              className="bg-transparent border-none outline-none text-sm w-full text-[#d1d7db] placeholder-[#8696a0]"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {/* Active Chat */}
          <div className="flex items-center gap-3 px-3 py-3 bg-[#2a3942] cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-[#00a884] flex items-center justify-center text-white">
                <Bot size={24} />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00a884] border-2 border-[#2a3942] rounded-full"></div>
            </div>
            <div className="flex-1 border-b border-transparent pb-1">
              <div className="flex justify-between items-baseline">
                <h3 className="text-[#e9edef] font-normal text-[17px]">Docket Compliance Bot</h3>
                <span className="text-[#00a884] text-xs">9:01 AM</span>
              </div>
              <div className="flex justify-between items-center mt-0.5">
                <p className="text-[#8696a0] text-sm truncate pr-2">Tap to see compliance alerts</p>
                <div className="w-5 h-5 bg-[#00a884] rounded-full flex items-center justify-center text-[#111a21] text-xs font-semibold">
                  1
                </div>
              </div>
            </div>
          </div>

          {/* Other Chats */}
          {[
            { name: "CA K.R. Mehta", preview: "Tax audit report ready", time: "Yesterday" },
            { name: "CS Priyanka Nair", preview: "MGT-7 form shared", time: "Yesterday" },
            { name: "Sanjay Sharma", preview: "KYC docs submitted", time: "Tuesday" },
            { name: "Tax Department Group", preview: "GSTR-3B challan attached", time: "Monday" },
          ].map((chat, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-3 hover:bg-[#202c33] cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center text-white overflow-hidden">
                <span className="opacity-50 font-bold">{chat.name.charAt(0)}</span>
              </div>
              <div className="flex-1 border-b border-[#222d34] pb-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[#e9edef] font-normal text-[17px]">{chat.name}</h3>
                  <span className="text-[#8696a0] text-xs">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center mt-0.5">
                  <p className="text-[#8696a0] text-sm truncate">{chat.preview}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT CHAT AREA - 70% width */}
      <div className="flex-1 flex flex-col bg-[#0b141a] relative">
        
        {/* Chat Background Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none z-0"
          style={{
            backgroundImage: "url('https://static.whatsapp.net/rsrc.php/v3/yl/r/r_QZ3s-iN-T.png')",
            backgroundRepeat: "repeat"
          }}
        />

        {/* Chat Header */}
        <div className="h-[60px] bg-[#202c33] flex items-center justify-between px-4 py-2 shrink-0 z-10">
          <div className="flex items-center gap-4 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-white">
              <Bot size={22} />
            </div>
            <div>
              <h2 className="text-[#e9edef] font-normal text-base leading-5">Docket Compliance Bot</h2>
              <p className="text-[#8696a0] text-[13px]">online</p>
            </div>
          </div>
          <div className="flex items-center gap-5 text-[#aebac1]">
            <Video size={20} className="cursor-pointer" />
            <Phone size={20} className="cursor-pointer" />
            <div className="w-[1px] h-6 bg-[#374248]"></div>
            <Search size={20} className="cursor-pointer" />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-16 py-4 flex flex-col z-10 scroll-smooth">
          <div className="flex justify-center mb-6">
            <div className="bg-[#182229] text-[#8696a0] text-xs px-3 py-1 rounded-lg uppercase tracking-wide">
              Today
            </div>
          </div>
          
          <div className="flex justify-center mb-4">
            <div className="bg-[#182229] text-[#ffd279] text-xs px-4 py-2 rounded-lg text-center max-w-sm flex items-start gap-2 shadow-sm">
              <span className="text-lg">🔒</span>
              <p>Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them. Click to learn more.</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pb-4">
            {messages.map((msg, i) => {
              const isFirstInGroup = i === 0 || messages[i - 1]?.from !== msg.from;
              
              return (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
                >
                  <div
                    className={`relative max-w-[65%] rounded-lg px-2 pt-2 pb-1 text-[15px] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ${
                      msg.from === "user" 
                        ? "bg-[#005c4b] text-[#e9edef] rounded-tr-none" 
                        : "bg-[#202c33] text-[#e9edef] rounded-tl-none"
                    }`}
                  >
                    {msg.from === "bot" && isFirstInGroup && (
                      <div className="text-[#00a884] text-[13px] font-medium mb-1 line-clamp-1">
                        Docket Compliance Bot
                      </div>
                    )}
                    <div className="whitespace-pre-wrap leading-[20px]">
                      {msg.text}
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-1 -mb-1 float-right ml-4">
                      <span className="text-[#8696a0] text-[11px] leading-3 mt-1">
                        {msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.from === "user" && (
                        <CheckCheck size={14} className="text-[#53bdeb] mt-1" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start mt-2 animate-in fade-in duration-200">
                <div className="bg-[#202c33] rounded-lg rounded-tl-none px-4 py-3 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] flex items-center gap-1 w-[70px]">
                  <div className="w-2 h-2 bg-[#8696a0] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-[#8696a0] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-[#8696a0] rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input */}
        <div className="h-[62px] bg-[#202c33] flex items-center px-4 py-2 gap-4 shrink-0 z-10">
          <div className="flex gap-4 text-[#8696a0]">
            <Smile size={26} className="cursor-pointer hover:text-[#aebac1]" />
            <Paperclip size={26} className="cursor-pointer hover:text-[#aebac1]" />
          </div>
          <div className="flex-1 bg-[#2a3942] rounded-lg flex items-center px-4 h-full">
            <input
              type="text"
              placeholder="Type a message"
              className="w-full bg-transparent border-none outline-none text-[#d1d7db] placeholder-[#8696a0] text-[15px]"
              disabled
            />
          </div>
          <div className="text-[#8696a0]">
            <Mic size={26} className="cursor-pointer hover:text-[#aebac1]" />
          </div>
        </div>
      </div>
    </div>
  );
}
