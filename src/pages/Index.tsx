import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import Icon from "@/components/ui/icon";

type Tab = "chats" | "groups" | "profile";
type ActiveView = { kind: "chat"; id: number } | { kind: "group"; id: number } | null;

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

interface GroupChat {
  id: number;
  name: string;
  avatar: string;
  members: number;
  messages: ChatMessage[];
}

const ALL_CONTACTS: Contact[] = [
  { id: 1, name: "Алина Петрова",  username: "@alina_p",  color: "from-pink-500 to-rose-400",     avatar: "А", online: true  },
  { id: 2, name: "Максим Ков.",    username: "@maxkov",   color: "from-violet-500 to-purple-400",  avatar: "М", online: true  },
  { id: 3, name: "Саша Иванов",   username: "@sasha_i",  color: "from-cyan-500 to-blue-400",      avatar: "С", online: false },
  { id: 4, name: "Женя Смирнова", username: "@zhenya_s", color: "from-amber-400 to-orange-400",   avatar: "Ж", online: false },
  { id: 5, name: "Кирилл Белов",  username: "@kirill_b", color: "from-emerald-500 to-teal-400",   avatar: "К", online: true  },
  { id: 6, name: "Настя Орлова",  username: "@nastya_o", color: "from-fuchsia-500 to-pink-400",   avatar: "Н", online: false },
  { id: 7, name: "Дима Соколов",  username: "@dima_s",   color: "from-sky-500 to-cyan-400",       avatar: "Д", online: true  },
  { id: 8, name: "Катя Новикова", username: "@katya_n",  color: "from-rose-500 to-pink-400",      avatar: "К", online: false },
];

const INITIAL_GROUPS: GroupChat[] = [
  { id: 101, name: "Команда Buzz 🚀", avatar: "🚀", members: 24, messages: [
    { id: 1, from: "them", text: "Деплой прошёл успешно! 🎉", time: "15:00", type: "text" },
    { id: 2, from: "them", text: "Все проверяем на проде", time: "15:01", type: "text" },
  ]},
  { id: 102, name: "Друзья 🎮",       avatar: "🎮", members: 8,  messages: [
    { id: 1, from: "them", text: "Кто в игры сегодня?", time: "12:30", type: "text" },
  ]},
  { id: 103, name: "Путешествия ✈️",  avatar: "✈️", members: 15, messages: [
    { id: 1, from: "them", text: "Бали этим летом? 🌴", time: "вчера", type: "text" },
  ]},
  { id: 104, name: "Новости 📰",       avatar: "📰", members: 312, messages: [
    { id: 1, from: "them", text: "Важное обновление платформы", time: "вчера", type: "text" },
  ]},
];

const EMOJIS   = ["😊","😂","🔥","❤️","👍","😎","🎉","😍","🤩","😜","🙏","💯","✨","🚀","🎮","🎵","👀","🤣","😭","💪"];
const STICKERS = ["😂","🥳","😍","🤯","👻","🐱","🦊","🎯","💎","⚡"];
const GROUP_AVATARS = ["🚀","🎮","✈️","📰","🎵","🏆","💡","🎯","🌍","🔥"];

function getNow() {
  return new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
}

/* ─────────────────────────────────────────────────────── */
/*  Shared Chat Panel                                       */
/* ─────────────────────────────────────────────────────── */
interface ChatPanelProps {
  name: string;
  subtitle: string;
  avatarEl: ReactNode;
  messages: ChatMessage[];
  onSend: (text: string, type: "text" | "sticker" | "voice") => void;
  onBack: () => void;
  onCall: () => void;
}

interface ChatPanelExtraProps {
  msg: string;
  setMsg: (v: string) => void;
  showPanel: "emoji" | "gif" | "sticker" | null;
  setPanel: (v: "emoji" | "gif" | "sticker" | null) => void;
}

