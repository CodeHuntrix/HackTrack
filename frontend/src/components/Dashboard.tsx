import React, { useState, useEffect, useMemo } from 'react';
import { api, HackathonData } from '../services/api';
import MagicPaste from './MagicPaste';
import { HackathonDataTable } from './ui/hackathon-data-table';
import HackathonForm from './HackathonForm';
import Modal from './Modal';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Plus, 
  Sparkles, 
  LayoutDashboard, 
  Search,
  Filter
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const INITIAL_COLUMNS = new Set(["title", "deadline", "prize", "team", "status", "team_members"]);

const Dashboard = () => {
  const [hackathons, setHackathons] = useState<HackathonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMagicModal, setShowMagicModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingData, setEditingData] = useState<HackathonData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(INITIAL_COLUMNS);

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

  const handleSave = async (data: HackathonData) => {
    try {
      await api.saveHackathon(data, data.id);
      setShowFormModal(false);
      setEditingData(null);
      loadHackathons();
    } catch (err) {
      alert("Error saving hackathon");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Delete this hackathon?")) {
      try {
        await api.deleteHackathon(id);
        loadHackathons();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const handleAIRExtraction = (extracted: HackathonData) => {
    setShowMagicModal(false);
    setEditingData(extracted);
    setShowFormModal(true);
  };

  const filteredHackathons = useMemo(() => {
    return hackathons.filter(h => 
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.platform?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.organization?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [hackathons, searchQuery]);

  const toggleColumn = (col: string) => {
    const next = new Set(visibleColumns);
    if (next.has(col)) next.delete(col);
    else next.add(col);
    setVisibleColumns(next);
  };

  return (
    <div className="w-[95vw] mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="bg-primary/20 p-2 rounded-lg">
                <LayoutDashboard className="h-6 w-6 text-primary" />
             </div>
             <h1 className="text-3xl font-extrabold gradient-text tracking-tight font-sans">HackTrack Pro</h1>
          </div>
          <p className="text-muted text-sm font-medium uppercase tracking-widest">Command Center • Phase 2</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowMagicModal(true)}>
            <Sparkles className="h-4 w-4 mr-2" />
            Magic Paste
          </Button>
          <Button onClick={() => { setEditingData(null); setShowFormModal(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 glass-panel p-3">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input 
            placeholder="Search hackathons..." 
            className="pl-10 bg-transparent border-none focus-visible:ring-0 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted text-[10px] uppercase font-bold tracking-widest">
                  <Filter className="h-3 w-3 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-panel border-white/5 bg-surface text-foreground">
                <DropdownMenuLabel>Toggle Visibility</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {[
                  {k: "title", l: "Hackathon"},
                  {k: "deadline", l: "Deadline"},
                  {k: "organization", l: "Host"},
                  {k: "prize", l: "Prize"},
                  {k: "team", l: "Focus"},
                  {k: "status", l: "Status"},
                  {k: "team_members", l: "Team"}
                ].map(col => (
                  <DropdownMenuCheckboxItem
                    key={col.k}
                    checked={visibleColumns.has(col.k)}
                    onCheckedChange={() => toggleColumn(col.k)}
                  >
                    {col.l}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="h-4 w-px bg-white/10 mx-2" />
            <span className="text-[10px] text-muted uppercase font-bold tracking-widest">
              {filteredHackathons.length} Active
            </span>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
        </div>
      ) : (
        <HackathonDataTable 
          hackathons={filteredHackathons}
          visibleColumns={visibleColumns}
          onEdit={(h) => { setEditingData(h); setShowFormModal(true); }}
          onDelete={handleDelete}
          onRefresh={loadHackathons}
        />
      )}

      <Modal isOpen={showMagicModal} onClose={() => setShowMagicModal(false)} title="AI Discovery">
        <MagicPaste onResult={handleAIRExtraction} />
      </Modal>

      <Modal
        isOpen={showFormModal}
        onClose={() => { setShowFormModal(false); setEditingData(null); }}
        title={editingData?.id ? "Edit Hackathon" : (editingData ? "Review AI Find" : "Manual Entry")}
      >
        <HackathonForm 
          initialData={editingData}
          onSave={handleSave}
          onCancel={() => { setShowFormModal(false); setEditingData(null); }}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
