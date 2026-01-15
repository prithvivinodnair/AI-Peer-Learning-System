// // app/api/assistant/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";

// // Using Hugging Face Inference API (Free tier: 30,000 chars/month)
// const HF_API_URL = "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct";

// // Fallback to multiple free models
// const FREE_MODELS = [
//   "microsoft/Phi-3-mini-4k-instruct",
//   "google/flan-t5-large",
//   "mistralai/Mistral-7B-Instruct-v0.2"
// ];

// // Rate limiting (in-memory)
// const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// const LIMITS = {
//   messagesPerHour: 30,
//   messagesPerDay: 100,
// };

// function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
//   const now = Date.now();
//   const hourKey = `${userId}:hour`;
  
//   const hourData = rateLimitStore.get(hourKey);
//   if (hourData) {
//     if (now < hourData.resetTime) {
//       if (hourData.count >= LIMITS.messagesPerHour) {
//         return { allowed: false, remaining: 0 };
//       }
//     } else {
//       rateLimitStore.delete(hourKey);
//     }
//   }

//   const hourCount = hourData?.count || 0;
//   const remaining = LIMITS.messagesPerHour - hourCount;

//   return { allowed: true, remaining };
// }

// function incrementRateLimit(userId: string) {
//   const now = Date.now();
//   const hourKey = `${userId}:hour`;

//   const hourData = rateLimitStore.get(hourKey);
//   if (hourData && now < hourData.resetTime) {
//     hourData.count++;
//   } else {
//     rateLimitStore.set(hourKey, {
//       count: 1,
//       resetTime: now + 60 * 60 * 1000,
//     });
//   }
// }

// async function callHuggingFace(message: string, modelIndex = 0): Promise<string> {
//   const model = FREE_MODELS[modelIndex];
  
//   try {
//     const response = await fetch(
//       `https://api-inference.huggingface.co/models/${model}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           // No API key needed for public models, but rate-limited
//         },
//         body: JSON.stringify({
//           inputs: `You are SkillShare Bot, a helpful learning assistant. Answer this question clearly and concisely:\n\nQuestion: ${message}\n\nAnswer:`,
//           parameters: {
//             max_new_tokens: 500,
//             temperature: 0.7,
//             top_p: 0.9,
//             return_full_text: false,
//           },
//         }),
//       }
//     );

//     if (!response.ok) {
//       if (response.status === 503) {
//         // Model is loading, wait and retry
//         await new Promise(resolve => setTimeout(resolve, 2000));
//         const retry = await fetch(
//           `https://api-inference.huggingface.co/models/${model}`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               inputs: `You are SkillShare Bot, a helpful learning assistant. Answer this question clearly and concisely:\n\nQuestion: ${message}\n\nAnswer:`,
//               parameters: {
//                 max_new_tokens: 500,
//                 temperature: 0.7,
//               },
//             }),
//           }
//         );
        
//         if (!retry.ok) throw new Error("Model unavailable");
//         const retryData = await retry.json();
//         return retryData[0]?.generated_text || retryData.generated_text || "Try again in a moment.";
//       }
      
//       // Try fallback model
//       if (modelIndex < FREE_MODELS.length - 1) {
//         return callHuggingFace(message, modelIndex + 1);
//       }
      
//       throw new Error("All models unavailable");
//     }

//     const data = await response.json();
//     return data[0]?.generated_text || data.generated_text || "I couldn't generate a response.";
//   } catch (error) {
//     if (modelIndex < FREE_MODELS.length - 1) {
//       return callHuggingFace(message, modelIndex + 1);
//     }
//     throw error;
//   }
// }

// // Fallback: Rule-based responses for common questions
// function getRuleBasedResponse(message: string): string | null {
//   const lowerMsg = message.toLowerCase();
  
