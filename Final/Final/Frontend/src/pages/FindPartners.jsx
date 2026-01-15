import React, { useState } from "react";
import {
  Search,
  Filter,
  Star,
  Zap,
  MapPin,
  Clock,
  Menu,
  X,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../contexts/SessionContext";

export default function FindPartners() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [subject, setSubject] = useState("");
  const [creditsSort, setCreditsSort] = useState("");
  const [availability, setAvailability] = useState("");
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({ date: '', time: '', notes: '' });
  const navigate = useNavigate();
  const { addSession } = useSession();

  const subjectOptions = [
    "Mathematics",
    "Statistics",
    "Data Analysis",
    "Programming",
    "Web Development",
    "Algorithms",
    "Chemistry",
    "Organic Chemistry",
    "Biochemistry",
    "Physics",
    "Engineering"
  ];

  const creditsOptions = [
    { label: "High to Low", value: "high-low" },
    { label: "Low to High", value: "low-high" }
  ];

  const availabilityOptions = [
    "Available now",
    "Available today",
    "Available tomorrow"
  ];

  const partners = [
    {
      id: 1,
      initials: "DER",
      name: "Dr. Elena Rodriguez",
      rating: 4.9,
      sessions: 156,
      match: 95,
      rate: 18,
      expertise: ["Advanced Mathematics", "Statistics", "Data Analysis"],
      bio: "PhD in Mathematics with 8 years of tutoring experience. Specializes in making complex concepts accessible.",
      response: "< 2 hours",
      languages: ["English", "Spanish"],
      availability: "Available now",
      online: true,
    },
    {
      id: 2,
      initials: "MC",
      name: "Marcus Chen",
      rating: 4.8,
      sessions: 89,
      match: 92,
      rate: 15,
      expertise: ["Programming", "Web Development", "Algorithms"],
      bio: "Senior Software Engineer at tech startup. Passionate about teaching coding and problem-solving.",
      response: "< 1 hour",
      languages: ["English", "Mandarin"],
      availability: "Available today",
      online: true,
    },
    {
      id: 3,
      initials: "PSW",
      name: "Prof. Sarah Williams",
      rating: 4.9,
      sessions: 203,
      match: 88,
      rate: 20,
      expertise: ["Chemistry", "Organic Chemistry", "Biochemistry"],
      bio: "University Professor with extensive research background. Expert in laboratory techniques.",
      response: "< 3 hours",
      languages: ["English"],
      availability: "Available tomorrow",
      online: true,
    },
    {
      id: 4,
      initials: "AH",
      name: "Ahmed Hassan",
      rating: 4.7,
      sessions: 67,
      match: 85,
      rate: 14,
      expertise: ["Physics", "Engineering", "Mathematics"],
      bio: "Mechanical Engineer and physics enthusiast. Great at explaining complex physics concepts.",
      response: "< 1 hour",
      languages: ["English", "Arabic"],
      availability: "Available now",
      online: true,
    },
  ];

  // Filtering logic
  let filteredPartners = partners.filter((p) => {
    // Search by name, subject, or expertise
    const searchMatch =
      searchTerm === "" ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.expertise.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    // Subject filter
    const subjectMatch =
      subject === "" || p.expertise.includes(subject);

    // Availability filter
    const availabilityMatch =
      availability === "" || p.availability === availability;

    return searchMatch && subjectMatch && availabilityMatch;
  });

  // Credits sorting
  if (creditsSort === "high-low") {
    filteredPartners = filteredPartners.sort((a, b) => b.rate - a.rate);
  } else if (creditsSort === "low-high") {
    filteredPartners = filteredPartners.sort((a, b) => a.rate - b.rate);
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 relative">
      {/* View Profile Modal */}
      {selectedPartner && !bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setSelectedPartner(null)}
              aria-label="Close"
            >
              <X size={22} />
            </button>
            <div className="flex gap-4 items-center mb-4">
              <div className="h-14 w-14 shrink-0 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-lg">
                {selectedPartner.initials}
              </div>
              <div>
                <h2 className="font-bold text-xl mb-1">{selectedPartner.name}</h2>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Star className="text-yellow-400 fill-yellow-400" size={16} />
                  {selectedPartner.rating} <span className="text-gray-400">({selectedPartner.sessions} sessions)</span>
                </p>
              </div>
            </div>
            <div className="mb-2">
              <span className="font-medium text-sm">Expertise:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedPartner.expertise.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2">{selectedPartner.bio}</p>
            <div className="flex flex-wrap gap-3 mb-2 text-sm">
              <span className="flex items-center gap-1"><Zap className="text-indigo-600" size={16} /> {selectedPartner.match}% match</span>
              <span className="text-gray-500">{selectedPartner.rate} credits/hr</span>
            </div>
            <div className="flex flex-wrap gap-3 mb-2 text-sm">
              <span className="flex items-center gap-1"><Clock size={14} /> Response: {selectedPartner.response}</span>
              <span className="flex items-center gap-1"><MapPin size={14} /> {selectedPartner.online ? "Online" : "Offline"}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedPartner.languages.map((lang) => (
                <span key={lang} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{lang}</span>
              ))}
            </div>
            <p className="text-sm text-green-600 font-medium mb-2">{selectedPartner.availability}</p>
            <div className="flex justify-end mt-4 gap-2">
              <button
                className="px-4 py-2 bg-indigo-900 hover:bg-indigo-700 text-white rounded-lg text-sm"
                onClick={() => setSelectedPartner(null)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg text-sm"
                onClick={() => setBookingModalOpen(true)}
              >
                Book Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {selectedPartner && bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setBookingModalOpen(false)}
              aria-label="Close"
            >
              <X size={22} />
            </button>
            <h2 className="font-bold text-xl mb-2">Book Session with {selectedPartner.name}</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                
                // Generate a unique meeting link
                const generateMeetingLink = () => {
                  const chars = 'abcdefghijklmnopqrstuvwxyz';
                  const randomStr = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
                  return `https://meet.google.com/${randomStr()}-${randomStr()}-${randomStr()}`;
                };

                // Format the date
                const formatDate = (dateStr) => {
                  const date = new Date(dateStr);
                  const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
                  return date.toLocaleDateString('en-US', options);
                };

                // Format the time
                const formatTime = (timeStr) => {
                  const [hours, minutes] = timeStr.split(':');
                  const hour = parseInt(hours);
                  const ampm = hour >= 12 ? 'PM' : 'AM';
                  const displayHour = hour % 12 || 12;
                  return `${displayHour}:${minutes} ${ampm}`;
                };

                // Calculate end time (1 hour session)
                const calculateEndTime = (timeStr) => {
                  const [hours, minutes] = timeStr.split(':');
                  const hour = parseInt(hours);
                  const endHour = (hour + 1) % 24;
                  const ampm = endHour >= 12 ? 'PM' : 'AM';
                  const displayHour = endHour % 12 || 12;
                  return `${displayHour}:${minutes} ${ampm}`;
                };

                // Create new session object
                const newSession = {
                  id: Date.now(),
                  title: `Session with ${selectedPartner.name}`,
                  tutor: selectedPartner.name,
                  date: formatDate(bookingDetails.date),
                  time: `${formatTime(bookingDetails.time)} - ${calculateEndTime(bookingDetails.time)}`,
                  credits: selectedPartner.rate,
                  status: "Upcoming",
                  link: generateMeetingLink(),
                  notes: bookingDetails.notes,
                  expertise: selectedPartner.expertise.join(', ')
                };

                // Add session to context
                addSession(newSession);

                // Reset form and modals
                setBookingModalOpen(false);
                setSelectedPartner(null);
                setBookingDetails({ date: '', time: '', notes: '' });

                // Navigate to sessions page
                navigate('/dashboard/sessions');
              }}
              className="flex flex-col gap-4 mt-2"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white"
                  value={bookingDetails.date}
                  onChange={e => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white"
                  value={bookingDetails.time}
                  onChange={e => setBookingDetails({ ...bookingDetails, time: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white"
                  rows={2}
                  value={bookingDetails.notes}
                  onChange={e => setBookingDetails({ ...bookingDetails, notes: e.target.value })}
                  placeholder="Add any notes for your session..."
                />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                  onClick={() => setBookingModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-900 hover:bg-indigo-700 text-white rounded-lg text-sm"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile top bar with menu */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 md:hidden">
          <button
            className="text-gray-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <h2 className="font-semibold text-lg">Find Learning Partners</h2>
        </div>

        <div className="flex-1 px-4 md:px-8 py-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              Find Learning Partners
            </h1>
            <p className="text-gray-500 mb-6 text-sm md:text-base">
              Discover expert tutors and study partners matched to your learning goals
            </p>

            {/* Search & Filter */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-3 md:gap-4">
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 flex-1">
                <Search size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search by subject, skill, or name..."
                  className="w-full bg-transparent focus:ring-0 border-none text-sm text-gray-700 placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  className="border border-gray-200 rounded-lg text-sm px-3 py-2 text-gray-700 bg-white focus:ring-indigo-500 focus:border-indigo-500"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option value="">Subject</option>
                  {subjectOptions.map((subj) => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
                <select
                  className="border border-gray-200 rounded-lg text-sm px-3 py-2 text-gray-700 bg-white focus:ring-indigo-500 focus:border-indigo-500"
                  value={creditsSort}
                  onChange={(e) => setCreditsSort(e.target.value)}
                >
                  <option value="">Credits</option>
                  {creditsOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <select
                  className="border border-gray-200 rounded-lg text-sm px-3 py-2 text-gray-700 bg-white focus:ring-indigo-500 focus:border-indigo-500"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                >
                  <option value="">Availability</option>
                  {availabilityOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                <button className="bg-gray-100 hover:bg-gray-200 rounded-lg p-2 text-gray-700">
                  <Filter size={18} />
                </button>
              </div>
            </div>

            {/* Partners List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPartners.length === 0 ? (
                <div className="col-span-2 text-center text-gray-500 py-10">No partners found.</div>
              ) : (
                filteredPartners.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div className="flex gap-4">
                        <div className="h-12 w-12 shrink-0 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
                          {p.initials}
                        </div>
                        <div>
                          <h2 className="font-semibold text-base md:text-lg">
                            {p.name}
                          </h2>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Star className="text-yellow-400 fill-yellow-400" size={14} />
                            {p.rating} {" "}
                            <span className="text-gray-400">
                              ({p.sessions} sessions)
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="text-sm text-right">
                        <p className="text-gray-700 flex items-center justify-end gap-1">
                          <Zap className="text-indigo-600" size={16} />
                          <span className="font-medium">{p.match}% match</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {p.rate} credits/hr
                        </p>
                      </div>
                    </div>

                    {/* Expertise */}
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-1">Expertise</p>
                      <div className="flex flex-wrap gap-2">
                        {p.expertise.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-gray-600 mt-2">{p.bio}</p>

                    {/* Response + Languages */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-3 gap-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-gray-600">
                        <p className="flex items-center gap-1">
                          <Clock size={14} /> Response: {p.response}
                        </p>
                        <p className="flex items-center gap-1">
                          <MapPin size={14} /> {p.online ? "Online" : "Offline"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {p.languages.map((lang) => (
                          <span
                            key={lang}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-green-600 font-medium mt-2">
                      {p.availability}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-4">
                      <button
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                        onClick={() => setSelectedPartner(p)}
                      >
                        View Profile
                      </button>
                      <button
                        className="px-4 py-2 bg-indigo-900 hover:bg-indigo-700 text-white rounded-lg text-sm"
                        onClick={() => { setSelectedPartner(p); setBookingModalOpen(true); }}
                      >
                        Book Session
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
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
