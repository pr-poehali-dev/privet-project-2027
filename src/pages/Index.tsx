import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Tab = "chats" | "groups" | "profile";

interface Contact {
  id: number;
  name: string;
  username: string;
  avatar: string;
  color: string;
  online: boolean;
}

interface ChatMessage {
  id: number;
  from: "me" | "them";
  text: string;
  time: string;
  type: "text" | "sticker" | "voice";
  emoji?: string;
}

interface Chat {
  id: number;
  contactId: number;
  messages: ChatMessage[];
}

const ALL_CONTACTS: Contact[] = [
  { id: 1, name: "Алина Петрова", username: "@alina_p", color: "from-pink-500 to-rose-400", avatar: "А", online: true },
  { id: 2, name: "Максим Ков.", username: "@maxkov", color: "from-violet-500 to-purple-400", avatar: "М", online: true },
  { id: 3, name: "Саша Иванов", username: "@sasha_i", color: "from-cyan-500 to-blue-400", avatar: "С", online: false },
  { id: 4, name: "Женя Смирнова", username: "@zhenya_s", color: "from-amber-400 to-orange-400", avatar: "Ж", online: false },
  { id: 5, name: "Кирилл Белов", username: "@kirill_b", color: "from-emerald-500 to-teal-400", avatar: "К", online: true },
  { id: 6, name: "Настя Орлова", username: "@nastya_o", color: "from-fuchsia-500 to-pink-400", avatar: "Н", online: false },
  { id: 7, name: "Дима Соколов", username: "@dima_s", color: "from-sky-500 to-cyan-400", avatar: "Д", online: true },
  { id: 8, name: "Катя Новикова", username: "@katya_n", color: "from-rose-500 to-pink-400", avatar: "К", online: false },
];

const groups = [
  { id: 1, name: "Команда Buzz 🚀", avatar: "🚀", members: 24, msg: "Алина: Деплой прошёл успешно!", time: "15:00", unread: 7 },
  { id: 2, name: "Друзья", avatar: "🎮", members: 8, msg: "Макс: Кто в игры сегодня?", time: "12:30", unread: 2 },
  { id: 3, name: "Путешествия ✈️", avatar: "✈️", members: 15, msg: "Женя: Бали этим летом?", time: "вчера", unread: 0 },
  { id: 4, name: "Новости", avatar: "📰", members: 312, msg: "Редакция: Важное обновление", time: "вчера", unread: 14 },
];

const emojis = ["😊","😂","🔥","❤️","👍","😎","🎉","😍","🤩","😜","🙏","💯","✨","🚀","🎮","🎵","👀","🤣","😭","💪"];
const stickers = ["😂","🥳","😍","🤯","👻","🐱","🦊","🎯","💎","⚡"];

function getNow() {
  return new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
}

