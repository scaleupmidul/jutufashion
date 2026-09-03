import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  ExternalLink,
  MessageCircle,
  Search,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { AdminMessage } from '../../types';
import { AdminConfirmModal } from './AdminConfirmModal';
import { AdminPagination } from './AdminPagination';

interface AdminMessagesViewProps {
  messages: AdminMessage[];
  onUpdateStatus: (id: string, status: 'new' | 'in-progress' | 'resolved', notes?: string) => Promise<any> | void;
  onDeleteMessage: (id: string) => Promise<any> | void;
}

const ITEMS_PER_PAGE = 20;

export const AdminMessagesView: React.FC<AdminMessagesViewProps> = ({
  messages,
  onUpdateStatus,
  onDeleteMessage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in-progress' | 'resolved'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Deletion Modal State
  const [messageToDelete, setMessageToDelete] = useState<AdminMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleConfirmDelete = async () => {
    if (!messageToDelete) return;
    setIsDeleting(true);
    try {
      const res = await onDeleteMessage(messageToDelete.id);
      if (res && res.success === false) {
        throw new Error(res.error || 'Failed to delete message from database');
      }
      showToast(`Inquiry from ${messageToDelete.name} deleted.`);
      setMessageToDelete(null);
    } catch (err: any) {
      showToast(err.message || 'Database error while deleting message', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'new' | 'in-progress' | 'resolved') => {
    setUpdatingId(id);
    try {
      const res = await onUpdateStatus(id, status);
      if (res && res.success === false) {
        showToast(res.error || 'Failed to update message status in database', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Database error while updating status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesStatus = statusFilter === 'all' || msg.status === statusFilter;
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return matchesStatus;

    return (
      matchesStatus &&
      (msg.name.toLowerCase().includes(searchLower) ||
        msg.phone.includes(searchLower) ||
        msg.email.toLowerCase().includes(searchLower) ||
        msg.subject.toLowerCase().includes(searchLower) ||
        msg.message.toLowerCase().includes(searchLower))
    );
  });

  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE) || 1;

  // Reset to page 1 on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Ensure current page is valid when total changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-950 uppercase">
          Customer Inquiries & Concierge
        </h2>
        <p className="text-xs text-stone-600 mt-0.5">
          Messages received from the Contact Us page, sizing consultation requests, and showroom inquiries.
        </p>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`px-4 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fadeIn border shadow-md ${
          toastType === 'error'
            ? 'bg-rose-900 text-white border-rose-700'
            : 'bg-stone-900 text-white border-stone-700'
        }`}>
          {toastType === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, phone, email, subject..."
              className="w-full bg-stone-50 text-stone-900 placeholder:text-stone-400 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {(['all', 'new', 'in-progress', 'resolved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-[11px] font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === st
                    ? 'bg-stone-950 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-500">
            <MessageSquare className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-stone-800">No customer inquiries found</p>
          </div>
        ) : (
          <>
            {paginatedMessages.map((msg) => {
              const cleanPhone = (msg.phone || '').replace(/[^0-9]/g, '');
              const whatsappUrl = `https://wa.me/${cleanPhone.startsWith('880') ? cleanPhone : '880' + cleanPhone.replace(/^0+/, '')}?text=${encodeURIComponent(
                `Hello ${msg.name}, thank you for contacting JUTU Footwear! Regarding your message: "${msg.subject}".`
              )}`;

              return (
                <div
                  key={msg.id}
                  className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-stone-400/90 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div>
                      <div className="flex items-center space-x-2.5">
                        <h3 className="font-bold text-sm sm:text-base text-stone-950 uppercase">
                          {msg.name}
                        </h3>
                        <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${
                          msg.status === 'new'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : msg.status === 'in-progress'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        }`}>
                          {msg.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 block mt-0.5">{msg.date}</span>
                    </div>

                    {/* Contact Info Pills */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <a
                        href={`tel:${msg.phone}`}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-900 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 font-mono text-[11px] font-bold transition-colors"
                      >
                        <Phone className="w-3 h-3 text-stone-600" />
                        <span>{msg.phone}</span>
                      </a>
                      {msg.email && (
                        <a
                          href={`mailto:${msg.email}`}
                          className="bg-stone-100 hover:bg-stone-200 text-stone-900 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 text-[11px] transition-colors"
                        >
                          <Mail className="w-3 h-3 text-stone-600" />
                          <span>{msg.email}</span>
                        </a>
                      )}
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg flex items-center space-x-1 text-[11px] font-bold transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Subject & Body */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-stone-500 block">
                      SUBJECT: {msg.subject}
                    </span>
                    <p className="text-xs sm:text-sm text-stone-800 leading-relaxed bg-[#faf8f5] border border-stone-200/80 p-3.5 rounded-xl">
                      {msg.message}
                    </p>
                  </div>

                  {/* Status Update & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase text-stone-500">Status:</span>
                      {(['new', 'in-progress', 'resolved'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(msg.id, st)}
                          disabled={updatingId === msg.id}
                          className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center space-x-1 ${
                            msg.status === st
                              ? 'bg-stone-900 text-white'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          }`}
                        >
                          {updatingId === msg.id && msg.status === st && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
                          <span>{st}</span>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setMessageToDelete(msg)}
                      className="text-stone-400 hover:text-red-700 text-xs font-bold flex items-center space-x-1 cursor-pointer self-end sm:self-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Message</span>
                    </button>
                  </div>

                </div>
              );
            })}

            {/* Pagination */}
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredMessages.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
              itemLabel="customer inquiries"
            />
          </>
        )}
      </div>

      {/* In-App Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(messageToDelete)}
        title="Delete Customer Inquiry"
        message={`Are you sure you want to permanently delete this message from "${messageToDelete?.name}" regarding "${messageToDelete?.subject}"?`}
        confirmLabel="Yes, Delete Message"
        cancelLabel="Cancel"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => !isDeleting && setMessageToDelete(null)}
      />

    </div>
  );
};
