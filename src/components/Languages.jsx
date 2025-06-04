import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, Globe } from 'lucide-react';

const PROFICIENCY_LEVELS = [
  { value: 'native', label: 'Native/Bilingual' },
  { value: 'fluent', label: 'Fluent' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'basic', label: 'Basic' }
];

export default function Languages({ data = [], onChange }) {
  const [newLang, setNewLang] = useState({
    name: '',
    proficiency: '',
    certification: ''
  });

  // Ensure data is always an array
  const languageData = Array.isArray(data) ? data : [];

  const handleAddLanguage = () => {
    if (newLang.name && newLang.proficiency) {
      onChange([...languageData, { ...newLang }]);
      setNewLang({
        name: '',
        proficiency: '',
        certification: ''
      });
    }
  };

  const handleRemoveLanguage = (index) => {
    const updatedLangs = languageData.filter((_, i) => i !== index);
    onChange(updatedLangs);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLang(prev => ({ ...prev, [name]: value }));
  };

  const handleProficiencyChange = (value) => {
    setNewLang(prev => ({ ...prev, proficiency: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Languages</h2>
        <Badge variant="outline" className="text-xs">
          {languageData.length} {languageData.length === 1 ? 'Language' : 'Languages'}
        </Badge>
      </div>

      {/* Existing Languages */}
      <div className="space-y-3">
        {languageData.map((lang, index) => (
          <Card key={index} className="relative group">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-green-500" />
                    <h3 className="font-medium">{lang.name}</h3>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <Badge variant="secondary" className="text-xs">
                      {PROFICIENCY_LEVELS.find(level => level.value === lang.proficiency)?.label || lang.proficiency}
                    </Badge>
                    {lang.certification && (
                      <p className="text-xs mt-1">{lang.certification}</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveLanguage(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Language */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              placeholder="Language Name"
              name="name"
              value={newLang.name}
              onChange={handleInputChange}
            />
            <Select
              value={newLang.proficiency}
              onValueChange={handleProficiencyChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Proficiency" />
              </SelectTrigger>
              <SelectContent>
                {PROFICIENCY_LEVELS.map(level => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            placeholder="Certification (Optional, e.g., TOEFL, IELTS, DELF)"
            name="certification"
            value={newLang.certification}
            onChange={handleInputChange}
          />
          <Button
            className="w-full"
            onClick={handleAddLanguage}
            disabled={!newLang.name || !newLang.proficiency}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Language
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 