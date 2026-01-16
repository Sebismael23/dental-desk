// Mock data for DentaVoice dashboard - Replace with real API calls later

export interface TranscriptEntry {
    speaker: 'ai' | 'caller';
    text: string;
    timestamp: string;
}

export interface Call {
    id: number;
    name: string;
    phone: string;
    time: string;
    duration: string;
    status: 'booked' | 'action_needed' | 'spam' | 'missed';
    summary: string;
    priority: 'low' | 'medium' | 'high';
    transcript: TranscriptEntry[];
    aiSummary?: string;
}

export interface Stat {
    label: string;
    value: string;
    change: string;
    icon: string;
    color: 'blue' | 'green' | 'emerald' | 'orange' | 'red';
}

export interface VoiceOption {
    id: string;
    name: string;
    description: string;
}

export const MOCK_USER = {
    name: "Dr. Smith Office",
    email: "admin@drsmithdental.com",
    clinicName: "Smith Family Dental",
    avatar: null,
};

export const MOCK_CALLS: Call[] = [
    {
        id: 1,
        name: "Sarah Jenkins",
        phone: "(555) 123-4567",
        time: "10:42 AM",
        duration: "1:24",
        status: "booked",
        summary: "Booked cleaning for Tuesday at 2pm.",
        priority: "low",
        transcript: [
            { speaker: "ai", text: "Good morning! Thank you for calling Smith Family Dental. This is Sarah, your virtual assistant. How may I help you today?", timestamp: "0:00" },
            { speaker: "caller", text: "Hi, I'd like to schedule a cleaning appointment.", timestamp: "0:08" },
            { speaker: "ai", text: "I'd be happy to help you schedule a cleaning! May I have your name please?", timestamp: "0:12" },
            { speaker: "caller", text: "It's Sarah Jenkins.", timestamp: "0:18" },
            { speaker: "ai", text: "Thank you, Sarah. Let me check our availability. We have openings on Tuesday at 2pm or Thursday at 10am. Which works better for you?", timestamp: "0:22" },
            { speaker: "caller", text: "Tuesday at 2pm works great.", timestamp: "0:35" },
            { speaker: "ai", text: "Perfect! I've booked you for a cleaning on Tuesday at 2pm. You'll receive a confirmation text shortly. Is there anything else I can help you with?", timestamp: "0:40" },
            { speaker: "caller", text: "No, that's all. Thank you!", timestamp: "0:55" },
            { speaker: "ai", text: "You're welcome! We look forward to seeing you Tuesday. Have a great day!", timestamp: "1:00" },
        ],
    },
    {
        id: 2,
        name: "Mike Ross",
        phone: "(555) 987-6543",
        time: "09:15 AM",
        duration: "2:10",
        status: "action_needed",
        summary: "Asking about Invisalign pricing. Needs follow up.",
        priority: "medium",
        transcript: [
            { speaker: "ai", text: "Good morning! Thank you for calling Smith Family Dental. How may I assist you?", timestamp: "0:00" },
            { speaker: "caller", text: "Hi, I'm interested in getting Invisalign. Can you tell me about the cost?", timestamp: "0:06" },
            { speaker: "ai", text: "Thank you for your interest in Invisalign! Pricing varies based on individual treatment needs. May I have your name so I can have our Invisalign coordinator reach out with detailed pricing?", timestamp: "0:12" },
            { speaker: "caller", text: "Sure, it's Mike Ross.", timestamp: "0:28" },
            { speaker: "ai", text: "Thank you, Mike. Our Invisalign treatments typically range from $3,500 to $6,500 depending on complexity. We also offer payment plans. Would you like to schedule a free consultation?", timestamp: "0:32" },
            { speaker: "caller", text: "I'm not sure yet. Can someone call me back with more details about the payment plans?", timestamp: "0:55" },
            { speaker: "ai", text: "Absolutely! I'll have our treatment coordinator call you back today to discuss payment options. What's the best number to reach you?", timestamp: "1:05" },
            { speaker: "caller", text: "This number is fine. Thanks!", timestamp: "1:18" },
            { speaker: "ai", text: "Great! Expect a call from us later today. Is there anything else you'd like to know?", timestamp: "1:22" },
            { speaker: "caller", text: "No, that's it for now.", timestamp: "1:35" },
            { speaker: "ai", text: "Thank you for calling Smith Family Dental, Mike. We'll be in touch soon!", timestamp: "1:40" },
        ],
    },
    {
        id: 3,
        name: "Unknown",
        phone: "(555) 000-0000",
        time: "08:30 AM",
        duration: "0:15",
        status: "spam",
        summary: "Detected sales call (Yelp). Hung up automatically.",
        priority: "low",
        transcript: [
            { speaker: "ai", text: "Good morning! Thank you for calling Smith Family Dental. How may I help you?", timestamp: "0:00" },
            { speaker: "caller", text: "Hi, this is Jessica from Yelp Business Services. I'm calling about your business listing...", timestamp: "0:05" },
            { speaker: "ai", text: "[System: Sales call detected. Call terminated automatically.]", timestamp: "0:12" },
        ],
    },
    {
        id: 4,
        name: "Emily Blunt",
        phone: "(555) 222-3333",
        time: "Yesterday",
        duration: "3:45",
        status: "booked",
        summary: "Emergency: Chipped tooth. Booked ASAP slot.",
        priority: "high",
        transcript: [
            { speaker: "ai", text: "Good afternoon! Smith Family Dental, how can I help you?", timestamp: "0:00" },
            { speaker: "caller", text: "Hi, I have an emergency! I just chipped my front tooth and it really hurts. Can I come in today?", timestamp: "0:05" },
            { speaker: "ai", text: "I'm so sorry to hear that! Let me help you right away. Can I get your name please?", timestamp: "0:15" },
            { speaker: "caller", text: "Emily Blunt.", timestamp: "0:22" },
            { speaker: "ai", text: "Thank you, Emily. Are you experiencing any bleeding or severe pain right now?", timestamp: "0:25" },
            { speaker: "caller", text: "There's no bleeding but it's pretty sensitive, especially to cold.", timestamp: "0:32" },
            { speaker: "ai", text: "I understand. This sounds like it needs immediate attention. I'm checking our emergency slots... We have an opening today at 4pm. Can you make it?", timestamp: "0:40" },
            { speaker: "caller", text: "Yes! 4pm works perfectly. Thank you so much!", timestamp: "0:58" },
            { speaker: "ai", text: "You're booked for 4pm today for an emergency evaluation. In the meantime, avoid very hot or cold foods. Do you need our address?", timestamp: "1:05" },
            { speaker: "caller", text: "Yes please, I'm new to the area.", timestamp: "1:20" },
            { speaker: "ai", text: "We're located at 123 Dental Way, Suite 200. I'll text you the address and directions. See you at 4pm!", timestamp: "1:25" },
        ],
    },
    {
        id: 5,
        name: "John Doe",
        phone: "(555) 444-5555",
        time: "Yesterday",
        duration: "0:45",
        status: "missed",
        summary: "Call dropped / No audio.",
        priority: "low",
        transcript: [
            { speaker: "ai", text: "Good afternoon! Smith Family Dental, how may I assist you?", timestamp: "0:00" },
            { speaker: "caller", text: "[Inaudible]", timestamp: "0:08" },
            { speaker: "ai", text: "I'm sorry, I'm having trouble hearing you. Could you please speak up?", timestamp: "0:15" },
            { speaker: "caller", text: "[No audio detected]", timestamp: "0:25" },
            { speaker: "ai", text: "[System: Call disconnected due to no audio.]", timestamp: "0:40" },
        ],
    },
    {
        id: 6,
        name: "Lisa Chen",
        phone: "(555) 777-8888",
        time: "2 days ago",
        duration: "2:30",
        status: "booked",
        summary: "Scheduled root canal consultation for Friday 10am.",
        priority: "medium",
        transcript: [
            { speaker: "ai", text: "Hello, Smith Family Dental. How can I help you today?", timestamp: "0:00" },
            { speaker: "caller", text: "Hi, my regular dentist referred me for a root canal consultation. Can I schedule that?", timestamp: "0:05" },
            { speaker: "ai", text: "Of course! I can help you with that. May I have your name?", timestamp: "0:15" },
            { speaker: "caller", text: "Lisa Chen.", timestamp: "0:20" },
            { speaker: "ai", text: "Thank you, Lisa. Do you have a referral from your dentist?", timestamp: "0:23" },
            { speaker: "caller", text: "Yes, Dr. Martinez sent it over yesterday.", timestamp: "0:28" },
            { speaker: "ai", text: "Perfect, I see the referral here. For root canal consultations, we have Dr. Smith available Friday at 10am or Monday at 2pm.", timestamp: "0:35" },
            { speaker: "caller", text: "Friday at 10am would be great.", timestamp: "0:50" },
            { speaker: "ai", text: "Excellent! You're scheduled for Friday at 10am. Please arrive 15 minutes early to complete paperwork. We'll send you intake forms via email.", timestamp: "0:55" },
            { speaker: "caller", text: "Sounds good. Thank you!", timestamp: "1:12" },
        ],
    },
    {
        id: 7,
        name: "Robert Wilson",
        phone: "(555) 333-9999",
        time: "2 days ago",
        duration: "1:55",
        status: "action_needed",
        summary: "Insurance question - needs verification of coverage.",
        priority: "medium",
        transcript: [
            { speaker: "ai", text: "Good morning! Smith Family Dental, this is your AI assistant. How may I help you?", timestamp: "0:00" },
            { speaker: "caller", text: "Hi, I just switched to a new insurance plan and I want to make sure you accept it before I schedule.", timestamp: "0:06" },
            { speaker: "ai", text: "I'd be happy to help verify your insurance coverage. What's the name of your insurance provider?", timestamp: "0:16" },
            { speaker: "caller", text: "It's Blue Cross Blue Shield, the PPO plan.", timestamp: "0:24" },
            { speaker: "ai", text: "We do accept most Blue Cross Blue Shield plans. For verification of your specific plan's coverage, I'll need to have our billing team look into this. May I get your name and member ID?", timestamp: "0:30" },
            { speaker: "caller", text: "Robert Wilson. Member ID is XYZ123456.", timestamp: "0:48" },
            { speaker: "ai", text: "Thank you, Robert. Our billing team will verify your coverage and call you back within 24 hours. Would you like to tentatively schedule an appointment pending verification?", timestamp: "0:55" },
            { speaker: "caller", text: "Let's wait until I know it's covered. Just have them call me back.", timestamp: "1:12" },
            { speaker: "ai", text: "Absolutely! You'll hear from us within 24 hours. Is this the best number to reach you?", timestamp: "1:20" },
            { speaker: "caller", text: "Yes, this works. Thanks!", timestamp: "1:30" },
        ],
    },
];

