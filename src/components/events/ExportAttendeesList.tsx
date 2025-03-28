
import React, { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface ExportAttendeesListProps {
  eventId: string;
  eventTitle: string;
  isHost: boolean;
}

const ExportAttendeesList = ({ eventId, eventTitle, isHost }: ExportAttendeesListProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { profile } = useAuthStore();
  
  const handleExport = async () => {
    if (!profile?.id) {
      toast.error('You must be logged in to export attendees');
      return;
    }
    
    if (!isHost) {
      toast.error('Only the event host can export attendees');
      return;
    }
    
    setIsExporting(true);
    
    try {
      // Fetch all attendees with their profile information
      const { data: attendees, error } = await supabase
        .from('event_attendees')
        .select(`
          *,
          profiles:attendee_id(id, display_name, email, institution, college)
        `)
        .eq('event_id', eventId);
      
      if (error) throw error;
      
      if (!attendees.length) {
        toast.info('No attendees to export');
        setIsExporting(false);
        return;
      }
      
      // Format data for Excel
      const excelData = attendees.map((item) => ({
        'Full Name': item.profiles.display_name,
        'Email': item.profiles.email,
        'Institution': item.profiles.institution || 'N/A',
        'College': item.profiles.college || 'N/A',
        'Status': item.status,
        'Registered On': new Date(item.registered_at).toLocaleString(),
      }));
      
      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendees');
      
      // Set column widths
      const colWidths = [
        { wch: 20 }, // Name
        { wch: 30 }, // Email
        { wch: 15 }, // Institution
        { wch: 15 }, // College
        { wch: 12 }, // Status
        { wch: 20 }, // Registered On
      ];
      worksheet['!cols'] = colWidths;
      
      // Generate Excel binary
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const fileName = `${eventTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_attendees.xlsx`;
      
      // Save file
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, fileName);
      
      toast.success('Attendee list exported successfully');
    } catch (error) {
      console.error('Error exporting attendees:', error);
      toast.error('Failed to export attendee list');
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isExporting || !isHost}
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4 mr-2" />
      )}
      Export Attendees
    </Button>
  );
};

export default ExportAttendeesList;
