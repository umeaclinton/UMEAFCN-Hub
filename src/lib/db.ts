import { sql } from '@vercel/postgres';

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
      content: "<p>The landscape of remote work has shifted dramatically. In 2026, companies are prioritizing efficiency, communication, and self-management skills more than ever. To land a remote job today, you need a specialized strategy that sets you apart from thousands of applicants globally.</p><h3>1. Optimize Your Resume for Remote Roles</h3><p>Your CV must explicitly demonstrate your ability to work independently. Highlight tools like Slack, Trello, Zoom, and Git. Mention specific projects where you managed your own schedule or collaborated asynchronously across timezones.</p><h3>2. Focus on Niche Remote Job Boards</h3><p>While general job sites are good, dedicated portals like We Work Remotely, FlexJobs, and remote-focused sections of specialty boards yield higher quality matches.</p><h3>3. Show, Don't Just Tell</h3><p>Build a portfolio that acts as a digital proof of work. Whether you are a developer, marketer, or designer, having a clean web presence showing past results is the single best way to build trust with remote employers.</p>"
    },
    {
      title: "How to Optimize Your Resume for ATS Scanners",
      slug: "optimize-resume-ats-scanners",
      excerpt: "Learn how Applicant Tracking Systems parse your resume and the exact layout and keyword strategies to get your application seen by human recruiters.",
      content: "<p>Most major corporations use Applicant Tracking Systems (ATS) to filter resumes before a human recruiter ever lays eyes on them. If your resume isn't optimized for these algorithms, it might get auto-rejected. Here is how to format and write your resume to pass the bots.</p><h3>1. Use Standard Formatting</h3><p>Avoid fancy graphics, tables, progress bars, and columns. ATS scanners read left-to-right and top-to-bottom; complex layouts cause text to scramble, leading to immediate rejection. Stick to clean, single-column layouts with standard fonts like Arial or Helvetica.</p><h3>2. Target Keywords from the Job Description</h3><p>Identify core skills and nouns in the target job post (e.g., 'Project Management', 'Python', 'SEO Strategy') and integrate them naturally into your professional summary and experience sections.</p><h3>3. Use Clear Section Headings</h3><p>Stick to universal headers like 'Work Experience', 'Education', and 'Skills'. Avoid creative headers like 'My Journey' or 'Where I've Been' which confuse the ATS parser.</p>"
    },
    {
      title: "The Ultimate Guide to Graduate Trainee Program Applications",
      slug: "ultimate-guide-graduate-trainee-programs",
      excerpt: "Graduate trainee programs are highly competitive. Find out how to build a winning application and ace the aptitude tests and assessment centers.",
      content: "<p>Graduate trainee programs at top multinationals (like FMCGs, banks, and tech firms) are the holy grail for fresh graduates. They offer rapid career progression, rotation opportunities, and mentorship. However, selection rates are often under 2%. Here is your playbook for success.</p><h3>1. Master the Aptitude Tests</h3><p>Most programs start with an automated cognitive test. Practice numerical, verbal, and diagrammatic reasoning tests daily. Speed and accuracy are critical skills tested in these assessments.</p><h3>2. Stand Out in the Assessment Center</h3><p>Assessment centers evaluate how you collaborate. Focus on active listening and building on others' ideas during group tasks, rather than trying to dominate the conversation. Leaders facilitate cooperation.</p><h3>3. Research the Corporate Culture</h3><p>Understand the company's values and recent business news. Align your interview answers with their core mission to demonstrate genuine interest.</p>"
    },
    {
      title: "How to Find and Secure Fully-Funded Scholarships",
      slug: "find-secure-fully-funded-scholarships",
      excerpt: "Securing funding for your education can change your life. Explore the top global scholarship programs and how to write a compelling personal statement.",
      content: "<p>Higher education is a powerful career catalyst, but the costs can be prohibitive. Fortunately, numerous international governments and institutions offer fully funded scholarships. Here is how to position yourself to win them.</p><h3>1. Target Major Global Programs</h3><p>Research prestigious government-backed programs like the Chevening Scholarship (UK), DAAD (Germany), MasterCard Foundation, and Fulbright (US). These cover tuition, accommodation, flights, and living stipends.</p><h3>2. Write a Compelling Personal Statement</h3><p>Your statement should clearly link your academic goals, personal story, and future career plans back to how you intend to create impact in your home country. Focus on leadership potentials and concrete objectives.</p><h3>3. Secure Strong Reference Letters</h3><p>Choose referees who know your work intimately and can speak to specific instances of your academic prowess, leadership, and resilience, rather than just writing generic praise.</p>"
    },
    {
      title: "5 Common Interview Mistakes and How to Avoid Them",
      slug: "5-common-interview-mistakes-avoid",
      excerpt: "Avoid these critical errors during job interviews to immediately boost your success rate and project confidence and competence.",
      content: "<p>An interview is your chance to turn an application into a job offer. Even highly qualified candidates fail interviews due to simple, avoidable errors. Learn these five common mistakes and how to address them.</p><h3>1. Poor Knowledge of the Company</h3><p>Never show up without knowing what the company sells, who their competitors are, and their recent milestones. Take 30 minutes to review their website and LinkedIn news before the call.</p><h3>2. Using Generic Clichés</h3><p>Avoid saying 'I'm a perfectionist' or 'I work too hard'. Instead, use the STAR method (Situation, Task, Action, Result) to tell concrete stories demonstrating how you solved real business challenges.</p><h3>3. Not Asking Thoughtful Questions</h3><p>When the interviewer asks 'Do you have any questions for us?', saying 'No' shows lack of engagement. Ask about team dynamics, performance metrics, or company growth plans.</p>"
    },
    {
      title: "Is a Coding Bootcamp Worth It in the Age of AI?",
      slug: "coding-bootcamp-worth-it-age-ai",
      excerpt: "With the rise of AI coding assistants, is formal software engineering bootcamp training still a smart career move? Let's analyze the pros and cons.",
      content: "<p>The growth of AI tools like Gemini, ChatGPT, and Copilot has changed the tech landscape. Many wonder if learning to code via an intensive bootcamp is still a viable career pathway. The answer is yes, but the focus of what you learn must change.</p><h3>1. The Shift to Systems Thinking</h3><p>AI can write boilerplate code, but it cannot architect large systems, debug complex integration errors, or understand business logic. Bootcamps that teach software architecture, system design, and AI-assisted workflows are highly valuable.</p><h3>2. The Importance of Problem Solving</h3><p>Recruiters today aren't looking for syntax typists; they want problem solvers who can leverage AI tools to build products faster and more securely. Emphasize your engineering and critical reasoning skills.</p><h3>3. Networking and Career Coaching</h3><p>The primary value of a bootcamp is often the community, job placement networks, and interview prep support. Look for programs with strong hiring partners.</p>"
    },
    {
      title: "How to Write a Professional Cold Email to Recruiters",
      slug: "write-professional-cold-email-recruiters",
      excerpt: "Cold emailing can bypass application queues. Learn the exact template and structure to grab a recruiter's attention and land an interview.",
      content: "<p>Applying to job portals can sometimes feel like sending resumes into a black hole. Sending a direct, polite, and value-packed cold email to a recruiter or team lead is an excellent way to stand out. Here is the framework for success.</p><h3>1. Keep it Brief and Focused</h3><p>Recruiters are busy. Your email should be readable in under 30 seconds. State who you are, why you are writing, and the value you can bring to the table.</p><h3>2. Personalize the Message</h3><p>Never copy-paste generic emails. Reference a recent article they published, a project their company launched, or a specific post they made on LinkedIn.</p><h3>3. Provide a Frictionless Call to Action</h3><p>Close with a simple request, such as a brief 10-minute call to discuss how your skills match their upcoming goals. Attach your resume as a PDF and link to your portfolio.</p>"
    },
    {
      title: "A Beginner's Guide to Negotiating Your First Salary",
      slug: "beginners-guide-negotiate-salary",
      excerpt: "Do not leave money on the table. Discover how to research market rates and confidently negotiate your salary package without risking the offer.",
      content: "<p>Many early-career professionals accept the first offer they receive because they fear the offer will be rescinded if they negotiate. In reality, employers expect negotiation, and candidate confidence can actually reinforce your value. Here is how to negotiate safely.</p><h3>1. Research Market Compensation Rates</h3><p>Use sites like Glassdoor, Levels.fyi, and LinkedIn Salary to determine the average range for your role, level, and location. Enter negotiations backed by data, not gut feelings.</p><h3>2. Focus on Total Compensation</h3><p>If the base salary is fixed, negotiate for bonuses, remote stipends, health insurance, extra vacation days, or certification budgets. Every benefit counts.</p><h3>3. Maintain a Collaborative Tone</h3><p>Frame the conversation positively. Emphasize your excitement about the role and focus on finding a mutually beneficial package that sets you up for long-term success.</p>"
    },
    {
      title: "Top Skills Companies Are Hiring for in 2026",
      slug: "top-skills-companies-hiring-2026",
      excerpt: "Discover the high-income soft and hard skills that are in highest demand across industries this year, and how to acquire them.",
      content: "<p>The job market in 2026 demands a combination of technical capability and adaptive intelligence. As automation handles routine tasks, companies are searching for professionals with specialized skill sets. Focus on developing these capabilities.</p><h3>1. AI Literacy and Prompt Engineering</h3><p>Understanding how to integrate AI systems into everyday business operations is now a foundational requirement across marketing, development, and administrative roles.</p><h3>2. Data Literacy and Analytics</h3><p>The ability to interpret data, spot trends, and make business decisions backed by analytical insights is highly valued across operations, finance, and management teams.</p><h3>3. Emotional Intelligence (EQ)</h3><p>As remote and asynchronous work grows, communication, empathy, resilience, and collaborative leadership are the core human traits that algorithms cannot replicate.</p>"
    },
    {
      title: "How to Balance a 9-to-5 Job with Up-Skilling",
      slug: "balance-9-to-5-job-with-upskilling",
      excerpt: "Struggling to find time to learn new career skills? Learn how to structure your week and stay motivated to up-skill without burning out.",
      content: "<p>Up-skilling is essential for career progression, but finding time to study while working a full-time 9-to-5 job is challenging. Success requires deliberate scheduling and efficient habits rather than finding vast blocks of free time.</p><h3>1. Use Micro-Learning Habits</h3><p>Do not wait for a free weekend. Dedicate 30 to 45 minutes every morning before work or during your commute to study. Consistency beats intensity.</p><h3>2. Focus on Project-Based Learning</h3><p>Rather than just watching video courses, build a small project using the skill you are learning. Building things solidifies knowledge much faster.</p><h3>3. Protect Your Energy Levels</h3><p>Avoid burning out by setting realistic expectations. Set aside one or two days a week for complete rest to keep your mind fresh and motivated.</p>"
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

export async function insertPost(title: string, content: string, sourceUrl: string, guidHash: string, slug: string, category: string = 'General', applyType: string = 'none', applyLink: string | null = null) {
  try {
    const result = await sql`
      INSERT INTO posts (title, content, source_url, guid_hash, slug, category, apply_type, apply_link)
      VALUES (${title}, ${content}, ${sourceUrl}, ${guidHash}, ${slug}, ${category}, ${applyType}, ${applyLink})
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

export async function getRecentPosts(limit = 20, offset = 0, searchQuery = '') {
  try {
    let result;
    if (searchQuery) {
      const query = `%${searchQuery}%`;
      result = await sql`
        SELECT id, title, content, source_url, slug, pub_date, category, apply_type, apply_link 
        FROM posts 
        WHERE (title ILIKE ${query} OR content ILIKE ${query}) AND apply_type != 'none'
        ORDER BY pub_date DESC 
        LIMIT ${limit} OFFSET ${offset};
      `;
    } else {
      result = await sql`
        SELECT id, title, content, source_url, slug, pub_date, category, apply_type, apply_link 
        FROM posts 
        WHERE apply_type != 'none'
        ORDER BY pub_date DESC 
        LIMIT ${limit} OFFSET ${offset};
      `;
    }
    return result.rows;
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

export async function getTotalPostsCount(searchQuery = '') {
  try {
    let result;
    if (searchQuery) {
      const query = `%${searchQuery}%`;
      result = await sql`
        SELECT COUNT(*) FROM posts 
        WHERE (title ILIKE ${query} OR content ILIKE ${query}) AND apply_type != 'none';
      `;
    } else {
      result = await sql`
        SELECT COUNT(*) FROM posts 
        WHERE apply_type != 'none';
      `;
    }
    return parseInt(result.rows[0].count, 10);
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
