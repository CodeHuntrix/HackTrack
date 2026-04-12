import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, Users, Trophy, Building2, Link as LinkIcon, CheckCircle2, Clock, Wallet, Layers, Zap, ArrowRightCircle, ChevronDown } from "lucide-react";
import { api } from "@/services/api";

// --- TYPE DEFINITIONS ---
interface Contributor {
  name: string;
  fallback: string;
}

export interface Hackathon {
  id?: number;
  title?: string;
  platform?: string;
  link?: string;
  status?: string;
  
  duration?: string;
  fees?: string;
  hackathon_type?: string;
  is_direct_to_final?: boolean;

  registration_deadline?: string | null;
  round_1_date?: string | null;
  result_date?: string | null;
  final_round_date?: string | null;
  mode?: string;
  team_size?: string;
  prize_pool?: string | null;
  organization?: string | null;
}

interface HackathonDataTableProps {
  hackathons: Hackathon[];
  visibleColumns: Set<string>;
  onEdit: (h: any) => void;
  onDelete: (id: number) => void;
  onRefresh: () => void;
}

const statusOrder = ["Upcoming", "Live", "Submitted", "Selected", "Rejected", "Ended"];
const statusVariants: Record<string, any> = {
  "Upcoming": "active",
  "Live": "active",
  "Submitted": "inProgress",
  "Selected": "active",
  "Rejected": "onHold",
  "Ended": "onHold",
};

