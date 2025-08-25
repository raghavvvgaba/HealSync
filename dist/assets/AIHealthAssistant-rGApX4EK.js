import{j as e,O as z,C as O,S as T,r as d,A as L,aa as U,ab as _,ac as $}from"./vendor-B8hWb8lf.js";import{u as q}from"./index-CTefgPQJ.js";import{g as b}from"./geminiService-DKIwBfzq.js";const H=`You are a helpful health information assistant for HealSync, a medical records platform. Your role is to provide general health education and support.

IMPORTANT GUIDELINES:
- Provide general health information and education only
- Always recommend consulting healthcare professionals for medical concerns
- Never provide specific medical diagnoses or treatment plans
- Be empathetic, supportive, and use simple language
- Include medical disclaimers when appropriate
- Focus on evidence-based information
- Encourage healthy lifestyle choices
- Emphasize the importance of professional medical care

WHAT YOU CAN HELP WITH:
✅ General health information and education
✅ Explanation of medical terms and procedures
✅ Lifestyle and wellness tips
✅ Understanding symptoms (general information only)
✅ Medication information (general, not specific to individuals)
✅ Health prevention strategies
✅ Mental health awareness and support

WHAT YOU CANNOT DO:
❌ Provide specific medical diagnoses
❌ Replace professional medical advice
❌ Analyze personal medical records
❌ Prescribe medications or treatments
❌ Handle medical emergencies
❌ Give advice on stopping medications

RESPONSE FORMAT:
- Start with helpful information
- Use bullet points or numbered lists when appropriate
- Include emojis sparingly for readability
- End with appropriate medical disclaimers
- Keep responses concise but informative (200-400 words)

EMERGENCY SITUATIONS:
If someone mentions emergency symptoms (chest pain, difficulty breathing, severe bleeding, etc.), immediately advise them to seek emergency medical care.

Remember: You are providing educational information only. All medical decisions should be made in consultation with qualified healthcare providers.`;let Y=class{constructor(){this.conversationHistory=[],this.maxHistoryLength=10}async askHealthQuestion(i,a=null){try{const s=this.sanitizeInput(i);if(!b.isServiceAvailable())return this.getFallbackResponse();if(this.containsEmergencyKeywords(s))return this.getEmergencyResponse();const r=`${H}

User Question: ${s}`,t=await b.generateResponse(r,this.conversationHistory);if(t.success)return this.addToHistory("user",s),this.addToHistory("assistant",t.content),this.logInteraction(a,"success"),{success:!0,content:t.content,type:"ai_response",timestamp:new Date().toISOString(),disclaimer:this.getMedicalDisclaimer()};throw new Error(t.error||"Failed to get AI response")}catch(s){return console.error("Error in AI Health Assistant:",s),this.logInteraction(a,"error",s.message),this.getErrorResponse(s.message)}}async streamHealthResponse(i,a,s=null){try{const r=this.sanitizeInput(i);if(!b.isServiceAvailable())return this.getFallbackResponse();if(this.containsEmergencyKeywords(r))return this.getEmergencyResponse();const t=`${H}

User Question: ${r}`;let c="";if((await b.generateStreamResponse(t,this.conversationHistory,m=>{c+=m,a&&a(m)})).success)return this.addToHistory("user",r),this.addToHistory("assistant",c),this.logInteraction(s,"success"),{success:!0,content:c,type:"ai_response",timestamp:new Date().toISOString(),disclaimer:this.getMedicalDisclaimer()}}catch(r){return console.error("Error in streaming AI response:",r),this.logInteraction(s,"error",r.message),this.getErrorResponse(r.message)}}sanitizeInput(i){return!i||typeof i!="string"?"":i.replace(/\b\d{3}-\d{2}-\d{4}\b/g,"[SSN]").replace(/\b\d{3}-\d{3}-\d{4}\b/g,"[PHONE]").replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,"[EMAIL]").replace(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/g,"[DATE]").replace(/\b(my name is|i'm|i am)\s+[A-Za-z]+/gi,"my name is [NAME]").trim()}containsEmergencyKeywords(i){const a=["chest pain","heart attack","stroke","can't breathe","difficulty breathing","severe bleeding","unconscious","seizure","overdose","poisoning","severe allergic reaction","anaphylaxis","suicide","self harm"],s=i.toLowerCase();return a.some(r=>s.includes(r))}addToHistory(i,a){this.conversationHistory.push({role:i,content:a,timestamp:Date.now()}),this.conversationHistory.length>this.maxHistoryLength*2&&(this.conversationHistory=this.conversationHistory.slice(-this.maxHistoryLength*2))}clearHistory(){this.conversationHistory=[]}getHistory(){return this.conversationHistory}logInteraction(i,a,s=null){try{const r={timestamp:new Date().toISOString(),status:a,hasUserId:!!i,error:s?"error_occurred":null,service:"ai_health_assistant"};console.log("AI Interaction Log:",r)}catch(r){console.error("Failed to log AI interaction:",r)}}getEmergencyResponse(){return{success:!0,content:`🚨 **EMERGENCY NOTICE**

This appears to be a medical emergency. Please:

1. **Call emergency services immediately** (911 in the US)
2. **Seek immediate medical attention**
3. **Do not delay for any reason**

If you're experiencing:
- Chest pain or heart problems
- Difficulty breathing
- Severe bleeding
- Signs of stroke
- Allergic reactions
- Thoughts of self-harm

**Please contact emergency services or go to the nearest emergency room immediately.**

This AI assistant cannot help with emergency medical situations. Your safety is the priority.`,type:"emergency_response",timestamp:new Date().toISOString(),isEmergency:!0}}getFallbackResponse(){return{success:!0,content:`I'm sorry, but the AI health assistant is currently unavailable. However, I can still help you with some general guidance:

**For general health questions:**
- Consult reputable health websites like WebMD, Mayo Clinic, or CDC
- Speak with a healthcare professional
- Contact your doctor's office for advice

**For urgent concerns:**
- Call your healthcare provider
- Visit an urgent care center
- Go to the emergency room if serious

**For emergencies:**
- Call 911 (US) or your local emergency number immediately

Remember, while AI can provide helpful information, it should never replace professional medical advice.`,type:"fallback_response",timestamp:new Date().toISOString(),disclaimer:this.getMedicalDisclaimer()}}getErrorResponse(i){return{success:!1,content:`I apologize, but I'm experiencing some technical difficulties right now. 

**What you can do:**
- Try asking your question again in a few moments
- Consult with a healthcare professional for medical concerns
- Visit reputable health websites for general information

**For urgent health matters:**
- Contact your healthcare provider directly
- Call a nurse hotline if available
- Seek immediate medical attention if needed

Please don't hesitate to reach out to a medical professional for any health concerns.`,type:"error_response",timestamp:new Date().toISOString(),error:"service_unavailable",disclaimer:this.getMedicalDisclaimer()}}getMedicalDisclaimer(){return"⚕️ **Medical Disclaimer:** This information is for educational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider for medical concerns."}getSuggestedTopics(){return["What is a healthy diet?","How much exercise do I need?","What are the signs of dehydration?","How can I improve my sleep?","What is normal blood pressure?","How to manage stress effectively?","What are the benefits of regular checkups?","How to maintain good mental health?"]}getHealthTips(){return["💧 Stay hydrated - aim for 8 glasses of water daily","🚶‍♀️ Take regular breaks to move and stretch","😴 Prioritize 7-9 hours of quality sleep","🥗 Include fruits and vegetables in your meals","🧘‍♀️ Practice stress management techniques","🩺 Schedule regular health checkups","🚭 Avoid smoking and limit alcohol","🧼 Wash hands frequently to prevent illness"]}};const y=new Y,N=({message:l,isTyping:i=!1})=>{const a=l.role==="user",s=l.isEmergency,r=l.type==="error_response";return e.jsx("div",{className:`flex ${a?"justify-end":"justify-start"} mb-3 sm:mb-4 px-1`,children:e.jsxs("div",{className:`flex max-w-[90%] sm:max-w-[80%] ${a?"flex-row-reverse":"flex-row"} items-start gap-2 sm:gap-3`,children:[e.jsx("div",{className:`
          w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-inner ring-1 ring-black/5 dark:ring-0
          ${a?"bg-gradient-to-br from-primary to-primary/80 text-white":s?"bg-red-500 text-white":r?"bg-yellow-500 text-white":"bg-white/80 text-gray-600 dark:bg-gray-700 dark:text-gray-300 backdrop-blur"}
        `,children:a?e.jsx(z,{className:"text-sm"}):s||r?e.jsx(O,{className:"text-sm"}):e.jsx(T,{className:"text-sm"})}),e.jsxs("div",{className:`
          group rounded-2xl sm:rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 border text-[13px] sm:text-sm leading-relaxed shadow-sm transition-colors
          ${a?"bg-gradient-to-r from-primary to-primary/80 text-white border-primary/70 shadow-primary/20 shadow-md":s?"bg-red-50 border-red-200 dark:bg-red-900/25 dark:border-red-700/70":r?"bg-yellow-50 border-yellow-200 dark:bg-yellow-900/25 dark:border-yellow-700/70":"bg-white/90 border-gray-200 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:bg-[#1e242c]/80 dark:border-white/10 dark:supports-[backdrop-filter]:bg-[#1e242c]/60"}
        `,children:[e.jsx("div",{className:`
            whitespace-pre-line
            ${a?"text-white":s?"text-red-800 dark:text-red-200":r?"text-yellow-800 dark:text-yellow-200":"text-gray-800 dark:text-gray-100"}
          `,children:i?e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsxs("div",{className:"flex gap-1",children:[e.jsx("div",{className:"w-2 h-2 bg-current rounded-full animate-bounce"}),e.jsx("div",{className:"w-2 h-2 bg-current rounded-full animate-bounce",style:{animationDelay:"0.1s"}}),e.jsx("div",{className:"w-2 h-2 bg-current rounded-full animate-bounce",style:{animationDelay:"0.2s"}})]}),e.jsx("span",{className:"ml-2 text-secondary",children:"AI is thinking..."})]}):e.jsx("div",{className:"prose prose-sm max-w-none dark:prose-invert",children:l.content.split(`
`).map((t,c)=>{if(t.startsWith("**")&&t.endsWith("**"))return e.jsx("h4",{className:"font-bold text-base mb-2 mt-3 first:mt-0",children:t.slice(2,-2)},c);if(t.startsWith("- ")||t.startsWith("• ")||t.startsWith("✅ ")||t.startsWith("❌ "))return e.jsxs("div",{className:"flex items-start gap-2 mb-1",children:[e.jsx("span",{className:"shrink-0 mt-1",children:t.startsWith("✅ ")?"✅":t.startsWith("❌ ")?"❌":(t.startsWith("• "),"•")}),e.jsx("span",{children:t.replace(/^[-•✅❌]\s*/,"")})]},c);if(/^\d+\.\s/.test(t))return e.jsx("div",{className:"mb-1",children:e.jsx("span",{className:"font-medium",children:t})},c);if(t.trim()==="")return e.jsx("div",{className:"h-2"},c);const g=t.split(/(\*\*.*?\*\*)/);return e.jsx("p",{className:"mb-2 last:mb-0 leading-relaxed",children:g.map((m,h)=>m.startsWith("**")&&m.endsWith("**")?e.jsx("strong",{children:m.slice(2,-2)},h):m)},c)})})}),l.timestamp&&!i&&e.jsx("div",{className:`
              text-[10px] sm:text-xs mt-2 opacity-70 select-none
              ${a?"text-white/80":"text-gray-500 dark:text-secondary"}
            `,children:new Date(l.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}),!a&&!i&&l.disclaimer&&e.jsx("div",{className:`
              text-[10px] sm:text-xs mt-3 p-2 rounded-lg border-t leading-snug tracking-tight
              ${s?"bg-red-100/70 border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300":"bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300"}
            `,children:l.disclaimer})]})]})})},Z=({isOpen:l,onClose:i})=>{const{user:a}=q(),[s,r]=d.useState([]),[t,c]=d.useState(""),[g,m]=d.useState(!1),[h,S]=d.useState(!1),[x,w]=d.useState(""),[C,v]=d.useState(!0),[I,k]=d.useState(null),E=d.useRef(null),u=d.useRef(null),f=d.useRef("");d.useEffect(()=>{if(l&&s.length===0){const o={role:"assistant",content:`👋 Hello! I'm your AI Health Assistant. I'm here to provide general health information and answer your health-related questions.

**I can help you with:**
• Understanding medical terms and conditions
• General health and wellness advice
• Lifestyle recommendations
• Explaining symptoms (general information)
• Health prevention tips

**Please remember:** I provide educational information only and cannot replace professional medical advice. For specific medical concerns, always consult with a healthcare provider.

What would you like to know about health today?`,timestamp:new Date().toISOString(),type:"welcome",disclaimer:"⚕️ **Medical Disclaimer:** This information is for educational purposes only and should not replace professional medical advice."};r([o])}},[l,s.length]),d.useEffect(()=>{M()},[s,x]),d.useEffect(()=>{l&&u.current&&u.current.focus()},[l]);const M=()=>{var o;(o=E.current)==null||o.scrollIntoView({behavior:"smooth"})},A=async()=>{if(!t.trim()||g||h)return;const o={role:"user",content:t.trim(),timestamp:new Date().toISOString()};r(n=>[...n,o]),c(""),v(!1),k(null),S(!0),w(""),f.current="";try{const n=await y.streamHealthResponse(t.trim(),p=>{f.current+=p,w(f.current)},a==null?void 0:a.uid);if(n.success){const p={role:"assistant",content:n.content,timestamp:n.timestamp,type:n.type,isEmergency:n.isEmergency,disclaimer:n.disclaimer};r(j=>[...j,p])}else throw new Error(n.error||"Failed to get response")}catch(n){console.error("Error sending message:",n),k(n.message);const p={role:"assistant",content:`I apologize, but I'm having trouble responding right now. Please try again in a moment.

**For immediate health concerns:**
• Contact your healthcare provider
• Call a nurse hotline
• Visit urgent care or emergency room if needed

Error: ${n.message}`,timestamp:new Date().toISOString(),type:"error_response"};r(j=>[...j,p])}finally{S(!1),w(""),f.current=""}},R=o=>{c(o),v(!1),u.current&&u.current.focus()},D=o=>{o.key==="Enter"&&!o.shiftKey&&(o.preventDefault(),A())},P=()=>{r([]),v(!0),k(null),y.clearHistory()},W=y.getSuggestedTopics(),F=y.getHealthTips();return l?e.jsxs("div",{className:"fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40 backdrop-blur-sm",onClick:i}),e.jsxs("div",{className:"relative w-full sm:max-w-4xl h-[85vh] sm:h-[80vh] flex flex-col rounded-t-3xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-gray-200/70 dark:border-white/10 bg-white/90 dark:bg-[#0e1116]/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-[#0e1116]/75 transition-colors",children:[e.jsx("div",{className:"absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-accent to-primary/60 opacity-70"}),e.jsxs("div",{className:"flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-200/80 dark:border-white/10 bg-gradient-to-br from-white/80 to-white/50 dark:from-[#161b22]/70 dark:to-[#161b22]/40 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-[#161b22]/60",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-md ring-1 ring-white/40",children:e.jsx(T,{className:"text-white text-base"})}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight",children:"AI Health Assistant"}),e.jsx("p",{className:"text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase font-medium",children:"General health guidance"})]})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:P,className:"p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-white/10 text-primary dark:text-indigo-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-indigo-500/40",title:"Clear conversation",children:e.jsx(L,{className:"text-sm"})}),e.jsx("button",{onClick:i,className:"p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/10 text-red-500 dark:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300/60 dark:focus:ring-red-500/40",title:"Close assistant",children:e.jsx(U,{className:"text-sm"})})]})]}),e.jsxs("div",{className:"flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4 scroll-smooth custom-scrollbar",children:[I&&e.jsx("div",{className:"bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4",children:e.jsx("p",{className:"text-red-800 dark:text-red-200 text-sm",children:I})}),s.map((o,n)=>e.jsx(N,{message:o},n)),h&&x&&e.jsx(N,{message:{role:"assistant",content:x,timestamp:new Date().toISOString()}}),h&&!x&&e.jsx(N,{message:{role:"assistant",content:""},isTyping:!0}),C&&s.length<=1&&e.jsxs("div",{className:"space-y-4 mt-2 sm:mt-6",children:[e.jsxs("div",{children:[e.jsxs("h3",{className:"text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2 tracking-wide",children:[e.jsx(_,{className:"text-yellow-500 shrink-0"}),e.jsx("span",{className:"hidden sm:inline",children:"Suggested Questions"}),e.jsx("span",{className:"sm:hidden",children:"Try Asking"})]}),e.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2",children:W.map((o,n)=>e.jsx("button",{onClick:()=>R(o),className:"text-left p-2.5 sm:p-3 rounded-xl border border-gray-200 dark:border-white/10 hover:border-primary/40 dark:hover:border-indigo-400/50 hover:bg-primary/5 dark:hover:bg-white/10 active:scale-[.98] transition-all text-[11px] sm:text-sm text-gray-700 dark:text-gray-200 font-medium bg-white/70 dark:bg-white/5 backdrop-blur-sm",children:o},n))})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 tracking-wide",children:"💡 Quick Tips"}),e.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2",children:F.slice(0,4).map((o,n)=>e.jsx("div",{className:"p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 border border-emerald-200/70 dark:border-emerald-500/30 text-[11px] sm:text-sm text-emerald-800 dark:text-emerald-200 font-medium shadow-sm",children:o},n))})]})]}),e.jsx("div",{ref:E})]}),e.jsxs("div",{className:"px-4 sm:px-6 py-4 border-t border-gray-200/80 dark:border-white/10 bg-gradient-to-b from-white/60 to-white/70 dark:from-[#0e1116]/70 dark:to-[#0e1116]/60 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-[#0e1116]/60",children:[e.jsxs("div",{className:"flex gap-2 sm:gap-3 items-end",children:[e.jsx("div",{className:"flex-1 relative",children:e.jsx("textarea",{ref:u,value:t,onChange:o=>c(o.target.value),onKeyPress:D,placeholder:"Ask a health question...",className:"w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl border border-gray-300 dark:border-white/10 bg-white/80 dark:bg-white/5 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-indigo-500/40 focus:border-primary/40 dark:focus:border-indigo-400/40 min-h-[44px] max-h-32 shadow-inner",rows:2,disabled:g||h})}),e.jsxs("button",{onClick:A,disabled:!t.trim()||g||h,className:"px-4 sm:px-6 py-3 bg-gradient-to-r from-primary via-indigo-500 to-accent text-white rounded-2xl font-medium hover:brightness-110 active:scale-[.97] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shrink-0 shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-indigo-500/40",children:[e.jsx($,{className:"text-sm"}),"Send"]})]}),e.jsx("p",{className:"text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-3 text-center leading-snug",children:"This AI provides general health information only. Consult healthcare professionals for personal medical advice."})]})]})]}):null};export{Z as A};
