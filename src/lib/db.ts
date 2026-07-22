import { neon } from '@neondatabase/serverless';

const neonSql = neon(process.env.DATABASE_URL!);

// Custom wrapper to mimic @vercel/postgres API shape
export const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
  const result = await neonSql(strings, ...values);
  return { rows: result, rowCount: result.length };
};

export async function initDb() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        source_url VARCHAR(500) NOT NULL,
        guid_hash VARCHAR(64) UNIQUE NOT NULL,
        slug VARCHAR(500) UNIQUE,
        pub_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        category VARCHAR(100) DEFAULT 'General',
        apply_type VARCHAR(20) DEFAULT 'none',
        apply_link VARCHAR(500)
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        pub_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        author VARCHAR(100) DEFAULT 'Admin'
      );
    `;
    
    // Add slug column to existing table if it doesn't exist
    try {
      await sql`ALTER TABLE posts ADD COLUMN slug VARCHAR(500) UNIQUE;`;
    } catch (e) {
      // Column might already exist, ignore
    }

    // Add category column to existing table if it doesn't exist
    try {
      await sql`ALTER TABLE posts ADD COLUMN category VARCHAR(100) DEFAULT 'General';`;
    } catch (e) {
      // Column might already exist, ignore
    }

    // Add apply_type and apply_link columns to existing table if they don't exist
    try {
      await sql`ALTER TABLE posts ADD COLUMN apply_type VARCHAR(20) DEFAULT 'none';`;
      await sql`ALTER TABLE posts ADD COLUMN apply_link VARCHAR(500);`;
    } catch (e) {
      // Columns might already exist, ignore
    }

    // Add filter columns for jobs
    try {
      await sql`ALTER TABLE posts ADD COLUMN job_type VARCHAR(50);`;
      await sql`ALTER TABLE posts ADD COLUMN experience VARCHAR(50);`;
      await sql`ALTER TABLE posts ADD COLUMN salary VARCHAR(100);`;
      await sql`ALTER TABLE posts ADD COLUMN domain VARCHAR(100);`;
    } catch (e) {
      // Columns might already exist, ignore
    }
    
    // Seed blog posts for AdSense compliance
    await seedBlogPosts();
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

async function seedBlogPosts() {
  const articles = [
    {
      title: "10 Proven Tips to Land a Remote Job in 2026",
      slug: "10-proven-tips-land-remote-job-2026",
      excerpt: "Remote work is evolving rapidly. Here are the top ten strategies you need to secure a work-from-home position in today's competitive job market.",
      content: `<p>The landscape of remote work has shifted dramatically. In 2026, companies are prioritizing efficiency, communication, and self-management skills more than ever. To land a remote job today, you need a specialized strategy that sets you apart from thousands of applicants globally. This comprehensive guide walks you through the 10 proven strategies to stand out, pass remote interviews, and land your dream work-from-home position.</p>
      
      <h3>1. Optimize Your Resume for Remote Roles</h3>
      <p>Your CV must explicitly demonstrate your ability to work independently. Highlight tools like Slack, Trello, Zoom, Asana, and Git. Mention specific projects where you managed your own schedule, worked with minimal supervision, or collaborated asynchronously across different timezones. Use active verbs such as "Coordinated," "Self-managed," and "Spearheaded asynchronously."</p>
      
      <h3>2. Focus on Niche Remote Job Boards</h3>
      <p>While general job sites are good, dedicated portals like We Work Remotely, FlexJobs, Remote.co, and remote-focused sections of specialty boards yield higher quality matches. Spend 80% of your time on platforms dedicated entirely to remote positions where hiring managers understand international contracts.</p>
      
      <h3>3. Build a Portfolio that Acts as Proof of Work</h3>
      <p>Build a portfolio that acts as a digital proof of work. Having a clean web presence showing past results is the single best way to build trust with remote employers. For developers, this is GitHub; for marketers, case studies; for designers, Behance or personal sites. Direct evidence of capability beats a written resume every time.</p>
      
      <h3>4. Master Asynchronous Communication</h3>
      <p>Remote teams depend on clear, concise, and proactive written communication. In your cover letter and communications, be detailed but precise. Avoid sending one-word questions; state your query, provide context, and offer solutions in a single, well-structured message.</p>
      
      <h3>5. Upgrade Your Home Office Setup</h3>
      <p>Before you start applying, ensure you have the hardware to succeed. This means a reliable, high-speed internet connection, a quiet environment, a clear webcam, and a decent microphone. Mentioning in your cover letter that you possess a fully functional home office with power backup immediate mitigates any logistical concerns a recruiter might have.</p>
      
      <h3>6. Build an Active LinkedIn Presence</h3>
      <p>Recruiters look for remote talent on LinkedIn. Optimize your profile headline to include keywords like "Remote," your stack, and target roles. Regularly publish insights or share industry articles to show that you are engaged and proactive in your field.</p>
      
      <h3>7. Showcase Strong Soft Skills</h3>
      <p>Working from home requires extreme discipline. Emphasize your adaptability, time management, self-motivation, and problem-solving capabilities. During interviews, tell stories of how you handled a project bottleneck independently without waiting for direct supervision.</p>
      
      <h3>8. Understand Remote Compensation & Compliance</h3>
      <p>Different companies hire remote workers as contractors, through Employer of Record (EOR) services (like Deel or Remote.com), or as direct foreign employees. Research how tax compliance and international payments work in your country so you can negotiate contracts confidently.</p>
      
      <h3>9. Prepare for Video Interviews</h3>
      <p>Ensure your lighting is good, the background is clean, and you look directly into the camera (not the screen) to establish eye contact. Record yourself practicing answers to common remote-focused questions to refine your delivery and pacing.</p>
      
      <h3>10. Follow Up Proactively</h3>
      <p>After submitting an application or completing an interview, send a brief, personalized follow-up note within 24 hours. Express your enthusiasm for the position, reiterate the value you can bring, and thank them for their time.`
    },
    {
      title: "How to Optimize Your Resume for ATS Scanners",
      slug: "optimize-resume-ats-scanners",
      excerpt: "Learn how Applicant Tracking Systems parse your resume and the exact layout and keyword strategies to get your application seen by human recruiters.",
      content: `<p>Most major corporations use Applicant Tracking Systems (ATS) to filter resumes before a human recruiter ever lays eyes on them. If your resume isn't optimized for these algorithms, it might get auto-rejected. Here is how to format and write your resume to pass the bots and secure human review.</p>
      
      <h3>1. Use Standard, Clean Formatting</h3>
      <p>Avoid fancy graphics, tables, progress bars, text boxes, and multi-column layouts. ATS scanners read left-to-right and top-to-bottom; complex layouts cause text to scramble, leading to immediate rejection. Stick to clean, single-column layouts with standard fonts like Arial, Calibri, or Times New Roman, and save your file as a PDF or DOCX.</p>
      
      <h3>2. Target Keywords from the Job Description</h3>
      <p>Identify core skills and nouns in the target job post (e.g., 'Project Management', 'Python', 'SEO Strategy', 'Stakeholder Communication') and integrate them naturally into your professional summary, experience bullet points, and skills section. Do not 'keyword stuff'; make sure the keywords flow naturally in sentences describing real accomplishments.</p>
      
      <h3>3. Use Clear, Universal Section Headings</h3>
      <p>Stick to universal headers like 'Professional Summary', 'Work Experience', 'Education', and 'Skills'. Avoid creative headers like 'My Journey', 'Where I\\'ve Been', or 'Credentials' which confuse the ATS parser and can lead to vital sections being omitted during parsing.</p>
      
      <h3>4. Focus on Quantifiable Achievements</h3>
      <p>Do not just list job responsibilities. Instead, focus on outcomes and achievements using the formula: Action Verb + Accomplished Goal + Quantifiable Metric. For example, write "Led a marketing campaign that increased subscriber conversion rates by 22% over 3 months" instead of "Responsible for social media campaign."</p>
      
      <h3>5. Avoid Header and Footer Info</h3>
      <p>Keep your contact details in the main body of the document. Many ATS scanners completely ignore headers and footers, which means the recruiter might receive a passed resume but have no way of knowing your email address, phone number, or location.`
    },
    {
      title: "The Ultimate Guide to Graduate Trainee Program Applications",
      slug: "ultimate-guide-graduate-trainee-programs",
      excerpt: "Graduate trainee programs are highly competitive. Find out how to build a winning application and ace the aptitude tests and assessment centers.",
      content: `<p>Graduate trainee programs at top multinationals (like FMCGs, banks, consulting firms, and tech giants) are the holy grail for fresh graduates. They offer rapid career progression, rotation opportunities, high-impact projects, and direct mentorship from executives. However, selection rates are often under 2%. Here is your comprehensive playbook to navigate the multi-stage application pipeline and win the offer.</p>
      
      <h3>1. Build a Standout Entry-Level Resume</h3>
      <p>As a fresh graduate, focus on leadership, initiative, and analytical capabilities. Highlight university leadership roles, internships, volunteer projects, certifications, and academic achievements. Tailor your resume to show that you are adaptive, eager to learn, and capable of collaborating in fast-paced corporate environments.</p>
      
      <h3>2. Master the Online Aptitude Tests</h3>
      <p>Most programs start with an automated cognitive or situational judgment test. Practice numerical, verbal, abstract, and diagrammatic reasoning tests daily using prep portals. Speed and accuracy are critical skills tested in these assessments, and preparation is the only way to pass the high cutoff scores.</p>
      
      <h3>3. Stand Out in the Assessment Center</h3>
      <p>The Assessment Center evaluates how you collaborate and solve business problems. During group tasks, focus on active listening, building constructively on others' ideas, and keeping track of time, rather than trying to dominate the conversation. Leaders are those who facilitate team success.</p>
      
      <h3>4. Prepare for Case Studies and Presentations</h3>
      <p>You may be asked to analyze a business scenario and present your recommendations. Practice structuring your thoughts logically using frameworks like SWOT analysis or MECE (Mutually Exclusive, Collectively Exhaustive). Focus on presenting data-driven recommendations and answering questions confidently under pressure.</p>
      
      <h3>5. Align with the Corporate Culture and Core Values</h3>
      <p>Before your final executive panel interview, research the company's recent business news, financial performance, and corporate values. Align your personal stories and career objectives with their core mission to demonstrate genuine passion and fit.</p>`
    },
    {
      title: "How to Find and Secure Fully-Funded Scholarships",
      slug: "find-secure-fully-funded-scholarships",
      excerpt: "Securing funding for your education can change your life. Explore the top global scholarship programs and how to write a compelling personal statement.",
      content: `<p>Higher education is a powerful career catalyst, but the costs of international study can be prohibitive. Fortunately, numerous global governments, foundations, and universities offer fully funded scholarships that cover tuition, flights, housing, and health insurance. Here is your step-by-step guide to finding and securing these life-changing opportunities.</p>
      
      <h3>1. Target Major Government and Foundation Programs</h3>
      <p>Research prestigious government-backed programs like the Chevening Scholarship (UK), DAAD (Germany), MasterCard Foundation Scholars Program, Erasmus Mundus (Europe), and Fulbright Program (USA). These prestigious awards seek to build future leaders and cover all educational and living expenses.</p>
      
      <h3>2. Write a Compelling Personal Statement</h3>
      <p>Your statement of purpose should clearly link your academic goals, personal story, and future career plans back to how you intend to create tangible development impact in your home country. Focus on leadership potentials, resilience in overcoming obstacles, and concrete, realistic objectives.</p>
      
      <h3>3. Secure Strong, Detailed Reference Letters</h3>
      <p>Choose academic and professional referees who know your work intimately and can speak to specific instances of your academic prowess, leadership capability, and character. Avoid referees who write generic, template-based praise; detailed anecdotes from a lecturer are far more persuasive.</p>
      
      <h3>4. Prepare Your Academic Transcript and Evaluations</h3>
      <p>Ensure your academic credentials, degree certificates, and transcripts are certified and translated if necessary. If your target country requires language proficiency exams (like IELTS or TOEFL) or graduate exams (like GRE or GMAT), register and study for them early to avoid missing tight deadlines.</p>
      
      <h3>5. Craft a Structured Study Plan or Research Proposal</h3>
      <p>For postgraduate scholarships, you will need a clear study plan or research proposal outlining what you want to study, why it is important, and how it fits into the broader academic field. Keep it realistic, well-researched, and aligned with the expertise of the host university's faculty members.</p>`
    },
    {
      title: "5 Common Interview Mistakes and How to Avoid Them",
      slug: "5-common-interview-mistakes-avoid",
      excerpt: "Avoid these critical errors during job interviews to immediately boost your success rate and project confidence and competence.",
      content: `<p>An interview is your chance to turn a written application into a solid job offer. Even highly qualified candidates frequently fail interviews due to simple, avoidable errors. By understanding these five common mistakes and implementing the correct approaches, you can immediately project confidence, structure, and competence.</p>
      
      <h3>1. Lack of Research and Company Knowledge</h3>
      <p>Never show up without knowing what the company sells, their target audience, who their main competitors are, and their recent milestones. Take 30-45 minutes to review their website, press releases, and social media channels. Mentioning their recent projects during the call shows deep interest and preparation.</p>
      
      <h3>2. Giving Vague, Cliché Answers</h3>
      <p>Avoid generic clichés like "I'm a perfectionist" or "I work too hard." Instead, use the STAR method (Situation, Task, Action, Result) to tell concrete stories demonstrating how you solved real business challenges, managed conflict, or optimized work processes.</p>
      
      <h3>3. Speaking Negatively about Past Employers</h3>
      <p>No matter how difficult your previous job was, never speak negatively about past managers or companies. It projects unprofessionalism and raises red flags. Instead, frame your decision to leave as a desire to seek new growth challenges and career advancement.</p>
      
      <h3>4. Neglecting Non-Verbal Communication</h3>
      <p>For online interviews, poor camera angles, messy backgrounds, and bad lighting can distract interviewers. For in-person interviews, poor posture or lack of eye contact can signal lack of confidence. Sit straight, look directly into the camera to simulate eye contact, and speak clearly.</p>
      
      <h3>5. Failing to Ask Thoughtful, Strategic Questions</h3>
      <p>When the interviewer asks "Do you have any questions for us?", saying "No" shows lack of enthusiasm. Prepare 2-3 strategic questions about team challenges, performance measurement metrics, or upcoming projects to show that you are already thinking like a team member.</p>`
    },
    {
      title: "Is a Coding Bootcamp Worth It in the Age of AI?",
      slug: "coding-bootcamp-worth-it-age-ai",
      excerpt: "With the rise of AI coding assistants, is formal software engineering bootcamp training still a smart career move? Let's analyze the pros and cons.",
      content: `<p>The rapid growth of AI tools like Gemini, ChatGPT, and Copilot has transformed the software development landscape. Today, AI can write boilerplate code, debug syntax errors, and generate documentation in seconds. This has led many to ask: is joining an intensive coding bootcamp still worth the investment? The answer is yes, but the focus of what you learn and project must shift.</p>
      
      <h3>1. The Shift to Systems Thinking and Architecture</h3>
      <p>AI is highly efficient at writing individual functions, but it cannot architect large-scale systems, understand complex database relationships, or align technical solutions with business goals. High-value bootcamps that focus on system design, database indexing, and software architecture are more relevant than ever.</p>
      
      <h3>2. Mastering AI-Assisted Workflows</h3>
      <p>The modern software engineer is not a slow typist; they are a conductor. Employers are looking for developers who can leverage AI tools to build, test, and deploy code 10 times faster while maintaining code quality and security. Choose bootcamps that actively teach you how to write prompts, review AI-generated code, and identify security vulnerabilities.</p>
      
      <h3>3. Focus on Deep Problem-Solving</h3>
      <p>Having a certificate is no longer enough. Build unique, complex capstone projects that solve real-world problems. Focus on projects with database integrations, user authentication, and third-party APIs to show recruiters that you have practical, full-stack capabilities.</p>
      
      <h3>4. Networking and Career Ecosystems</h3>
      <p>The true value of a reputable bootcamp is often not just the curriculum, but the structured accountability, peer-to-peer coding, career coaching, mock interviews, and access to direct hiring partner networks. Leverage these resources to bypass traditional application queues.</p>`
    },
    {
      title: "How to Write a Professional Cold Email to Recruiters",
      slug: "write-professional-cold-email-recruiters",
      excerpt: "Cold emailing can bypass application queues. Learn the exact template and structure to grab a recruiter's attention and land an interview.",
      content: `<p>Applying through job boards can feel like sending your CV into a black hole. Sending a direct, polite, and value-packed cold email to a recruiter or team lead is an excellent way to stand out. By targeting the right decision-makers and framing your value clearly, you can land interviews that aren't even advertised yet.</p>
      
      <h3>1. Target the Right Decision-Maker</h3>
      <p>Do not send generic emails to general addresses. Use LinkedIn to find the recruitment manager, HR lead, or the team lead of the department you want to join. Tools like Hunter.io or Voila Norbert can help you find their direct professional email addresses.</p>
      
      <h3>2. Write a Compelling Subject Line</h3>
      <p>Your subject line determines if your email gets opened. Keep it professional, concise, and value-focused. For example: "Inquiry: Experienced Product Marketer - [Name]" or "Applying for Software Engineer Role - [Name]". Avoid vague subjects like "Job Application" or "Hello".</p>
      
      <h3>3. Keep it Short and Value-Packed</h3>
      <p>Recruiters are extremely busy. Your email should be readable in under 30 seconds. State who you are, why you are writing, and highlight 2-3 specific accomplishments that match their department goals. Attach your resume as a clean PDF and link to your portfolio.</p>
      
      <h3>4. Professional Cold Email Template</h3>
      <p>Here is a proven template you can adapt:
      <pre>Subject: Opportunity Inquiry: UI/UX Designer - [Your Name]

Dear [Recruiter Name],

I hope this email finds you well. I have been following [Company Name]'s recent work in digital finance and was inspired by your latest app update.

I am a UI/UX designer with 3+ years of experience building mobile interfaces that improve retention. Previously at [Past Company], I redesigned the checkout flow, resulting in a 14% increase in successful transactions.

I would love to bring this same focus to [Company Name]. I have attached my resume and you can view my portfolio at [Portfolio Link]. 

Are you open to a brief 10-minute chat next Tuesday morning to discuss how my experience can support your design goals this quarter?

Best regards,
[Your Name]
[Your Phone Number]
[Your LinkedIn Link]</pre></p>
      
      <h3>5. Follow Up Politely</h3>
      <p>If you don't receive a response after 4-5 business days, send a single, polite follow-up reply on the same thread. Simply reiterate your interest and ask if they have had a chance to review your details. Keep it low-pressure.</p>`
    },
    {
      title: "A Beginner's Guide to Negotiating Your First Salary",
      slug: "beginners-guide-negotiate-salary",
      excerpt: "Do not leave money on the table. Discover how to research market rates and confidently negotiate your salary package without risking the offer.",
      content: `<p>Many early-career professionals accept the first offer they receive because they fear the offer will be rescinded if they negotiate. In reality, employers expect negotiation, and candidate confidence can actually reinforce your professional value. Here is how to negotiate your salary safely, professionally, and backed by data.</p>
      
      <h3>1. Research Market Compensation Rates</h3>
      <p>Use sites like Glassdoor, Levels.fyi, PayScale, and LinkedIn Salary to determine the average salary range for your role, experience level, and location. Enter negotiations backed by factual data and ranges, not personal financial needs.</p>
      
      <h3>2. Let the Employer Make the First Offer</h3>
      <p>If asked about your salary expectations early in the process, try to defer by saying: "I am open to competitive compensation aligned with the responsibilities of the role. What is the budgeted range you have set aside for this position?" If forced, provide a wide range based on your research.</p>
      
      <h3>3. Focus on Total Compensation</h3>
      <p>If the base salary is fixed due to budget constraints, negotiate for other high-value perks. This includes remote work stipends, health insurance, extra vacation days, certification budgets, or signing bonuses. Every benefit counts toward your total package.</p>
      
      <h3>4. Practice Your Script</h3>
      <p>Frame the conversation positively. Emphasize your excitement about the team and focus on finding a mutually beneficial package. For example: "I am thrilled about the offer and eager to join the team. Based on my research and the specific responsibilities we discussed, I was hoping we could look at a base of [Target Amount]. Is there flexibility in that number?"</p>
      
      <h3>5. Get the Final Offer in Writing</h3>
      <p>Never resign from your current job or stop your job search based on a verbal agreement. Always wait until you receive a formal, written contract detailing the agreed-upon base salary, benefits, start date, and job title.</p>`
    },
    {
      title: "Top Skills Companies Are Hiring for in 2026",
      slug: "top-skills-companies-hiring-2026",
      excerpt: "Discover the high-income soft and hard skills that are in highest demand across industries this year, and how to acquire them.",
      content: `<p>The job market in 2026 demands a combination of technical capability and adaptive intelligence. As automation and AI handle routine tasks, companies are searching for professionals with specialized skill sets. Focus on developing these capabilities to future-proof your career.</p>
      
      <h3>1. AI Literacy and Prompt Engineering</h3>
      <p>Understanding how to integrate AI tools into everyday business operations is now a foundational requirement across marketing, development, management, and administrative roles. Showing that you can prompt and leverage AI to double output is a high-value differentiator.</p>
      
      <h3>2. Data Literacy and Analytics</h3>
      <p>The ability to interpret data, spot trends, and make business decisions backed by analytical insights is highly valued across operations, finance, and marketing teams. Learn tools like PowerBI, Tableau, SQL, or Google Analytics to demonstrate capability.</p>
      
      <h3>3. Asynchronous Project Management</h3>
      <p>With teams distributed globally, knowing how to manage tasks, document progress, and move projects forward using platforms like Jira, Notion, ClickUp, or Asana without constant meetings is a critical skill for remote efficiency.</p>
      
      <h3>4. Cybersecurity and Privacy Basics</h3>
      <p>As operations digitize, data breaches are costly. Basic knowledge of secure remote work, compliance regulations (like GDPR, NDPA, or CCPA), and data handling is increasingly valued across non-technical and administrative roles.</p>
      
      <h3>5. Emotional Intelligence (EQ) and Resilience</h3>
      <p>Communication, empathy, active listening, and collaborative leadership are the core human traits that algorithms cannot replicate. Showing that you can manage stress, facilitate cooperation, and adapt to change makes you indispensable.</p>`
    },
    {
      title: "How to Balance a 9-to-5 Job with Up-Skilling",
      slug: "balance-9-to-5-job-with-upskilling",
      excerpt: "Struggling to find time to learn new career skills? Learn how to structure your week and stay motivated to up-skill without burning out.",
      content: `<p>Up-skilling is essential for career progression, but finding time to study while working a full-time 9-to-5 job is challenging. Success requires deliberate scheduling, time management, and efficient habits rather than waiting for vast blocks of free time. Here is how to construct a sustainable routine to learn without burning out.</p>
      
      <h3>1. Build Micro-Learning Habits</h3>
      <p>Do not wait for a free weekend to study for 6 hours. Instead, dedicate 30 to 45 minutes every morning before work or during your commute to study. Consistent, daily study builds neural connections and habits much faster than sporadic bursts.</p>
      
      <h3>2. Align Learning with Your Day Job</h3>
      <p>The fastest way to learn is to apply the skills immediately. Try to integrate your learning into your current job. If you are learning Excel automation, use it to speed up your weekly reports. If you are learning design, volunteer to build a presentation slide for your team.</p>
      
      <h3>3. Focus on Project-Based Learning</h3>
      <p>Rather than just watching endless video courses (which leads to "tutorial purgatory"), build a small, functional project using the skill you are learning. Building things solidifies knowledge, exposes integration problems, and gives you portfolio pieces.</p>
      
      <h3>4. Protect Your Energy and Prevent Burnout</h3>
      <p>Learning is mentally exhausting. Set realistic expectations and don't try to learn 3 different subjects at once. Set aside one or two days a week for complete rest to keep your mind fresh, motivated, and healthy.</p>
      
      <h3>5. Find an Accountability Partner</h3>
      <p>Share your learning goals with a colleague, friend, or join an online learning community (like Twitter's #100DaysOfCode). Knowing that others are tracking your progress provides a powerful psychological boost to stay consistent.</p>`
    }
  ];

  try {
    // Check if we already have blog posts seeded to prevent duplicates
    const checkCount = await sql`SELECT COUNT(*) FROM blog_posts;`;
    const count = parseInt(checkCount.rows[0].count, 10);
    if (count > 0) {
      console.log('Blog posts already seeded, skipping.');
      return;
    }

    for (const art of articles) {
      await sql`
        INSERT INTO blog_posts (title, slug, content, excerpt, author)
        VALUES (${art.title}, ${art.slug}, ${art.content}, ${art.excerpt}, 'Admin')
        ON CONFLICT (slug) DO NOTHING;
      `;
    }
    console.log('Seeded 10 blog posts successfully');
  } catch (error) {
    console.error('Error seeding blog posts:', error);
  }
}

