
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Calendar, Award, ExternalLink, FileText, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Certificate } from '@/types/certificates';
import { format } from 'date-fns';

interface CertificateCardProps {
  certificate: Certificate;
  compact?: boolean;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate, compact = false }) => {
  const getCompetitionLevelColor = (level: string | null) => {
    switch (level) {
      case 'international':
        return 'bg-purple-600 text-purple-50';
      case 'national':
        return 'bg-indigo-600 text-indigo-50';
      case 'state':
        return 'bg-blue-600 text-blue-50';
      case 'college':
        return 'bg-green-600 text-green-50';
      default:
        return 'bg-gray-600 text-gray-50';
    }
  };

  const getCertificateTypeColor = (type: string) => {
    switch (type) {
      case 'competition':
        return 'bg-orange-600 text-orange-50';
      case 'course':
        return 'bg-teal-600 text-teal-50';
      default:
        return 'bg-slate-600 text-slate-50';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="space-y-1 bg-muted/30 pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-base line-clamp-2">{certificate.title}</h3>
          <div className="flex gap-1 flex-wrap justify-end">
            <Badge variant="secondary" className={getCertificateTypeColor(certificate.certificate_type)}>
              {certificate.certificate_type}
            </Badge>
            {certificate.competition_level && (
              <Badge variant="secondary" className={getCompetitionLevelColor(certificate.competition_level)}>
                {certificate.competition_level}
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{certificate.issuer}</p>
      </CardHeader>
      <CardContent className={`pt-4 ${compact ? 'pb-2' : 'pb-4'}`}>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={14} className="text-muted-foreground" />
            <span>Issued: {format(new Date(certificate.issue_date), 'PPP')}</span>
          </div>
          
          {!compact && certificate.expiry_date && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={14} className="text-muted-foreground" />
              <span>Expires: {format(new Date(certificate.expiry_date), 'PPP')}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm">
            <Award size={14} className="text-primary" />
            <span className="font-semibold">{certificate.points_awarded} points awarded</span>
          </div>
        </div>
      </CardContent>
      
      {!compact && (
        <CardFooter className="bg-muted/20 pt-2 gap-2 flex-wrap">
          {certificate.verification_hash && (
            <Button variant="outline" size="sm" className="h-8">
              <FileText size={14} className="mr-1" />
              Verify
            </Button>
          )}
          
          {certificate.media_url && (
            <Button variant="outline" size="sm" className="h-8" asChild>
              <a href={certificate.media_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={14} className="mr-1" />
                View Certificate
              </a>
            </Button>
          )}
          
          <Button variant="secondary" size="sm" className="h-8 ml-auto">
            <Medal size={14} className="mr-1" />
            Add to Resume
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CertificateCard;
