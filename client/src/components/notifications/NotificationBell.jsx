import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCheckDouble } from 'react-icons/fa';
import api from '../../lib/api.js';

const readStorageKey = 'fundsphere_read_notifications';

const readIds = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(readStorageKey) || '[]'));
  } catch {
    return new Set();
  }
};

const storeReadId = (id) => {
  const ids = readIds();
  ids.add(id);
  localStorage.setItem(readStorageKey, JSON.stringify([...ids]));
};

const storeReadIds = (idsToAdd) => {
  const ids = readIds();
  idsToAdd.forEach((id) => ids.add(id));
  localStorage.setItem(readStorageKey, JSON.stringify([...ids]));
};

const toneClass = (severity) => {
  const tones = {
    info: 'border-green-200 bg-green-50 text-fundsphere-green',
    success: 'border-green-200 bg-green-50 text-fundsphere-green',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
    urgent: 'border-red-200 bg-red-50 text-fundsphere-red'
  };
  return tones[severity] || tones.info;
};

const formatDateTime = (value) => {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [localReadVersion, setLocalReadVersion] = useState(0);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data = { items: [] } } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.get('/notifications');
      return response.data;
    },
    refetchInterval: 60_000,
    staleTime: 30_000
  });

  const notifications = useMemo(() => {
    const ids = readIds();
    return (data.items || []).map((notification) => ({
      ...notification,
      isRead: notification.isRead || ids.has(notification._id)
    }));
  }, [data.items, localReadVersion]);

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  const markRead = useMutation({
    mutationFn: (id) => api.patch(`/notifications/${id}/read`),
    onMutate: (id) => {
      storeReadId(id);
      setLocalReadVersion((value) => value + 1);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  const markAllRead = useMutation({
    mutationFn: () => api.patch('/notifications/read-all'),
    onMutate: () => {
      storeReadIds(notifications.map((notification) => notification._id));
      setLocalReadVersion((value) => value + 1);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (panelRef.current?.contains(event.target) || buttonRef.current?.contains(event.target)) return;
      setOpen(false);
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => panelRef.current?.querySelector('button, a')?.focus(), 0);
    }
  }, [open]);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) markRead.mutate(notification._id);
    setOpen(false);
    if (notification.link) navigate(notification.link);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        className="relative flex h-12 w-12 items-center justify-center rounded-lg border border-slate-300 bg-white text-fundsphere-blue"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <FaBell aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-fundsphere-red px-1 text-xs font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <section
          ref={panelRef}
          className="absolute right-0 top-14 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-lg border border-slate-200 bg-white shadow-soft sm:w-96"
          role="dialog"
          aria-label="Notification panel"
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Notifications</h2>
              <p className="text-sm text-slate-600">{unreadCount} unread</p>
            </div>
            <button
              type="button"
              className="btn-secondary min-h-10 px-3 py-2 text-sm"
              onClick={() => markAllRead.mutate()}
              disabled={!unreadCount}
            >
              <FaCheckDouble aria-hidden="true" />
              Mark all read
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto p-3">
            {notifications.length ? (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <button
                    key={notification._id}
                    type="button"
                    className={`w-full rounded-lg border p-4 text-left transition hover:bg-slate-50 ${notification.isRead ? 'border-slate-200 bg-white text-slate-700' : toneClass(notification.severity)}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-950">{notification.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-700">{notification.message}</p>
                      </div>
                      {!notification.isRead && <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-fundsphere-red" aria-label="Unread" />}
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-600">{formatDateTime(notification.dueDate || notification.createdAt)}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex min-h-40 items-center justify-center rounded-lg bg-slate-50 p-6 text-center">
                <p className="font-semibold text-slate-600">No notifications available</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