// --- STATUS PICKER DROPDOWN ---
const StatusPicker = ({ current, onSelect }: { current: string, onSelect: (status: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const click = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 transition-transform active:scale-95 px-3 py-0.5 rounded-full border border-white/10 glass-panel bg-white/5 hover:bg-white/10 group/btn shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
      >
        <Badge variant={statusVariants[current] || "default"} className="bg-transparent border-none p-0 shadow-none text-[10px] uppercase truncate max-w-[80px]">
          {current}
        </Badge>
        <ChevronDown className={cn("h-3 w-3 text-muted/50 group-hover/btn:text-white transition-all", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute z-50 mt-2 left-1/2 -translate-x-1/2 w-32 glass-panel shadow-2xl overflow-hidden py-1 border-white/5"
          >
            {statusOrder.map((s) => (
              <div
                key={s}
                onClick={() => { onSelect(s); setIsOpen(false); }}
                className={cn(
                  "px-3 py-1.5 text-[10px] uppercase font-bold cursor-pointer transition-colors",
                  current === s ? "bg-primary text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                {s}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- MAIN COMPONENT ---
export const HackathonDataTable = ({ 
  hackathons, 
  onEdit,
  onDelete,
  onRefresh
}: HackathonDataTableProps) => {
  
  const handleStatusChange = async (h: Hackathon, nextStatus: string) => {
    if (!h.id) return;
    try {
      await api.saveHackathon({ status: nextStatus }, h.id);
      onRefresh();
    } catch (err) {
      console.error("Failed to update status");
    }
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const teamMembers: Contributor[] = [
    { name: "Riyaz", fallback: "RY" },
    { name: "Deepshika", fallback: "DS" },
    { name: "Nabithra", fallback: "NB" },
    { name: "Ramitha", fallback: "RM" },
  ];

  return (
    <div className="glass-panel overflow-hidden">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader className="bg-white/5 border-none">
            <TableRow className="border-none">
              <TableHead className="text-muted font-black uppercase text-[10px] tracking-widest py-5 border-none">Hackathon</TableHead>
              <TableHead className="text-muted font-black uppercase text-[10px] tracking-widest py-5 border-none">Duration</TableHead>
              <TableHead className="text-muted font-black uppercase text-[10px] tracking-widest py-5 border-none">Type</TableHead>
              <TableHead className="text-muted font-black uppercase text-[10px] tracking-widest py-5 border-none">Fees</TableHead>
              <TableHead className="text-muted font-black uppercase text-[10px] tracking-widest py-5 border-none">Timeline</TableHead>
              <TableHead className="text-muted font-black uppercase text-[10px] tracking-widest py-5 border-none text-center">Flow</TableHead>
              <TableHead className="text-muted font-black uppercase text-[10px] tracking-widest py-5 border-none text-center">Status</TableHead>
              <TableHead className="text-right py-5 border-none pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hackathons.length > 0 ? (
              hackathons.map((h, index) => (
                <motion.tr
                  key={h.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                >
                  <TableCell className="py-4 border-none">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                         <span className="font-bold text-white text-md group-hover:text-primary transition-colors">{h.title}</span>
                         {h.link && (
                            <a href={h.link} target="_blank" rel="noreferrer" className="text-muted hover:text-white transition-colors">
                               <LinkIcon className="h-3 w-3" />
                            </a>
                         )}
                      </div>
                      <div className="flex flex-col gap-0.5 mt-0.5">
                        <span className="text-[10px] text-muted flex items-center gap-1 font-medium">
                          <Building2 className="h-2.5 w-2.5" /> {h.organization || h.platform || "Independent"}
                        </span>
                        <span className="text-[10px] text-accent/80 font-bold uppercase tracking-tight flex items-center gap-1">
                          <Trophy className="h-2.5 w-2.5" /> {h.prize_pool || "Recognition"} • {h.team_size || "1-4"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4 border-none">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white/90">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      <span>{h.duration ? `${h.duration}H` : "N/A"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 border-none">
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 uppercase font-black border-white/10 bg-white/5 text-secondary">
                      {h.hackathon_type || "Mixed"}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-4 border-none">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter">
                      <Wallet className={cn("h-3 w-3", h.fees?.toLowerCase().includes("free") ? "text-green-400" : "text-primary")} />
                      <span className={cn(h.fees?.toLowerCase().includes("free") ? "text-green-400" : "text-white/80")}>
                        {h.fees || "FREE"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 border-none min-w-[180px]">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px]">
                      <div className="flex items-center gap-1.5 text-muted">
                        <Clock className="h-2.5 w-2.5" />
                        <span className="font-bold">REG:</span> {formatDate(h.registration_deadline)}
                      </div>
                      <div className="flex items-center gap-1.5 text-primary">
                        <Calendar className="h-2.5 w-2.5" />
                        <span className="font-bold">R1:</span> {formatDate(h.round_1_date)}
                      </div>
                      <div className="flex items-center gap-1.5 text-secondary">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        <span className="font-bold">RES:</span> {formatDate(h.result_date)}
                      </div>
                      <div className="flex items-center gap-1.5 text-accent font-black">
                        <Trophy className="h-2.5 w-2.5" />
                        <span className="font-bold">FINAL:</span> {formatDate(h.final_round_date)}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 border-none text-center">
                    {h.is_direct_to_final ? (
                       <div className="flex flex-col items-center gap-0.5 text-primary animate-pulse" title="Direct to Final">
                          <Zap className="h-4 w-4" />
                          <span className="text-[8px] font-black uppercase tracking-tighter">Direct</span>
                       </div>
                    ) : (
                       <div className="flex flex-col items-center gap-0.5 text-muted/30">
                          <ArrowRightCircle className="h-4 w-4" />
                          <span className="text-[8px] font-bold uppercase tracking-tighter">Mixed</span>
                       </div>
                    )}
                  </TableCell>

                  <TableCell className="py-4 border-none text-center">
                    <StatusPicker current={h.status || "Upcoming"} onSelect={(s) => handleStatusChange(h, s)} />
                  </TableCell>

                  <TableCell className="py-4 text-right border-none pr-6">
                    <div className="flex justify-end gap-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEdit(h)} className="text-[10px] uppercase font-black text-secondary hover:text-white transition-colors">Edit</button>
                      <button 
                        onClick={() => h.id && onDelete(h.id)} 
                        className="text-[10px] uppercase font-black text-accent hover:text-white transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted italic border-none">
                   No hackathons tracking yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
