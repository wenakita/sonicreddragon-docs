---
sidebar_position: 2
title: Test Intro
hide_title: true
className: intro-page
---

import TestHero from '@site/src/components/TestHero';
import BrowserOnly from '@docusaurus/BrowserOnly';

<BrowserOnly>
{() => (
  <>
    <TestHero />
    <div style={{
      background: '#000000',
      color: '#FFFFFF',
      padding: '4rem',
      textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Test Section</h2>
      <p style={{ fontSize: '1.5rem' }}>If you can see this, the page is rendering correctly.</p>
    </div>
  </>
)}
</BrowserOnly> 