export async function insertPost(
  title: string, 
  content: string, 
  sourceUrl: string, 
  guidHash: string, 
  slug: string, 
  category: string = 'General', 
  applyType: string = 'none', 
  applyLink: string | null = null,
  jobType: string | null = null,
  experience: string | null = null,
  salary: string | null = null,
  domain: string | null = null
) {
  try {
    const result = await sql`
      INSERT INTO posts (title, content, source_url, guid_hash, slug, category, apply_type, apply_link, job_type, experience, salary, domain)
      VALUES (${title}, ${content}, ${sourceUrl}, ${guidHash}, ${slug}, ${category}, ${applyType}, ${applyLink}, ${jobType}, ${experience}, ${salary}, ${domain})
      ON CONFLICT (guid_hash) DO NOTHING
      RETURNING id, title, slug, pub_date;
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error inserting post:', error);
    throw error;
  }
}

export async function getPostByHash(guidHash: string) {
  try {
    const result = await sql`
      SELECT id FROM posts WHERE guid_hash = ${guidHash} LIMIT 1;
    `;
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error checking existing post:', error);
    throw error;
  }
}

export interface PostFilters {
  searchQuery?: string;
  jobType?: string[];
  experience?: string[];
  salary?: string[];
  domain?: string;
}

export async function getRecentPosts(limit = 20, offset = 0, filters: PostFilters | string = '') {
  try {
    let q = '';
    let jobTypeFilter: string[] = [];
    let experienceFilter: string[] = [];
    let salaryFilter: string[] = [];
    let domainFilter = '';

    if (typeof filters === 'string') {
      q = filters;
    } else {
      q = filters.searchQuery || '';
      jobTypeFilter = filters.jobType || [];
      experienceFilter = filters.experience || [];
      salaryFilter = filters.salary || [];
      domainFilter = filters.domain || '';
    }

    // neon serverless SQL tagged templates need some careful handling with dynamic clauses.
    // To keep it secure and simple, we dynamically build the query using the .query() API.
    
    let queryStr = `SELECT id, title, content, source_url, slug, pub_date, category, apply_type, apply_link, job_type, experience, salary, domain FROM posts WHERE apply_type != 'none'`;
    let params: any[] = [];
    let paramIndex = 1;

    if (q) {
      queryStr += ` AND (title ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`;
      params.push(`%${q}%`);
      paramIndex++;
    }
    
    if (jobTypeFilter.length > 0) {
      queryStr += ` AND job_type = ANY($${paramIndex}::text[])`;
      params.push(jobTypeFilter);
      paramIndex++;
    }

    if (experienceFilter.length > 0) {
      queryStr += ` AND experience = ANY($${paramIndex}::text[])`;
      params.push(experienceFilter);
      paramIndex++;
    }

    if (salaryFilter.length > 0) {
      queryStr += ` AND salary = ANY($${paramIndex}::text[])`;
      params.push(salaryFilter);
      paramIndex++;
    }

    if (domainFilter) {
      queryStr += ` AND domain = $${paramIndex}`;
      params.push(domainFilter);
      paramIndex++;
    }

    queryStr += ` ORDER BY pub_date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const rows = await neonSql(queryStr, params);
    return rows;
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    throw error;
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const result = await sql`
      SELECT id, title, content, source_url, slug, pub_date, category, apply_type, apply_link 
      FROM posts 
      WHERE slug = ${slug} AND apply_type != 'none';
    `;
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    throw error;
  }
}

export async function getPostById(id: number) {
  try {
    const result = await sql`
      SELECT id, title, content, source_url, slug, pub_date, category, apply_type, apply_link 
      FROM posts 
      WHERE id = ${id} AND apply_type != 'none';
    `;
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error fetching post by id:', error);
    throw error;
  }
}

export async function getPostsWithShortContent(maxContentLength = 500) {
  try {
    const result = await sql`
      SELECT id, title, content, source_url, slug, pub_date, category 
      FROM posts 
      WHERE LENGTH(content) < ${maxContentLength}
      ORDER BY pub_date DESC;
    `;
    return result.rows;
  } catch (error) {
    console.error('Error fetching short-content posts:', error);
    throw error;
  }
}

export async function getTotalPostsCount(filters: PostFilters | string = '') {
  try {
    let q = '';
    let jobTypeFilter: string[] = [];
    let experienceFilter: string[] = [];
    let salaryFilter: string[] = [];
    let domainFilter = '';

    if (typeof filters === 'string') {
      q = filters;
    } else {
      q = filters.searchQuery || '';
      jobTypeFilter = filters.jobType || [];
      experienceFilter = filters.experience || [];
      salaryFilter = filters.salary || [];
      domainFilter = filters.domain || '';
    }

    let queryStr = `SELECT COUNT(*) FROM posts WHERE apply_type != 'none'`;
    let params: any[] = [];
    let paramIndex = 1;

    if (q) {
      queryStr += ` AND (title ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`;
      params.push(`%${q}%`);
      paramIndex++;
    }
    
    if (jobTypeFilter.length > 0) {
      queryStr += ` AND job_type = ANY($${paramIndex}::text[])`;
      params.push(jobTypeFilter);
      paramIndex++;
    }

    if (experienceFilter.length > 0) {
      queryStr += ` AND experience = ANY($${paramIndex}::text[])`;
      params.push(experienceFilter);
      paramIndex++;
    }

    if (salaryFilter.length > 0) {
      queryStr += ` AND salary = ANY($${paramIndex}::text[])`;
      params.push(salaryFilter);
      paramIndex++;
    }

    if (domainFilter) {
      queryStr += ` AND domain = $${paramIndex}`;
      params.push(domainFilter);
      paramIndex++;
    }

    const rows = await neonSql(queryStr, params);
    return parseInt(rows[0].count, 10);
  } catch (error) {
    console.error('Error counting posts:', error);
    return 0;
  }
}

export async function updatePostContent(id: number, content: string, category: string, applyType: string = 'none', applyLink: string | null = null) {
  try {
    await sql`
      UPDATE posts 
      SET content = ${content}, category = ${category}, apply_type = ${applyType}, apply_link = ${applyLink}
      WHERE id = ${id};
    `;
    return true;
  } catch (error) {
    console.error('Database update error:', error);
    return false;
  }
}

export async function insertBlogPost(title: string, slug: string, content: string, excerpt: string, author: string = 'Admin') {
  try {
    const result = await sql`
      INSERT INTO blog_posts (title, slug, content, excerpt, author)
      VALUES (${title}, ${slug}, ${content}, ${excerpt}, ${author})
      ON CONFLICT (slug) DO UPDATE 
      SET title = EXCLUDED.title, content = EXCLUDED.content, excerpt = EXCLUDED.excerpt, author = EXCLUDED.author
      RETURNING id, title, slug;
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error inserting blog post:', error);
    throw error;
  }
}

export async function getBlogPosts(limit = 10, offset = 0) {
  try {
    const result = await sql`
      SELECT id, title, slug, excerpt, pub_date, author 
      FROM blog_posts 
      ORDER BY pub_date DESC 
      LIMIT ${limit} OFFSET ${offset};
    `;
    return result.rows;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const result = await sql`
      SELECT id, title, slug, content, excerpt, pub_date, author 
      FROM blog_posts 
      WHERE slug = ${slug} LIMIT 1;
    `;
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    throw error;
  }
}

export async function getLatestPostsByCategory(category: string, limit = 4) {
  try {
    let result;
    if (category.toLowerCase() === 'jobs' || category.toLowerCase() === 'general') {
      result = await sql`
        SELECT id, title, content, source_url, slug, pub_date, category, apply_type, apply_link 
        FROM posts 
        WHERE apply_type != 'none' 
          AND category NOT IN ('Internships', 'Scholarships', 'Bootcamps', 'Grants', 'Graduate Programs')
        ORDER BY pub_date DESC 
        LIMIT ${limit};
      `;
    } else {
      result = await sql`
        SELECT id, title, content, source_url, slug, pub_date, category, apply_type, apply_link 
        FROM posts 
        WHERE apply_type != 'none' AND category ILIKE ${category}
        ORDER BY pub_date DESC 
        LIMIT ${limit};
      `;
    }
    return result.rows;
  } catch (error) {
    console.error(`Error fetching posts for category ${category}:`, error);
    throw error;
  }
}

export async function getSetting(key: string) {
  try {
    const result = await sql`SELECT value FROM settings WHERE key = ${key} LIMIT 1;`;
    return result.rows.length > 0 ? result.rows[0].value : null;
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return null;
  }
}

export async function setSetting(key: string, value: string) {
  try {
    await sql`
      INSERT INTO settings (key, value) 
      VALUES (${key}, ${value}) 
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
    `;
    return true;
  } catch (error) {
    console.error(`Error setting ${key}:`, error);
    return false;
  }
}
