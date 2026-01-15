import React, { createContext, useContext, useState, useEffect } from 'react';

const SessionContext = createContext();

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState(() => {
    // Load sessions from localStorage on initial render
    const savedSessions = localStorage.getItem('bookedSessions');
    return savedSessions ? JSON.parse(savedSessions) : [
      {
        id: 1,
        title: "Linear Algebra – Matrix Multiplication",
        tutor: "Dr. Lisa Wang",
        date: "Monday, Oct 28, 2025",
        time: "3:00 PM - 4:00 PM",
        credits: 10,
        status: "Upcoming",
        link: "https://meet.google.com/abc-defg-hij",
        notes: ""
      },
      {
        id: 2,
        title: "JavaScript Advanced – Asynchronous Programming",
        tutor: "James Miller",
        date: "Tuesday, Oct 29, 2025",
        time: "5:30 PM - 6:30 PM",
        credits: 12,
        status: "Upcoming",
        link: "https://meet.google.com/xyz-pqrs-tuv",
        notes: ""
      },
      {
        id: 3,
        title: "Spanish Conversation Practice",
        tutor: "Miguel Rodriguez",
        date: "Thursday, Oct 31, 2025",
        time: "10:00 AM - 10:45 AM",
        credits: 8,
        status: "Upcoming",
        link: "https://meet.google.com/mno-stuv-wxy",
        notes: ""
      },
    ];
  });

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bookedSessions', JSON.stringify(sessions));
  }, [sessions]);

  const addSession = (session) => {
    setSessions(prevSessions => [...prevSessions, session]);
  };

  const deleteSession = (sessionId) => {
    setSessions(prevSessions => prevSessions.filter(s => s.id !== sessionId));
  };

  const updateSession = (sessionId, updatedData) => {
    setSessions(prevSessions =>
      prevSessions.map(s => s.id === sessionId ? { ...s, ...updatedData } : s)
    );
  };

  return (
    <SessionContext.Provider value={{ sessions, addSession, deleteSession, updateSession }}>
      {children}
    </SessionContext.Provider>
  );
};
