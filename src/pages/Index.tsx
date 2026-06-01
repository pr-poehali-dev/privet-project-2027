import { useState } from "react";
import Icon from "@/components/ui/icon";

const TABS = ["chats", "groups", "contacts", "profile"] as const;
type Tab = (typeof TABS)[number];

const chats = [
  { id: 1, name: "Алина Петрова", avatar: "А", color: "from-pink-500 to-rose-400", msg: "Привет! Как дела? 😊", time: "14:32", unread: 3, online: true, status: "Сегодня отличный день!" },
  { id: 2, name: "Максим Ков.", avatar: "М", color: "from-violet-500 to-purple-400", msg: "Видел новый GIF? 🔥", time: "13:10", unread: 0, online: true, status: "В дороге 🚗" },
  { id: 3, name: "Саша Иванов", avatar: "С", color: "from-cyan-500 to-blue-400", msg: "Стикер прислал", time: "11:55", unread: 1, online: false, status: "" },
  { id: 4, name: "Женя Смирнова", avatar: "Ж", color: "from-amber-400 to-orange-400", msg: "Голосовое 0:42", time: "10:20", unread: 0, online: false, status: "Не беспокоить 🎧" },
  { id: 5, name: "Кирилл Белов", avatar: "К", color: "from-emerald-500 to-teal-400", msg: "Окей, договорились!", time: "09:01", unread: 0, online: true, status: "" },
  { id: 6, name: "Настя Орлова", avatar: "Н", color: "from-fuchsia-500 to-pink-400", msg: "🎉🎉🎉", time: "вчера", unread: 0, online: false, status: "На встрече" },
];

const groups = [
  { id: 1, name: "Команда Buzz 🚀", avatar: "🚀", members: 24, msg: "Алина: Деплой прошёл успешно!", time: "15:00", unread: 7 },
  { id: 2, name: "Друзья", avatar: "🎮", members: 8, msg: "Макс: Кто в игры сегодня?", time: "12:30", unread: 2 },
  { id: 3, name: "Путешествия ✈️", avatar: "✈️", members: 15, msg: "Женя: Бали этим летом?", time: "вчера", unread: 0 },
  { id: 4, name: "Новости", avatar: "📰", members: 312, msg: "Редакция: Важное обновление", time: "вчера", unread: 14 },
];

const contacts = [
  { id: 1, name: "Алина Петрова", username: "@alina_p", color: "from-pink-500 to-rose-400", avatar: "А", online: true },
  { id: 2, name: "Максим Ков.", username: "@maxkov", color: "from-violet-500 to-purple-400", avatar: "М", online: true },
  { id: 3, name: "Саша Иванов", username: "@sasha_i", color: "from-cyan-500 to-blue-400", avatar: "С", online: false },
  { id: 4, name: "Женя Смирнова", username: "@zhenya_s", color: "from-amber-400 to-orange-400", avatar: "Ж", online: false },
  { id: 5, name: "Кирилл Белов", username: "@kirill_b", color: "from-emerald-500 to-teal-400", avatar: "К", online: true },
  { id: 6, name: "Настя Орлова", username: "@nastya_o", color: "from-fuchsia-500 to-pink-400", avatar: "Н", online: false },
];

const messages = [
  { id: 1, from: "them", text: "Привет! Видел новый апдейт Buzz? 🔥", time: "13:00", type: "text", emoji: "" },
  { id: 2, from: "me", text: "Да! Анимации просто огонь 🚀", time: "13:01", type: "text", emoji: "" },
  { id: 3, from: "them", text: "", time: "13:02", type: "sticker", emoji: "😂" },
  { id: 4, from: "me", text: "Хахаха, тоже нравится 😄", time: "13:03", type: "text", emoji: "" },
  { id: 5, from: "them", text: "🎵 Голосовое сообщение · 0:42", time: "13:05", type: "voice", emoji: "" },
  { id: 6, from: "me", text: "Понял, слушаю!", time: "13:06", type: "text", emoji: "" },
  { id: 7, from: "them", text: "Встречаемся в 19:00?", time: "13:10", type: "text", emoji: "" },
];

