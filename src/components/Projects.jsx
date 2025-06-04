import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, FolderGit2, Link, Calendar, Tags } from 'lucide-react';
import { format } from 'date-fns';

export default function Projects({ data = [], onChange }) {
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    url: '',
    startDate: '',
    endDate: '',
    technologies: '',
    achievements: ''
  });

  // Ensure data is always an array
  const projectData = Array.isArray(data) ? data : [];

  const handleAddProject = () => {
    if (newProject.name && newProject.description) {
      const formattedProject = {
        ...newProject,
        technologies: newProject.technologies.split(',').map(tech => tech.trim()).filter(Boolean),
        achievements: newProject.achievements.split('\n').filter(Boolean)
      };
      onChange([...projectData, formattedProject]);
      setNewProject({
        name: '',
        description: '',
        url: '',
        startDate: '',
        endDate: '',
        technologies: '',
        achievements: ''
      });
    }
  };

  const handleRemoveProject = (index) => {
    const updatedProjects = projectData.filter((_, i) => i !== index);
    onChange(updatedProjects);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Projects</h2>
        <Badge variant="outline" className="text-xs">
          {projectData.length} {projectData.length === 1 ? 'Project' : 'Projects'}
        </Badge>
      </div>

      {/* Existing Projects */}
      <div className="space-y-3">
        {projectData.map((project, index) => (
          <Card key={index} className="relative group">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="h-4 w-4 text-purple-500" />
                    <h3 className="font-medium">{project.name}</h3>
                  </div>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>{project.description}</p>
                    
                    {(project.startDate || project.endDate) && (
                      <div className="flex items-center gap-1 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {project.startDate && format(new Date(project.startDate), 'MMM yyyy')}
                          {project.endDate && ` - ${format(new Date(project.endDate), 'MMM yyyy')}`}
                          {!project.endDate && ' - Present'}
                        </span>
                      </div>
                    )}

                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tags className="h-3 w-3" />
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {project.achievements && project.achievements.length > 0 && (
                      <ul className="list-disc list-inside text-xs space-y-1 ml-1">
                        {project.achievements.map((achievement, achieveIndex) => (
                          <li key={achieveIndex}>{achievement}</li>
                        ))}
                      </ul>
                    )}

                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-purple-500 hover:text-purple-600"
                      >
                        <Link className="h-3 w-3" />
                        View Project
                      </a>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveProject(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Project */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <Input
            placeholder="Project Name"
            name="name"
            value={newProject.name}
            onChange={handleInputChange}
          />
          <Textarea
            placeholder="Project Description"
            name="description"
            value={newProject.description}
            onChange={handleInputChange}
            className="min-h-[100px]"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="date"
              placeholder="Start Date"
              name="startDate"
              value={newProject.startDate}
              onChange={handleInputChange}
            />
            <Input
              type="date"
              placeholder="End Date (Optional)"
              name="endDate"
              value={newProject.endDate}
              onChange={handleInputChange}
            />
          </div>
          <Input
            placeholder="Project URL (Optional)"
            name="url"
            value={newProject.url}
            onChange={handleInputChange}
          />
          <Input
            placeholder="Technologies Used (comma-separated)"
            name="technologies"
            value={newProject.technologies}
            onChange={handleInputChange}
          />
          <Textarea
            placeholder="Key Achievements (one per line)"
            name="achievements"
            value={newProject.achievements}
            onChange={handleInputChange}
            className="min-h-[100px]"
          />
          <Button
            className="w-full"
            onClick={handleAddProject}
            disabled={!newProject.name || !newProject.description}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 