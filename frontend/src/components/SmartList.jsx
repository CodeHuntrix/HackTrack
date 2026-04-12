import React, { useState } from 'react';

const StatusBadge = ({ status }) => {
  const colors = {
    Upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    Live: 'bg-green-500/20 text-green-400 border-green-500/50',
    Submitted: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
    Selected: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    Rejected: 'bg-red-500/20 text-red-400 border-red-500/50',
    Ended: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
  };

  const colorStyle = colors[status] || colors.Upcoming;
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colorStyle}`} style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '11px', borderStyle: 'solid', borderWidth: '1px' }}>
      {status}
    </span>
  );
};

const SmartList = ({ hackathons, onEdit, onDelete, onStatusChange }) => {
  const [expandedId, setExpandedId] = useState(null);

  const formatTimeLeft = (dateStr) => {
    if (!dateStr) return 'N/A';
    const deadline = new Date(dateStr);
    const now = new Date();
    const diff = deadline - now;
    if (diff < 0) return 'Deadline Passed';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days}d left`;
  };

  return (
    <div className="glass-panel w-full overflow-hidden fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/50">
              <th className="p-4 text-xs font-bold text-muted uppercase">Hackathon</th>
              <th className="p-4 text-xs font-bold text-muted uppercase">Round 1 Deadline</th>
              <th className="p-4 text-xs font-bold text-muted uppercase">Focus</th>
              <th className="p-4 text-xs font-bold text-muted uppercase">Status</th>
              <th className="p-4 text-xs font-bold text-muted uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hackathons.map((h) => (
              <React.Fragment key={h.id}>
                <tr 
                  className={`border-b border-slate-800 hover:bg-slate-800/30 transition-colors cursor-pointer ${expandedId === h.id ? 'bg-slate-800/40' : ''}`}
                  onClick={() => setExpandedId(expandedId === h.id ? null : h.id)}
                >
                  <td className="p-4">
                    <div className="font-semibold">{h.title}</div>
                    <div className="text-xs text-muted">{h.platform} • {h.mode}</div>
                  </td>
                  <td className="p-4 font-mono text-secondary">
                    {formatTimeLeft(h.submission_deadline)}
                  </td>
                  <td className="p-4 text-sm">
                    {h.team_size} members
                  </td>
                  <td className="p-4">
                    <StatusBadge status={h.status} />
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => onEdit(h)} className="text-xs text-primary hover:underline">Edit</button>
                      <button onClick={() => onDelete(h.id)} className="text-xs text-accent hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>

                {/* Expanded "Noise" Drawer */}
                {expandedId === h.id && (
                  <tr className="bg-slate-900/50">
                    <td colSpan="5" className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-in">
                        <div>
                          <h4 className="text-xs font-bold text-muted uppercase mb-2">Detailed Criteria</h4>
                          <p className="text-sm"><strong>Type:</strong> {h.round_1_type}</p>
                          <p className="text-sm mt-1">{h.round_1_criteria}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-bold text-muted uppercase mb-2">The "Noise" Details</h4>
                          {h.extra_data?.venue && <p className="text-sm">📍 <strong>Venue:</strong> {h.extra_data.venue}</p>}
                          {h.extra_data?.fee && <p className="text-sm">💰 <strong>Fee:</strong> {h.fee}</p>}
                          {h.extra_data?.contacts && (
                            <div className="mt-2 text-sm italic">
                              <strong>Contact:</strong> {h.extra_data.contacts[0]?.name} ({h.extra_data.contacts[0]?.phone})
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-muted uppercase mb-2">Checklist</h4>
                          <div className="flex flex-col gap-1">
                            {['PPT', 'Idea Doc', 'Video', 'Project'].map(item => (
                              <label key={item} className="flex items-center gap-2 text-sm cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                <input 
                                  type="checkbox" 
                                  checked={h.checklist?.[item] || false} 
                                  onChange={() => {}} // TODO: Handle checklist update
                                  className="accent-primary" 
                                />
                                <span className={h.checklist?.[item] ? 'text-primary' : 'text-muted'}>{item}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {hackathons.length === 0 && (
              <tr>
                <td colSpan="5" className="p-10 text-center text-muted italic">No hackathons tracked yet. Use Magic Paste to start!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SmartList;
