import * as React from "react";
import { motion } from "framer-motion";
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
import { ExternalLink, Calendar, Users, Trophy, Building2, Link as LinkIcon, CheckCircle2, Clock } from "lucide-react";
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
  registration_deadline?: string | null;
  round_1_date?: string | null;
  result_date?: string | null;
  final_submission_date?: string | null;
  top_teams_date?: string | null;
  grand_finale_date?: string | null;
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

// --- MAIN COMPONENT ---
export const HackathonDataTable = ({ 
  hackathons, 
  visibleColumns,
  onEdit,
  onDelete,
  onRefresh
}: HackathonDataTableProps) => {
  
  const handleStatusToggle = async (h: Hackathon) => {
    if (!h.id || !h.status) return;
    
    const currentIndex = statusOrder.indexOf(h.status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    const nextStatus = statusOrder[nextIndex];

    try {
      await api.saveHackathon({ status: nextStatus }, h.id);
      onRefresh();
    } catch (err) {
      console.error("Failed to toggle status");
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
          <TableHeader className="bg-white/5">
            <TableRow>
              <TableHead className="text-muted font-semibold uppercase text-[10px] tracking-wider py-4 border-none">Hackathon</TableHead>
              <TableHead className="text-muted font-semibold uppercase text-[10px] tracking-wider py-4 border-none">Direct Link</TableHead>
              <TableHead className="text-muted font-semibold uppercase text-[10px] tracking-wider py-4 border-none">Milestones</TableHead>
              <TableHead className="text-muted font-semibold uppercase text-[10px] tracking-wider py-4 border-none">Prize Pool</TableHead>
              <TableHead className="text-muted font-semibold uppercase text-[10px] tracking-wider py-4 border-none text-center">Status</TableHead>
              <TableHead className="text-muted font-semibold uppercase text-[10px] tracking-wider py-4 border-none">Team</TableHead>
              <TableHead className="text-right py-4 border-none">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hackathons.length > 0 ? (
              hackathons.map((h, index) => (
                <motion.tr
                  key={h.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  {/* TITLE & ORG */}
                  <TableCell className="py-4 border-none">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-md group-hover:text-primary transition-colors">{h.title}</span>
                      <span className="text-[10px] text-muted flex items-center gap-1">
                        {h.organization || h.platform || "Independent"}
                      </span>
                    </div>
                  </TableCell>
                  
                  {/* LINK CHIP */}
                  <TableCell className="py-4 border-none">
                    {h.link ? (
                      <a 
                        href={h.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md transition-all border border-primary/20"
                      >
                        <LinkIcon className="h-2.5 w-2.5" />
                        Explore Site
                      </a>
                    ) : (
                      <span className="text-muted text-[10px] italic">No link</span>
                    )}
                  </TableCell>

                  {/* MILESTONE GRID */}
                  <TableCell className="py-4 border-none min-w-[200px]">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                      <div className="flex items-center gap-1.5 text-secondary">
                        <Clock className="h-3 w-3" />
                        <span className="uppercase font-bold opacity-70">Reg:</span> {formatDate(h.registration_deadline)}
                      </div>
                      <div className="flex items-center gap-1.5 text-primary">
                        <Calendar className="h-3 w-3" />
                        <span className="uppercase font-bold opacity-70">R1:</span> {formatDate(h.round_1_date)}
                      </div>
                      <div className="flex items-center gap-1.5 text-accent">
                        <Trophy className="h-3 w-3" />
                        <span className="uppercase font-bold opacity-70">Finale:</span> {formatDate(h.grand_finale_date)}
                      </div>
                      <div className="flex items-center gap-1.5 text-muted">
                        <CheckCircle2 className="h-3 w-3" />
                        <span className="uppercase font-bold opacity-70">Results:</span> {formatDate(h.result_date)}
                      </div>
                    </div>
                  </TableCell>

                  {/* PRIZE */}
                  <TableCell className="py-4 border-none">
                    <div className="flex items-center gap-2 text-sm text-green-400 font-medium">
                      <Trophy className="h-3 w-3" />
                      <span>{h.prize_pool || "Good Luck!"}</span>
                    </div>
                  </TableCell>
                  
                  {/* STATUS (INTERACTIVE) */}
                  <TableCell className="py-4 border-none text-center">
                    <button 
                      onClick={() => handleStatusToggle(h)}
                      className="transition-transform active:scale-95 cursor-pointer"
                      title="Click to toggle status"
                    >
                      <Badge variant={statusVariants[h.status || "Upcoming"] || "default"} className="px-3 py-0.5 text-[10px] uppercase tracking-tighter whitespace-nowrap">
                        {h.status || "Upcoming"}
                      </Badge>
                    </button>
                  </TableCell>

                  {/* TEAM */}
                  <TableCell className="py-4 border-none">
                       <div className="flex -space-x-2">
                        {teamMembers.map((member, idx) => (
                          <Avatar key={idx} className="h-7 w-7 border-2 border-[#020617] ring-1 ring-white/10 shrink-0">
                            <AvatarFallback className="text-[8px] font-bold bg-surface text-primary">
                              {member.fallback}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="py-4 text-right border-none">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEdit(h)} className="text-[10px] uppercase font-bold text-secondary hover:text-white underline-offset-4 hover:underline">Edit</button>
                      <button 
                        onClick={() => h.id && onDelete(h.id)} 
                        className="text-[10px] uppercase font-bold text-accent hover:text-white underline-offset-4 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted italic border-none">
                   No hackathons tracking yet. Use Magic Paste to start!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
