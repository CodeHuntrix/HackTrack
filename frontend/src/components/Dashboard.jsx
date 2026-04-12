import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import MagicPaste from './MagicPaste';
import SmartList from './SmartList';
import HackathonForm from './HackathonForm';

const Dashboard = () => {
  const [hackathons, setHackathons] = useState([]);
  const [editingHackathon, setEditingHackathon] = useState(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHackathons();
  }, []);

  const loadHackathons = async () => {
    try {
      const data = await api.getHackathons();
      setHackathons(data);
    } catch (err) {
      console.error("Failed to load:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      await api.saveHackathon(data, data.id);
      setEditingHackathon(null);
      setShowManualForm(false);
      loadHackathons();
    } catch (err) {
      alert("Error saving: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this hackathon? Data will be lost.")) {
      try {
        await api.deleteHackathon(id);
        loadHackathons();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const handleAIRExtraction = (data) => {
    // When AI extracts data, we open the form pre-filled so user can review it
    setEditingHackathon(data);
  };

  return (
    <div className="container">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl gradient-text mb-2">HackTrack V0</h1>
          <p className="text-muted">Mastering deadlines for Riyaz & Team</p>
        </div>
        {!editingHackathon && !showManualForm && (
          <button onClick={() => setShowManualForm(true)} className="btn btn-secondary">
            + Manual Entry
          </button>
        )}
      </header>

      {(editingHackathon || showManualForm) ? (
        <HackathonForm 
          initialData={editingHackathon} 
          onSave={handleSave} 
          onCancel={() => {
            setEditingHackathon(null);
            setShowManualForm(false);
          }} 
        />
      ) : (
        <>
          <MagicPaste onResult={handleAIRExtraction} />
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Tracker</h2>
            <div className="text-xs text-muted">{hackathons.length} Event(s) Tracking</div>
          </div>

          <SmartList 
            hackathons={hackathons} 
            onEdit={setEditingHackathon} 
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
