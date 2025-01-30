import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';

import { SelectInput, SelectItemType } from '@/components/ChatSettings/SelectInput';
import { Trash2 } from 'lucide-react';

export type Persona = {
    id?: number;
    name: string;
    icon: string;
    description: string;
    prompt: string;
};

type PersonaModalProps = {
    isOpen: boolean;
    personas: Persona[];
    onSave: (personaData: Omit<Persona, 'id'>) => void;
    onDelete: (personaId: number) => void;
    onClose: () => void;
};

export default function PersonaModal({ isOpen, personas, onSave, onDelete, onClose }: PersonaModalProps) {
    const { handleSubmit, reset, register, setValue } = useForm({
        defaultValues: { name: '', icon: '', description: '', prompt: '' }
    });

    const [selectedPersona, setSelectedPersona] = useState<string>('new');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Reset form when the modal is opened
    useEffect(() => {
        if (isOpen) {
            reset({ name: '', icon: '', description: '', prompt: '' });
            setSelectedPersona('new');
            setShowDeleteConfirm(false);
        }
    }, [isOpen, reset]);

    // Format personas into SelectInput items
    const personaOptions: SelectItemType[] = [
        { label: 'New Persona', value: 'new' },
        ...personas.map((persona) => ({
            label: persona.name,
            value: persona.id?.toString() || '',
            icon: <span className="text-lg">{persona.icon}</span>
        }))
    ];

    // Handle persona selection from dropdown
    const handleSelectPersona = (personaId: string) => {
        setSelectedPersona(personaId);
        if (personaId === 'new') {
            reset({ name: '', icon: '', description: '', prompt: '' });
        } else {
            const persona = personas.find((p) => p.id?.toString() === personaId);
            if (persona) {
                setValue('name', persona.name);
                setValue('icon', persona.icon);
                setValue('description', persona.description);
                setValue('prompt', persona.prompt);
            }
        }
    };

    const handleConfirm = handleSubmit((data) => {
        onSave(data);
        onClose();
    });

    const handleDelete = () => {
        if (selectedPersona !== 'new') {
            onDelete(Number(selectedPersona));
            setSelectedPersona('new');
            reset({ name: '', icon: '', description: '', prompt: '' });
        }
        setShowDeleteConfirm(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="min-w-[22vw] max-h-[85vh] flex flex-col gap-6">
                <DialogHeader>
                    <DialogTitle>Manage Persona</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col flex-grow overflow-y-auto gap-4">
                    {/* Persona Selection Dropdown */}
                    <label className="block text-sm font-semibold">
                        Select Persona:
                        <SelectInput
                            id="persona-select"
                            items={personaOptions}
                            value={selectedPersona}
                            onChange={handleSelectPersona}
                            placeholder="Select a persona"
                        />
                    </label>

                    <label className="block text-sm font-semibold">
                        Icon:
                        <input
                            {...register('icon')}
                            type="text"
                            className="mt-1 block w-full p-2 border rounded bg-gray-50"
                            placeholder="Enter an emoji (e.g., 📊)"
                        />
                    </label>

                    <label className="block text-sm font-semibold">
                        Name:
                        <input
                            {...register('name')}
                            type="text"
                            className="mt-1 block w-full p-2 border rounded bg-gray-50"
                            placeholder="Enter persona name"
                        />
                    </label>

                    <label className="block text-sm font-semibold">
                        Description:
                        <input
                            {...register('description')}
                            type="text"
                            className="mt-1 block w-full p-2 border rounded bg-gray-50"
                            placeholder="Short description"
                        />
                    </label>

                    <label className="block text-sm font-semibold">
                        Prompt:
                        <textarea
                            {...register('prompt')}
                            className="mt-1 block w-full p-2 border rounded bg-gray-50"
                            rows={3}
                            placeholder="Enter persona prompt"
                        />
                    </label>
                </div>

                <DialogFooter className="flex justify-between">
                    {/* Delete Persona Button */}
                    {selectedPersona !== 'new' && (
                        <Button
                            variant="destructive"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex items-center gap-2"
                        >
                            <Trash2 size={16} />
                            Delete
                        </Button>
                    )}

                    {/* Confirmation Modal for Deletion */}
                    {showDeleteConfirm && (
                        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                            <DialogContent className="max-w-sm">
                                <DialogHeader>
                                    <DialogTitle>Confirm Deletion</DialogTitle>
                                </DialogHeader>
                                <p>Are you sure you want to delete this persona? This action cannot be undone.</p>
                                <DialogFooter>
                                    <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="destructive" onClick={handleDelete}>
                                        Delete
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm} id="confirm" autoFocus>
                            Save
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
