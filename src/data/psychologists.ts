export interface Psychologist {
  id: string;
  name: string;
  avatar: string;
  specialty: string[];
  description: string;
  experience: number;
}

export const psychologists: Psychologist[] = [
  {
    id: "p1",
    name: "Dr. Andi Setiawan, M.Psi.",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    specialty: ["Bullying Trauma", "Social Anxiety", "Adolescent Psychology"],
    description: "10 years of experience handling victims of bullying and social anxiety. Focuses on cognitive therapy to rebuild self-confidence.",
    experience: 10,
  },
  {
    id: "p2",
    name: "Dr. Budi Santoso, Ph.D.",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    specialty: ["Work Burnout", "Career Stress", "Depression"],
    description: "Expert in work stress management and burnout. Has helped hundreds of young professionals balance their career and mental health.",
    experience: 12,
  },
  {
    id: "p3",
    name: "Dr. Clara Wijaya, M.Psi.",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    specialty: ["Family Issues", "Relationship Conflict", "Grief"],
    description: "Marriage and family counselor. Provides a safe space for family conflict mediation and self-acceptance therapy.",
    experience: 8,
  },
  {
    id: "p4",
    name: "Dr. Dina Rahmawati, Sp.KJ",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
    specialty: ["Severe Depression", "Bipolar Disorder", "PTSD"],
    description: "Clinical psychiatrist providing medical and therapeutic approaches for severe depression and bipolar mood disorders.",
    experience: 15,
  },
  {
    id: "p5",
    name: "Eko Pratama, M.Psi., Psikolog",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    specialty: ["Addiction", "Substance Abuse", "Behavioral Issues"],
    description: "Specialist in addiction rehabilitation therapy, ranging from substance abuse to gadget and internet addiction.",
    experience: 7,
  },
  {
    id: "p6",
    name: "Dr. Fitriani Larasati",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024e",
    specialty: ["Academic Stress", "Eating Disorders", "Body Image"],
    description: "Focuses heavily on teenagers and students experiencing academic stress and body image disorders.",
    experience: 5,
  },
  {
    id: "p7",
    name: "Galih Nugroho, M.Psi.",
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
    specialty: ["Anger Management", "Impulse Control", "Men's Mental Health"],
    description: "Focuses on anger and impulsivity management, as well as specific men's mental health issues.",
    experience: 9,
  },
  {
    id: "p8",
    name: "Dr. Hana Pratiwi, Ph.D.",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026703d",
    specialty: ["Grief Counseling", "Loss", "Life Transitions"],
    description: "Assists individuals experiencing grief, loss of family members, or facing severe life transitions.",
    experience: 14,
  },
  {
    id: "p9",
    name: "Irfan Hakim, M.Psi., Psikolog",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026702c",
    specialty: ["OCD", "Phobias", "Panic Attacks"],
    description: "Certified Cognitive Behavioral Therapist (CBT) for handling OCD, specific phobias, and panic attacks.",
    experience: 6,
  },
  {
    id: "p10",
    name: "Dr. Jessica Tania",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704b",
    specialty: ["Insomnia", "Sleep Disorders", "Chronic Fatigue"],
    description: "Specialist in sleep disorders and chronic fatigue. Helps patients restore healthy and natural sleep patterns.",
    experience: 11,
  }
];

export function getRecommendedPsychologist(analysis: any): Psychologist {
  if (!analysis || !analysis.topics) {
    return psychologists[0];
  }

  const topicsStr = analysis.topics.join(' ').toLowerCase();
  const emotionStr = (analysis.emotion || '').toLowerCase();
  
  const scoredDocs = psychologists.map(doc => {
    let score = 0;
    doc.specialty.forEach(spec => {
      const specLow = spec.toLowerCase();
      if (topicsStr.includes(specLow)) score += 3;
      if (emotionStr.includes(specLow)) score += 2;
      
      if (topicsStr.includes('bully') && specLow.includes('bullying')) score += 5;
      if (topicsStr.includes('work') && specLow.includes('burnout')) score += 5;
      if (emotionStr.includes('sad') && specLow.includes('depression')) score += 4;
      if (emotionStr.includes('anxious') && specLow.includes('anxiety')) score += 4;
    });
    return { doc, score };
  });

  scoredDocs.sort((a, b) => b.score - a.score);
  return scoredDocs[0].doc;
}
