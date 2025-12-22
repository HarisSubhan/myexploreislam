import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      title: 'Step 1: Parents Subscribe',
      description: `Parents sign up on the platform and choose a monthly or yearly plan. After subscribing, they get access to a Parent Dashboard where they can:`,
      points: [
        'Add multiple children under their profile.',
        'Set the child’s age to unlock the right level of content.',
        'View child activity, quiz scores, time spent, and overall progress.',
        'Safe and secure - only parents have access to settings and account management.',
      ],
      icon: '📝',
    },
    {
      title: 'Step 2: Kids Start Learning',
      description: `Each child gets their own Kid Dashboard, which is colorful, easy to use, and full of exciting learning modules. Kids can:`,
      points: [
        'Watch animated episodes featuring Maryam & Muaz.',
        'Complete interactive modules and assignments.',
        'Read ebooks with audio and visual support.',
        'Take quizzes that reinforce learning (automatically graded with badges and rewards).',
      ],
      icon: '🎮',
    },
    {
      title: 'Step 3: Parents Track Progress',
      description: `Parents can log in anytime to:`,
      points: [
        'View which modules their child has completed.',
        'See quiz scores, time spent, and areas where their child needs improvement.',
        'Download progress reports (coming soon).',
        'Set time limits and reminders for learning.',
      ],
      icon: '📊',
    },
  ];

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>How It Works</h1>
      <p style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <strong>Explore Islam</strong> makes Islamic learning simple, fun, and structured for children while giving parents full control and insight.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {steps.map((step, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              gap: '1.5rem',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              backgroundColor: '#f9f9f9',
              alignItems: 'flex-start',
            }}
          >
            <div style={{ fontSize: '2.5rem' }}>{step.icon}</div>
            <div>
              <h2 style={{ margin: '0 0 0.5rem 0' }}>{step.title}</h2>
              <p style={{ margin: '0 0 0.5rem 0' }}>{step.description}</p>
              <ul style={{ paddingLeft: '1.2rem' }}>
                {step.points.map((point, idx) => (
                  <li key={idx} style={{ marginBottom: '0.3rem' }}>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <p style={{ textAlign: 'center', marginTop: '3rem', fontWeight: 'bold' }}>
        Stay involved in your child’s Islamic education – easily and effectively.
      </p>
    </div>
  );
};

export default HowItWorks;
