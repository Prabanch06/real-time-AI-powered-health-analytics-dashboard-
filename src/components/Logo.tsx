import React from 'react';

export const Logo = ({
    className = "w-8 h-8",
    withText = false,
    textClass = "text-xl font-bold"
}: {
    className?: string,
    withText?: boolean,
    textClass?: string
}) => {
    return (
        <div className={`flex items-center gap-3 ${withText ? '' : 'justify-center'}`}>
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                <defs>
                    <linearGradient id="healthAI-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0B3E7A" />
                        <stop offset="100%" stopColor="#3CBA9B" />
                    </linearGradient>
                </defs>

                {/* Hexagon outline */}
                <path
                    d="M50 5 L88.97 27.5 L88.97 72.5 L50 95 L11.03 72.5 L11.03 27.5 Z"
                    stroke="url(#healthAI-grad)"
                    strokeWidth="5"
                    strokeLinejoin="round"
                />

                {/* Network nodes and lines (Left side) */}
                <g stroke="url(#healthAI-grad)" strokeWidth="1.5">
                    <line x1="11.03" y1="27.5" x2="28" y2="40" />
                    <line x1="11.03" y1="50" x2="28" y2="40" />
                    <line x1="11.03" y1="72.5" x2="28" y2="60" />
                    <line x1="28" y1="40" x2="28" y2="60" />
                    <line x1="28" y1="40" x2="40" y2="35" />
                    <line x1="28" y1="60" x2="40" y2="65" />
                    <line x1="11.03" y1="72.5" x2="30" y2="85" />
                    <line x1="30" y1="85" x2="50" y2="95" />
                    <line x1="28" y1="60" x2="30" y2="85" />
                    <line x1="11.03" y1="27.5" x2="22" y2="15" />
                    <line x1="22" y1="15" x2="50" y2="5" />
                </g>

                {/* Nodes */}
                <g fill="#0B3E7A">
                    <circle cx="11.03" cy="27.5" r="3.5" />
                    <circle cx="11.03" cy="50" r="3.5" />
                    <circle cx="11.03" cy="72.5" r="3.5" />
                    <circle cx="28" cy="40" r="3.5" />
                    <circle cx="28" cy="60" r="3.5" />
                    <circle cx="30" cy="85" r="3.5" />
                    <circle cx="50" cy="95" r="3.5" />
                    <circle cx="22" cy="15" r="3.5" />
                    <circle cx="50" cy="5" r="3.5" />
                </g>

                {/* The 'H' */}
                <path
                    d="M38 30 L38 70 M38 50 L54 50 M54 30 L54 70"
                    stroke="url(#healthAI-grad)"
                    strokeWidth="6.5"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                />

                {/* Heartbeat right out of the H */}
                <path
                    d="M54 50 L60 50 L65 30 L72 70 L77 50 L89 50"
                    stroke="url(#healthAI-grad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            {withText && (
                <span className={`${textClass} tracking-tight`}>
                    <span className="text-[#0B3E7A]">health</span>
                    <span className="text-[#3CBA9B]">AI</span>
                </span>
            )}
        </div>
    );
};
