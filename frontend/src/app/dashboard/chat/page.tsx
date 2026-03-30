'use client';

import { Suspense } from 'react';
import { ChatInterface } from '@/components/chat/chat-interface';
import { Loader2 } from 'lucide-react';

function ChatContent() {
  return <ChatInterface />;
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';
