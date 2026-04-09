import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useActivationCodes } from './useActivationCodes';
import { useUsers } from './useUsers';

/**
 * Hook to manage administrative alerts (Expiring codes, Low stock, Support)
 */
export function useAdminAlerts() {
    const { codes, loading: codesLoading } = useActivationCodes();
    const { users, loading: usersLoading } = useUsers();
    const [tickets, setTickets] = useState([]);
    const [loadingTickets, setLoadingTickets] = useState(true);

    // Fetch support tickets
    useEffect(() => {
        async function fetchTickets() {
            try {
                const { data, error } = await supabase
                    .from('support_tickets')
                    .select('*')
                    .eq('status', 'open');
                
                if (!error) setTickets(data || []);
            } catch (err) {
                console.error("Error fetching alerts tickets:", err);
            } finally {
                setLoadingTickets(false);
            }
        }
        fetchTickets();
    }, []);

    const alerts = useMemo(() => {
        const list = [];
        const now = new Date();
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(now.getDate() + 7);

        // 1. Check Expiring Codes
        const expiringCodes = codes.filter(c => 
            c.status === 'available' && 
            c.expires_at && 
            new Date(c.expires_at) <= sevenDaysFromNow &&
            new Date(c.expires_at) > now
        );

        if (expiringCodes.length > 0) {
            list.push({
                id: 'expiring-codes',
                type: 'warning',
                title: 'أكواد تنتهي قريباً',
                message: `هناك ${expiringCodes.length} كود ستنتهي صلاحيتها خلال 7 أيام.`,
                count: expiringCodes.length,
                category: 'codes'
            });
        }

        // 2. Check Low Stock per Organization
        const orgs = {};
        codes.forEach(c => {
            if (c.status === 'available') {
                orgs[c.org_id] = (orgs[c.org_id] || 0) + 1;
            }
        });

        const lowStockOrgs = Object.entries(orgs).filter(([_, count]) => count < 10);
        lowStockOrgs.forEach(([orgId, count]) => {
            const orgUser = users.find(u => u.id === orgId || u.rawId === orgId);
            list.push({
                id: `low-stock-${orgId}`,
                type: count === 0 ? 'urgent' : 'warning',
                title: count === 0 ? 'نفاذ المخزون' : 'رصيد منخفض',
                message: `الجهة ${orgUser?.displayName || orgId} لديها ${count} كود متبقي فقط.`,
                count: count,
                category: 'stock',
                orgId
            });
        });

        // 3. Check Support Tickets
        if (tickets.length > 0) {
            list.push({
                id: 'open-tickets',
                type: 'info',
                title: 'تذاكر دعم فني معلقة',
                message: `يوجد ${tickets.length} تذكرة دعم فني بانتظار الرد.`,
                count: tickets.length,
                category: 'support'
            });
        }

        return list;
    }, [codes, users, tickets]);

    return {
        alerts,
        unreadCount: alerts.length,
        loading: codesLoading || usersLoading || loadingTickets
    };
}
