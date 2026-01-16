import React, { useState } from 'react';

const SecurityArchitectureDiagram = () => {
  const [activeTab, setActiveTab] = useState('verification');
  const [selectedTier, setSelectedTier] = useState(0);

  const verificationTiers = [
    {
      tier: 0,
      name: "Unverified Caller",
      color: "red",
      description: "Phone number not recognized. Default for all new callers.",
      canShare: [
        "Office hours",
        "Office location/address",
        "Insurance accepted (general list)",
        "Services offered",
        "How to schedule (capture info)",
      ],
      cannotShare: [
        "Patient name",
        "Appointment details",
        "Account balance",
        "Treatment information",
        "Insurance claims",
        "Any PHI"
      ],
      aiResponse: `"Hi! Thanks for calling Johnson Family Dental. How can I help you today?"`
    },
    {
      tier: 1,
      name: "Phone Number Match",
      color: "yellow",
      description: "Caller's phone matches a patient record. Automatic verification.",
      canShare: [
        "Everything from Tier 0",
        "Greet by first name",
        "Confirm appointment exists",
        "Appointment date/time",
        "Basic account status (vague)",
      ],
      cannotShare: [
        "Specific balance amount",
        "Treatment details",
        "Insurance claim details",
        "Other patient information"
      ],
      aiResponse: `"Hi Sarah! I see you're calling from your number on file. How can I help you today?"`
    },
    {
      tier: 2,
      name: "Verified (Questions)",
      color: "green",
      description: "Caller verified identity by answering security questions.",
      canShare: [
        "Everything from Tier 1",
        "General balance status",
        "Next appointment details",
        "Appointment history",
      ],
      cannotShare: [
        "Specific balance amount",
        "Detailed treatment plans",
        "Insurance disputes",
        "Sensitive medical info"
      ],
      aiResponse: `"Thanks for confirming, Sarah. I can see your next cleaning is scheduled for January 20th at 2pm."`
    },
    {
      tier: 3,
      name: "Staff Transfer Required",
      color: "blue",
      description: "Sensitive request that requires human handling.",
      canShare: [
        "Transfer to staff member",
        "Offer callback option"
      ],
      cannotShare: [
        "Detailed balance discussions",
        "Treatment plan questions",
        "Insurance claim disputes",
        "Payment processing",
        "HIPAA requests",
        "Complaints"
      ],
      aiResponse: `"I'd be happy to connect you with our team for that. One moment please."`
    }
  ];

  const currentTier = verificationTiers[selectedTier];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold text-center mb-2">Security & Privacy Architecture</h1>
      <p className="text-gray-400 text-center mb-6">Understanding verification tiers and data protection</p>
      
      {/* Tab Selector */}
      <div className="flex justify-center gap-2 mb-8">
        {[
          { id: 'verification', label: '🔐 Verification Tiers' },
          { id: 'immutability', label: '📝 Data Immutability' },
          { id: 'booking', label: '📅 Booking Strategy' },
          { id: 'integration', label: '🔗 Integration Options' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Verification Tiers Tab */}
      {activeTab === 'verification' && (
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-2 mb-6">
            {verificationTiers.map((tier, i) => (
              <button
                key={i}
                onClick={() => setSelectedTier(i)}
                className={`p-3 rounded-lg text-left transition-all ${
                  selectedTier === i 
                    ? `ring-2 ring-${tier.color}-400 bg-gray-800` 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <div className={`text-xs font-bold mb-1 ${
                  tier.color === 'red' ? 'text-red-400' :
                  tier.color === 'yellow' ? 'text-yellow-400' :
                  tier.color === 'green' ? 'text-green-400' :
                  'text-blue-400'
                }`}>
                  TIER {tier.tier}
                </div>
                <div className="font-medium text-sm">{tier.name}</div>
              </button>
            ))}
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-4 h-4 rounded-full ${
                currentTier.color === 'red' ? 'bg-red-500' :
                currentTier.color === 'yellow' ? 'bg-yellow-500' :
                currentTier.color === 'green' ? 'bg-green-500' :
                'bg-blue-500'
              }`}></div>
              <h2 className="text-xl font-bold">Tier {currentTier.tier}: {currentTier.name}</h2>
            </div>
            
            <p className="text-gray-400 mb-6">{currentTier.description}</p>

            <div className="bg-gray-900 rounded-lg p-4 mb-6">
              <div className="text-xs text-gray-500 mb-1">AI Greeting Example:</div>
              <div className="text-green-400 italic">{currentTier.aiResponse}</div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                  <span>✅</span> AI CAN Share
                </h3>
                <ul className="space-y-2">
                  {currentTier.canShare.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                  <span>❌</span> AI CANNOT Share
                </h3>
                <ul className="space-y-2">
                  {currentTier.cannotShare.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
            <h3 className="font-bold text-yellow-400 mb-2">⚠️ Golden Rule</h3>
            <p className="text-sm text-gray-300">
              When in doubt, the AI should ALWAYS err on the side of caution and either:
              (1) Ask for verification, or (2) Transfer to a human staff member.
              Never reveal PHI to an unverified caller.
            </p>
          </div>
        </div>
      )}

      {/* Data Immutability Tab */}
      {activeTab === 'immutability' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">📝 What Can vs Cannot Be Changed</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="p-3 text-left">Field</th>
                    <th className="p-3 text-center">Editable?</th>
                    <th className="p-3 text-left">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { field: "Transcript", editable: false, reason: "Legal record of what was said" },
                    { field: "Recording", editable: false, reason: "Legal record of conversation" },
                    { field: "Caller Phone", editable: false, reason: "Caller ID is factual data" },
                    { field: "Timestamp", editable: false, reason: "When call occurred is immutable" },
                    { field: "Call Duration", editable: false, reason: "Factual data from system" },
                    { field: "Vapi Call ID", editable: false, reason: "System reference" },
                    { field: "Status", editable: true, reason: "Practice marks callback complete" },
                    { field: "Notes", editable: true, reason: "Practice adds internal notes" },
                    { field: "Callback Info", editable: true, reason: "Track follow-up actions" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gray-700">
                      <td className="p-3 font-medium">{row.field}</td>
                      <td className="p-3 text-center">
                        {row.editable ? (
                          <span className="text-green-400">✅ Yes</span>
                        ) : (
                          <span className="text-red-400">🔒 No</span>
                        )}
                      </td>
                      <td className="p-3 text-gray-400">{row.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="font-bold text-blue-400 mb-3">🔐 How Immutability Works</h3>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs">1</span>
                  <span className="text-gray-300">Database triggers prevent UPDATE on protected fields</span>
                </li>
                <li className="flex gap-2">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs">2</span>
                  <span className="text-gray-300">Transcript hash stored to detect tampering</span>
                </li>
                <li className="flex gap-2">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs">3</span>
                  <span className="text-gray-300">Recording backed up to your own storage</span>
                </li>
                <li className="flex gap-2">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs">4</span>
                  <span className="text-gray-300">All changes logged to append-only audit table</span>
                </li>
              </ol>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="font-bold text-purple-400 mb-3">📋 Audit Log Records</h3>
              <p className="text-sm text-gray-400 mb-3">Every action is logged with:</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• What changed (old → new value)</li>
                <li>• Who made the change</li>
                <li>• When it happened</li>
                <li>• IP address</li>
                <li>• User agent (browser/device)</li>
              </ul>
              <div className="mt-4 p-3 bg-gray-900 rounded text-xs">
                <div className="text-gray-500">Example log entry:</div>
                <code className="text-green-400">
                  status_changed: "pending" → "called_back"<br/>
                  by: user_123 at 2024-01-15 09:45:00<br/>
                  ip: 192.168.1.1
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Strategy Tab */}
      {activeTab === 'booking' && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold mb-6 text-center">📅 Booking Strategy by Phase</h2>
          
          <div className="space-y-6">
            {[
              {
                phase: "Phase 1: MVP",
                title: "Intent Capture Only",
                color: "blue",
                recommended: true,
                how: "AI captures what patient wants, practice calls back to book",
                aiSays: `"I'd love to help you schedule. Let me get your info and our team will call back within 2 hours to confirm a time that works."`,
                pros: ["Simple to build", "Works with ANY practice", "No integration needed", "Lower liability"],
                cons: ["Less 'magical'", "Extra step for patient", "Practice must call back"]
              },
              {
                phase: "Phase 2: v1.1",
                title: "Availability Display",
                color: "yellow",
                recommended: false,
                how: "Practice syncs available slots to Cal.com, AI shows options",
                aiSays: `"I can see we have openings Tuesday at 2pm and Thursday at 10am. Which works better for you?"`,
                pros: ["Better patient experience", "Patient picks preferred time", "Still low-risk"],
                cons: ["Requires Cal.com setup", "Practice must sync availability", "Still 'soft' booking"]
              },
              {
                phase: "Phase 3: v2.0",
                title: "Direct Booking",
                color: "green",
                recommended: false,
                how: "AI books directly into Cal.com, syncs to practice calendar",
                aiSays: `"I've booked you for Tuesday at 2pm. You'll receive a confirmation text shortly."`,
                pros: ["Best patient experience", "No callback needed", "Truly automated"],
                cons: ["Complex setup per practice", "Higher risk of conflicts", "Requires appointment rules"]
              }
            ].map((phase, i) => (
              <div key={i} className={`bg-gray-800 rounded-lg p-6 ${phase.recommended ? 'ring-2 ring-blue-500' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      phase.color === 'blue' ? 'bg-blue-600' :
                      phase.color === 'yellow' ? 'bg-yellow-600' :
                      'bg-green-600'
                    }`}>
                      {phase.phase}
                    </span>
                    <h3 className="text-lg font-bold mt-2">{phase.title}</h3>
                  </div>
                  {phase.recommended && (
                    <span className="text-xs bg-blue-600 px-2 py-1 rounded">RECOMMENDED FOR MVP</span>
                  )}
                </div>
                
                <p className="text-gray-400 text-sm mb-4">{phase.how}</p>
                
                <div className="bg-gray-900 rounded-lg p-3 mb-4">
                  <div className="text-xs text-gray-500 mb-1">AI Says:</div>
                  <div className="text-green-400 text-sm italic">{phase.aiSays}</div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-bold text-green-400 mb-2">✅ Pros</div>
                    <ul className="space-y-1 text-xs text-gray-300">
                      {phase.pros.map((pro, j) => <li key={j}>• {pro}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-red-400 mb-2">❌ Cons</div>
                    <ul className="space-y-1 text-xs text-gray-300">
                      {phase.cons.map((con, j) => <li key={j}>• {con}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integration Options Tab */}
      {activeTab === 'integration' && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold mb-6 text-center">🔗 Integration Options</h2>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-lg mb-4">Do You Need Zapier/n8n?</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                <h4 className="font-bold text-green-400 mb-2">✅ Build Directly (MVP)</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Email notifications → Resend API</li>
                  <li>• SMS notifications → Twilio API</li>
                  <li>• Webhooks → Next.js API routes</li>
                  <li>• Calendar → Cal.com API</li>
                </ul>
                <div className="mt-3 text-xs text-gray-400">
                  Cost: $0-30/mo | Complexity: Low | Reliability: High
                </div>
              </div>
              
              <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
                <h4 className="font-bold text-yellow-400 mb-2">⏳ Use Zapier Later (v2.0)</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Custom CRM integrations</li>
                  <li>• Practice-specific workflows</li>
                  <li>• Obscure system connections</li>
                  <li>• "Power user" features</li>
                </ul>
                <div className="mt-3 text-xs text-gray-400">
                  Cost: $20-50/mo per practice | Complexity: Medium
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-lg mb-4">Patient Database Integration Options</h3>
            
            <div className="space-y-4">
              {[
                {
                  name: "No Integration (MVP)",
                  complexity: "None",
                  pros: "Simple, works everywhere, low liability",
                  cons: "AI can't verify patients, can't check appointments",
                  recommended: true
                },
                {
                  name: "Phone Lookup Only (v1.1)",
                  complexity: "Low",
                  pros: "AI greets by name, knows new vs existing",
                  cons: "Practice uploads CSV, limited info",
                  recommended: false
                },
                {
                  name: "Full PMS Integration (v2.0+)",
                  complexity: "Very High",
                  pros: "Full patient verification, direct booking",
                  cons: "Dentrix API closed, expensive, high liability",
                  recommended: false
                }
              ].map((opt, i) => (
                <div key={i} className={`p-4 rounded-lg ${opt.recommended ? 'bg-blue-900/30 border border-blue-600' : 'bg-gray-700'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">{opt.name}</span>
                    <span className="text-xs bg-gray-600 px-2 py-1 rounded">Complexity: {opt.complexity}</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2 text-xs">
                    <div><span className="text-green-400">✅</span> {opt.pros}</div>
                    <div><span className="text-red-400">❌</span> {opt.cons}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-4">Calendar Integration Comparison</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="p-3 text-left">Option</th>
                    <th className="p-3 text-center">Cost</th>
                    <th className="p-3 text-center">Complexity</th>
                    <th className="p-3 text-center">Works With</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Cal.com", cost: "Free-$15/mo", complexity: "Low", works: "Any practice" },
                    { name: "Google Calendar", cost: "Free", complexity: "Low", works: "Any practice" },
                    { name: "Calendly", cost: "Free-$12/mo", complexity: "Low", works: "Any practice" },
                    { name: "Dentrix Direct", cost: "$$$", complexity: "Very High", works: "Dentrix only" },
                    { name: "Open Dental API", cost: "Free", complexity: "High", works: "Open Dental only" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gray-700">
                      <td className="p-3 font-medium">{row.name}</td>
                      <td className="p-3 text-center">{row.cost}</td>
                      <td className="p-3 text-center">{row.complexity}</td>
                      <td className="p-3 text-center text-gray-400">{row.works}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-3 bg-blue-900/30 border border-blue-600 rounded">
              <span className="text-blue-400 font-bold">💡 Recommendation:</span>
              <span className="text-gray-300 ml-2 text-sm">Start with Cal.com. It's free, has a good API, and practices can sync it to their main system.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityArchitectureDiagram;
