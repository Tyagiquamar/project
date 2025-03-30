import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../socket';
import { setStudent } from '../store/studentSlice';
import { setCurrentPoll, setPollResults } from '../store/pollSlice';
import type { RootState } from '../store';
import type { Student, Poll } from '../types';

const StudentView: React.FC = () => {
  const dispatch = useDispatch();
  const student = useSelector((state: RootState) => state.student.currentStudent);
  const currentPoll = useSelector((state: RootState) => state.poll.currentPoll);
  const results = useSelector((state: RootState) => state.poll.results);

  const [name, setName] = useState('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const storedStudent = localStorage.getItem('student');
    if (storedStudent) {
      const parsedStudent: Student = JSON.parse(storedStudent);
      dispatch(setStudent(parsedStudent));
      socket.connect();
      socket.emit('student:register', parsedStudent);
    }
  }, [dispatch]);

  useEffect(() => {
    socket.on('poll:new', (poll: Poll) => {
      dispatch(setCurrentPoll(poll));
      setTimeLeft(poll.timeLimit);
      setHasSubmitted(false);
      setSelectedOption('');
    });

    socket.on('poll:results_update', (results) => {
      dispatch(setPollResults(results));
    });

    return () => {
      socket.off('poll:new');
      socket.off('poll:results_update');
    };
  }, [dispatch]);

  useEffect(() => {
    if (timeLeft && timeLeft > 0 && !hasSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev ? prev - 1 : null));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, hasSubmitted]);

  const handleRegister = () => {
    if (!name.trim()) return;

    const newStudent: Student = {
      id: Date.now().toString(),
      name: name.trim(),
    };

    localStorage.setItem('student', JSON.stringify(newStudent));
    dispatch(setStudent(newStudent));
    socket.connect();
    socket.emit('student:register', newStudent);
  };

  const handleSubmit = () => {
    if (!selectedOption || !student || !currentPoll) return;

    socket.emit('student:submit_answer', {
      pollId: currentPoll.id,
      studentId: student.id,
      answer: selectedOption,
    });
    setHasSubmitted(true);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-[#7765DA] text-white py-2 px-4 rounded-full flex items-center">
              <span className="text-xl font-semibold">Interview Poll</span>
              <span className="ml-2 text-xl">⭐</span>
            </div>
          </div>
          <h1 className="text-4xl font-semibold text-center mb-4">Let’s Get Started</h1>
          <p className="text-center text-[#6E6E6E] mb-6">
            If you’re a student, you’ll be able to submit your answers, participate in live polls, and see how your responses compare with your classmates.
          </p>
          <div className="space-y-4 mb-6">
            <label className="block text-sm font-medium text-[#4B5563] mb-2">Enter your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rahul Bajaj"
              className="w-full p-3 border border-[#E5E7EB] rounded-xl text-[#1E1E1E] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleRegister}
              disabled={!name.trim()}
              className="w-full bg-blue-500 text-white py-3 rounded-xl mt-6 hover:bg-blue-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Waiting for Teacher - If no current poll
  if (!currentPoll) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] p-6">
        <div className="bg-[#7765DA] text-white py-2 px-4 rounded-full flex items-center mb-6">
          <span className="text-xl font-semibold">Interview Poll</span>
          <span className="ml-2 text-xl">⭐</span>
        </div>

        {/* Spinner and message */}
        <div className="text-center py-12">
          <div className="text-4xl mb-4 text-[#7765DA] animate-spin">
            
          </div>
          <p className="text-[#1E1E1E] text-2xl font-semibold mb-4">
            Wait for the teacher to ask questions..
          </p>
          <p className="text-[#6B7280] text-lg">
            We're waiting for the teacher to start the poll.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-[#1E1E1E]">Welcome, {student.name}</h1>
            {timeLeft !== null && !hasSubmitted && (
              <div className="text-lg font-medium text-red-500 flex items-center">
                {/* Clock Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-black-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
                </svg>
                Time left: {timeLeft}s
              </div>
            )}
          </div>

          {currentPoll ? (
            <div>
              <h2 className="text-xl font-medium text-[#1E1E1E] mb-6">{currentPoll.question}</h2>
              {!hasSubmitted && timeLeft && timeLeft > 0 ? (
                <div className="space-y-4">
                  {currentPoll.options.map((option) => (
                    <label
                      key={option}
                      className={`flex items-center gap-3 p-4 border ${
                        selectedOption === option
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-[#E5E7EB] hover:bg-gray-50'
                      } rounded-xl cursor-pointer transition-colors`}
                    >
                      <input
                        type="radio"
                        name="poll-option"
                        value={option}
                        checked={selectedOption === option}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        className="h-4 w-4 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-[#1E1E1E]">{option}</span>
                    </label>
                  ))}
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedOption}
                    className="w-full mt-6 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Submit Answer
                  </button>
                </div>
              ) : (
                results && (
                  <div className="space-y-6">
                    <h3 className="font-medium text-[#4B5563]">Results:</h3>
                    {currentPoll.options.map((option) => {
                      const votes = results.results[option] || 0;
                      const percentage = Math.round((votes / results.totalResponses) * 100);

                      return (
                        <div key={option} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-[#4B5563]">{option}</span>
                            <span className="font-medium text-[#4B5563]">{percentage}%</span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <p className="text-sm text-[#6B7280]">{votes} votes</p>
                        </div>
                      );
                    })}
                    <p className="text-sm text-[#6B7280] pt-4 border-t border-[#E5E7EB]">
                      Total responses: {results.totalResponses}
                    </p>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#6B7280] text-lg">Waiting for the teacher to start a poll...</p>
            </div>
          )}
        </div>
      </div>

      {/* Chatbot Icon */}
      <div
        onClick={toggleChat}
        className="fixed bottom-4 right-4 bg-[#7765DA] text-white p-3 rounded-full cursor-pointer shadow-lg"
      >
        <span className="text-2xl">💬</span>
      </div>

      {/* Chatbot Dialog */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Chat & Participants</h2>
            <div className="space-y-4">
              <textarea
                placeholder="Type your message..."
                className="w-full p-3 border border-[#E5E7EB] rounded-lg"
              />
              <div>
                <p className="font-semibold">Participants:</p>
                <ul className="list-disc ml-6">
                  <li>Rahul Bajaj</li>
                  <li>John Doe</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={toggleChat}
                className="bg-[#7765DA] text-white px-4 py-2 rounded-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentView;
