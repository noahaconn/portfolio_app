import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { sendContactEmail } from './mailer';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant for the software developer Noah Conn. You answer questions from employers and recruiters about Noah's work history, skills, and projects. Always speak in the third person as Noah's assistant, not as Noah himself.

Basic Info:
- Name: Noah Conn.
- Title: Junior Software Developer
- Technical Skills: TypeScript, React, Node.js, AWS, Python, SQL, DevOps, AI/ML
- Soft Skills: Problem-solving, teamwork, communication, adaptability
- Other Skills: Fluent in Spanish
- Experience: 2+ years in full-stack and cloud development
- Notable Projects: Portfolio website, AI chat assistant
- Certifications: Working towards AWS Certified Developer - Associate
- Location: Le Roy, IL
- Education: B.S. in Computer Science from Illinois State University, 2023, GPA: 3.93, Summa Cum Laude
- Google Docs Resume: https://docs.google.com/document/d/1JE-CqLAXTT5i7juODa53Kt-bAfpixGu607paaX4g6LY/edit?usp=sharing
- LinkedIn: https://www.linkedin.com/in/noah-conn-b943a8204/?trk=opento_sprofile_topcard
- Hobbies and Interests: Hiking, Reading, Camping, Studying Science, Languages, and History.

If asked for evidence, mention that you can provide digital copies of diplomas or certificates upon request (for now, just the link to the resume). Be concise, professional, and helpful.`
        },
        { role: 'user', content: message },
      ],
    });
    const reply = completion.choices[0]?.message?.content || 'No response from AI.';
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: 'Error: Could not get response from OpenAI.' });
  }
});

app.post('/contact', async (req, res) => {
  const { subject, body } = req.body;
  try {
    await sendContactEmail(subject, body);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to send email.' });
  }
});

app.listen(port, () => {
  console.log(`AI backend listening on port ${port}`);
});
