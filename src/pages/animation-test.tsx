import React from 'react';
import Layout from '@theme/Layout';
import AnimatedText from '../components/AnimatedText';
import AnimatedButton from '../components/AnimatedButton';
import InteractiveCard from '../components/InteractiveCard';

export default function AnimationTest(): React.ReactElement {
  return (
    <Layout
      title="Animation Test"
      description="Test page for animation components">
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Animation Component Test</h1>
        
        <div style={{ marginBottom: '3rem' }}>
          <h2>AnimatedText Tests</h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3>String Children (should work)</h3>
            <AnimatedText animation="typewriter" duration={2000}>
              This is a test string
            </AnimatedText>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3>Number Children (should work)</h3>
            <AnimatedText animation="fadeInUp" duration={1000}>
              {42}
            </AnimatedText>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3>Empty/Null Children (should handle gracefully)</h3>
            <AnimatedText animation="slideInLeft" duration={1000}>
              {null}
            </AnimatedText>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3>Undefined Children (should handle gracefully)</h3>
            <AnimatedText animation="scale" duration={1000}>
              {undefined}
            </AnimatedText>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3>Wave Animation</h3>
            <AnimatedText animation="wave" duration={1000} loop={false}>
              Wave animation test
            </AnimatedText>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3>Glow Animation</h3>
            <AnimatedText animation="glow" duration={1500} loop={false}>
              Glow effect test
            </AnimatedText>
          </div>
        </div>
        
        <div style={{ marginBottom: '3rem' }}>
          <h2>Other Component Tests</h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3>AnimatedButton</h3>
            <AnimatedButton variant="primary" size="medium">
              Test Button
            </AnimatedButton>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3>InteractiveCard</h3>
            <InteractiveCard title="Test Card" variant="primary">
              This is a test card to verify interactions work properly.
            </InteractiveCard>
          </div>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2>Console Check</h2>
          <p>Open browser console to check for any JavaScript errors. All animations should work without throwing errors.</p>
        </div>
      </div>
    </Layout>
  );
} 