const emojis = ["😊","😂","🔥","❤️","👍","😎","🎉","😍","🤩","😜","🙏","💯","✨","🚀","🎮","🎵","👀","🤣","😭","💪"];
const stickers = ["😂","🥳","😍","🤯","👻","🐱","🦊","🎯","💎","⚡"];

export default function Index() {
  const [tab, setTab] = useState<Tab>("chats");
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [msg, setMsg] = useState("");
  const [showPanel, setShowPanel] = useState<"emoji" | "gif" | "sticker" | null>(null);
  const [calling, setCalling] = useState(false);
  const [localMessages, setLocalMessages] = useState(messages);

  const activeChatData = chats.find(c => c.id === activeChat);

  const sendMessage = (text: string, type = "text") => {
    if (!text.trim() && type === "text") return;
    setLocalMessages(prev => [...prev, {
      id: Date.now(),
      from: "me",
      text,
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      type,
      emoji: "",
    }]);
    setMsg("");
    setShowPanel(null);
  };

  return (
    <div className="buzz-root flex h-screen w-full overflow-hidden bg-[#0a0a12]">
      {/* Sidebar */}
      <aside className={`buzz-sidebar flex flex-col w-full md:w-80 shrink-0 border-r border-white/5 ${activeChat ? "hidden md:flex" : "flex"}`}>
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
            <button className="w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors">
              <Icon name="PenSquare" size={15} className="text-white/40" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-3 mb-3">
          {([
            ["chats", "MessageCircle", "Чаты"],
            ["groups", "Users", "Группы"],
            ["contacts", "Contact", "Контакты"],
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
        <div className="flex-1 overflow-y-auto px-3 pb-4 custom-scroll">
          {tab === "chats" && (
            <div className="flex flex-col gap-1">
              {chats.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setActiveChat(c.id)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-all duration-200 text-left group buzz-chat-item"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white font-bold text-base shadow-lg`}>
                      {c.avatar}
                    </div>
                    {c.online && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0a0a12]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-white font-semibold text-sm truncate">{c.name}</span>
                      <span className="text-white/25 text-[11px] shrink-0 ml-2">{c.time}</span>
                    </div>
                    <p className="text-white/35 text-xs truncate">{c.msg}</p>
                  </div>
                  {c.unread > 0 && (
                    <div className="w-5 h-5 rounded-full buzz-gradient flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-md shadow-violet-500/40">
                      {c.unread}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

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
                  style={{ animationDelay: `${i * 50}ms` }}
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

          {tab === "contacts" && (
            <div>
              <div className="flex items-center gap-2 px-3 py-2 mb-3 bg-white/5 rounded-2xl border border-white/5">
                <Icon name="Search" size={14} className="text-white/30" />
                <input className="flex-1 bg-transparent text-white/70 text-sm outline-none placeholder:text-white/25" placeholder="Поиск контактов..." />
              </div>
              <div className="flex flex-col gap-1">
                {contacts.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => { setActiveChat(c.id); setTab("chats"); }}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all text-left buzz-chat-item"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="relative shrink-0">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white font-bold shadow-lg`}>
                        {c.avatar}
                      </div>
                      {c.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0a12]" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{c.name}</p>
                      <p className="text-white/30 text-xs">{c.username}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-8 h-8 rounded-xl bg-white/5 hover:bg-violet-500/20 flex items-center justify-center transition-colors">
                        <Icon name="Phone" size={13} className="text-white/40" />
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-white/5 hover:bg-violet-500/20 flex items-center justify-center transition-colors">
                        <Icon name="MessageCircle" size={13} className="text-white/40" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

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
                  <button key={label} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl hover:bg-white/8 transition-colors text-left border border-white/0 hover:border-white/5">
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
      </aside>

      {/* Chat Area */}
      <main className={`flex-1 flex flex-col relative ${!activeChat ? "hidden md:flex" : "flex"}`}>
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5">
            <div className="w-20 h-20 rounded-3xl buzz-gradient flex items-center justify-center shadow-2xl shadow-violet-500/50 buzz-pulse">
              <span className="text-white font-black text-4xl font-syne">B</span>
            </div>
            <div className="text-center">
              <p className="text-white/60 font-semibold text-base">Добро пожаловать в Buzz</p>
              <p className="text-white/25 text-sm mt-1">Выберите чат слева, чтобы начать</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#0a0a12]/90 backdrop-blur-xl shrink-0">
              <button onClick={() => setActiveChat(null)} className="md:hidden w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors">
                <Icon name="ArrowLeft" size={17} className="text-white/50" />
              </button>
              {activeChatData && (
                <>
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${activeChatData.color} flex items-center justify-center text-white font-bold shadow-lg`}>
                      {activeChatData.avatar}
                    </div>
                    {activeChatData.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0a12]" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm leading-tight">{activeChatData.name}</p>
                    <p className={`text-xs ${activeChatData.online ? "text-emerald-400" : "text-white/30"}`}>
                      {activeChatData.online ? "онлайн" : "был(а) недавно"}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setCalling(true)} className="w-9 h-9 rounded-xl hover:bg-violet-500/20 flex items-center justify-center transition-colors group">
                      <Icon name="Phone" size={15} className="text-white/40 group-hover:text-violet-300 transition-colors" />
                    </button>
                    <button onClick={() => setCalling(true)} className="w-9 h-9 rounded-xl hover:bg-violet-500/20 flex items-center justify-center transition-colors group">
                      <Icon name="Video" size={15} className="text-white/40 group-hover:text-violet-300 transition-colors" />
                    </button>
                    <button className="w-9 h-9 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors">
                      <Icon name="MoreVertical" size={15} className="text-white/40" />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Status Banner */}
            {activeChatData?.status && (
              <div className="px-4 py-2 bg-violet-950/40 border-b border-violet-500/10 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                <span className="text-violet-300/80 text-xs">{activeChatData.status}</span>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2.5 custom-scroll">
              <div className="text-center">
                <span className="text-white/20 text-xs bg-white/5 px-3 py-1 rounded-full">Сегодня</span>
              </div>
              {localMessages.map((m, i) => (
                <div
                  key={m.id}
                  className={`flex ${m.from === "me" ? "justify-end" : "justify-start"} buzz-msg-appear`}
                  style={{ animationDelay: `${i * 25}ms` }}
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
                        {[
                          ["😂","Смех"],["🔥","Огонь"],["❤️","Любовь"],
                          ["🎉","Праздник"],["👏","Аплодисменты"],["🤔","Думаю"],
                        ].map(([emoji, label]) => (
                          <button
                            key={label}
                            onClick={() => sendMessage(`[GIF: ${label}]`)}
                            className="h-16 bg-white/5 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-violet-500/15 transition-colors border border-white/0 hover:border-violet-500/20"
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
                  onKeyDown={e => e.key === "Enter" && sendMessage(msg)}
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

      {/* Call Overlay */}
      {calling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center buzz-call-bg buzz-fade-in">
          <div className="flex flex-col items-center gap-8 p-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl buzz-gradient opacity-20 scale-125 blur-2xl" />
              <div className="absolute inset-0 rounded-3xl buzz-gradient opacity-10 scale-150 blur-3xl animate-ping" style={{ animationDuration: "2s" }} />
              <div className="relative w-28 h-28 rounded-3xl buzz-gradient flex items-center justify-center text-white font-black text-5xl shadow-2xl shadow-violet-500/50">
                {activeChatData?.avatar}
              </div>
            </div>
            <div>
              <h2 className="text-white font-black text-3xl font-syne">{activeChatData?.name}</h2>
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
