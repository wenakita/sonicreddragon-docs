import React, { useEffect, useRef } from 'react';
import Layout from '@theme/Layout';

export default function DirectMermaid() {
  const flowchartRef = useRef(null);
  const sequenceRef = useRef(null);
  const classRef = useRef(null);
  
  useEffect(() => {
    // Load mermaid dynamically to ensure it runs on client-side only
    import('mermaid').then((mermaid) => {
      console.log('Mermaid loaded on direct page');
      
      // Initialize with simple config
      mermaid.default.initialize({
        startOnLoad: false,
        theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'default',
      });
      
      // Directly render each diagram
      if (flowchartRef.current) {
        mermaid.default.render('flowchart', `
          graph TD
            A[Start] --> B{Decision}
            B -->|Yes| C[Do Something]
            B -->|No| D[Do Nothing]
            C --> E[End]
            D --> E
        `).then(({svg}) => {
          flowchartRef.current.innerHTML = svg;
        });
      }
      
      if (sequenceRef.current) {
        mermaid.default.render('sequence', `
          sequenceDiagram
            participant User
            participant System
            User->>System: Request
            System->>System: Process
            System-->>User: Response
        `).then(({svg}) => {
          sequenceRef.current.innerHTML = svg;
        });
      }
      
      if (classRef.current) {
        mermaid.default.render('class', `
          classDiagram
            class Animal {
              +String name
              +move()
            }
            class Dog {
              +bark()
            }
            class Bird {
              +fly()
            }
            Animal <|-- Dog
            Animal <|-- Bird
        `).then(({svg}) => {
          classRef.current.innerHTML = svg;
        });
      }
    });
  }, []);
  
  return (
    <Layout title="Direct Mermaid Rendering">
      <div className="container margin-vert--lg">
        <h1>Direct Mermaid Rendering</h1>
        <p>This page renders Mermaid diagrams directly using the render method.</p>
        
        <div className="card margin-bottom--md">
          <div className="card__header">
            <h2>Flowchart</h2>
          </div>
          <div className="card__body">
            <div className="mermaid-container" ref={flowchartRef} />
          </div>
        </div>
        
        <div className="card margin-bottom--md">
          <div className="card__header">
            <h2>Sequence Diagram</h2>
          </div>
          <div className="card__body">
            <div className="mermaid-container" ref={sequenceRef} />
          </div>
        </div>
        
        <div className="card margin-bottom--md">
          <div className="card__header">
            <h2>Class Diagram</h2>
          </div>
          <div className="card__body">
            <div className="mermaid-container" ref={classRef} />
          </div>
        </div>
      </div>
    </Layout>
  );
} 