export const MOCK_STATS: Stat[] = [
    { label: "Calls Today", value: "12", change: "+2", icon: "phone", color: "blue" },
    { label: "Appointments", value: "3", change: "+1", icon: "calendar", color: "green" },
    { label: "Rev. Saved", value: "$850", change: "+12%", icon: "check", color: "emerald" },
    { label: "Action Needed", value: "1", change: "-2", icon: "alert", color: "orange" },
];

export const VOICE_OPTIONS: VoiceOption[] = [
    { id: "sarah", name: "Sarah", description: "Warm & Friendly" },
    { id: "michael", name: "Michael", description: "Professional" },
    { id: "emma", name: "Emma", description: "Calm & Soft" },
];

export const DEFAULT_OFFICE_HOURS = [
    { day: "Monday", open: "09:00", close: "17:00", enabled: true },
    { day: "Tuesday", open: "09:00", close: "17:00", enabled: true },
    { day: "Wednesday", open: "09:00", close: "17:00", enabled: true },
    { day: "Thursday", open: "09:00", close: "17:00", enabled: true },
    { day: "Friday", open: "09:00", close: "17:00", enabled: true },
    { day: "Saturday", open: "10:00", close: "14:00", enabled: false },
    { day: "Sunday", open: "00:00", close: "00:00", enabled: false },
];