//   const patterns = [
//     {
//       keywords: ['hello', 'hi', 'hey'],
//       response: "Hello! I'm SkillShare Bot. I can help you with study questions, explain concepts, or create practice quizzes. What would you like to learn about today?"
//     },
//     {
//       keywords: ['help', 'what can you do'],
//       response: "I can help you with:\n• Answering study questions\n• Explaining complex topics simply\n• Creating practice questions\n• Suggesting study strategies\n• Building learning plans\n\nJust ask me anything!"
//     },
//     {
//       keywords: ['thank'],
//       response: "You're welcome! Feel free to ask if you have more questions. Happy learning! 📚"
//     }
//   ];

//   for (const pattern of patterns) {
//     if (pattern.keywords.some(kw => lowerMsg.includes(kw))) {
//       return pattern.response;
//     }
//   }

//   return null;
// }

// export async function POST(req: NextRequest) {
//   try {
//     // Check authentication
//     const session = await getServerSession();
//     if (!session?.user?.email) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const userId = session.user.email;

//     // Check rate limit
//     const { allowed, remaining } = checkRateLimit(userId);
//     if (!allowed) {
//       return NextResponse.json(
//         {
//           error: "Rate limit exceeded",
//           message: "You've reached your hourly limit. Please try again in a bit!",
//           remaining: 0,
//         },
//         { status: 429 }
//       );
//     }

//     const body = await req.json();
//     const { message } = body;

//     if (!message || typeof message !== "string") {
//       return NextResponse.json(
//         { error: "Invalid message" },
//         { status: 400 }
//       );
//     }

//     // Try rule-based response first (instant, no API calls)
//     const ruleResponse = getRuleBasedResponse(message);
//     if (ruleResponse) {
//       incrementRateLimit(userId);
//       return NextResponse.json({
//         reply: ruleResponse,
//         remaining: remaining - 1,
//         source: "rule-based"
//       });
//     }

//     // Call free AI model
//     try {
//       const aiResponse = await callHuggingFace(message);
//       incrementRateLimit(userId);
      
//       return NextResponse.json({
//         reply: aiResponse,
//         remaining: remaining - 1,
//         source: "ai"
//       });
//     } catch (error) {
//       console.error("AI error:", error);
      
//       // Ultimate fallback
//       return NextResponse.json({
//         reply: "I'm having trouble connecting to my AI models right now. This could be due to high demand on the free tier. Please try again in a moment, or ask a simpler question!",
//         remaining: remaining,
//         source: "fallback"
//       });
//     }

//   } catch (error) {
//     console.error("API error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(req: NextRequest) {
//   try {
//     const session = await getServerSession();
//     if (!session?.user?.email) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const userId = session.user.email;
//     const { allowed, remaining } = checkRateLimit(userId);

//     return NextResponse.json({
//       remaining,
//       limits: LIMITS,
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }



// app/api/assistant/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

// Rate limiting (in-memory)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const LIMITS = {
  messagesPerHour: 30,
  messagesPerDay: 100,
};

function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const hourKey = `${userId}:hour`;
  
  const hourData = rateLimitStore.get(hourKey);
  if (hourData) {
    if (now < hourData.resetTime) {
      if (hourData.count >= LIMITS.messagesPerHour) {
        return { allowed: false, remaining: 0 };
      }
    } else {
      rateLimitStore.delete(hourKey);
    }
  }

  const hourCount = hourData?.count || 0;
  const remaining = LIMITS.messagesPerHour - hourCount;

  return { allowed: true, remaining };
}

function incrementRateLimit(userId: string) {
  const now = Date.now();
  const hourKey = `${userId}:hour`;

  const hourData = rateLimitStore.get(hourKey);
  if (hourData && now < hourData.resetTime) {
    hourData.count++;
  } else {
    rateLimitStore.set(hourKey, {
      count: 1,
      resetTime: now + 60 * 60 * 1000,
    });
  }
}

