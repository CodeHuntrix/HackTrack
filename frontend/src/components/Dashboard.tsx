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
  Filter,
  Loader2
} from 'lucide-react';
import { useToast } from './ui/toast';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useSafeTap } from '@/hooks/useSafeTap';

const INITIAL_COLUMNS = ["title", "deadline", "organization", "prize", "team", "status", "team_members"];

const Dashboard = () => {
  const [hackathons, setHackathons] = useState<HackathonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showMagicModal, setShowMagicModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingData, setEditingData] = useState<HackathonData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isColumnOpen, setIsColumnOpen] = useState(false);

  const { touchProps: statusTouchProps } = useSafeTap({
    onTap: () => setIsStatusOpen(!isStatusOpen)
  });

  const { touchProps: columnTouchProps } = useSafeTap({
    onTap: () => setIsColumnOpen(!isColumnOpen)
  });
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(INITIAL_COLUMNS));

  const { toast } = useToast();

  useEffect(() => {
    loadHackathons();
  }, []);

  const loadHackathons = async () => {
    try {
      const data = await api.getHackathons();
      setHackathons(data);
    } catch (err: any) {
      const errorDetail = err.response?.data?.detail;
      const errorMessage = typeof errorDetail === 'string' ? errorDetail : (err.message || 'Check your connection');
      toast('error', 'Failed to load hackathons', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: HackathonData) => {
    setIsSaving(true);
    try {
      await api.saveHackathon(data, data.id);
      toast('success', data.id ? 'Changes saved' : 'Hackathon added', data.title);
      setShowFormModal(false);
      setEditingData(null);
      loadHackathons();
    } catch (err: any) {
      const errorDetail = err.response?.data?.detail;
      let errorMessage = 'Please check all fields and try again.';
      
      if (typeof errorDetail === 'string') {
        errorMessage = errorDetail;
      } else if (Array.isArray(errorDetail)) {
        errorMessage = errorDetail.map((e: any) => `${e.loc.join('.')}: ${e.msg}`).join(', ');
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast('error', 'Save failed', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    // Keep window.confirm for now as a simple blocker, but toast the result
    if (window.confirm("Delete this hackathon?")) {
      try {
        await api.deleteHackathon(id);
        toast('success', 'Hackathon deleted');
        loadHackathons();
      } catch (err: any) {
        const errorDetail = err.response?.data?.detail;
        const errorMessage = typeof errorDetail === 'string' ? errorDetail : (err.message || 'Check your connection');
        toast('error', 'Delete failed', errorMessage);
      }
    }
  };

  const handleAIRExtraction = (extracted: HackathonData) => {
    setShowMagicModal(false);
    setEditingData(extracted);
    setShowFormModal(true);
  };

  const STATUS_PRIORITY: Record<string, number> = {
    "Live": 1,
    "Upcoming": 2,
    "Accepted": 3,
    "Submitted": 4,
    "Rejected": 5,
    "Ended": 6
  };

  const filteredHackathons = useMemo(() => {
    return hackathons
      .filter(h => {
        const matchesSearch = (h.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                            h.platform?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            h.organization?.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Handle renamed term in filter
        const currentStatus = h.status === "Selected" ? "Accepted" : h.status;
        const matchesStatus = statusFilter === "All" || currentStatus === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const pA = STATUS_PRIORITY[a.status === "Selected" ? "Accepted" : (a.status || "Upcoming")] || 99;
        const pB = STATUS_PRIORITY[b.status === "Selected" ? "Accepted" : (b.status || "Upcoming")] || 99;
        return pA - pB;
      });
  }, [hackathons, searchQuery, statusFilter]);

  const toggleColumn = (col: string) => {
    const next = new Set(visibleColumns);
    if (next.has(col)) next.delete(col);
    else next.add(col);
    setVisibleColumns(next);
  };

  return (
    <div className="h-screen w-screen max-w-[1800px] mx-auto flex flex-col p-4 md:p-8 overflow-hidden">
      {/* HEADER SECTION - FIXED */}
      <div className="flex-none flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 mt-4">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
             <div className="bg-primary/10 p-1.5 rounded-xl border border-primary/20 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                <img src="/logo.png" alt="HackTrack Pro Logo" className="h-10 w-10 object-contain brightness-110 contrast-125" />
             </div>
             <h1 className="text-3xl font-extrabold gradient-text tracking-tighter font-title uppercase">HackTrack Pro</h1>
          </div>
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

      {/* TOOLBAR SECTION - FIXED */}
      <div className="flex-none flex flex-col md:flex-row items-center justify-between gap-4 mb-6 glass-panel p-3">
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
            {/* STATUS FILTER */}
            <DropdownMenu open={isStatusOpen} onOpenChange={setIsStatusOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  {...statusTouchProps}
                  variant="ghost" 
                  size="sm" 
                  className="text-muted text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors touch-manipulation"
                >
                  <Filter className="h-3 w-3 mr-2" />
                  Status: {statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 glass-panel border-white/5 bg-surface text-foreground">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {["All", "Upcoming", "Live", "Submitted", "Accepted", "Rejected", "Ended"].map(status => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter === status}
                    onCheckedChange={() => setStatusFilter(status)}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-4 w-px bg-white/10 mx-1" />

            {/* COLUMN VISIBLITY */}
            <DropdownMenu open={isColumnOpen} onOpenChange={setIsColumnOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  {...columnTouchProps}
                  variant="ghost" 
                  size="sm" 
                  className="text-muted text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors touch-manipulation"
                >
                  <LayoutDashboard className="h-3 w-3 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-panel border-white/5 bg-surface text-foreground">
                <DropdownMenuLabel>View Options</DropdownMenuLabel>
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

            <div className="h-4 w-px bg-white/10 mx-1" />

            <span className="text-[10px] text-muted uppercase font-bold tracking-widest px-2">
              {filteredHackathons.length} Results
            </span>
        </div>
      </div>

      {/* SCROLLABLE DATA SECTION */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0 bg-surface/20 rounded-2xl border border-white/5 backdrop-blur-sm">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
          </div>
        ) : (
          <div className="flex-1 overflow-auto custom-scrollbar">
            <HackathonDataTable 
              hackathons={filteredHackathons}
              visibleColumns={visibleColumns}
              onEdit={(h) => { setEditingData(h); setShowFormModal(true); }}
              onDelete={handleDelete}
              onRefresh={loadHackathons}
            />
          </div>
        )}
      </div>


      <Modal 
        isOpen={showMagicModal} 
        onClose={() => setShowMagicModal(false)} 
        title="AI Discovery"
        footer={
          <Button 
            form="magic-paste-form"
            type="submit"
            disabled={isExtracting}
            className="w-full bg-primary hover:bg-primary/90 h-11 rounded-xl font-bold text-white transition-all active:scale-95 disabled:opacity-70"
          >
            {isExtracting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Groq is Thinking...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Extract with AI
              </>
            )}
          </Button>
        }
      >
        <MagicPaste 
          onResult={(data) => {
             setIsExtracting(false);
             handleAIRExtraction(data);
          }} 
          isAnalyzing={isExtracting}
        />
      </Modal>

      <Modal
        isOpen={showFormModal}
        onClose={() => { setShowFormModal(false); setEditingData(null); }}
        title={editingData?.id ? "Edit Hackathon" : (editingData ? "Review AI Find" : "Manual Entry")}
        footer={
          <div className="flex justify-end gap-3">
             <Button 
                type="button" 
                variant="outline" 
                onClick={() => { setShowFormModal(false); setEditingData(null); }} 
                className="h-11 px-8 rounded-xl"
                disabled={isSaving}
             >
                Cancel
             </Button>
             <Button 
                form="hackathon-form"
                type="submit"
                disabled={isSaving}
                className="bg-primary hover:bg-primary/90 h-11 px-12 rounded-xl font-bold text-white shadow-[0_4px_20px_rgba(168,85,247,0.3)] transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
             >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Hackathon'
                )}
             </Button>
          </div>
        }
      >
        <HackathonForm 
          initialData={editingData}
          onSave={handleSave}
          onCancel={() => { setShowFormModal(false); setEditingData(null); }}
          isSaving={isSaving}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
