import React from 'react'
import { 
  IconSparkles, 
  IconDroplet, 
  IconBrush,
  IconBolt,
  IconCircle,
  IconWaveSine
} from '@tabler/icons-react'

interface CleaningBackgroundProps {
  className?: string
}

export function CleaningBackground({ className = '' }: CleaningBackgroundProps) {
  // Reduced to 30 icons for better performance
  const iconPositions = [
    // Top row
    { Icon: IconSparkles, top: '8%', left: '12%', rotation: 15 },
    { Icon: IconDroplet, top: '12%', left: '35%', rotation: -20 },
    { Icon: IconCircle, top: '10%', left: '58%', rotation: 0 },
    { Icon: IconBrush, top: '15%', left: '82%', rotation: 45 },
    { Icon: IconWaveSine, top: '5%', left: '90%', rotation: -15 },
    
    // Second row
    { Icon: IconBolt, top: '28%', left: '5%', rotation: 30 },
    { Icon: IconSparkles, top: '25%', left: '28%', rotation: -25 },
    { Icon: IconDroplet, top: '30%', left: '52%', rotation: 10 },
    { Icon: IconCircle, top: '22%', left: '75%', rotation: 0 },
    { Icon: IconBrush, top: '32%', left: '95%', rotation: -40 },
    
    // Third row  
    { Icon: IconWaveSine, top: '45%', left: '8%', rotation: 20 },
    { Icon: IconBolt, top: '42%', left: '32%', rotation: -35 },
    { Icon: IconSparkles, top: '48%', left: '55%', rotation: 5 },
    { Icon: IconDroplet, top: '40%', left: '78%', rotation: 25 },
    { Icon: IconCircle, top: '47%', left: '92%', rotation: 0 },
    
    // Fourth row
    { Icon: IconBrush, top: '62%', left: '15%', rotation: -20 },
    { Icon: IconWaveSine, top: '65%', left: '38%', rotation: 40 },
    { Icon: IconBolt, top: '60%', left: '62%', rotation: -10 },
    { Icon: IconSparkles, top: '68%', left: '85%', rotation: 30 },
    { Icon: IconDroplet, top: '58%', left: '3%', rotation: 15 },
    
    // Fifth row
    { Icon: IconCircle, top: '78%', left: '20%', rotation: 0 },
    { Icon: IconBrush, top: '82%', left: '45%', rotation: -30 },
    { Icon: IconWaveSine, top: '75%', left: '68%', rotation: 20 },
    { Icon: IconBolt, top: '85%', left: '90%', rotation: -25 },
    { Icon: IconSparkles, top: '80%', left: '7%', rotation: 35 },
    
    // Bottom row
    { Icon: IconDroplet, top: '92%', left: '25%', rotation: 10 },
    { Icon: IconCircle, top: '95%', left: '50%', rotation: 0 },
    { Icon: IconBrush, top: '88%', left: '75%', rotation: -15 },
    { Icon: IconWaveSine, top: '94%', left: '10%', rotation: 25 },
    { Icon: IconBolt, top: '90%', left: '95%', rotation: -40 },
  ]

  return (
    <div 
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ contain: 'layout style paint' }}
    >
      {iconPositions.map((item, index) => {
        const { Icon, top, left, rotation } = item
        return (
          <Icon
            key={index}
            className="absolute text-wj-dark opacity-[0.06] w-4 h-4 md:w-5 md:h-5"
            style={{
              top,
              left,
              transform: `rotate(${rotation}deg)`,
              willChange: 'transform',
            }}
          />
        )
      })}
    </div>
  )
} 