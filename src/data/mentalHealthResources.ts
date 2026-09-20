import { ResourceArticle, EmergencyContact } from "../types";

export const MENTAL_HEALTH_RESOURCES: ResourceArticle[] = [
  {
    id: "res-stress",
    topic: "Stress",
    title: "Understanding and Managing Everyday Stress",
    summary:
      "Stress is your body's natural response to perceived pressure or demanding life changes. While temporary stress can heighten focus, prolonged unmanaged stress impacts both physical vitality and mental clarity.",
    commonSigns: [
      "Physical tension such as headaches, clenched jaw, or tight shoulders",
      "Feeling frequently overwhelmed, irritable, or short-tempered",
      "Difficulty switching off racing thoughts when trying to sleep",
      "Changes in appetite or digestive patterns",
    ],
    copingStrategies: [
      "Break complex tasks into small, bite-sized achievable steps",
      "Incorporate micro-breaks during long stretches of focus",
      "Practice paced breathing (such as 4-4 or Box Breathing) to reset the nervous system",
      "Establish healthy boundary limits on work and screen exposure",
    ],
    whenToSeekHelp:
      "If chronic stress leads to persistent exhaustion, physical chest tightness, inability to meet daily obligations, or a feeling that you cannot cope alone.",
    reliableResources: [
      { title: "American Psychological Association (APA) - Stress", url: "https://www.apa.org/topics/stress" },
      { title: "NHS UK - Stress Management", url: "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/stress/" },
    ],
  },
  {
    id: "res-anxiety",
    topic: "Anxiety",
    title: "Navigating Anxiety & Rumination",
    summary:
      "Anxiety is characterized by persistent worry, apprehension, and heightened nervous system arousal even when no immediate physical danger exists.",
    commonSigns: [
      "Restlessness, trembling, or feeling constantly 'on edge'",
      "Rapid heart rate, shallow breathing, or chest tightness",
      "Catastrophic thinking or mentally fixating on worst-case scenarios",
      "Avoidance of situations, conversations, or tasks that trigger discomfort",
    ],
    copingStrategies: [
      "Engage the 5-4-3-2-1 sensory grounding exercise to return to the physical present",
      "Designate a bounded 10-minute 'worry window' during the afternoon to write out fears",
      "Limit high doses of caffeine and energy drinks which mimic anxiety symptoms",
      "Label repetitive thoughts as 'just stories my mind is telling me' rather than facts",
    ],
    whenToSeekHelp:
      "When anxiety impairs your ability to work, socialize, sleep, or causes panic attacks that feel unmanageable.",
    reliableResources: [
      { title: "Anxiety & Depression Association of America (ADAA)", url: "https://adaa.org/" },
      { title: "Mind UK - Understanding Anxiety", url: "https://www.mind.org.uk/information-support/types-of-mental-health-problems/anxiety-and-panic-attacks/" },
    ],
  },
  {
    id: "res-depression",
    topic: "Depression",
    title: "Recognizing Low Mood and Depressive Patterns",
    summary:
      "Depression is more than feeling transient sadness. It can cast a persistent shadow over your mood, energy levels, interest in hobbies, and sense of hope.",
    commonSigns: [
      "Persistent feelings of sadness, numbness, emptiness, or tearfulness",
      "Loss of interest or pleasure in activities you usually enjoy",
      "Drastic shifts in sleep patterns (insomnia or oversleeping)",
      "Pervasive low energy, brain fog, or feelings of worthlessness",
    ],
    copingStrategies: [
      "Adopt 'behavioral activation' by engaging in one tiny meaningful task even when unmotivated",
      "Seek natural daylight within 30 minutes of waking to support circadian rhythm",
      "Maintain contact with at least one supportive person, even via simple text",
      "Show gentle patience towards your energy limits without self-criticism",
    ],
    whenToSeekHelp:
      "If low mood persists continuously for more than two weeks, interferes with basic self-care, or involves any thoughts of self-harm or hopelessness.",
    reliableResources: [
      { title: "National Institute of Mental Health (NIMH) - Depression", url: "https://www.nimh.nih.gov/health/topics/depression" },
      { title: "Beyond Blue - Depression Information", url: "https://www.beyondblue.org.au/" },
    ],
  },
  {
    id: "res-burnout",
    topic: "Burnout",
    title: "Preventing and Recovering from Burnout",
    summary:
      "Burnout is a state of emotional, physical, and mental exhaustion caused by excessive, prolonged stress and chronic mismatch between demands and recovery.",
    commonSigns: [
      "Chronic cynicism, detachment, or resentment towards work or responsibilities",
      "Feeling that no matter how much you rest, your energy never restores",
      "Decreased productivity combined with harsh feelings of inadequacy",
      "Frequent physical ailments or lowered immune resilience",
    ],
    copingStrategies: [
      "Perform a daily commitments audit and renegotiate or eliminate non-essential obligations",
      "Incorporate true psychological detachment from work during evenings and weekends",
      "Prioritize non-negotiable sleep windows and restorative nutrition",
      "Communicate workload constraints candidly with supervisors or team members",
    ],
    whenToSeekHelp:
      "When exhaustion leads to despair, severe cognitive impairment, or affects physical health and close relationships.",
    reliableResources: [
      { title: "World Health Organization (WHO) - Burnout Syndrome", url: "https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases" },
    ],
  },
  {
    id: "res-sleep",
    topic: "Sleep",
    title: "The Architecture of Restorative Sleep",
    summary:
      "Quality sleep is the fundamental foundation of emotional regulation, cognitive resilience, cellular repair, and immune health.",
    commonSigns: [
      "Taking more than 45 minutes to fall asleep or waking repeatedly through the night",
      "Feeling groggy, fatigued, or irritable throughout the day",
      "Relying on sleep aids or stimulants to function",
    ],
    copingStrategies: [
      "Keep a consistent sleep and wake schedule, even on weekends",
      "Keep bedroom temperature cool (around 65°F / 18°C) and completely dark",
      "Avoid caffeine at least 8 hours before bed and screens 30 minutes before sleep",
      "Use the MindCare digital sunset and 4-4 breathing exercises in bed",
    ],
    whenToSeekHelp:
      "If chronic insomnia or sleep disruptions persist for several months despite healthy sleep habits.",
    reliableResources: [
      { title: "Sleep Foundation - Healthy Sleep Guidelines", url: "https://www.sleepfoundation.org/" },
    ],
  },
  {
    id: "res-loneliness",
    topic: "Loneliness",
    title: "Understanding Loneliness & Building Belonging",
    summary:
      "Loneliness is the distressing feeling that arises when our social connections do not match our emotional need for intimacy, understanding, and shared presence.",
    commonSigns: [
      "Feeling disconnected or unseen even when surrounded by colleagues or family",
      "Hesitating to reach out due to fears of being a burden or being rejected",
      "Filling emotional voids with endless passive social media scrolling",
    ],
    copingStrategies: [
      "Prioritize depth over quantity: foster one genuine relationship with regular contact",
      "Participate in interest-based community groups, book clubs, volunteering, or hobbies",
      "Practice authentic vulnerability: share a small real feeling instead of 'I'm fine'",
      "Cultivate compassionate self-companionship during quiet alone time",
    ],
    whenToSeekHelp:
      "When social withdrawal turns into severe isolation, despair, or social phobia.",
    reliableResources: [
      { title: "Campaign to End Loneliness", url: "https://www.campaigntoendloneliness.org/" },
    ],
  },
  {
    id: "res-self-esteem",
    topic: "Self-esteem",
    title: "Cultivating Resilient Self-Compassion",
    summary:
      "True self-esteem is not about feeling superior to others; it is grounded in trusting your inherent worth and meeting your mistakes with self-compassion.",
    commonSigns: [
      "A persistent harsh inner critic that magnifies mistakes",
      "Comparing yourself unfavorably to curated highlights on social media",
      "People-pleasing behavior out of fear of conflict or abandonment",
      "Difficulty accepting compliments or acknowledging personal wins",
    ],
    copingStrategies: [
      "Notice the inner critic and gently ask: 'Would I speak this way to someone I love?'",
      "Keep a 'Wins & Gratitude' log in your MindCare journal to record daily successes",
      "Establish healthy personal boundaries to protect your energy",
      "Embrace 'good enough' progress over paralyzing perfectionism",
    ],
    whenToSeekHelp:
      "When feelings of worthlessness inhibit you from pursuing life goals or contribute to chronic depressive patterns.",
    reliableResources: [
      { title: "Dr. Kristin Neff - Center for Self-Compassion", url: "https://self-compassion.org/" },
    ],
  },
  {
    id: "res-mindfulness",
    topic: "Mindfulness",
    title: "Everyday Mindfulness for Mental Clarity",
    summary:
      "Mindfulness is the simple practice of paying deliberate, non-judgmental attention to the present moment, allowing you to respond rather than react.",
    commonSigns: [
      "Living on autopilot and missing moments as they happen",
      "Reacting impulsively to emotional triggers with subsequent regret",
      "Feeling scattered, disorganized, and mentally fatigued",
    ],
    copingStrategies: [
      "Engage in 3 minutes of focused breath awareness using MindCare timer",
      "Eat one meal a day mindfully without a phone or television screen",
      "When feeling agitated, pause for three breaths before formulating a response",
      "Notice bodily tension signals early before they escalate",
    ],
    whenToSeekHelp:
      "Mindfulness is an accessible wellness tool; if traumatic memories or intense dissociation occur during meditation, consult a trauma-informed professional.",
    reliableResources: [
      { title: "Mindful.org - Getting Started with Mindfulness", url: "https://www.mindful.org/" },
    ],
  },
  {
    id: "res-habits",
    topic: "Healthy habits",
    title: "Building Sustainable Wellness Habits",
    summary:
      "Mental well-being is heavily influenced by atomic, daily micro-habits rather than occasional monumental transformations.",
    commonSigns: [
      "Starting ambitious health plans that crash within a few days",
      "All-or-nothing thinking ('I missed one day so I ruined everything')",
      "Relying purely on fleeting willpower instead of supportive environments",
    ],
    copingStrategies: [
      "Anchor new habits to existing ones (e.g., 'After I brew coffee, I will log my mood in MindCare')",
      "Make the starting step ridiculously small (e.g., 2 minutes of breathing)",
      "Focus on consistency over intensity during the first 30 days",
      "Track streaks on your MindCare dashboard to celebrate progress",
    ],
    whenToSeekHelp:
      "When compulsive or disordered habits interfere with daily living, health, or nutrition.",
    reliableResources: [
      { title: "Atomic Habits Framework (James Clear)", url: "https://jamesclear.com/atomic-habits" },
    ],
  },
  {
    id: "res-regulation",
    topic: "Emotional regulation",
    title: "Mastering Emotional Regulation & Coping",
    summary:
      "Emotional regulation is the ability to monitor, understand, and modulate your emotional reactions rather than suppressing them or feeling consumed by them.",
    commonSigns: [
      "Sudden intense spikes of anger, frustration, or sadness that feel overwhelming",
      "Difficulty calming down after minor inconveniences or disagreements",
      "Relying on maladaptive numbing behaviors to escape difficult emotions",
    ],
    copingStrategies: [
      "Name the emotion accurately ('I am noticing feeling frustrated and unheard')",
      "Use the physiological sigh (two quick inhales through nose, long exhale through mouth)",
      "Allow the emotion to peak and ebb like a wave (typically 90 seconds in the body)",
      "Engage in private expressive journaling to process tangled thoughts",
    ],
    whenToSeekHelp:
      "If emotional dysregulation leads to outbursts that harm your relationships, job security, or personal safety.",
    reliableResources: [
      { title: "Dialectical Behavior Therapy (DBT) Skills Information", url: "https://behavioraltech.org/" },
    ],
  },
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    country: "United States & Canada",
    emergencyNumber: "911",
    crisisLine: "988 (Suicide & Crisis Lifeline - Call or Text 24/7)",
    crisisWebsite: "https://988lifeline.org",
  },
  {
    country: "United Kingdom",
    emergencyNumber: "999 (Emergency) / 111 (NHS Mental Health)",
    crisisLine: "111 or text SHOUT to 85258 (24/7 Free Crisis Text Line)",
    crisisWebsite: "https://www.giveusashout.org",
  },
  {
    country: "Australia",
    emergencyNumber: "000",
    crisisLine: "13 11 14 (Lifeline 24/7 Crisis Support)",
    crisisWebsite: "https://www.lifeline.org.au",
  },
  {
    country: "India",
    emergencyNumber: "112",
    crisisLine: "14416 (Tele-MANAS National Mental Health Helpline - 24/7 Toll Free)",
    crisisWebsite: "https://telemanas.mohfw.gov.in",
  },
  {
    country: "European Union",
    emergencyNumber: "112",
    crisisLine: "116 123 (Emotional Support Helpline across EU)",
    crisisWebsite: "https://www.befrienders.org",
  },
  {
    country: "International & Other Countries",
    emergencyNumber: "Local Emergency Number",
    crisisLine: "Befrienders Worldwide or Find A Helpline (Confidential 24/7 directory)",
    crisisWebsite: "https://findahelpline.com",
  },
];
