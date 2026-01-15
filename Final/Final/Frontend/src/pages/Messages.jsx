import React, { useState, useEffect, useRef } from "react";
import { Menu, X, User, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Messages() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  // Initialize real-time polling and fetch initial data
  useEffect(() => {
    // Get current user (from session/auth context)
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      navigate("/login");
      return;
    }
    setCurrentUserId(user.id);

    // Fetch all messages initially
    fetchMessages();

    // Poll for new messages every 2 seconds
    const pollInterval = setInterval(() => {
      fetchMessages();
    }, 2000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [navigate]);

  const fetchMessages = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/messages`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        
        // Extract unique users from messages
        const uniqueUsers = {};
        data.forEach((msg) => {
          const otherUserId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
          const otherUserName = msg.sender_id === currentUserId ? msg.receiver_name : msg.sender_name;
          if (!uniqueUsers[otherUserId]) {
            uniqueUsers[otherUserId] = {
              id: otherUserId,
              name: otherUserName,
            };
          }
        });
        setUsers(Object.values(uniqueUsers));
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedChat) return;

    const messageContent = input.trim();
    const tempId = Date.now();
    
    // Optimistically add message to UI
    const optimisticMessage = {
      id: tempId,
      sender_id: currentUserId,
      receiver_id: selectedChat.id,
      content: messageContent,
      created_at: new Date().toISOString(),
      sender_name: "You",
    };
    
    setMessages((prev) => [...prev, optimisticMessage]);
    setInput("");

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          receiver_id: selectedChat.id,
          content: messageContent,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Message sent:', result);
        
        // Replace optimistic message with real one
        setMessages((prev) => 
          prev.map(msg => msg.id === tempId ? result.data : msg)
        );
        
        // Fetch to sync with server
        setTimeout(() => fetchMessages(), 500);
      } else {
        console.error('Failed to send message:', response.status);
        // Remove optimistic message on error
        setMessages((prev) => prev.filter(msg => msg.id !== tempId));
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter(msg => msg.id !== tempId));
    }
  };

  // Filter messages for selected chat
  const selectedChatMessages = selectedChat
    ? messages.filter(
        (msg) =>
          (msg.sender_id === currentUserId && msg.receiver_id === selectedChat.id) ||
          (msg.sender_id === selectedChat.id && msg.receiver_id === currentUserId)
      )
    : [];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 relative">


      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 md:hidden">
          <button
            className="text-gray-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <h2 className="font-semibold text-lg">Messages</h2>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* User List */}
          <div className="hidden md:flex flex-col w-72 border-r border-gray-200 bg-white">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-lg">Chats</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedChat(user)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition ${
                    selectedChat?.id === user.id ? "bg-indigo-50" : ""
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-800">{user.name}</h3>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat window */}
          <div className="flex-1 flex flex-col bg-gray-50">
            {selectedChat ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedChat.name}</h3>
                    <p className="text-xs text-gray-500">Active now</p>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                  {selectedChatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`mb-4 flex ${
                        msg.sender_id === currentUserId ? "justify-end" : "justify-start"
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

                {/* Input bar */}
                <div className="flex items-center gap-2 p-4 border-t bg-white">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
    </div>
  );
}

/* -------------------------
   Reusable Sidebar Item
------------------------- */
function NavItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-sm font-medium transition ${
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
      }`}
    >
      <span>{label}</span>
    </button>
  );
}
