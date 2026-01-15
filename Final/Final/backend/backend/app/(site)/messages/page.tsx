"use client";

import React, { useState, useEffect } from "react";
import { Send, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  sender_name?: string;
  receiver_name?: string;
}

interface ChatUser {
  id: number;
  name: string;
  email?: string;
  profile_pic?: string;
}

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [users, setUsers] = useState<ChatUser[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [input, setInput] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [allUsers, setAllUsers] = useState<ChatUser[]>([]);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Load chat list & messages
  useEffect(() => {
    async function loadData() {
      if (!session?.user?.id) return;
      
      try {
        const msgs = await fetch("/api/messages").then(r => r.json());

        // 1) set messages
        setMessages(msgs);

        // 2) build unique chat partners with real names
        const currentUserId = parseInt(session.user.id);
        const map: Record<number, ChatUser> = {};
        msgs.forEach((m: Message) => {
          const uid =
            m.sender_id === currentUserId ? m.receiver_id : m.sender_id;
          const name = 
            m.sender_id === currentUserId ? m.receiver_name : m.sender_name;

          map[uid] = { id: uid, name: name || "User " + uid };
        });

        setUsers(Object.values(map));
      } catch (e) {
        console.log("Error loading messages", e);
      }
    }

    loadData();

    // Poll for new messages every 2 seconds for real-time updates
    const pollInterval = setInterval(() => {
      loadData();
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [session]);

  // Load all users for New Chat modal
  useEffect(() => {
    async function loadAllUsers() {
      if (!session?.user?.id) return;
      
      try {
        const data = await fetch("/api/users").then(r => r.json());
        // Filter out current user
        const filtered = data.filter((u: ChatUser) => u.id !== parseInt(session.user.id));
        setAllUsers(filtered);
      } catch (e) {
        console.log("Error loading users", e);
      }
    }

    loadAllUsers();
  }, [session]);

  // Filter messages for selected chat
  const currentUserId = session?.user?.id ? parseInt(session.user.id) : 0;
  const chatMessages = selectedUser
    ? messages.filter(
        (m) =>
          (m.sender_id === currentUserId &&
            m.receiver_id === selectedUser.id) ||
          (m.sender_id === selectedUser.id &&
            m.receiver_id === currentUserId)
      )
    : [];

  // Send message
  const handleSend = async () => {
    if (!input.trim() || !selectedUser || !session?.user?.id) return;

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiver_id: selectedUser.id,
        content: input.trim(),
      }),
    });

    // Optimistic update
    const newMsg: Message = {
      id: Date.now(),
      sender_id: parseInt(session.user.id),
      receiver_id: selectedUser.id,
      content: input.trim(),
      created_at: new Date().toISOString(),
      sender_name: session.user.name || "You",
      receiver_name: selectedUser.name,
    };
    setMessages((prev) => [...prev, newMsg]);

    // Add user to chat list if not already there
    if (!users.find(u => u.id === selectedUser.id)) {
      setUsers(prev => [...prev, selectedUser]);
    }

    setInput("");
  };

  // Start new chat with selected user
  const handleStartChat = (user: ChatUser) => {
    setSelectedUser(user);
    setShowNewChatModal(false);
    // Add to chat list if not already there
    if (!users.find(u => u.id === user.id)) {
      setUsers(prev => [...prev, user]);
    }
  };

  // Show loading state
  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Don't render if no session
  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 relative">
      <div className="flex-1 flex flex-col">
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT SIDEBAR USER LIST */}
          <div className="hidden md:flex flex-col w-72 border-r bg-white">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <h2 className="font-semibold text-lg">Chats</h2>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-indigo-600"
                title="New Chat"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  className={`w-full text-left px-4 py-3 border-b hover:bg-gray-50 transition ${
                    selectedUser?.id === u.id ? "bg-indigo-50" : ""
                  }`}
                >
                  <h3 className="font-medium text-gray-800">{u.name}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    Chat with {u.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* CHAT WINDOW */}
          <div className="flex-1 flex flex-col bg-gray-50">
            {selectedUser ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
                  <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`mb-4 flex ${
                        msg.sender_id === currentUserId
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 text-sm ${
                          msg.sender_id === currentUserId
                            ? "bg-indigo-900 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className="text-[10px] text-gray-400 mt-1 text-right">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="flex items-center gap-2 p-4 border-t bg-white">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-100 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <button
                    onClick={handleSend}
                    className="bg-indigo-900 hover:bg-indigo-700 text-white p-2 rounded-lg"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a chat to start messaging.
              </div>
            )}
          </div>

        </div>
      </div>

      {/* NEW CHAT MODAL */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">New Chat</h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {allUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No users available</p>
              ) : (
                <div className="space-y-2">
                  {allUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleStartChat(user)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition text-left"
                    >
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{user.name}</h4>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
