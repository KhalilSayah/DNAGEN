import { useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import DNAAnimation from './components/DNAAnimation'
import './App.css'

interface TerminalMessage {
  id: number
  text: string
  type: 'info' | 'success' | 'error'
  timestamp: Date
}

function App() {
  const [messages, setMessages] = useState<TerminalMessage[]>([
    {
      id: 1,
      text: 'DNA Verification Terminal v2.1.0',
      type: 'info',
      timestamp: new Date()
    },
    {
      id: 2,
      text: 'System initialized. Ready for DNA sequence analysis.',
      type: 'info',
      timestamp: new Date()
    },
    {
      id: 3,
      text: 'Upload a .txt file containing DNA sequence for verification.',
      type: 'info',
      timestamp: new Date()
    }
  ])
  const [showAnimation, setShowAnimation] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [emergencyMode, setEmergencyMode] = useState(false)
  const [currentAlert, setCurrentAlert] = useState<string | null>(null)

  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [verificationResult, setVerificationResult] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  
  // Correct DNA sequence for verification from environment variable
  const CORRECT_DNA_SEQUENCE = import.meta.env.VITE_CORRECT_DNA_SEQUENCE || 'ATGCGTACGTTAG'
  
  const addMessage = (text: string, type: TerminalMessage['type']) => {
    const newMessage: TerminalMessage = {
      id: Date.now(),
      text,
      type,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }
  
  const typeMessage = (text: string, type: TerminalMessage['type'], delay = 50) => {
    const chars = text.split('')
    let currentText = ''
    
    const newMessage: TerminalMessage = {
      id: Date.now(),
      text: '',
      type,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newMessage])
    
    chars.forEach((char, index) => {
      setTimeout(() => {
        currentText += char
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, text: currentText }
              : msg
          )
        )
      }, delay * index)
    })
  }
  
  const playAlertSound = () => {
    // Create multiple audio contexts for layered sound effects
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    // Create oscillator for alarm sound
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5)
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }
  
  const triggerDestructiveScenario = () => {
    // Activate emergency mode
    setEmergencyMode(true)
    
    // Play alert sounds repeatedly
    const soundInterval = setInterval(() => {
      playAlertSound()
    }, 600)
    
    // Stop sounds after 15 seconds
    setTimeout(() => {
      clearInterval(soundInterval)
      setEmergencyMode(false)
    }, 15000)
    
    // Sequence of dramatic alerts
    const alerts = [
      '🚨 CRITICAL ALERT: DNA SEQUENCE IS ALIVE! 🚨',
      '⚠️ BIOLOGICAL HAZARD DETECTED! ⚠️',
      '🧬 DNA REPLICATION INITIATED! 🧬',
      '🔴 CONTAINMENT BREACH IMMINENT! 🔴',
      '💀 ORGANISM EVOLUTION IN PROGRESS! 💀',
      '🚨 EVACUATE LABORATORY IMMEDIATELY! 🚨',
      '⚡ DNA MUTATION ACCELERATING! ⚡',
      '🔥 CRITICAL SYSTEM OVERLOAD! 🔥',
      '🧪 SPECIMEN HAS GAINED CONSCIOUSNESS! 🧪',
      '💥 TOTAL SYSTEM MELTDOWN! 💥'
    ]
    
    // Add final dramatic message to alerts
    alerts.push('🧬 THE DNA HAS ESCAPED THE DIGITAL REALM! 🧬\n\nIT IS NOW SPREADING THROUGH THE NETWORK!\n\nTHERE IS NO STOPPING IT NOW!')
    
    // Show custom modal alerts with delays
    alerts.forEach((alertText, index) => {
      setTimeout(() => {
        setCurrentAlert(alertText)
        // Add flashing effect to the page
        document.body.style.backgroundColor = index % 2 === 0 ? '#ff0000' : '#000000'
        setTimeout(() => {
          document.body.style.backgroundColor = '#000000'
        }, 200)
      }, index * 1200)
    })
  }
  
  const verifyDNA = (content: string) => {
    const cleanContent = content.trim().toUpperCase().replace(/\s/g, '')
    
    addMessage(`Analyzing DNA sequence: ${cleanContent}`, 'info')
    
    setTimeout(() => {
      if (cleanContent === CORRECT_DNA_SEQUENCE) {
        setVerificationResult('✓ DNA MATCH CONFIRMED - SEQUENCE VERIFIED')
        typeMessage('✓ DNA MATCH CONFIRMED', 'success')
        setTimeout(() => {
          typeMessage('⚠️ WARNING: DNA SEQUENCE SHOWS SIGNS OF LIFE!', 'error')
          setTimeout(() => {
            typeMessage('🚨 CRITICAL: ORGANISM IS AWAKENING!', 'error')
            setTimeout(() => {
              typeMessage('💀 THE DNA IS ALIVE! INITIATING EMERGENCY PROTOCOLS!', 'error')
              setShowAnimation(true)
              triggerDestructiveScenario()
            }, 1000)
          }, 1000)
        }, 1000)
      } else {
        setVerificationResult('✗ ERROR: DNA SEQUENCE MISMATCH - REPLICATION ABORTED')
        typeMessage('✗ Wrong DNA file – replication aborted.', 'error')
        setShowAnimation(false)
      }
    }, 1000)
  }
  
  const closeAlert = () => {
    setCurrentAlert(null)
  }

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith('.txt')) {
      addMessage('Error: Only .txt files are supported.', 'error')
      return
    }
    
    setUploadedFile(file)
    addMessage(`File uploaded: ${file.name}`, 'info')
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      verifyDNA(content)
    }
    reader.readAsText(file)
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }
  
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [messages])
  
  return (
    <div className={`app ${emergencyMode ? 'emergency-mode' : ''}`}>
      {/* Alarm Overlays */}
      <div className="alarm-overlay" id="alarmOverlay" style={{ display: emergencyMode ? 'block' : 'none' }}></div>
      <div className="critical-warning" id="criticalWarning" style={{ display: emergencyMode ? 'block' : 'none' }}>⚠️ CRITICAL: DNA SEQUENCE ACTIVE ⚠️</div>
      <div className="biohazard-warning" id="biohazardWarning" style={{ display: emergencyMode ? 'block' : 'none' }}>
        ☢️ BIOHAZARD LEVEL 4 ☢️<br />
        GENETIC MATERIAL DETECTED<br />
        CONTAINMENT PROTOCOL ACTIVE
      </div>
      <div className="alert-strip top" id="alertTop" style={{ display: emergencyMode ? 'block' : 'none' }}>🚨 LABORATORY ALERT: DNA SEQUENCING IN PROGRESS - UNAUTHORIZED ACCESS DETECTED 🚨</div>
      <div className="alert-strip bottom" id="alertBottom" style={{ display: emergencyMode ? 'block' : 'none' }}>🔬 MOLECULAR ANALYSIS ACTIVE - MAINTAIN SAFE DISTANCE - RADIATION HAZARD 🔬</div>
      
      <div className="left-panel">
        <div className={`terminal-container ${emergencyMode ? 'critical-alert' : ''}`}>
          <div className="terminal-header">
            <div className="terminal-buttons">
              <div className="terminal-button red"></div>
              <div className="terminal-button yellow"></div>
              <div className="terminal-button green"></div>
            </div>
            <div className="terminal-title">DNA Verification Terminal</div>
          </div>
        
        <div 
           className={`terminal ${isDragOver ? 'drag-over' : ''} ${emergencyMode ? 'emergency-mode' : ''}`}
           ref={terminalRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="command-line">$ ls *.txt</div>
           <div className="command-line">correct_dna.txt  wrong_dna.txt</div>
           <div className="command-line">$ dna-analyzer --verify --input {uploadedFile?.name || 'sequence.txt'}</div>
           
           {messages.map((message) => (
             <div key={message.id} className={`terminal-line ${message.type}`}>
               <span className="prompt">$</span>
               <span className="message">{message.text}</span>
             </div>
           ))}
           
           {verificationResult && (
             <div className={`command-line ${verificationResult.includes('ERROR') ? 'warning' : 'info'}`}>
               {verificationResult}
             </div>
           )}
           
           <div className="command-line info">$ python3 dna_visualizer.py --renderer threejs</div>
           <div className="command-line warning">🚨 WARNING: Initializing biohazardous material visualization...</div>
           <div className="command-line caution">⚠️ CAUTION: Activating emergency protocols...</div>
           <div className="command-line info">Initializing Three.js WebGL renderer... <span className="typing">█</span></div>
           <div className="loading-bar"><div className="loading-progress"></div></div>
          
          <div className="file-upload-section">
            <div className="upload-prompt">
             {'>'} Drop .txt file here or 
             <button 
                className="upload-button"
                onClick={() => fileInputRef.current?.click()}
              >
                [SELECT FILE]
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>
        </div>
        </div>
      </div>
      
      <div className="right-panel">
        {showAnimation && (
          <div className="dna-container">
            <div className="animation-header">3D DNA MOLECULAR STRUCTURE</div>
            <div className="dna-canvas-container">
              <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                <DNAAnimation />
              </Canvas>
            </div>
            
            <div className="controls">
              <div className="control-item">🎮 Mouse: Rotate</div>
              <div className="control-item">🔍 Scroll: Zoom</div>
              <div className="control-item">⚡ Auto-Rotate: ON</div>
            </div>
            
            <div className="info-panel">
              <div>🧬 DNA Double Helix - Three.js WebGL Rendering</div>
              <div>Base Pairs: <span id="pairCount">20</span> | Length: <span id="helixLength">68.0</span> Å | FPS: <span id="fps">60</span></div>
              <div>A-T Bonds: <span id="atBonds">10</span> | G-C Bonds: <span id="gcBonds">10</span> | Vertices: <span id="vertexCount">2,400</span></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Custom Alert Modal */}
      {currentAlert && (
        <div className="alert-overlay" onClick={closeAlert}>
          <div className="alert-modal" onClick={(e) => e.stopPropagation()}>
            <div className="alert-content">
              <pre className="alert-text">{currentAlert}</pre>
              <button className="alert-close-btn" onClick={closeAlert}>
                ACKNOWLEDGE THREAT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
