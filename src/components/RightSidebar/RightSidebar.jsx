import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserPlus,
    faBolt,
    faCalendarCheck,
    faUsers,
    faGem,
    faRocket,
    faCheck,
    faCrown,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";
import FollowSuggestions from "../FollowSuggestions/FollowSuggestions";

export default function RightSidebar() {
    const suggestedUsers = [
        {
            id: 1,
            name: "Sarah Wilson",
            username: "@sarahw",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            mutualFriends: 12,
            verified: true,
        },
        {
            id: 2,
            name: "Mike Johnson",
            username: "@mikej",
            avatar: "https://randomuser.me/api/portraits/men/22.jpg",
            mutualFriends: 8,
            verified: false,
        },
        {
            id: 3,
            name: "Emma Davis",
            username: "@emmad",
            avatar: "https://randomuser.me/api/portraits/women/68.jpg",
            mutualFriends: 15,
            verified: true,
        },
        {
            id: 4,
            name: "Alex Chen",
            username: "@alexc",
            avatar: "https://randomuser.me/api/portraits/men/45.jpg",
            mutualFriends: 6,
            verified: false,
        },
    ];

    const upcomingEvents = [
        {
            id: 1,
            title: "Tech Meetup 2024",
            date: "Jan 15",
            time: "6:00 PM",
            attendees: 234,
            color: "from-blue-500 to-cyan-500",
        },
        {
            id: 2,
            title: "Design Workshop",
            date: "Jan 18",
            time: "2:00 PM",
            attendees: 89,
            color: "from-purple-500 to-pink-500",
        },
        {
            id: 3,
            title: "Startup Pitch Night",
            date: "Jan 22",
            time: "7:00 PM",
            attendees: 156,
            color: "from-orange-500 to-red-500",
        },
    ];

    const activeGroups = [
        {
            id: 1,
            name: "React Developers",
            members: "15.2K",
            avatar: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop",
            online: 342,
        },
        {
            id: 2,
            name: "UI/UX Designers",
            members: "8.7K",
            avatar: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&h=100&fit=crop",
            online: 128,
        },
    ];

    return (
        <aside className="w-64 h-[calc(100vh-80px)] sticky top-20 overflow-y-auto scrollbar-hide">
            <div className="space-y-4 pl-4">
                {/* Follow Suggestions - Dynamic */}
                <FollowSuggestions />

                {/* Suggested Users - Keep for fallback/additional suggestions */}
                <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <FontAwesomeIcon icon={faUserPlus} className="text-blue-500" />
                            Suggested for you
                        </h4>
                        <Link to="/suggestions" className="text-xs text-blue-500 hover:text-blue-600 font-semibold">
                            See all
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {suggestedUsers.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between p-2 rounded-xl hover:bg-linear-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all duration-300"
                                        />
                                        {user.verified && (
                                            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                                                <FontAwesomeIcon icon={faCheck} className="text-white text-[8px]" />
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                                            {user.name}
                                        </h5>
                                        <p className="text-xs text-gray-500">{user.mutualFriends} mutual friends</p>
                                    </div>
                                </div>
                                <button className="px-3 py-1.5 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 transition-all duration-300">
                                    Follow
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <FontAwesomeIcon icon={faCalendarCheck} className="text-green-500" />
                            Upcoming Events
                        </h4>
                        <Link to="/events" className="text-xs text-blue-500 hover:text-blue-600 font-semibold">
                            View all
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {upcomingEvents.map((event) => (
                            <Link
                                key={event.id}
                                to={`/event/${event.id}`}
                                className="block p-3 rounded-xl border border-gray-100 hover:border-transparent hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 group"
                            >
                                <div className="flex gap-3">
                                    <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${event.color} flex flex-col items-center justify-center text-white shadow-lg`}>
                                        <span className="text-[10px] font-bold uppercase">{event.date.split(" ")[0]}</span>
                                        <span className="text-sm font-bold -mt-0.5">{event.date.split(" ")[1]}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors duration-300">
                                            {event.title}
                                        </h5>
                                        <p className="text-xs text-gray-500 mt-0.5">{event.time}</p>
                                        <div className="flex items-center gap-1 mt-1.5">
                                            <div className="flex -space-x-1.5">
                                                {[1, 2, 3].map((i) => (
                                                    <div
                                                        key={i}
                                                        className="w-5 h-5 rounded-full bg-linear-to-br from-gray-200 to-gray-300 border-2 border-white"
                                                    ></div>
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-500">+{event.attendees} going</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Active Groups */}
                <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <FontAwesomeIcon icon={faUsers} className="text-purple-500" />
                            Active Groups
                        </h4>
                        <Link to="/groups" className="text-xs text-blue-500 hover:text-blue-600 font-semibold">
                            Browse
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {activeGroups.map((group) => (
                            <Link
                                key={group.id}
                                to={`/group/${group.id}`}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-linear-to-r hover:from-purple-50/50 hover:to-pink-50/50 transition-all duration-300 group"
                            >
                                <img
                                    src={group.avatar}
                                    alt={group.name}
                                    className="w-12 h-12 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow duration-300"
                                />
                                <div className="flex-1">
                                    <h5 className="font-semibold text-gray-900 text-sm group-hover:text-purple-600 transition-colors duration-300">
                                        {group.name}
                                    </h5>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs text-gray-500">{group.members} members</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        <span className="text-xs text-green-500 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                            {group.online} online
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Quick Links Footer */}
                <div className="px-4 py-3">
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
                        <Link to="/about" className="hover:text-gray-600 transition-colors">About</Link>
                        <Link to="/privacy" className="hover:text-gray-600 transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-gray-600 transition-colors">Terms</Link>
                        <Link to="/cookies" className="hover:text-gray-600 transition-colors">Cookies</Link>
                        <Link to="/careers" className="hover:text-gray-600 transition-colors">Careers</Link>
                    </div>
                    <p className="text-xs text-gray-300 mt-2">SocialHub © 2024</p>
                </div>
            </div>
        </aside>
    );
}
