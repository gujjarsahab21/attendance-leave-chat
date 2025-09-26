import { useEffect, useRef, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  PaperClipIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  BellAlertIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

const MOCK = {
  contacts: [
    { id: "john", name: "John Doe", subtitle: "Software Engineer" },
    { id: "sarah", name: "Sarah Khan", subtitle: "Product" },
    { id: "michael", name: "Michael Ray", subtitle: "Design" },
  ],
  groups: [{ id: "project-a", name: "Project A" }, { id: "hr", name: "HR Team" }],
  announcements: [{ id: "company", name: "Company Announcements" }],
};

const initialMessages = {
  john: [
    { id: 1, from: "john", text: "Hey! You available for a quick sync?", time: "10:30 AM" },
    { id: 2, from: "me", text: "Yes — jumping in 5 mins.", time: "10:32 AM" },
  ],
  sarah: [{ id: 1, from: "sarah", text: "Please review the PR when free.", time: "09:10 AM" }],
  "Project A": [{ id: 1, from: "member", text: "Standup at 11 — don't miss.", time: "08:00 AM" }],
  "Company Announcements": [{ id: 1, from: "admin", text: "All-hands on Friday @4pm", time: "Yesterday" }],
};

export default function Chat() {
  const [active, setActive] = useState("john");
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem("chat_messages_v1");
      if (raw) return JSON.parse(raw);
    } catch {}
    return initialMessages;
  });
  const [input, setInput] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const messagesRef = useRef(null);

  const filteredContacts = useMemo(() => {
    if (!query.trim()) return MOCK.contacts;
    const q = query.toLowerCase();
    return MOCK.contacts.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  const sections = {
    direct: filteredContacts,
    groups: MOCK.groups,
    announcements: MOCK.announcements,
  };

  useEffect(() => {
    try {
      localStorage.setItem("chat_messages_v1", JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, active]);

  const activeMessages = messages[active] || [];

  function handleSelect(key) {
    setActive(key);
    setFilePreview(null);
  }

  function handleAttach(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type.startsWith("image/")) {
      const url = URL.createObjectURL(f);
      setFilePreview({ file: f, url, name: f.name, type: f.type });
    } else {
      setFilePreview({ file: f, url: null, name: f.name, type: f.type });
    }
    e.target.value = "";
  }

  function handleSend(e) {
    e?.preventDefault();
    if (!input.trim() && !filePreview) {
      toast.error("Type a message or attach a file");
      return;
    }

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsg = {
      id: Date.now(),
      from: "me",
      text: input.trim() || (filePreview ? `[file] ${filePreview.name}` : ""),
      time,
      file: filePreview ? { name: filePreview.name, url: filePreview.url, type: filePreview.type } : null,
    };

    setMessages((prev) => {
      const copy = { ...prev };
      copy[active] = [...(copy[active] || []), newMsg];
      return copy;
    });

    setInput("");
    setFilePreview(null);
    toast.success("Message sent");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function MessageBubble({ m }) {
    const isMe = m.from === "me";
    return (
      <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[70%] p-3 rounded-2xl text-sm whitespace-pre-wrap shadow-md ${
            isMe
              ? "bg-blue-500 text-white rounded-br-none"
              : "bg-white text-gray-800 border rounded-bl-none"
          }`}
        >
          {m.file && m.file.url && (
            <div className="mb-2">
              <img src={m.file.url} alt={m.file.name} className="max-w-full rounded-md" />
            </div>
          )}
          <div>{m.text}</div>
          <div className={`text-[11px] mt-1 text-right ${isMe ? "text-blue-100" : "text-gray-400"}`}>
            {m.time}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-143 bg-gray-100">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r flex flex-col">
        <div className="p-3 border-b">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people or groups"
              className="bg-transparent w-full text-sm outline-none py-1"
            />
          </div>
        </div>

        <div className="p-3 overflow-y-auto flex-1">
          {/* Direct contacts */}
          <div className="mb-3">
            <div className="text-xs text-gray-500 uppercase mb-2 flex items-center gap-2">
              <UsersIcon className="w-4 h-4" /> Direct
            </div>
            <div className="space-y-1">
              {sections.direct.map((c) => {
                const key = c.id;
                const lastMsg = (messages[key] || []).slice(-1)[0];
                return (
                  <button
                    key={key}
                    onClick={() => handleSelect(key)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 hover:bg-gray-50 transition ${
                      active === key ? "bg-blue-50 border border-blue-100" : ""
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                      {c.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${active === key ? "text-blue-700" : "text-gray-800"}`}>
                        {c.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {lastMsg ? `${lastMsg.from === "me" ? "You: " : ""}${lastMsg.text}` : c.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Groups */}
          <div className="mb-3">
            <div className="text-xs text-gray-500 uppercase mb-2 flex items-center gap-2">
              <BellAlertIcon className="w-4 h-4" /> Groups
            </div>
            <div className="space-y-1">
              {sections.groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => handleSelect(g.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition ${
                    active === g.name ? "bg-blue-50 border border-blue-100" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
                      {g.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${active === g.name ? "text-blue-700" : "text-gray-800"}`}>
                        {g.name}
                      </div>
                      <div className="text-xs text-gray-500">Group chat</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div>
            <div className="text-xs text-gray-500 uppercase mb-2">Announcements</div>
            <div className="space-y-1">
              {sections.announcements.map((a) => (
                <button
                  key={a.id}
                  onClick={() => handleSelect(a.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition ${
                    active === a.name ? "bg-blue-50 border border-blue-100" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold">
                      AN
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${active === a.name ? "text-blue-700" : "text-gray-800"}`}>
                        {a.name}
                      </div>
                      <div className="text-xs text-gray-500">Company updates</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Chat main */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-white border-b">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-medium text-gray-800">
              {String(active).slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-gray-800 capitalize">{active}</div>
              <div className="text-xs text-gray-500">Active conversation</div>
            </div>
          </div>
          <div className="text-sm text-blue-600 font-medium">Online</div>
        </div>

        {/* Messages */}
        <div ref={messagesRef} className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4">
          {activeMessages.length === 0 ? (
            <div className="text-center text-gray-500 mt-16">No messages yet. Say hi 👋</div>
          ) : (
            activeMessages.map((m) => <MessageBubble key={m.id} m={m} />)
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="bg-white border-t px-4 py-3 flex items-center gap-3">
          <label className="p-2 rounded-md hover:bg-gray-50 cursor-pointer">
            <input type="file" className="hidden" onChange={handleAttach} />
            <PaperClipIcon className="w-5 h-5 text-gray-500" />
          </label>

          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder={`Message ${active}`}
              className="w-full resize-none border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
            />
            {filePreview && (
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                {filePreview.url ? (
                  <img src={filePreview.url} alt={filePreview.name} className="w-12 h-8 object-cover rounded" />
                ) : (
                  <div className="w-12 h-8 flex items-center justify-center bg-gray-100 rounded">
                    {filePreview.name.slice(0, 2)}
                  </div>
                )}
                <div className="truncate">{filePreview.name}</div>
                <button type="button" onClick={() => setFilePreview(null)} className="ml-auto text-red-500 text-xs">
                  Remove
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-full flex items-center justify-center"
          >
            <PaperAirplaneIcon className="w-4 h-4 transform rotate-90" />
          </button>
        </form>
      </main>
    </div>
  );
}
