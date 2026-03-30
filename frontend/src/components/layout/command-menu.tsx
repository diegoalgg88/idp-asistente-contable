'use client';

import * as React from 'react';
import { 
  Calculator, 
  Calendar, 
  CreditCard, 
  FileText, 
  Search, 
  User, 
  Users,
  Briefcase
} from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { useNavigate } from 'react-router-dom';

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Escribe un comando o busca algo..." />
      <CommandList>
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
        <CommandGroup heading="Sugerencias">
          <CommandItem onSelect={() => runCommand(() => navigate('/dashboard'))}>
            <Briefcase className="mr-2 h-4 w-4" />
            <span>Dashboard Principal</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/dashboard/documents'))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Documentos e IDP</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/dashboard/payroll'))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Gestión de Nómina</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Módulos">
          <CommandItem onSelect={() => runCommand(() => navigate('/dashboard/finance'))}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Conciliación Bancaria</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/dashboard/clients'))}>
            <User className="mr-2 h-4 w-4" />
            <span>Catálogo de Clientes</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Configuración">
          <CommandItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendario Fiscal</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
