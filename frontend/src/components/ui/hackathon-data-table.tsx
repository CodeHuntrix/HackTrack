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
import { ExternalLink, Calendar, Users, Trophy, Building2, Link as LinkIcon, CheckCircle2, Clock, Wallet, Layers, Zap, ArrowRightCircle, ChevronDown, Globe, MapPin, Info } from "lucide-react";
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

  round_1_criteria?: string | null;
  extra_rounds?: string | null;
  final_round?: string | null;
  checklist?: any;
}

interface HackathonDataTableProps {
  hackathons: Hackathon[];
  visibleColumns: Set<string>;
  onEdit: (h: any) => void;
  onDelete: (id: number) => void;
  onRefresh: () => void;
}

const statusOrder = ["Upcoming", "Live", "Submitted", "Accepted", "Rejected", "Ended"];
const statusConfig: Record<string, { color: string, border: string, text: string }> = {
  "Upcoming": { color: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400" },
  "Live": { color: "bg-green-500/20", border: "border-green-500/30", text: "text-green-400" },
  "Submitted": { color: "bg-orange-500/20", border: "border-orange-500/30", text: "text-orange-400" },
  "Accepted": { color: "bg-emerald-500/20", border: "border-emerald-500/30", text: "text-emerald-400" },
  "Rejected": { color: "bg-red-500/20", border: "border-red-500/30", text: "text-red-400" },
  "Ended": { color: "bg-white/10", border: "border-white/20", text: "text-muted" },
};

// --- STATUS PICKER DROPDOWN ---
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

const StatusPicker = ({ current, onSelect }: { current: string, onSelect: (status: string) => Promise<void> }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Handle 'Selected' legacy data
  const effectiveStatus = current === "Selected" ? "Accepted" : current;
  const config = statusConfig[effectiveStatus] || statusConfig["Upcoming"];

  const handleSelect = async (status: string) => {
    setIsUpdating(true);
    try {
      await onSelect(status);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isUpdating}>
        <button 
          className={cn(
            "flex items-center justify-between gap-2 transition-all active:scale-95 px-3 py-1.5 rounded-md border w-[120px] shadow-lg group/btn outline-none ring-offset-background focus:ring-2 focus:ring-primary/50",
            isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
            config.color, config.border
          )}
        >
          <span className={cn("text-xs font-black uppercase tracking-widest truncate", config.text)}>
            {effectiveStatus}
          </span>
          {isUpdating ? (
            <div className="h-3.5 w-3.5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 opacity-50 group-hover/btn:opacity-100 transition-all" />
          )}
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-[124px] glass-panel border-white/10 bg-surface/90 backdrop-blur-xl p-1 z-[1000] shadow-[0_10px_50px_rgba(0,0,0,0.8)]">
        {statusOrder.map((s) => (
          <DropdownMenuItem
            key={s}
            onClick={() => handleSelect(s)}
            className={cn(
              "px-3 py-2 text-[11px] uppercase font-black tracking-tight cursor-pointer focus:bg-primary/20 focus:text-white transition-colors rounded-sm",
              effectiveStatus === s ? "bg-primary text-white" : "text-white/70"
            )}
          >
            {s}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// --- MAIN COMPONENT ---
export const HackathonDataTable = ({ 
  hackathons, 
  onEdit,
  onDelete,
  onRefresh
}: HackathonDataTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    const next = new Set(expandedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedRows(next);
  };
  
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
    <div className="glass-panel overflow-visible flex-1 flex flex-col">
      <div className="relative w-full overflow-visible flex-1">
        <Table>
          <TableHeader className="bg-white/5 border-none">
            <TableRow className="border-none">
              <TableHead className="text-muted font-black uppercase text-[10px] sm:text-xs tracking-widest py-5 border-none min-w-[150px] lg:w-[350px]">Hackathon</TableHead>
              <TableHead className="text-muted font-black uppercase text-[10px] sm:text-xs tracking-widest py-5 border-none">Duration</TableHead>
              <TableHead className="text-muted font-black uppercase text-[10px] sm:text-xs tracking-widest py-5 border-none">Timeline</TableHead>
              <TableHead className="text-muted font-black uppercase text-[10px] sm:text-xs tracking-widest py-5 border-none">Mode</TableHead>
              <TableHead className="text-muted font-black uppercase text-[10px] sm:text-xs tracking-widest py-5 border-none">Type</TableHead>
              <TableHead className="text-muted font-black uppercase text-[10px] sm:text-xs tracking-widest py-5 border-none">Fees</TableHead>
              <TableHead className="text-muted font-black uppercase text-[10px] sm:text-xs tracking-widest py-5 border-none">Team</TableHead>
              <TableHead className="text-muted font-black uppercase text-[10px] sm:text-xs tracking-widest py-5 border-none text-center">Flow</TableHead>
              <TableHead className="text-muted font-black uppercase text-[11px] tracking-widest py-5 border-none text-right">Status</TableHead>
              <TableHead className="text-right py-5 border-none pr-6 w-[120px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hackathons.length > 0 ? (
              hackathons.map((h, index) => (
                <React.Fragment key={h.id}>
                  <motion.tr
                    key={h.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                  >
                  <TableCell className="py-4 border-b border-white/5">
                    <div className="flex flex-col min-w-[150px] lg:w-[350px]">
                      <div className="flex items-baseline gap-2 flex-wrap">
                         <span className="font-bold text-white text-base sm:text-xl group-hover:text-primary transition-all duration-300 font-title tracking-tight">
                           {h.title}
                           {h.link && (
                              <a href={h.link} target="_blank" rel="noreferrer" className="inline-block ml-2 text-muted hover:text-white transition-colors">
                                 <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                              </a>
                           )}
                         </span>
                      </div>
                      <div className="flex flex-col gap-0.5 mt-0.5">
                        <span className="text-[10px] sm:text-xs text-muted flex items-center gap-1.5 font-medium">
                          <Building2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> {h.organization || h.platform || "Independent"}
                        </span>
                        <span className="text-[9px] sm:text-[11px] text-accent/80 font-bold uppercase tracking-tight flex items-center gap-1.5">
                          <Trophy className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> {h.prize_pool || "Recognition"} • {h.team_size || "1-4"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4 border-b border-white/5">
                    <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-md font-black text-white">
                      <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                      <span>{h.duration ? `${h.duration}H` : "N/A"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 border-b border-white/5 min-w-[220px]">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[10px] sm:text-xs">
                      <div className="flex items-center gap-2 text-muted">
                        <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="font-bold">REG:</span> {formatDate(h.registration_deadline)}
                      </div>
                      <div className="flex items-center gap-2 text-primary">
                        <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="font-bold">R1:</span> {formatDate(h.round_1_date)}
                      </div>
                      <div className="flex items-center gap-2 text-secondary">
                        <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="font-bold">RES:</span> {formatDate(h.result_date)}
                      </div>
                      <div className="flex items-center gap-2 text-accent font-black">
                        <Trophy className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="font-bold">FINAL:</span> {formatDate(h.final_round_date)}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 border-b border-white/5">
                    <div className="flex items-center gap-1.5">
                      <Globe className="h-4 w-4 text-secondary/80" />
                      <span className="text-xs font-black uppercase tracking-tighter text-white/90">{h.mode || "Online"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 border-b border-white/5">
                    <Badge variant="outline" className="text-[10px] px-2 py-0.5 uppercase font-black border-white/10 bg-white/5 text-secondary">
                      {h.hackathon_type || "Mixed"}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-4 border-b border-white/5">
                    <div className="flex flex-col gap-1 text-[10px] sm:text-xs font-black uppercase tracking-tighter leading-tight">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Wallet className={cn("h-3.5 w-3.5 shrink-0", h.fees?.toLowerCase().includes("free") ? "text-green-400" : "text-primary/80")} />
                        <span className={cn("break-words max-w-[100px]", h.fees?.toLowerCase().includes("free") ? "text-green-400" : "text-white/90")}>
                          {h.fees || "FREE"}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 border-b border-white/5">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-secondary" />
                      <span className="text-sm font-black uppercase tracking-tighter text-white">{h.team_size || "1-4"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 border-b border-white/5 text-center">
                    {h.is_direct_to_final ? (
                       <div className="flex flex-col items-center gap-1 text-primary animate-pulse" title="Direct to Final">
                          <Zap className="h-4.5 w-4.5" />
                          <span className="text-[9px] font-black uppercase tracking-tighter">Direct</span>
                       </div>
                    ) : (
                       <div className="flex flex-col items-center gap-1 text-muted/30">
                          <ArrowRightCircle className="h-4.5 w-4.5" />
                          <span className="text-[9px] font-bold uppercase tracking-tighter">Mixed</span>
                       </div>
                    )}
                  </TableCell>

                  <TableCell className="py-4 border-b border-white/5 text-right w-[140px]">
                    <div className="flex justify-end">
                      <StatusPicker current={h.status || "Upcoming"} onSelect={(s) => handleStatusChange(h, s)} />
                    </div>
                  </TableCell>

                  <TableCell className="py-4 text-right border-b border-white/5 pr-6">
                    <div className="flex justify-end gap-3 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button 
                         onClick={() => h.id && toggleExpand(h.id)} 
                         className={cn("text-[10px] uppercase font-black transition-colors", expandedRows.has(h.id!) ? "text-primary" : "text-muted hover:text-white")}
                      >
                        {expandedRows.has(h.id!) ? "Less" : "More"}
                      </button>
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

                {/* EXPANDED CONTENT */}
                <AnimatePresence>
                  {h.id && expandedRows.has(h.id) && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white/[0.03] border-none"
                    >
                      <TableCell colSpan={10} className="p-0 border-b border-white/5">
                        <div className="px-12 py-5 space-y-5">
                          <div className="flex flex-wrap items-start gap-12">
                             {/* LOCATION */}
                             <div className="flex gap-8 border-r border-white/5 pr-12">
                               <div className="space-y-1">
                                 <div className="flex items-center gap-1.5 text-primary mb-1">
                                   <MapPin className="h-3.5 w-3.5" />
                                   <h4 className="text-[9px] uppercase font-black tracking-widest opacity-80">Location</h4>
                                 </div>
                                 <div className="flex flex-col">
                                   <span className="text-sm font-bold text-white tracking-tight">{h.organization || h.platform || "Independent"}</span>
                                   <span className="text-[10px] text-muted font-medium">{h.platform && h.organization ? h.platform : ""}</span>
                                 </div>
                               </div>
                             </div>

                             {/* TECHNICALS */}
                             <div className="flex gap-16">
                               <div className="space-y-1">
                                 <div className="flex items-center gap-1.5 text-accent mb-1">
                                   <Layers className="h-3.5 w-3.5" />
                                   <h4 className="text-[9px] uppercase font-black tracking-widest opacity-80">Screening Criteria</h4>
                                 </div>
                                 <p className="text-[11px] text-white/60 leading-relaxed font-medium max-w-[280px] italic">
                                   "{h.round_1_criteria || "No specific screening criteria found."}"
                                 </p>
                               </div>
                               <div className="space-y-1">
                                 <div className="flex items-center gap-1.5 text-primary/70 mb-1">
                                   <Info className="h-3.5 w-3.5" />
                                   <h4 className="text-[9px] uppercase font-black tracking-widest opacity-80">Rounds & Info</h4>
                                 </div>
                                 <p className="text-[11px] text-white/50 leading-relaxed font-medium max-w-[320px]">
                                   {h.extra_rounds || "Standard hackathon procedure applies."}
                                 </p>
                               </div>
                             </div>
                          </div>
                        </div>
                      </TableCell>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="h-32 text-center text-muted italic border-none">
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
