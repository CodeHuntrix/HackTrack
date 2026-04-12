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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, Users, Trophy, Building2 } from "lucide-react";

// --- TYPE DEFINITIONS ---
interface Contributor {
  name: string;
  src?: string;
  fallback: string;
}

export interface Hackathon {
  id?: number;
  title: string;
  platform?: string;
  status?: string;
  registration_deadline?: string | null;
  submission_deadline?: string | null;
  mode?: string;
  team_size?: string;
  prize_pool?: string | null;
  organization?: string | null;
  round_1_type?: string | null;
  extra_rounds?: string | null;
  final_round?: string | null;
}

interface HackathonDataTableProps {
  hackathons: Hackathon[];
  visibleColumns: Set<string>;
  onEdit: (h: any) => void;
  onDelete: (id: number) => void;
}

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
  onDelete
}: HackathonDataTableProps) => {
  
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
      },
    }),
  };

  const teamMembers: Contributor[] = [
    { name: "Riyaz", fallback: "RY" },
    { name: "Deepshika", fallback: "DS" },
    { name: "Nabithra", fallback: "NB" },
    { name: "Ramitha", fallback: "RM" },
  ];

  const tableHeaders = [
    { key: "title", label: "Hackathon" },
    { key: "deadline", label: "Submission" },
    { key: "organization", label: "Host" },
    { key: "prize", label: "Prize Pool" },
    { key: "team", label: "Focus" },
    { key: "status", label: "Status" },
    { key: "team_members", label: "Team" },
  ];

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="glass-panel overflow-hidden">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow>
              {tableHeaders
                .filter((h) => visibleColumns.has(h.key))
                .map((header) => (
                  <TableHead key={header.key} className="text-muted font-semibold uppercase text-[10px] tracking-wider py-4 border-none">
                    {header.label}
                  </TableHead>
                ))}
              <TableHead className="text-right py-4 border-none">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hackathons.length > 0 ? (
              hackathons.map((h, index) => (
                <motion.tr
                  key={h.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  {visibleColumns.has("title") && (
                    <TableCell className="py-4 border-none">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-md group-hover:text-primary transition-colors">{h.title}</span>
                        <span className="text-[10px] text-muted flex items-center gap-1">
                          {h.platform} <ExternalLink className="h-2 w-2" />
                        </span>
                      </div>
                    </TableCell>
                  )}
                  
                  {visibleColumns.has("deadline") && (
                    <TableCell className="py-4 border-none">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3 text-secondary" />
                        <span>{formatDate(h.submission_deadline || null)}</span>
                      </div>
                    </TableCell>
                  )}

                  {visibleColumns.has("organization") && (
                    <TableCell className="py-4 border-none">
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <Building2 className="h-3 w-3" />
                        <span>{h.organization || "N/A"}</span>
                      </div>
                    </TableCell>
                  )}

                  {visibleColumns.has("prize") && (
                    <TableCell className="py-4 border-none">
                      <div className="flex items-center gap-2 text-sm text-green-400 font-medium">
                        <Trophy className="h-3 w-3" />
                        <span>{h.prize_pool || "Good Luck!"}</span>
                      </div>
                    </TableCell>
                  )}
                  
                  {visibleColumns.has("team") && (
                    <TableCell className="py-4 border-none text-sm text-muted">
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        <span>{h.team_size} • {h.mode}</span>
                      </div>
                    </TableCell>
                  )}
                  
                  {visibleColumns.has("status") && (
                    <TableCell className="py-4 border-none">
                      <Badge variant={statusVariants[h.status || "Upcoming"] || "default"} className="px-3 py-0.5 text-[10px] uppercase tracking-tighter">
                        {h.status || "Unknown"}
                      </Badge>
                    </TableCell>
                  )}

                  {visibleColumns.has("team_members") && (
                    <TableCell className="py-4 border-none text-sm">
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
                  )}

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
                <TableCell colSpan={tableHeaders.length + 1} className="h-32 text-center text-muted italic border-none">
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
