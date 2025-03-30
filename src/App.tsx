import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import TeacherView from './components/TeacherView';
import RoleSelection from './components/Roll';
import StudentView from './components/StudentView';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/teacher" element={<TeacherView />} />
            <Route path="/" element={<RoleSelection />} />
            <Route path="/student" element={<StudentView />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;