// Rule-based responses for instant replies
function getRuleBasedResponse(message: string): string | null {
  const lowerMsg = message.toLowerCase().trim();
  
  const patterns = [
    {
      keywords: ['hello', 'hi', 'hey', 'greetings'],
      response: "Hello! 👋 I'm SkillShare Bot, your AI learning assistant. I can help you with study questions, explain concepts, create practice quizzes, and suggest learning strategies. What would you like to work on today?"
    },
    {
      keywords: ['help', 'what can you do', 'how do you work'],
      response: "I can help you with:\n\n📚 Answering study questions\n🧠 Explaining complex topics in simple terms\n✍️ Creating practice questions and quizzes\n📊 Suggesting study strategies\n🎯 Building personalized learning plans\n\nJust ask me anything about what you're learning!"
    },
    {
      keywords: ['thank', 'thanks', 'appreciate'],
      response: "You're very welcome! 😊 I'm here whenever you need help with your studies. Feel free to ask more questions anytime!"
    },
    {
      keywords: ['bye', 'goodbye', 'see you'],
      response: "Goodbye! Good luck with your studies! 📖 Come back anytime you need help!"
    }
  ];

  for (const pattern of patterns) {
    if (pattern.keywords.some(kw => lowerMsg.includes(kw))) {
      return pattern.response;
    }
  }

  return null;
}

// Call Groq API (Free - 14,400 requests/day)
async function callGroq(message: string): Promise<string> {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not configured");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant", // Fast and free
      messages: [
        {
          role: "system",
          content: `You are SkillShare Bot, an enthusiastic and helpful AI learning assistant. Your goal is to help students learn effectively.

Guidelines:
- Answer study questions clearly and accurately
- Explain complex topics in simple, easy-to-understand terms
- Use examples and analogies when helpful
- Be encouraging and supportive
- Keep responses concise but thorough (2-4 paragraphs max)
- Use emojis occasionally to keep things friendly
- If asked to create quizzes, provide 3-5 questions with answers
- Suggest study techniques when relevant

Keep your tone friendly, educational, and motivating!`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Groq API error:", error);
    throw new Error("AI service unavailable");
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "I couldn't generate a response. Please try again!";
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.email;

    // Check rate limit
    const { allowed, remaining } = checkRateLimit(userId);
    if (!allowed) {
      return NextResponse.json(
        {
          reply: "⏰ You've reached your hourly limit of 30 messages. Please try again in a bit! Your limit will reset soon.",
          remaining: 0,
        },
        { status: 200 } // Return 200 so frontend shows the message
      );
    }

    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message" },
        { status: 400 }
      );
    }

    // Try rule-based response first (instant, no API calls)
    const ruleResponse = getRuleBasedResponse(message);
    if (ruleResponse) {
      incrementRateLimit(userId);
      return NextResponse.json({
        reply: ruleResponse,
        remaining: remaining - 1,
      });
    }

    // Call Groq AI
    try {
      const aiResponse = await callGroq(message);
      incrementRateLimit(userId);
      
      return NextResponse.json({
        reply: aiResponse,
        remaining: remaining - 1,
      });
    } catch (error: any) {
      console.error("AI error:", error);
      
      // Check if it's API key issue
      if (error.message === "GROQ_API_KEY not configured") {
        return NextResponse.json({
          reply: "⚠️ The AI service is not configured yet. Please add your GROQ_API_KEY to the .env.local file.\n\nTo get a free API key:\n1. Visit https://console.groq.com\n2. Sign up (free)\n3. Create an API key\n4. Add to .env.local: GROQ_API_KEY=your_key_here",
          remaining: remaining,
        });
      }
      
      // Generic error fallback
      return NextResponse.json({
        reply: "🤖 I'm having trouble connecting right now. Please try again in a moment!\n\nIn the meantime, you can ask me simple questions and I'll do my best to help with my basic responses.",
        remaining: remaining,
      });
    }

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.email;
    const { allowed, remaining } = checkRateLimit(userId);

    return NextResponse.json({
      remaining,
      limits: LIMITS,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}