export default function Index() {
  const [tab, setTab] = useState<Tab>("chats");
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [msg, setMsg] = useState("");
  const [showPanel, setShowPanel] = useState<"emoji" | "gif" | "sticker" | null>(null);
  const [calling, setCalling] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [contactSearch, setContactSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find(c => c.id === activeChatId) ?? null;
  const activeChatContact = activeChat ? ALL_CONTACTS.find(c => c.id === activeChat.contactId) : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages.length]);

  const openOrCreateChat = (contact: Contact) => {
    const existing = chats.find(c => c.contactId === contact.id);
    if (existing) {
      setActiveChatId(existing.id);
    } else {
      const newChat: Chat = { id: Date.now(), contactId: contact.id, messages: [] };
      setChats(prev => [...prev, newChat]);
      setActiveChatId(newChat.id);
    }
    setShowContacts(false);
    setTab("chats");
  };

  const sendMessage = (text: string, type: "text" | "sticker" | "voice" = "text") => {
    if (!text.trim() && type === "text") return;
    if (!activeChatId) return;
    const newMsg: ChatMessage = {
      id: Date.now(),
      from: "me",
      text,
      time: getNow(),
      type,
    };
    setChats(prev => prev.map(c =>
      c.id === activeChatId ? { ...c, messages: [...c.messages, newMsg] } : c
    ));
    setMsg("");
    setShowPanel(null);
  };

  const filteredContacts = ALL_CONTACTS.filter(c =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.username.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const lastMsg = (chat: Chat) => {
    const last = chat.messages[chat.messages.length - 1];
    if (!last) return "";
    if (last.type === "sticker") return last.emoji ?? "Стикер";
    if (last.type === "voice") return "🎵 Голосовое";
    return last.text;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a0a12]">

      {/* ===== SIDEBAR ===== */}
      <aside className={`buzz-sidebar flex flex-col w-full md:w-80 shrink-0 border-r border-white/5 relative ${activeChatId ? "hidden md:flex" : "flex"}`}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 pt-6 pb-4">
          <div className="w-9 h-9 rounded-2xl buzz-gradient flex items-center justify-center shadow-lg shadow-violet-500/40">
            <span className="text-white font-black text-base font-syne">B</span>
          </div>
          <span className="text-white font-black text-xl tracking-tight font-syne">Buzz</span>
          <div className="ml-auto flex gap-1">
            <button className="w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors">
              <Icon name="Search" size={15} className="text-white/40" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-3 mb-3">
          {([
            ["chats", "MessageCircle", "Чаты"],
            ["groups", "Users", "Группы"],
            ["profile", "User", "Профиль"],
          ] as [Tab, string, string][]).map(([t, icon, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition-all duration-200 ${tab === t ? "buzz-tab-active" : "hover:bg-white/5"}`}
            >
              <Icon name={icon} size={17} className={tab === t ? "text-white" : "text-white/30"} />
              <span className={`text-[10px] font-semibold ${tab === t ? "text-white" : "text-white/25"}`}>{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-3 pb-20 custom-scroll">

          {/* === CHATS === */}
          {tab === "chats" && (
            chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center">
                  <span className="text-3xl">💬</span>
                </div>
                <div className="text-center">
                  <p className="text-white/50 font-semibold text-sm">Чатов пока нет</p>
                  <p className="text-white/25 text-xs mt-1">Нажми + чтобы начать общение</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {chats.map((chat, i) => {
                  const contact = ALL_CONTACTS.find(c => c.id === chat.contactId);
                  if (!contact) return null;
                  return (
                    <button
                      key={chat.id}
                      onClick={() => setActiveChatId(chat.id)}
                      className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 text-left buzz-chat-item ${activeChatId === chat.id ? "buzz-tab-active" : "hover:bg-white/5"}`}
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <div className="relative shrink-0">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${contact.color} flex items-center justify-center text-white font-bold text-base shadow-lg`}>
                          {contact.avatar}
                        </div>
                        {contact.online && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0a0a12]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-white font-semibold text-sm truncate">{contact.name}</span>
                          <span className="text-white/25 text-[11px] shrink-0 ml-2">
                            {chat.messages[chat.messages.length - 1]?.time ?? ""}
                          </span>
                        </div>
                        <p className="text-white/35 text-xs truncate">{lastMsg(chat) || "Напишите первым..."}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )
          )}

          {/* === GROUPS === */}
          {tab === "groups" && (
            <div className="flex flex-col gap-1">
              <button className="flex items-center gap-3 p-3 mb-2 rounded-2xl border border-dashed border-violet-500/30 hover:border-violet-500/60 hover:bg-violet-500/5 transition-all">
                <div className="w-10 h-10 rounded-xl buzz-gradient flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Icon name="Plus" size={18} className="text-white" />
                </div>
                <span className="text-violet-300 font-semibold text-sm">Создать группу</span>
              </button>
              {groups.map((g, i) => (
                <button
                  key={g.id}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all text-left buzz-chat-item"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                    {g.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-white font-semibold text-sm truncate">{g.name}</span>
                      <span className="text-white/25 text-[11px]">{g.time}</span>
                    </div>
                    <p className="text-white/35 text-xs truncate">{g.msg}</p>
                  </div>
                  {g.unread > 0 && (
                    <div className="w-5 h-5 rounded-full buzz-gradient flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      {g.unread}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* === PROFILE === */}
          {tab === "profile" && (
            <div className="flex flex-col items-center pt-4 gap-4 buzz-fade-in">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl buzz-gradient flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-violet-500/50">
                  Я
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#0a0a12]" />
                <button className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#1a1a2e] border border-white/10 flex items-center justify-center hover:bg-violet-500/20 transition-colors">
                  <Icon name="Camera" size={12} className="text-white/60" />
                </button>
              </div>
              <div className="text-center">
                <h2 className="text-white font-bold text-xl font-syne">Иван Иванов</h2>
                <p className="text-white/35 text-sm">@ivan_buzz</p>
              </div>
              <div className="w-full p-3.5 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-2">
                <span className="text-white/60 text-sm flex-1">На орбите 🚀</span>
                <Icon name="Pencil" size={13} className="text-white/30" />
              </div>
              <div className="w-full flex flex-col gap-2">
                {[
                  ["Bell", "Уведомления", "Вкл"],
                  ["Lock", "Конфиденциальность", ""],
                  ["Palette", "Оформление", "Тёмная"],
                  ["HelpCircle", "Помощь", ""],
                  ["LogOut", "Выйти", ""],
                ].map(([icon, label, sub]) => (
                  <button key={label} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors text-left border border-transparent hover:border-white/5">
                    <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                      <Icon name={icon} size={15} className="text-violet-300" />
                    </div>
                    <span className="text-white/75 text-sm font-medium flex-1">{label}</span>
                    {sub && <span className="text-white/25 text-xs">{sub}</span>}
                    <Icon name="ChevronRight" size={13} className="text-white/15" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FAB — найти контакт */}
        <div className="absolute bottom-5 right-4">
          <button
            onClick={() => setShowContacts(true)}
            className="w-14 h-14 rounded-2xl buzz-gradient shadow-2xl shadow-violet-500/50 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <Icon name="UserPlus" size={22} className="text-white" />
          </button>
        </div>
      </aside>

      {/* ===== CHAT AREA ===== */}
      <main className={`flex-1 flex flex-col relative ${!activeChatId ? "hidden md:flex" : "flex"}`}>
        {!activeChatId ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5">
            <div className="w-20 h-20 rounded-3xl buzz-gradient flex items-center justify-center shadow-2xl shadow-violet-500/50 buzz-pulse">
              <span className="text-white font-black text-4xl font-syne">B</span>
            </div>
            <div className="text-center">
              <p className="text-white/60 font-semibold text-base">Добро пожаловать в Buzz</p>
              <p className="text-white/25 text-sm mt-1">Нажми + чтобы найти контакт и начать чат</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#0a0a12]/90 backdrop-blur-xl shrink-0">
              <button
                onClick={() => setActiveChatId(null)}
                className="md:hidden w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <Icon name="ArrowLeft" size={17} className="text-white/50" />
              </button>
              {activeChatContact && (
                <>
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${activeChatContact.color} flex items-center justify-center text-white font-bold shadow-lg`}>
                      {activeChatContact.avatar}
                    </div>
                    {activeChatContact.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0a12]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm leading-tight">{activeChatContact.name}</p>
                    <p className={`text-xs ${activeChatContact.online ? "text-emerald-400" : "text-white/30"}`}>
                      {activeChatContact.online ? "онлайн" : "был(а) недавно"}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setCalling(true)}
                      className="w-9 h-9 rounded-xl hover:bg-violet-500/20 flex items-center justify-center transition-colors group"
                    >
                      <Icon name="Phone" size={15} className="text-white/40 group-hover:text-violet-300 transition-colors" />
                    </button>
                    <button
                      onClick={() => setCalling(true)}
                      className="w-9 h-9 rounded-xl hover:bg-violet-500/20 flex items-center justify-center transition-colors group"
                    >
                      <Icon name="Video" size={15} className="text-white/40 group-hover:text-violet-300 transition-colors" />
                    </button>
                    <button className="w-9 h-9 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors">
                      <Icon name="MoreVertical" size={15} className="text-white/40" />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2.5 custom-scroll">
              {activeChat && activeChat.messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${activeChatContact?.color} flex items-center justify-center text-white font-bold text-2xl shadow-xl`}>
                    {activeChatContact?.avatar}
                  </div>
                  <div className="text-center">
                    <p className="text-white/60 font-semibold text-sm">{activeChatContact?.name}</p>
                    <p className="text-white/25 text-xs mt-1">Напишите первое сообщение 👋</p>
                  </div>
                </div>
              )}
              {activeChat && activeChat.messages.length > 0 && (
                <>
                  <div className="text-center mb-1">
                    <span className="text-white/20 text-xs bg-white/5 px-3 py-1 rounded-full">Сегодня</span>
                  </div>
                  {activeChat.messages.map((m, i) => (
                    <div
                      key={m.id}
                      className={`flex ${m.from === "me" ? "justify-end" : "justify-start"} buzz-msg-appear`}
                      style={{ animationDelay: `${i * 20}ms` }}
                    >
                      {m.type === "sticker" ? (
                        <div className="text-6xl hover:scale-110 transition-transform cursor-pointer">{m.emoji}</div>
                      ) : m.type === "voice" ? (
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl max-w-[220px] ${m.from === "me" ? "buzz-msg-me" : "buzz-msg-them"}`}>
                          <button className="w-9 h-9 rounded-full buzz-gradient flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/30 hover:scale-105 transition-transform">
                            <Icon name="Play" size={12} className="text-white ml-0.5" />
                          </button>
                          <div className="flex-1">
                            <div className="flex gap-0.5 items-center h-6">
                              {[3,5,8,4,7,9,3,6,4,8,5,3].map((h, j) => (
                                <div key={j} className="w-1 rounded-full bg-white/40" style={{ height: `${h * 2}px` }} />
                              ))}
                            </div>
                            <p className="text-white/40 text-[10px] mt-0.5">0:42</p>
                          </div>
                        </div>
                      ) : (
                        <div className={`px-4 py-2.5 rounded-2xl max-w-[75%] ${m.from === "me" ? "buzz-msg-me rounded-br-sm" : "buzz-msg-them rounded-bl-sm"}`}>
                          <p className="text-white text-sm leading-relaxed">{m.text}</p>
                          <p className={`text-[10px] mt-1 ${m.from === "me" ? "text-white/35 text-right" : "text-white/25"}`}>{m.time}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Emoji/GIF/Sticker Panel */}
            {showPanel && (
              <div className="px-4 pb-2 buzz-slide-up">
                <div className="bg-[#13131f] rounded-2xl p-3 border border-white/5 shadow-xl">
                  {showPanel === "emoji" && (
                    <div className="flex flex-wrap gap-2">
                      {emojis.map(e => (
                        <button key={e} onClick={() => setMsg(m => m + e)} className="text-2xl hover:scale-125 transition-transform active:scale-95">{e}</button>
                      ))}
                    </div>
                  )}
                  {showPanel === "sticker" && (
                    <div>
                      <p className="text-white/30 text-xs mb-2 font-semibold uppercase tracking-wide">Стикеры</p>
                      <div className="flex flex-wrap gap-3">
                        {stickers.map(s => (
                          <button key={s} onClick={() => sendMessage(s, "sticker")} className="text-4xl hover:scale-125 transition-transform active:scale-95">{s}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  {showPanel === "gif" && (
                    <div>
                      <p className="text-white/30 text-xs mb-2 font-semibold uppercase tracking-wide">GIF</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[["😂","Смех"],["🔥","Огонь"],["❤️","Любовь"],["🎉","Праздник"],["👏","Аплодисменты"],["🤔","Думаю"]].map(([emoji, label]) => (
                          <button
                            key={label}
                            onClick={() => sendMessage(`[GIF: ${label}]`)}
                            className="h-16 bg-white/5 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-violet-500/15 transition-colors border border-transparent hover:border-violet-500/20"
                          >
                            <span className="text-2xl">{emoji}</span>
                            <span className="text-white/40 text-[10px]">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-4 pb-5 pt-2 shrink-0">
              <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-3 py-2 border border-white/5 focus-within:border-violet-500/30 transition-all shadow-lg">
                <button
                  onClick={() => setShowPanel(p => p === "emoji" ? null : "emoji")}
                  className={`w-8 h-8 flex items-center justify-center text-lg transition-all hover:scale-110 ${showPanel === "emoji" ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
                >
                  😊
                </button>
                <button
                  onClick={() => setShowPanel(p => p === "sticker" ? null : "sticker")}
                  className={`w-8 h-8 flex items-center justify-center text-xs font-black transition-all ${showPanel === "sticker" ? "text-violet-300" : "text-white/30 hover:text-white/60"}`}
                >
                  STK
                </button>
                <button
                  onClick={() => setShowPanel(p => p === "gif" ? null : "gif")}
                  className={`w-8 h-8 flex items-center justify-center text-xs font-black transition-all ${showPanel === "gif" ? "text-violet-300" : "text-white/30 hover:text-white/60"}`}
                >
                  GIF
                </button>
                <input
                  value={msg}
                  onChange={e => setMsg(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(msg); } }}
                  className="flex-1 bg-transparent text-white/80 text-sm outline-none placeholder:text-white/25 py-1"
                  placeholder="Сообщение..."
                />
                <button className="w-8 h-8 flex items-center justify-center opacity-30 hover:opacity-60 transition-opacity">
                  <Icon name="Paperclip" size={15} className="text-white" />
                </button>
                <button
                  onClick={() => sendMessage(msg)}
                  className="w-9 h-9 rounded-xl buzz-gradient flex items-center justify-center shadow-lg shadow-violet-500/40 hover:scale-105 active:scale-95 transition-transform"
                >
                  <Icon name="Send" size={14} className="text-white ml-0.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* ===== CONTACTS DRAWER ===== */}
      {showContacts && (
        <div className="fixed inset-0 z-40 flex items-end md:items-center md:justify-center buzz-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowContacts(false)}
          />
          {/* Sheet */}
          <div className="relative w-full md:w-96 bg-[#12121e] border border-white/10 rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col max-h-[80vh] buzz-slide-up">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <h2 className="text-white font-bold text-lg font-syne">Контакты</h2>
              <button
                onClick={() => setShowContacts(false)}
                className="w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <Icon name="X" size={16} className="text-white/50" />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 pb-3">
              <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-3 py-2.5 border border-white/5 focus-within:border-violet-500/30 transition-all">
                <Icon name="Search" size={14} className="text-white/30 shrink-0" />
                <input
                  value={contactSearch}
                  onChange={e => setContactSearch(e.target.value)}
                  className="flex-1 bg-transparent text-white/70 text-sm outline-none placeholder:text-white/25"
                  placeholder="Найти контакт..."
                  autoFocus
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto px-4 pb-6 flex flex-col gap-1 custom-scroll">
              {filteredContacts.length === 0 && (
                <div className="text-center py-8 text-white/30 text-sm">Ничего не найдено</div>
              )}
              {filteredContacts.map((contact, i) => (
                <button
                  key={contact.id}
                  onClick={() => openOrCreateChat(contact)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-all text-left buzz-chat-item"
                  style={{ animationDelay: `${i * 35}ms` }}
                >
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${contact.color} flex items-center justify-center text-white font-bold text-base shadow-lg`}>
                      {contact.avatar}
                    </div>
                    {contact.online && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#12121e]" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{contact.name}</p>
                    <p className="text-white/30 text-xs">{contact.username}</p>
                  </div>
                  <div className={`text-xs px-2.5 py-1 rounded-full font-semibold ${contact.online ? "bg-emerald-500/15 text-emerald-400" : "bg-white/5 text-white/25"}`}>
                    {contact.online ? "онлайн" : "оффлайн"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== CALL OVERLAY ===== */}
      {calling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center buzz-call-bg buzz-fade-in">
          <div className="flex flex-col items-center gap-8 p-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl buzz-gradient opacity-20 scale-125 blur-2xl" />
              <div className="absolute inset-0 rounded-3xl buzz-gradient opacity-10 scale-150 blur-3xl animate-ping" style={{ animationDuration: "2s" }} />
              <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-black text-5xl shadow-2xl shadow-violet-500/50">
                {activeChatContact?.avatar ?? "?"}
              </div>
            </div>
            <div>
              <h2 className="text-white font-black text-3xl font-syne">{activeChatContact?.name ?? ""}</h2>
              <p className="text-white/40 text-sm mt-2 tracking-widest uppercase">Звонок...</p>
            </div>
            <div className="flex gap-6">
              {[
                { icon: "MicOff", bg: "bg-white/10 hover:bg-white/20", label: "Микро" },
                { icon: "Video", bg: "bg-white/10 hover:bg-white/20", label: "Камера" },
                { icon: "PhoneOff", bg: "bg-red-500 hover:bg-red-400", label: "Завершить", action: () => setCalling(false) },
              ].map(btn => (
                <button key={btn.icon} onClick={btn.action} className="flex flex-col items-center gap-2">
                  <div className={`w-16 h-16 rounded-2xl ${btn.bg} flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg`}>
                    <Icon name={btn.icon} size={24} className="text-white" />
                  </div>
                  <span className="text-white/40 text-xs">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
