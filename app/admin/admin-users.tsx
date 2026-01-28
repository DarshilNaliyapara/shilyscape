import api from "@/utils/axios";
import { Calendar, Loader2, Mail, Shield, User } from "lucide-react"
import { useCallback, useEffect, useState } from "react";

interface UserData {
    _id: string;
    displayName?: string;
    userName: string;
    email?: string;
    image?: string;
    role?: string;
    createdAt?: string;
    emailVerified?: Date | null;
}

export const AdminUsers = () => {
    const [usersList, setUsersList] = useState<UserData[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    const fetchUsers = useCallback(async () => {
        setIsLoadingUsers(true);
        try {
            const res = await api.get('/auth/users')
            setUsersList(Array.isArray(res.data.data) ? res.data.data : res.data.data.users || []);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setIsLoadingUsers(false);
        }
    }, []);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (isLoadingUsers ? (
        <div className="flex h-96 items-center justify-center text-neutral-500 flex-col gap-3 ">
            <Loader2 className="animate-spin text-cyan-500" size={40} />
            <p className="text-sm font-medium">Loading users...</p>
        </div>
    ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {usersList.length === 0 ? (
                <div className="col-span-full text-center py-20 text-neutral-500">
                    <User size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No users found in the database.</p>
                </div>
            ) : (
                usersList.map((userData) => (
                    <div
                        key={userData._id}
                        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                {/* Avatar with Fallback */}
                                {userData.image ? (
                                    <img
                                        src={userData.image}
                                        alt={userData.displayName || "User"}
                                        className="w-12 h-12 rounded-full border-2 border-neutral-800 object-cover shrink-0"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-cyan-900/30 border-2 border-neutral-800 flex items-center justify-center text-cyan-400 font-bold text-lg shrink-0">
                                        {(userData.displayName || "U").charAt(0).toUpperCase()}
                                    </div>
                                )}

                                <div className="flex-1 items-center">
                                    <h3 className="text-white font-bold text-xl leading-tight truncate">
                                        {userData.displayName || "Unknown"}
                                    </h3>
                                    <p className="text-xs text-neutral-400 truncate mt-0.5">
                                        @{userData.userName || "user"}
                                    </p>
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${userData.role === 'ADMIN'
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                                }`}>
                                {userData.role || 'USER'}
                            </span>

                            {userData.emailVerified && (
                                <Shield size={10} className="text-green-500 shrink-0" />
                            )}
                        </div>

                        <div className="space-y-3 mt-4 pt-4 border-t border-neutral-800">
                            <div className="flex items-center gap-3 text-neutral-400 text-sm group-hover:text-neutral-300 transition-colors">
                                <Mail size={16} className="text-neutral-600 group-hover:text-cyan-500 transition-colors shrink-0" />
                                <span className="truncate">{userData.email || "No email provided"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-neutral-400 text-sm group-hover:text-neutral-300 transition-colors">
                                <Calendar size={16} className="text-neutral-600 group-hover:text-cyan-500 transition-colors shrink-0" />
                                <span>Joined {formatDate(userData.createdAt)}</span>
                            </div>
                        </div>

                        <div className="mt-4 text-xs font-mono text-neutral-600 truncate bg-neutral-950/50 p-2 rounded">
                            ID: {userData._id}
                        </div>
                    </div>
                ))
            )}
        </div>
    ))
}