function ChatPanel({ name, subtitle, avatarEl, messages, onSend, onBack, onCall, msg, setMsg, showPanel, setPanel }: ChatPanelProps & ChatPanelExtraProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const send = (text: string, type: "text" | "sticker" | "voice" = "text") => {
    if (!text.trim() && type === "text") return;
    onSend(text, type);
    setMsg("");
    setPanel(null);
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#0a0a12]/90 backdrop-blur-xl shrink-0">
        <button onClick={onBack} className="md:hidden w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors">
          <Icon name="ArrowLeft" size={17} className="text-white/50" />
        </button>
        {avatarEl}
        <div className="flex-1">
          <p className="text-white font-semibold text-sm leading-tight">{name}</p>
          <p className="text-xs text-white/30">{subtitle}</p>
        </div>
        <div className="flex gap-1">
          <button onClick={onCall} className="w-9 h-9 rounded-xl hover:bg-violet-500/20 flex items-center justify-center transition-colors group">
            <Icon name="Phone" size={15} className="text-white/40 group-hover:text-violet-300 transition-colors" />
          </button>
          <button onClick={onCall} className="w-9 h-9 rounded-xl hover:bg-violet-500/20 flex items-center justify-center transition-colors group">
            <Icon name="Video" size={15} className="text-white/40 group-hover:text-violet-300 transition-colors" />
          </button>
          <button className="w-9 h-9 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors">
            <Icon name="MoreVertical" size={15} className="text-white/40" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2.5 custom-scroll">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <p className="text-white/25 text-sm">Напишите первое сообщение 👋</p>
          </div>
        )}
        {messages.length > 0 && (
          <>
            <div className="text-center mb-1">
              <span className="text-white/20 text-xs bg-white/5 px-3 py-1 rounded-full">Сегодня</span>
            </div>
            {messages.map((m, i) => (
              <div
                key={m.id}
                className={`flex ${m.from === "me" ? "justify-end" : "justify-start"} buzz-msg-appear`}
                style={{ animationDelay: `${i * 15}ms` }}
              >
                {m.type === "sticker" ? (
                  <div className="text-6xl hover:scale-110 transition-transform cursor-pointer">{m.emoji ?? m.text}</div>
                ) : m.type === "voice" ? (
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl max-w-[220px] ${m.from === "me" ? "buzz-msg-me" : "buzz-msg-them"}`}>
                    <button className="w-9 h-9 rounded-full buzz-gradient flex items-center justify-center shrink-0 hover:scale-105 transition-transform">
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
                  <div className={`px-3 py-2 rounded-2xl max-w-[65%] min-w-0 ${m.from === "me" ? "buzz-msg-me rounded-br-sm" : "buzz-msg-them rounded-bl-sm"}`}>
                    <p className="text-white text-xs leading-relaxed break-words whitespace-pre-wrap">{m.text}</p>
                    <p className={`text-[9px] mt-0.5 ${m.from === "me" ? "text-white/35 text-right" : "text-white/25"}`}>{m.time}</p>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
        <div ref={endRef} />
      </div>

      {/* Emoji / Sticker / GIF panel */}
      {showPanel && (
        <div className="px-4 pb-2 buzz-slide-up">
          <div className="buzz-surface rounded-2xl p-3 border border-white/5 shadow-xl">
            {showPanel === "emoji" && (
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setMsg(msg + e)} className="text-2xl hover:scale-125 transition-transform active:scale-95">{e}</button>
                ))}
              </div>
            )}
            {showPanel === "sticker" && (
              <div>
                <p className="text-white/30 text-xs mb-2 font-semibold uppercase tracking-wide">Стикеры</p>
                <div className="flex flex-wrap gap-3">
                  {STICKERS.map(s => (
                    <button key={s} onClick={() => { onSend(s, "sticker"); setPanel(null); }}
                      className="text-4xl hover:scale-125 transition-transform active:scale-95">{s}</button>
                  ))}
                </div>
              </div>
            )}
            {showPanel === "gif" && (
              <div>
                <p className="text-white/30 text-xs mb-2 font-semibold uppercase tracking-wide">GIF</p>
                <div className="grid grid-cols-3 gap-2">
                  {[["😂","Смех"],["🔥","Огонь"],["❤️","Любовь"],["🎉","Праздник"],["👏","Аплодисменты"],["🤔","Думаю"]].map(([emoji, label]) => (
                    <button key={label} onClick={() => send(`[GIF: ${label}]`)}
                      className="h-16 bg-white/5 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-violet-500/15 transition-colors border border-transparent hover:border-violet-500/20">
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
        <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-3 py-2 border border-white/5 focus-within:border-violet-500/30 transition-all">
          <button onClick={() => setPanel(showPanel === "emoji" ? null : "emoji")}
            className={`w-8 h-8 flex items-center justify-center text-xl transition-all hover:scale-110 ${showPanel === "emoji" ? "opacity-100" : "opacity-40 hover:opacity-70"}`}>
            😊
          </button>
          <button onClick={() => setPanel(showPanel === "sticker" ? null : "sticker")}
            className={`w-8 h-8 flex items-center justify-center text-xs font-black transition-all ${showPanel === "sticker" ? "text-violet-300" : "text-white/30 hover:text-white/60"}`}>
            STK
          </button>
          <button onClick={() => setPanel(showPanel === "gif" ? null : "gif")}
            className={`w-8 h-8 flex items-center justify-center text-xs font-black transition-all ${showPanel === "gif" ? "text-violet-300" : "text-white/30 hover:text-white/60"}`}>
            GIF
          </button>
          <input
            value={msg}
            onChange={e => setMsg(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(msg); } }}
            className="flex-1 bg-transparent text-white/80 text-sm outline-none placeholder:text-white/25 py-1"
            placeholder="Сообщение..."
          />
          <button className="w-8 h-8 flex items-center justify-center opacity-30 hover:opacity-60 transition-opacity">
            <Icon name="Paperclip" size={15} className="text-white" />
          </button>
          <button onClick={() => send(msg)}
            className="w-9 h-9 rounded-xl buzz-gradient flex items-center justify-center shadow-lg shadow-violet-500/40 hover:scale-105 active:scale-95 transition-transform">
            <Icon name="Send" size={14} className="text-white ml-0.5" />
          </button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  Profile Settings Modal                                  */
/* ─────────────────────────────────────────────────────── */
interface ProfileSettings {
  name: string;
  username: string;
  status: string;
  photo: string | null;
  notifications: boolean;
  theme: "dark" | "light";
}

function ProfileSettingModal({ setting, value, onClose, onSave }: {
  setting: string;
  value: string | boolean;
  onClose: () => void;
  onSave: (v: string | boolean) => void;
}) {
  const [val, setVal] = useState(value);

  // Special theme picker
  if (setting === "Оформление") {
    const themeVal = val as string;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center buzz-fade-in">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative buzz-surface border border-white/10 rounded-3xl p-6 w-80 shadow-2xl buzz-slide-up">
          <h3 className="text-white font-bold text-lg mb-5 font-syne">Оформление</h3>
          <div className="flex gap-3 mb-5">
            <button
              onClick={() => setVal("dark")}
              className={`flex-1 flex flex-col items-center gap-2 py-5 rounded-2xl border-2 transition-all ${themeVal === "dark" ? "border-violet-500 bg-violet-500/10" : "border-white/10 bg-white/5 hover:bg-white/8"}`}
            >
              <span className="text-3xl">🌙</span>
              <span className={`text-sm font-semibold ${themeVal === "dark" ? "text-violet-300" : "text-white/50"}`}>Тёмная</span>
            </button>
            <button
              onClick={() => setVal("light")}
              className={`flex-1 flex flex-col items-center gap-2 py-5 rounded-2xl border-2 transition-all ${themeVal === "light" ? "border-violet-500 bg-violet-500/10" : "border-white/10 bg-white/5 hover:bg-white/8"}`}
            >
              <span className="text-3xl">☀️</span>
              <span className={`text-sm font-semibold ${themeVal === "light" ? "text-violet-300" : "text-white/50"}`}>Светлая</span>
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 text-white/50 text-sm hover:bg-white/10 transition-colors">Отмена</button>
            <button onClick={() => { onSave(val); onClose(); }} className="flex-1 py-2.5 rounded-xl buzz-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity">Сохранить</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center buzz-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative buzz-surface border border-white/10 rounded-3xl p-6 w-80 shadow-2xl buzz-slide-up">
        <h3 className="text-white font-bold text-lg mb-4 font-syne">{setting}</h3>
        {typeof value === "boolean" ? (
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">{val ? "Включено" : "Выключено"}</span>
            <button
              onClick={() => setVal(v => !v)}
              className={`w-12 h-6 rounded-full transition-all ${val ? "buzz-gradient" : "bg-white/10"} relative`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${val ? "left-[26px]" : "left-0.5"}`} />
            </button>
          </div>
        ) : (
          <input
            autoFocus
            value={val as string}
            onChange={e => setVal(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500/50 transition-colors"
          />
        )}
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 text-white/50 text-sm hover:bg-white/10 transition-colors">Отмена</button>
          <button onClick={() => { onSave(val); onClose(); }} className="flex-1 py-2.5 rounded-xl buzz-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity">Сохранить</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  Create Group Modal                                      */
/* ─────────────────────────────────────────────────────── */
function CreateGroupModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (group: GroupChat) => void;
}) {
  const [groupName, setGroupName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(GROUP_AVATARS[0]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  const toggleMember = (id: number) => {
    setSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (!groupName.trim()) return;
    const newGroup: GroupChat = {
      id: Date.now(),
      name: groupName.trim(),
      avatar: selectedAvatar,
      members: selectedMembers.length + 1,
      messages: [],
    };
    onCreate(newGroup);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center buzz-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full md:w-[420px] buzz-surface border border-white/10 rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] buzz-slide-up">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <h2 className="text-white font-bold text-lg font-syne">Создать группу</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors">
            <Icon name="X" size={16} className="text-white/50" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-6 flex flex-col gap-5 custom-scroll">
          {/* Group name */}
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-2">Название группы</p>
            <input
              autoFocus
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500/50 transition-colors placeholder:text-white/25"
              placeholder="Введите название..."
            />
          </div>

          {/* Avatar emoji picker */}
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-2">Аватар</p>
            <div className="flex flex-wrap gap-2">
              {GROUP_AVATARS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setSelectedAvatar(emoji)}
                  className={`w-11 h-11 rounded-2xl text-2xl flex items-center justify-center transition-all border-2 ${selectedAvatar === emoji ? "border-violet-500 bg-violet-500/15 scale-110" : "border-transparent bg-white/5 hover:bg-white/10"}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Members */}
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-2">Участники</p>
            <div className="flex flex-col gap-1">
              {ALL_CONTACTS.map(contact => {
                const checked = selectedMembers.includes(contact.id);
                return (
                  <button
                    key={contact.id}
                    onClick={() => toggleMember(contact.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${checked ? "bg-violet-500/10 border border-violet-500/20" : "bg-white/5 border border-transparent hover:bg-white/8"}`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${contact.color} flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0`}>
                      {contact.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm font-medium truncate">{contact.name}</p>
                      <p className="text-white/30 text-xs truncate">{contact.username}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${checked ? "bg-violet-500 border-violet-500" : "border-white/20"}`}>
                      {checked && <Icon name="Check" size={11} className="text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Create button */}
          <button
            onClick={handleCreate}
            disabled={!groupName.trim()}
            className="w-full py-3 rounded-2xl buzz-gradient text-white font-semibold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-violet-500/30"
          >
            Создать группу {selectedMembers.length > 0 && `(${selectedMembers.length + 1} участн.)`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  Main App                                               */
/* ─────────────────────────────────────────────────────── */
export default function Index() {
  const [tab, setTab]               = useState<Tab>("chats");
  const [activeView, setActiveView] = useState<ActiveView>(null);
  const [chats, setChats]           = useState<Chat[]>([]);
  const [groupChats, setGroupChats] = useState<GroupChat[]>(INITIAL_GROUPS);
  const [showContacts, setShowContacts] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [contactSearch, setContactSearch] = useState("");
  const [calling, setCalling]       = useState(false);

  // Separate state for personal chats
  const [chatMsg, setChatMsg]       = useState("");
  const [chatPanel, setChatPanel]   = useState<"emoji" | "gif" | "sticker" | null>(null);

  // Separate state for group chats
  const [groupMsg, setGroupMsg]     = useState("");
  const [groupPanel, setGroupPanel] = useState<"emoji" | "gif" | "sticker" | null>(null);

  const [profile, setProfile]       = useState<ProfileSettings>({
    name: "Иван Иванов", username: "@ivan_buzz", status: "На орбите 🚀",
    photo: null, notifications: true, theme: "dark",
  });
  const [openSetting, setOpenSetting] = useState<keyof ProfileSettings | "theme_ui" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Применяем тему к документу
  useEffect(() => {
    document.documentElement.classList.toggle("light-theme", profile.theme === "light");
  }, [profile.theme]);

  const activeChat    = activeView?.kind === "chat"  ? chats.find(c => c.id === activeView.id)      : null;
  const activeGroup   = activeView?.kind === "group" ? groupChats.find(g => g.id === activeView.id) : null;
  const activeChatContact = activeChat ? ALL_CONTACTS.find(c => c.id === activeChat.contactId) : null;

  const switchView = (view: ActiveView) => {
    setActiveView(view);
  };

  const openOrCreateChat = (contact: Contact) => {
    const existing = chats.find(c => c.contactId === contact.id);
    if (existing) {
      switchView({ kind: "chat", id: existing.id });
    } else {
      const newChat: Chat = { id: Date.now(), contactId: contact.id, messages: [] };
      setChats(prev => [...prev, newChat]);
      switchView({ kind: "chat", id: newChat.id });
    }
    setShowContacts(false);
    setTab("chats");
  };

  const sendToChat = (text: string, type: "text" | "sticker" | "voice") => {
    if (!activeChat) return;
    const m: ChatMessage = { id: Date.now(), from: "me", text, time: getNow(), type };
    setChats(prev => prev.map(c => c.id === activeChat.id ? { ...c, messages: [...c.messages, m] } : c));
  };

  const sendToGroup = (text: string, type: "text" | "sticker" | "voice") => {
    if (!activeGroup) return;
    const m: ChatMessage = { id: Date.now(), from: "me", text, time: getNow(), type };
    setGroupChats(prev => prev.map(g => g.id === activeGroup.id ? { ...g, messages: [...g.messages, m] } : g));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfile(p => ({ ...p, photo: url }));
  };

  const filteredContacts = ALL_CONTACTS.filter(c =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.username.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const isActive = activeView !== null;
  const callerName = activeChatContact?.name ?? activeGroup?.name ?? "";
  const callerAvatar = activeChatContact?.avatar ?? activeGroup?.avatar ?? "?";

  const lastMsg = (chat: Chat) => {
    const last = chat.messages[chat.messages.length - 1];
    if (!last) return "Напишите первым...";
    if (last.type === "sticker") return last.emoji ?? "Стикер";
    if (last.type === "voice")   return "🎵 Голосовое";
    return last.text;
  };

  const SETTING_LABELS: Partial<Record<keyof ProfileSettings, string>> = {
    name: "Имя", username: "Никнейм", status: "Статус", notifications: "Уведомления",
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a0a12]">

      {/* ══════════════ SIDEBAR ══════════════ */}
      <aside className={`buzz-sidebar flex flex-col w-full md:w-80 shrink-0 border-r border-white/5 relative ${isActive ? "hidden md:flex" : "flex"}`}>

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
            ["chats",   "MessageCircle", "Чаты"],
            ["groups",  "Users",         "Группы"],
            ["profile", "User",          "Профиль"],
          ] as [Tab, string, string][]).map(([t, icon, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition-all duration-200 ${tab === t ? "buzz-tab-active" : "hover:bg-white/5"}`}>
              <Icon name={icon} size={17} className={tab === t ? "text-white" : "text-white/30"} />
              <span className={`text-[10px] font-semibold ${tab === t ? "text-white" : "text-white/25"}`}>{label}</span>
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-3 pb-20 custom-scroll">

          {/* CHATS */}
          {tab === "chats" && (
            chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center">
                  <span className="text-3xl">💬</span>
                </div>
                <div className="text-center">
                  <p className="text-white/50 font-semibold text-sm">Чатов пока нет</p>
                  <p className="text-white/25 text-xs mt-1">Нажми <span className="text-violet-400">+</span> чтобы найти кого написать</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {chats.map((chat, i) => {
                  const contact = ALL_CONTACTS.find(c => c.id === chat.contactId);
                  if (!contact) return null;
                  const isSelected = activeView?.kind === "chat" && activeView.id === chat.id;
                  return (
                    <button key={chat.id} onClick={() => switchView({ kind: "chat", id: chat.id })}
                      className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 text-left buzz-chat-item ${isSelected ? "buzz-tab-active" : "hover:bg-white/5"}`}
                      style={{ animationDelay: `${i * 40}ms` }}>
                      <div className="relative shrink-0">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${contact.color} flex items-center justify-center text-white font-bold text-base shadow-lg`}>
                          {contact.avatar}
                        </div>
                        {contact.online && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0a0a12]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-white font-semibold text-sm truncate">{contact.name}</span>
                          <span className="text-white/25 text-[11px] shrink-0 ml-2">{chat.messages[chat.messages.length - 1]?.time ?? ""}</span>
                        </div>
                        <p className="text-white/35 text-xs truncate">{lastMsg(chat)}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )
          )}

          {/* GROUPS */}
          {tab === "groups" && (
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setShowCreateGroup(true)}
                className="flex items-center gap-3 p-3 mb-2 rounded-2xl border border-dashed border-violet-500/30 hover:border-violet-500/60 hover:bg-violet-500/5 transition-all">
                <div className="w-10 h-10 rounded-xl buzz-gradient flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Icon name="Plus" size={18} className="text-white" />
                </div>
                <span className="text-violet-300 font-semibold text-sm">Создать группу</span>
              </button>
              {groupChats.map((g, i) => {
                const isSelected = activeView?.kind === "group" && activeView.id === g.id;
                const lastM = g.messages[g.messages.length - 1];
                return (
                  <button key={g.id}
                    onClick={() => switchView({ kind: "group", id: g.id })}
                    className={`flex items-center gap-3 p-3 rounded-2xl transition-all text-left buzz-chat-item ${isSelected ? "buzz-tab-active" : "hover:bg-white/5"}`}
                    style={{ animationDelay: `${i * 40}ms` }}>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                      {g.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-white font-semibold text-sm truncate">{g.name}</span>
                        <span className="text-white/25 text-[11px]">{lastM?.time ?? ""}</span>
                      </div>
                      <p className="text-white/35 text-xs truncate">{lastM?.text ?? "Нет сообщений"}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* PROFILE */}
          {tab === "profile" && (
            <div className="flex flex-col items-center pt-4 gap-4 buzz-fade-in">
              {/* Avatar */}
              <div className="relative">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-3xl buzz-gradient flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-violet-500/50 cursor-pointer overflow-hidden hover:opacity-90 transition-opacity"
                >
                  {profile.photo
                    ? <img src={profile.photo} className="w-full h-full object-cover" alt="avatar" />
                    : <span>{profile.name.charAt(0)}</span>
                  }
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#1a1a2e] border-2 border-[#0a0a12] flex items-center justify-center hover:bg-violet-500/30 transition-colors shadow-lg"
                >
                  <Icon name="Camera" size={13} className="text-violet-300" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#0a0a12]" />
              </div>

              <div className="text-center">
                <h2 className="text-white font-bold text-xl font-syne">{profile.name}</h2>
                <p className="text-white/35 text-sm">{profile.username}</p>
              </div>

              {/* Status */}
              <button
                onClick={() => setOpenSetting("status")}
                className="w-full p-3.5 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-2 hover:bg-white/8 transition-colors"
              >
                <span className="text-white/60 text-sm flex-1 text-left">{profile.status}</span>
                <Icon name="Pencil" size={13} className="text-white/30" />
              </button>

              {/* Settings list */}
              <div className="w-full flex flex-col gap-2">
                {([
                  ["name",          "User",    "Имя",          profile.name],
                  ["username",      "AtSign",  "Никнейм",      profile.username],
                  ["notifications", "Bell",    "Уведомления",  profile.notifications ? "Вкл" : "Выкл"],
                ] as [keyof ProfileSettings, string, string, string][]).map(([key, icon, label, sub]) => (
                  <button key={key}
                    onClick={() => setOpenSetting(key)}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors text-left border border-transparent hover:border-white/5"
                  >
                    <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                      <Icon name={icon} size={15} className="text-violet-300" />
                    </div>
                    <span className="text-white/75 text-sm font-medium flex-1">{label}</span>
                    <span className="text-white/30 text-xs">{sub}</span>
                    <Icon name="ChevronRight" size={13} className="text-white/15" />
                  </button>
                ))}

                {/* Тема — открывает модалку с выбором */}
                <button
                  onClick={() => setOpenSetting("theme_ui")}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors text-left border border-transparent hover:border-white/5"
                >
                  <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <Icon name={profile.theme === "dark" ? "Moon" : "Sun"} size={15} className="text-violet-300" />
                  </div>
                  <span className="text-white/75 text-sm font-medium flex-1">Оформление</span>
                  <span className="text-white/30 text-xs">{profile.theme === "dark" ? "Тёмная" : "Светлая"}</span>
                  <Icon name="ChevronRight" size={13} className="text-white/15" />
                </button>

                <button className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl hover:bg-red-500/10 transition-colors text-left border border-transparent hover:border-red-500/20 mt-1">
                  <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                    <Icon name="LogOut" size={15} className="text-red-400" />
                  </div>
                  <span className="text-red-400/80 text-sm font-medium flex-1">Выйти</span>
                  <Icon name="ChevronRight" size={13} className="text-white/15" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FAB — найти контакт, только на вкладке chats */}
        {tab === "chats" && (
          <button
            onClick={() => setShowContacts(true)}
            className="absolute bottom-5 left-4 w-12 h-12 rounded-2xl buzz-gradient flex items-center justify-center shadow-lg shadow-violet-500/40 hover:scale-105 active:scale-95 transition-transform z-10"
            title="Найти контакт"
          >
            <Icon name="UserPlus" size={18} className="text-white" />
          </button>
        )}
      </aside>

      {/* ══════════════ MAIN AREA ══════════════ */}
      <main className={`flex-1 flex flex-col relative ${!isActive ? "hidden md:flex" : "flex"}`}>
        {!isActive ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5">
            <div className="w-20 h-20 rounded-3xl buzz-gradient flex items-center justify-center shadow-2xl shadow-violet-500/50 buzz-pulse">
              <span className="text-white font-black text-4xl font-syne">B</span>
            </div>
            <div className="text-center">
              <p className="text-white/60 font-semibold text-base">Добро пожаловать в Buzz</p>
              <p className="text-white/25 text-sm mt-1">Выберите чат или группу слева</p>
            </div>
          </div>
        ) : activeView?.kind === "chat" && activeChat && activeChatContact ? (
          <ChatPanel
            name={activeChatContact.name}
            subtitle={activeChatContact.online ? "онлайн" : "был(а) недавно"}
            avatarEl={
              <div className="relative">
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${activeChatContact.color} flex items-center justify-center text-white font-bold shadow-lg`}>
                  {activeChatContact.avatar}
                </div>
                {activeChatContact.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0a12]" />}
              </div>
            }
            messages={activeChat.messages}
            onSend={sendToChat}
            onBack={() => switchView(null)}
            onCall={() => setCalling(true)}
            msg={chatMsg}
            setMsg={setChatMsg}
            showPanel={chatPanel}
            setPanel={setChatPanel}
          />
        ) : activeView?.kind === "group" ? (
          <ChatPanel
            name={activeGroup?.name ?? ""}
            subtitle={`${activeGroup?.members ?? 0} участников`}
            avatarEl={
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                {activeGroup?.avatar ?? "👥"}
              </div>
            }
            messages={activeGroup?.messages ?? []}
            onSend={sendToGroup}
            onBack={() => switchView(null)}
            onCall={() => setCalling(true)}
            msg={groupMsg}
            setMsg={setGroupMsg}
            showPanel={groupPanel}
            setPanel={setGroupPanel}
          />
        ) : null}
      </main>

      {/* ══════════════ CONTACTS DRAWER ══════════════ */}
      {showContacts && (
        <div className="fixed inset-0 z-40 flex items-end md:items-center md:justify-center buzz-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowContacts(false)} />
          <div className="relative w-full md:w-96 buzz-surface border border-white/10 rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col max-h-[80vh] buzz-slide-up">
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>
            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <h2 className="text-white font-bold text-lg font-syne">Контакты</h2>
              <button onClick={() => setShowContacts(false)} className="w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors">
                <Icon name="X" size={16} className="text-white/50" />
              </button>
            </div>
            <div className="px-4 pb-3">
              <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-3 py-2.5 border border-white/5 focus-within:border-violet-500/30 transition-all">
                <Icon name="Search" size={14} className="text-white/30 shrink-0" />
                <input value={contactSearch} onChange={e => setContactSearch(e.target.value)}
                  className="flex-1 bg-transparent text-white/70 text-sm outline-none placeholder:text-white/25"
                  placeholder="Найти контакт..." autoFocus />
              </div>
            </div>
            <div className="overflow-y-auto px-4 pb-6 flex flex-col gap-1 custom-scroll">
              {filteredContacts.length === 0 && (
                <div className="text-center py-8 text-white/30 text-sm">Ничего не найдено</div>
              )}
              {filteredContacts.map((contact, i) => (
                <button key={contact.id} onClick={() => openOrCreateChat(contact)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-all text-left buzz-chat-item"
                  style={{ animationDelay: `${i * 35}ms` }}>
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${contact.color} flex items-center justify-center text-white font-bold text-base shadow-lg`}>
                      {contact.avatar}
                    </div>
                    {contact.online && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#12121e]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 font-semibold text-sm truncate">{contact.name}</p>
                    <p className="text-white/30 text-xs truncate">{contact.username}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${contact.online ? "bg-emerald-400" : "bg-white/15"}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ CREATE GROUP MODAL ══════════════ */}
      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onCreate={group => setGroupChats(prev => [...prev, group])}
        />
      )}

      {/* ══════════════ PROFILE SETTING MODAL ══════════════ */}
      {openSetting && openSetting !== "theme_ui" && openSetting in SETTING_LABELS && (
        <ProfileSettingModal
          setting={SETTING_LABELS[openSetting as keyof ProfileSettings]!}
          value={profile[openSetting as keyof ProfileSettings] as string | boolean}
          onClose={() => setOpenSetting(null)}
          onSave={v => setProfile(p => ({ ...p, [openSetting]: v }))}
        />
      )}

      {/* Theme modal */}
      {openSetting === "theme_ui" && (
        <ProfileSettingModal
          setting="Оформление"
          value={profile.theme}
          onClose={() => setOpenSetting(null)}
          onSave={v => setProfile(p => ({ ...p, theme: v as "dark" | "light" }))}
        />
      )}

      {/* ══════════════ CALL OVERLAY ══════════════ */}
      {calling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center buzz-call-bg buzz-fade-in">
          <div className="flex flex-col items-center gap-8 p-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl buzz-gradient opacity-20 scale-125 blur-2xl" />
              <div className="absolute inset-0 rounded-3xl buzz-gradient opacity-10 scale-150 blur-3xl animate-ping" style={{ animationDuration: "2s" }} />
              <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-black text-5xl shadow-2xl shadow-violet-500/50">
                {callerAvatar}
              </div>
            </div>
            <div>
              <h2 className="text-white font-black text-3xl font-syne">{callerName}</h2>
              <p className="text-white/40 text-sm mt-2 tracking-widest uppercase">Звонок...</p>
            </div>
            <div className="flex gap-6">
              {[
                { icon: "MicOff",   bg: "bg-white/10 hover:bg-white/20", label: "Микро",      action: undefined },
                { icon: "Video",    bg: "bg-white/10 hover:bg-white/20", label: "Камера",     action: undefined },
                { icon: "PhoneOff", bg: "bg-red-500 hover:bg-red-400",   label: "Завершить",  action: () => setCalling(false) },
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