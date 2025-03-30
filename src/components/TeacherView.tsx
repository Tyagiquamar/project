import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusCircle, X } from 'lucide-react';
import { socket } from '../socket';
import { setCurrentPoll, setPollResults } from '../store/pollSlice';
import type { RootState } from '../store';
import type { Poll } from '../types';

const TeacherView: React.FC = () => {
  const dispatch = useDispatch();
  const currentPoll = useSelector((state: RootState) => state.poll.currentPoll);
  const results = useSelector((state: RootState) => state.poll.results);
  
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timeLimit, setTimeLimit] = useState(60);

  useEffect(() => {
    socket.connect();

    socket.on('poll:results_update', (results) => {
      dispatch(setPollResults(results));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const createPoll = () => {
    if (!question || options.some(opt => !opt)) return;

    const newPoll: Poll = {
      id: Date.now().toString(),
      question,
      options: options.filter(Boolean),
      timeLimit,
      createdAt: Date.now(),
      isActive: true,
    };

    socket.emit('teacher:create_poll', newPoll);
    dispatch(setCurrentPoll(newPoll));
    setQuestion('');
    setOptions(['', '']);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#1E1E1E] mb-8">Teacher Dashboard</h1>
        
        {!currentPoll ? (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-[#1E1E1E] mb-6">Create New Poll</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-2">
                  Question
                </label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full p-3 border border-[#E5E7EB] rounded-xl text-[#1E1E1E] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type your question here"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-2">
                  Options
                </label>
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...options];
                          newOptions[index] = e.target.value;
                          setOptions(newOptions);
                        }}
                        className="flex-1 p-3 border border-[#E5E7EB] rounded-xl text-[#1E1E1E] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Option ${index + 1}`}
                      />
                      {index >= 2 && (
                        <button
                          onClick={() => setOptions(options.filter((_, i) => i !== index))}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {options.length < 4 && (
                  <button
                    onClick={() => setOptions([...options, ''])}
                    className="flex items-center text-blue-500 gap-2 mt-3 hover:text-blue-600 transition-colors"
                  >
                    <PlusCircle size={20} />
                    Add Option
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-2">
                  Time Limit (seconds)
                </label>
                <input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  min="10"
                  max="300"
                  className="w-32 p-3 border border-[#E5E7EB] rounded-xl text-[#1E1E1E] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={createPoll}
                className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition-colors font-medium"
              >
                Create Poll
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-[#1E1E1E] mb-6">Live Results</h2>
            <div className="mb-6">
              <p className="text-xl font-medium text-[#1E1E1E] mb-4">{currentPoll.question}</p>
              <div className="space-y-4">
                {currentPoll.options.map((option) => {
                  const votes = results?.results[option] || 0;
                  const percentage = results?.totalResponses 
                    ? Math.round((votes / results.totalResponses) * 100) 
                    : 0;
                    
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
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-[#E5E7EB]">
              <p className="text-sm text-[#6B7280]">
                Total responses: {results?.totalResponses || 0}
              </p>
              <p className="text-sm text-[#6B7280]">
                Time remaining: {currentPoll.timeLimit}s
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherView;