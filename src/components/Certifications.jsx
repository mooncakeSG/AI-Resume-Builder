import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Award, Link, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function Certifications({ data = [], onChange }) {
  const [newCert, setNewCert] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: ''
  });

  // Ensure data is always an array
  const certData = Array.isArray(data) ? data : [];

  const handleAddCertification = () => {
    if (newCert.name && newCert.issuer) {
      onChange([...certData, { ...newCert }]);
      setNewCert({
        name: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
        credentialUrl: ''
      });
    }
  };

  const handleRemoveCertification = (index) => {
    const updatedCerts = certData.filter((_, i) => i !== index);
    onChange(updatedCerts);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCert(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Certifications</h2>
        <Badge variant="outline" className="text-xs">
          {certData.length} {certData.length === 1 ? 'Certificate' : 'Certificates'}
        </Badge>
      </div>

      {/* Existing Certifications */}
      <div className="space-y-3">
        {certData.map((cert, index) => (
          <Card key={index} className="relative group">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-blue-500" />
                    <h3 className="font-medium">{cert.name}</h3>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{cert.issuer}</p>
                    {cert.issueDate && (
                      <div className="flex items-center gap-1 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>Issued: {format(new Date(cert.issueDate), 'MMM yyyy')}</span>
                        {cert.expiryDate && (
                          <span> - Expires: {format(new Date(cert.expiryDate), 'MMM yyyy')}</span>
                        )}
                      </div>
                    )}
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600"
                      >
                        <Link className="h-3 w-3" />
                        View Credential
                      </a>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveCertification(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Certification */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              placeholder="Certification Name"
              name="name"
              value={newCert.name}
              onChange={handleInputChange}
            />
            <Input
              placeholder="Issuing Organization"
              name="issuer"
              value={newCert.issuer}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="date"
              placeholder="Issue Date"
              name="issueDate"
              value={newCert.issueDate}
              onChange={handleInputChange}
            />
            <Input
              type="date"
              placeholder="Expiry Date (Optional)"
              name="expiryDate"
              value={newCert.expiryDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              placeholder="Credential ID (Optional)"
              name="credentialId"
              value={newCert.credentialId}
              onChange={handleInputChange}
            />
            <Input
              placeholder="Credential URL (Optional)"
              name="credentialUrl"
              value={newCert.credentialUrl}
              onChange={handleInputChange}
            />
          </div>
          <Button
            className="w-full"
            onClick={handleAddCertification}
            disabled={!newCert.name || !newCert.issuer}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 