// Simulate AI summary generation
export const generateAISummary = async (call: Call): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const summaries: Record<number, string> = {
        1: `**Patient:** Sarah Jenkins\n**Purpose:** Routine cleaning appointment\n**Outcome:** Successfully booked\n\n**Key Details:**\n- Appointment scheduled for Tuesday at 2pm\n- Standard cleaning procedure\n- Patient confirmed via text\n\n**Sentiment:** Positive - smooth scheduling experience`,

        2: `**Patient:** Mike Ross\n**Purpose:** Invisalign inquiry\n**Outcome:** Callback requested\n\n**Key Details:**\n- Interested in Invisalign treatment\n- Quoted $3,500-$6,500 range\n- Wants payment plan information\n- Treatment coordinator to follow up today\n\n**Action Required:** Call back with financing options\n**Sentiment:** Neutral - needs more information before committing`,

        3: `**Caller:** Unknown (Yelp Sales)\n**Purpose:** Sales solicitation\n**Outcome:** Automatically blocked\n\n**Details:**\n- Detected as telemarketing call\n- System terminated after 12 seconds\n- No action needed`,

        4: `**Patient:** Emily Blunt\n**Purpose:** Dental emergency - chipped tooth\n**Outcome:** Emergency appointment booked\n\n**Key Details:**\n- Front tooth chipped\n- Sensitivity to cold (no bleeding)\n- Emergency slot at 4pm same day\n- New patient - address provided\n\n**Priority:** HIGH - same-day emergency\n**Sentiment:** Relieved after getting appointment`,

        5: `**Caller:** John Doe\n**Purpose:** Unknown\n**Outcome:** Call failed\n\n**Technical Issue:**\n- No audio detected from caller\n- Call disconnected after 40 seconds\n- May need to attempt callback\n\n**Action:** Consider returning call to verify intent`,

        6: `**Patient:** Lisa Chen\n**Purpose:** Root canal consultation (referral)\n**Outcome:** Consultation scheduled\n\n**Key Details:**\n- Referred by Dr. Martinez\n- Referral on file\n- Friday 10am with Dr. Smith\n- Intake forms to be emailed\n\n**Sentiment:** Cooperative, smooth booking`,

        7: `**Patient:** Robert Wilson\n**Purpose:** Insurance verification\n**Outcome:** Pending verification\n\n**Key Details:**\n- New insurance: Blue Cross Blue Shield PPO\n- Member ID: XYZ123456\n- Waiting for coverage confirmation before booking\n\n**Action Required:** Billing team to verify coverage within 24 hours\n**Sentiment:** Cautious - wants confirmation before appointment`,
    };

    return summaries[call.id] || `Summary unavailable for this call.`;
};
