'use client'
import { clientSessionToken } from '@/lib/http';
import { useState } from 'react';



export default function AppProvider({ children, initialSessionToken }: { children: React.ReactNode, initialSessionToken?: string }) {
    
    useState(() => {
        clientSessionToken.value = initialSessionToken || '';
    })
    return <>{children}</>
}