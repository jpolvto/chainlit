import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SidebarTrigger from '@/components/header/SidebarTrigger';
import { Sidebar, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import NewChatButton from '../header/NewChat';
import SearchChats from './Search';
import { ThreadHistory } from './ThreadHistory';

// Import modal and icons
import PersonaModal, { Persona } from './PersonaModal';
import { UserPen } from '../icons/UserPen';

export default function LeftSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();

  // Example predefined personas
  const initialPersonas: Persona[] = [
    {
      id: 1,
      name: 'AI Marketing Strategist',
      icon: '📊',
      description: 'Helps craft compelling marketing strategies and content.',
      prompt: 'You are an expert marketing strategist. Provide data-driven insights and creative ideas to improve engagement, conversion rates, and branding strategies.',
    },
    {
      id: 2,
      name: 'Technical Troubleshooter',
      icon: '🛠️',
      description: 'Assists with debugging and resolving technical issues.',
      prompt: 'You are a highly experienced software engineer specializing in debugging and troubleshooting. Provide solutions to common coding issues, performance optimizations, and best practices.',
    },
  ];

  // Track an array of Persona objects
  const [personas, setPersonas] = useState<Persona[]>(initialPersonas);
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle persona deletion
  const handleDeletePersona = (personaId: number) => {
    setPersonas((prev) => prev.filter((persona) => persona.id !== personaId));
  };

  // Simulate data loading to prevent extra UI elements from appearing
  React.useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100); // Adjust if necessary
  }, []);

  // Show the manage personas modal
  const handleManagePersonas = () => {
    setShowPersonaModal(true);
  };

  // Save a new persona
  const handleSavePersona = (personaData: Omit<Persona, 'id'>) => {
    const newPersona: Persona = {
      id: Date.now(), // Provide a unique ID
      ...personaData,
    };
    setPersonas((prev) => [...prev, newPersona]);
    setShowPersonaModal(false);
  };

  return (
    <Sidebar {...props} className="border-none flex flex-col h-full">
      <SidebarHeader className="py-3">
        <div className="flex items-center justify-between">
          <SidebarTrigger />
          <div className="flex items-center space-x-2">
            <SearchChats />
            <button onClick={handleManagePersonas} className="p-2 hover:bg-gray-200 rounded">
              <UserPen className="w-6 h-6 text-gray-700" />
            </button>
            <NewChatButton navigate={navigate} />
          </div>
        </div>
      </SidebarHeader>

      {/* Scrollable content, ensure it's fully loaded before rendering */}
      {isLoaded && (
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <ul className="space-y-1">
            {personas.map((persona) => (
              <li key={persona.id} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
                <span className="text-lg">{persona.icon}</span>
                <span className="text-sm font-medium">{persona.name}</span>
              </li>
            ))}
          </ul>

          {/* Only render chat history if it's fully loaded */}
          {isLoaded && <ThreadHistory />}
        </div>
      )}

      {/* Ensure no unnecessary UI is lingering */}
      {isLoaded && <SidebarRail />}

      {/* The separate overlay component */}
      <PersonaModal
        isOpen={showPersonaModal}
        onClose={() => setShowPersonaModal(false)}
        onSave={handleSavePersona}
        onDelete={handleDeletePersona}
        personas={personas}
      />
    </Sidebar>
  );
}
