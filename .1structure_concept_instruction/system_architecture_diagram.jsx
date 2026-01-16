import React, { useState } from 'react';

const SystemArchitectureDiagram = () => {
  const [activeFlow, setActiveFlow] = useState('overview');
  const [hoveredComponent, setHoveredComponent] = useState(null);

  const componentInfo = {
    patient: {
      title: "Patient",
      description: "Calls the dental practice's main phone number. If no one answers or it's after hours, call forwards to AI."
    },
    twilio: {
      title: "Twilio (Phone Numbers)",
      description: "Provides dedicated phone numbers for each practice. Handles call routing and forwarding to Vapi."
    },
    vapi: {
      title: "Vapi.ai (Voice AI)",
      description: "Handles the AI conversation. Speech-to-text, AI responses, text-to-speech. Sends webhook after each call."
    },
    nextjs: {
      title: "Your App (Next.js)",
      description: "The dashboard practices log into. Shows calls, settings, analytics. Also handles webhooks from Vapi."
    },
    supabase: {
      title: "Supabase (Database)",
      description: "Stores all data: practices, users, calls, settings. Row-Level Security ensures practices only see their own data."
    },
    practice: {
      title: "Dental Practice",
      description: "Logs into app.dentaldeskai.com. Sees their calls, listens to recordings, marks callbacks complete."
    },
    admin: {
      title: "Admin Panel (You)",
      description: "You see all practices, all calls, revenue metrics, system health. Can impersonate for support."
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold text-center mb-2">AI Dental Receptionist - System Architecture</h1>
      <p className="text-gray-400 text-center mb-6">Click components to learn more. Use tabs to see different flows.</p>
      
      {/* Flow Selector */}
      <div className="flex justify-center gap-2 mb-8">
        {[
          { id: 'overview', label: '🏗️ Overview' },
          { id: 'call', label: '📞 Call Flow' },
          { id: 'dashboard', label: '💻 Dashboard Flow' },
          { id: 'data', label: '🔒 Data Flow' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFlow(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeFlow === tab.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Info Panel */}
      {hoveredComponent && (
        <div className="fixed top-4 right-4 w-72 bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-xl z-50">
          <h3 className="font-bold text-blue-400 mb-2">{componentInfo[hoveredComponent]?.title}</h3>
          <p className="text-sm text-gray-300">{componentInfo[hoveredComponent]?.description}</p>
        </div>
      )}

      {/* Overview Diagram */}
      {activeFlow === 'overview' && (
        <div className="max-w-4xl mx-auto">
          <svg viewBox="0 0 800 500" className="w-full">
            {/* Background boxes */}
            <rect x="20" y="20" width="760" height="460" rx="10" fill="#1f2937" stroke="#374151" strokeWidth="2"/>
            
            {/* Patient */}
            <g 
              className="cursor-pointer transition-transform hover:scale-105"
              onMouseEnter={() => setHoveredComponent('patient')}
              onMouseLeave={() => setHoveredComponent(null)}
            >
              <circle cx="100" cy="100" r="40" fill="#3b82f6" stroke="#60a5fa" strokeWidth="2"/>
              <text x="100" y="95" textAnchor="middle" fill="white" fontSize="24">👤</text>
              <text x="100" y="115" textAnchor="middle" fill="white" fontSize="10">Patient</text>
            </g>

            {/* Arrow Patient to Twilio */}
            <path d="M140 100 L200 100" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrow)"/>
            <text x="170" y="90" textAnchor="middle" fill="#9ca3af" fontSize="10">Calls</text>

            {/* Twilio */}
            <g 
              className="cursor-pointer transition-transform hover:scale-105"
              onMouseEnter={() => setHoveredComponent('twilio')}
              onMouseLeave={() => setHoveredComponent(null)}
            >
              <rect x="200" y="60" width="120" height="80" rx="8" fill="#ef4444" stroke="#f87171" strokeWidth="2"/>
              <text x="260" y="95" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Twilio</text>
              <text x="260" y="115" textAnchor="middle" fill="white" fontSize="10">Phone Numbers</text>
            </g>

            {/* Arrow Twilio to Vapi */}
            <path d="M320 100 L380 100" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrow)"/>
            <text x="350" y="90" textAnchor="middle" fill="#9ca3af" fontSize="10">Routes</text>

            {/* Vapi */}
            <g 
              className="cursor-pointer transition-transform hover:scale-105"
              onMouseEnter={() => setHoveredComponent('vapi')}
              onMouseLeave={() => setHoveredComponent(null)}
            >
              <rect x="380" y="60" width="120" height="80" rx="8" fill="#8b5cf6" stroke="#a78bfa" strokeWidth="2"/>
              <text x="440" y="95" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Vapi.ai</text>
              <text x="440" y="115" textAnchor="middle" fill="white" fontSize="10">Voice AI</text>
            </g>

            {/* Arrow Vapi to Next.js */}
            <path d="M440 140 L440 200" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrow)"/>
            <text x="470" y="170" textAnchor="middle" fill="#9ca3af" fontSize="10">Webhook</text>

            {/* Next.js App */}
            <g 
              className="cursor-pointer transition-transform hover:scale-105"
              onMouseEnter={() => setHoveredComponent('nextjs')}
              onMouseLeave={() => setHoveredComponent(null)}
            >
              <rect x="340" y="200" width="200" height="100" rx="8" fill="#10b981" stroke="#34d399" strokeWidth="2"/>
              <text x="440" y="240" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Your App</text>
              <text x="440" y="260" textAnchor="middle" fill="white" fontSize="11">Next.js Dashboard</text>
              <text x="440" y="280" textAnchor="middle" fill="white" fontSize="10">app.dentaldeskai.com</text>
            </g>

            {/* Arrow Next.js to Supabase */}
            <path d="M440 300 L440 360" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrow)"/>
            <text x="470" y="330" textAnchor="middle" fill="#9ca3af" fontSize="10">Stores</text>

            {/* Supabase */}
            <g 
              className="cursor-pointer transition-transform hover:scale-105"
              onMouseEnter={() => setHoveredComponent('supabase')}
              onMouseLeave={() => setHoveredComponent(null)}
            >
              <rect x="340" y="360" width="200" height="80" rx="8" fill="#f59e0b" stroke="#fbbf24" strokeWidth="2"/>
              <text x="440" y="395" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Supabase</text>
              <text x="440" y="415" textAnchor="middle" fill="white" fontSize="10">Database + Auth + Storage</text>
            </g>

            {/* Practice User */}
            <g 
              className="cursor-pointer transition-transform hover:scale-105"
              onMouseEnter={() => setHoveredComponent('practice')}
              onMouseLeave={() => setHoveredComponent(null)}
            >
              <rect x="600" y="200" width="140" height="100" rx="8" fill="#06b6d4" stroke="#22d3ee" strokeWidth="2"/>
              <text x="670" y="235" textAnchor="middle" fill="white" fontSize="24">🏥</text>
              <text x="670" y="265" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Dental Practice</text>
              <text x="670" y="285" textAnchor="middle" fill="white" fontSize="10">Views own data only</text>
            </g>

            {/* Arrow Practice to Next.js */}
            <path d="M600 250 L540 250" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrow)"/>
            <text x="570" y="240" textAnchor="middle" fill="#9ca3af" fontSize="10">Logs in</text>

            {/* Admin (You) */}
            <g 
              className="cursor-pointer transition-transform hover:scale-105"
              onMouseEnter={() => setHoveredComponent('admin')}
              onMouseLeave={() => setHoveredComponent(null)}
            >
              <rect x="600" y="360" width="140" height="80" rx="8" fill="#ec4899" stroke="#f472b6" strokeWidth="2"/>
              <text x="670" y="390" textAnchor="middle" fill="white" fontSize="20">👑</text>
              <text x="670" y="415" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Admin (You)</text>
              <text x="670" y="432" textAnchor="middle" fill="white" fontSize="10">Sees ALL data</text>
            </g>

            {/* Arrow Admin to Supabase */}
            <path d="M600 400 L540 400" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrow)"/>
            <text x="570" y="390" textAnchor="middle" fill="#9ca3af" fontSize="10">Full access</text>

            {/* Arrow definition */}
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#60a5fa"/>
              </marker>
            </defs>
          </svg>
        </div>
      )}

      {/* Call Flow Diagram */}
      {activeFlow === 'call' && (
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6 text-center">📞 What Happens When a Patient Calls</h2>
          
          <div className="space-y-4">
            {[
              { step: 1, icon: "📱", title: "Patient Dials", desc: "Patient calls (801) 555-0123 (practice's main number)", color: "blue" },
              { step: 2, icon: "🔔", title: "Phone Rings", desc: "Practice phone rings. Receptionist can answer if available.", color: "green" },
              { step: 3, icon: "➡️", title: "Forward (if needed)", desc: "If no answer after 4 rings OR after hours → forwards to AI number", color: "yellow" },
              { step: 4, icon: "🤖", title: "AI Answers", desc: "\"Hi! Thanks for calling Johnson Family Dental, this is Sophie...\"", color: "purple" },
              { step: 5, icon: "💬", title: "Conversation", desc: "AI captures: name, phone, reason for call, new/existing patient", color: "purple" },
              { step: 6, icon: "📤", title: "Webhook Sent", desc: "Vapi sends call data (transcript, recording) to your app", color: "orange" },
              { step: 7, icon: "💾", title: "Data Saved", desc: "Your app saves call to Supabase database under practice's account", color: "orange" },
              { step: 8, icon: "📧", title: "Notification", desc: "Practice gets email/SMS: \"New call from Mike Thompson\"", color: "cyan" },
              { step: 9, icon: "✅", title: "Action Taken", desc: "Practice sees call in dashboard, calls patient back, marks complete", color: "cyan" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${
                  item.color === 'blue' ? 'bg-blue-600' :
                  item.color === 'green' ? 'bg-green-600' :
                  item.color === 'yellow' ? 'bg-yellow-600' :
                  item.color === 'purple' ? 'bg-purple-600' :
                  item.color === 'orange' ? 'bg-orange-600' :
                  'bg-cyan-600'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded">Step {item.step}</span>
                    <span className="font-bold">{item.title}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Flow */}
      {activeFlow === 'dashboard' && (
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6 text-center">💻 What the Practice Sees</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-bold text-blue-400 mb-3">🏠 Dashboard</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Today's call count</li>
                <li>• Leads captured</li>
                <li>• Callbacks pending (action needed!)</li>
                <li>• Quick view of recent calls</li>
              </ul>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-bold text-green-400 mb-3">📞 Calls List</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• All calls with filters</li>
                <li>• Caller name & phone</li>
                <li>• Reason for calling</li>
                <li>• Status (pending/called back)</li>
              </ul>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-bold text-purple-400 mb-3">🔍 Call Detail</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Full conversation transcript</li>
                <li>• Audio recording (play/download)</li>
                <li>• Extracted data summary</li>
                <li>• Action buttons (mark called, etc.)</li>
              </ul>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-bold text-yellow-400 mb-3">⚙️ Settings</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Practice info (hours, address)</li>
                <li>• AI name & voice</li>
                <li>• Insurance list</li>
                <li>• Notification preferences</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-pink-900/30 border border-pink-700 rounded-lg">
            <h3 className="font-bold text-pink-400 mb-2">👑 What YOU See (Admin Panel)</h3>
            <p className="text-sm text-gray-300 mb-3">You have a separate admin view at /admin that shows:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <span className="bg-gray-700 px-2 py-1 rounded">All practices</span>
              <span className="bg-gray-700 px-2 py-1 rounded">All calls</span>
              <span className="bg-gray-700 px-2 py-1 rounded">Revenue/MRR</span>
              <span className="bg-gray-700 px-2 py-1 rounded">System health</span>
            </div>
          </div>
        </div>
      )}

      {/* Data Flow */}
      {activeFlow === 'data' && (
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6 text-center">🔒 Data Privacy & Security</h2>
          
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3">Who Can See What?</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="p-3 text-left">Data</th>
                    <th className="p-3 text-center">Practice A</th>
                    <th className="p-3 text-center">Practice B</th>
                    <th className="p-3 text-center">You (Admin)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700">
                    <td className="p-3">Practice A's calls</td>
                    <td className="p-3 text-center text-green-400">✅ Yes</td>
                    <td className="p-3 text-center text-red-400">❌ No</td>
                    <td className="p-3 text-center text-green-400">✅ Yes</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="p-3">Practice B's calls</td>
                    <td className="p-3 text-center text-red-400">❌ No</td>
                    <td className="p-3 text-center text-green-400">✅ Yes</td>
                    <td className="p-3 text-center text-green-400">✅ Yes</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="p-3">Recordings</td>
                    <td className="p-3 text-center">Own only</td>
                    <td className="p-3 text-center">Own only</td>
                    <td className="p-3 text-center text-green-400">All</td>
                  </tr>
                  <tr>
                    <td className="p-3">Settings</td>
                    <td className="p-3 text-center">Own only</td>
                    <td className="p-3 text-center">Own only</td>
                    <td className="p-3 text-center text-green-400">All</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-bold text-green-400 mb-3">✅ How Data Isolation Works</h3>
              <p className="text-sm text-gray-300 mb-3">Supabase Row-Level Security (RLS) automatically filters data:</p>
              <code className="block bg-gray-900 p-3 rounded text-xs text-green-300">
                {`-- Every query is automatically filtered
SELECT * FROM calls 
WHERE practice_id = 
  current_user's_practice_id`}
              </code>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-bold text-blue-400 mb-3">🔐 Security Measures</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Supabase Auth for login</li>
                <li>• JWT tokens with practice_id</li>
                <li>• RLS on every table</li>
                <li>• HTTPS everywhere</li>
                <li>• Recordings in private storage</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
            <h3 className="font-bold text-yellow-400 mb-2">⚠️ HIPAA Note</h3>
            <p className="text-sm text-gray-300">
              While this architecture is secure, you'll need a <strong>Business Associate Agreement (BAA)</strong> with 
              Supabase and other vendors to be fully HIPAA compliant. Supabase offers BAAs on their Pro plan ($25/mo).
            </p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-8 max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-600"></div>
            <span className="text-gray-400">Patient/User</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span className="text-gray-400">Twilio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-600"></div>
            <span className="text-gray-400">Vapi.ai</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-600"></div>
            <span className="text-gray-400">Your App</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500"></div>
            <span className="text-gray-400">Supabase</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-cyan-600"></div>
            <span className="text-gray-400">Practice User</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-pink-600"></div>
            <span className="text-gray-400">Admin (You)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemArchitectureDiagram;
