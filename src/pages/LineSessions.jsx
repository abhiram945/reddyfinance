import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddLinePopUp from "../components/AddLinePopUp";

const LineSessions = () => {
  const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  const sessions = ["morning", "afternoon"];
  const [entries, setEntries] = useState({
    "line-1": {
      password: "1234",
      days: {
        "monday": {
          sessions: ["morning"]
        }
      }
    },
    "line-2": {
      password: "5678",
      days: {
        "tuesday": {
          sessions: ["afternoon"]
        }
      }
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('lines');
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [addMode, setAddMode] = useState('line'); // 'line', 'day', 'session'
  const navigate = useNavigate();

  // Add functions
  const addLine = (line, password) => {
    setEntries({
      ...entries,
      [line]: { password, days: {} }
    });
  };

  const addDay = (line, day) => {
    setEntries({
      ...entries,
      [line]: {
        ...entries[line],
        days: {
          ...entries[line].days,
          [day]: { sessions: [] }
        }
      }
    });
  };

  const addSession = (line, day, session) => {
    const newSessions = [...(entries[line].days[day].sessions || []), session];
    setEntries({
      ...entries,
      [line]: {
        ...entries[line],
        days: {
          ...entries[line].days,
          [day]: { sessions: newSessions }
        }
      }
    });
  };

  const onAdd = (data) => {
    if (addMode === 'line') {
      addLine(data.line, data.password);
    } else if (addMode === 'day') {
      addDay(selectedLine, data.day);
    } else if (addMode === 'session') {
      addSession(selectedLine, selectedDay, data.session);
    }
    setIsModalOpen(false);
  };

  // Handle line click: prompt password
  const handleLineClick = (line) => {
    const userPwd = window.prompt(`Enter password for ${line}:`);
    if (entries[line] && entries[line].password === userPwd) {
      setSelectedLine(line);
      setCurrentView('days');
    } else {
      window.alert("Incorrect password");
    }
  };

  // Handle day click
  const handleDayClick = (day) => {
    setSelectedDay(day);
    setCurrentView('sessions');
  };

  // Handle session click
  const handleSessionClick = (session) => {
    navigate(`/${encodeURIComponent(selectedLine)}/${selectedDay}/${session}`);
  };

  // Back handlers
  const backToLines = () => {
    setCurrentView('lines');
    setSelectedLine(null);
    setSelectedDay(null);
  };

  const backToDays = () => {
    setCurrentView('days');
    setSelectedDay(null);
  };

  // Get unique lines
  const uniqueLines = Object.keys(entries);

  // Get days for selected line
  const daysForLine = selectedLine ? Object.keys(entries[selectedLine].days) : [];

  // Get sessions for selected line and day
  const sessionsForDay = selectedLine && selectedDay ? entries[selectedLine].days[selectedDay].sessions : [];

  // Handle plus button click
  const handlePlusClick = () => {
    if (currentView === 'lines') {
      setAddMode('line');
    } else if (currentView === 'days') {
      setAddMode('day');
    } else if (currentView === 'sessions') {
      setAddMode('session');
    }
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700">
          Reddy Finance
        </h1>
        <p className="mt-2 text-gray-600">
          {currentView === 'lines' && 'Select a line'}
          {currentView === 'days' && `Days for ${selectedLine}`}
          {currentView === 'sessions' && `Sessions for ${selectedLine} on ${selectedDay}`}
        </p>
      </div>

      {/* Conditional rendering based on currentView */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
        {currentView === 'lines' && uniqueLines.map((line) => (
          <button
            key={line}
            onClick={() => handleLineClick(line)}
            className="py-3 px-4 bg-emerald-50 rounded-lg text-emerald-700 text-lg md:text-xl text-center font-medium hover:bg-emerald-600 hover:text-white transition-all duration-200"
          >
            {line.toUpperCase()}
          </button>
        ))}

        {currentView === 'days' && (
          <>
            <button
              onClick={backToLines}
              className="self-start mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              ← Back to Lines
            </button>
            {daysForLine.map((day) => (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className="py-3 px-4 bg-emerald-50 rounded-lg text-emerald-700 text-lg md:text-xl text-center font-medium hover:bg-emerald-600 hover:text-white transition-all duration-200"
              >
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </button>
            ))}
          </>
        )}

        {currentView === 'sessions' && (
          <>
            <button
              onClick={backToDays}
              className="self-start mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              ← Back to Days
            </button>
            {sessionsForDay.map((session) => (
              <button
                key={session}
                onClick={() => handleSessionClick(session)}
                className="py-3 px-4 bg-emerald-50 rounded-lg text-emerald-700 text-lg md:text-xl text-center font-medium hover:bg-emerald-600 hover:text-white transition-all duration-200"
              >
                {session.charAt(0).toUpperCase() + session.slice(1)}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Add button */}
      <button
        onClick={handlePlusClick}
        className="fixed right-5 bottom-5 w-14 h-14 rounded-full bg-white shadow-2xl shadow-emerald-600 flex items-center justify-center transition cursor-pointer"
      >
        <img className="w-10 h-10" src={`${import.meta.env.BASE_URL}plus.svg`} alt="add-entry" />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <AddLinePopUp
          onSubmit={onAdd}
          days={days}
          sessions={sessions}
          setIsModalOpen={setIsModalOpen}
          addMode={addMode}
        />
      )}
    </main>
  );
};

export default LineSessions;
