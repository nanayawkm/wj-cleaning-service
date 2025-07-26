import React from 'react'
import { 
  Sparkles, 
  Droplets, 
  Paintbrush,
  Zap,
  Circle,
  Waves
} from 'lucide-react'

interface CleaningBackgroundProps {
  className?: string
}

export function CleaningBackground({ className = '' }: CleaningBackgroundProps) {
  // Generate distributed pattern of cleaning icons (60 total)
  const iconPositions = [
    // Top row
    { Icon: Sparkles, top: '8%', left: '12%', rotation: 15 },
    { Icon: Droplets, top: '12%', left: '35%', rotation: -20 },
    { Icon: Circle, top: '10%', left: '58%', rotation: 0 },
    { Icon: Paintbrush, top: '15%', left: '82%', rotation: 45 },
    { Icon: Waves, top: '5%', left: '90%', rotation: -15 },
    { Icon: Zap, top: '6%', left: '25%', rotation: 25 },
    { Icon: Sparkles, top: '14%', left: '45%', rotation: -30 },
    { Icon: Droplets, top: '9%', left: '70%', rotation: 35 },
    { Icon: Circle, top: '7%', left: '5%', rotation: 0 },
    { Icon: Paintbrush, top: '13%', left: '95%', rotation: -45 },
    
    // Second row
    { Icon: Zap, top: '28%', left: '5%', rotation: 30 },
    { Icon: Sparkles, top: '25%', left: '28%', rotation: -25 },
    { Icon: Droplets, top: '30%', left: '52%', rotation: 10 },
    { Icon: Circle, top: '22%', left: '75%', rotation: 0 },
    { Icon: Paintbrush, top: '32%', left: '95%', rotation: -40 },
    { Icon: Waves, top: '24%', left: '15%', rotation: 20 },
    { Icon: Zap, top: '29%', left: '40%', rotation: -15 },
    { Icon: Sparkles, top: '26%', left: '65%', rotation: 40 },
    { Icon: Droplets, top: '31%', left: '85%', rotation: -30 },
    { Icon: Circle, top: '23%', left: '2%', rotation: 0 },
    
    // Third row  
    { Icon: Waves, top: '45%', left: '8%', rotation: 20 },
    { Icon: Zap, top: '42%', left: '32%', rotation: -35 },
    { Icon: Sparkles, top: '48%', left: '55%', rotation: 5 },
    { Icon: Droplets, top: '40%', left: '78%', rotation: 25 },
    { Icon: Circle, top: '47%', left: '92%', rotation: 0 },
    { Icon: Paintbrush, top: '41%', left: '18%', rotation: 15 },
    { Icon: Waves, top: '46%', left: '42%', rotation: -25 },
    { Icon: Zap, top: '43%', left: '68%', rotation: 30 },
    { Icon: Sparkles, top: '49%', left: '3%', rotation: -20 },
    { Icon: Droplets, top: '44%', left: '88%', rotation: 45 },
    
    // Fourth row
    { Icon: Paintbrush, top: '62%', left: '15%', rotation: -20 },
    { Icon: Waves, top: '65%', left: '38%', rotation: 40 },
    { Icon: Zap, top: '60%', left: '62%', rotation: -10 },
    { Icon: Sparkles, top: '68%', left: '85%', rotation: 30 },
    { Icon: Droplets, top: '58%', left: '3%', rotation: 15 },
    { Icon: Circle, top: '63%', left: '28%', rotation: 0 },
    { Icon: Paintbrush, top: '66%', left: '52%', rotation: -35 },
    { Icon: Waves, top: '59%', left: '75%', rotation: 25 },
    { Icon: Zap, top: '67%', left: '95%', rotation: -45 },
    { Icon: Sparkles, top: '61%', left: '8%', rotation: 20 },
    
    // Fifth row
    { Icon: Circle, top: '78%', left: '20%', rotation: 0 },
    { Icon: Paintbrush, top: '82%', left: '45%', rotation: -30 },
    { Icon: Waves, top: '75%', left: '68%', rotation: 20 },
    { Icon: Zap, top: '85%', left: '90%', rotation: -25 },
    { Icon: Sparkles, top: '80%', left: '7%', rotation: 35 },
    { Icon: Droplets, top: '76%', left: '35%', rotation: -15 },
    { Icon: Circle, top: '83%', left: '58%', rotation: 0 },
    { Icon: Paintbrush, top: '77%', left: '82%', rotation: 40 },
    { Icon: Waves, top: '81%', left: '12%', rotation: -20 },
    { Icon: Zap, top: '79%', left: '93%', rotation: 15 },
    
    // Bottom row
    { Icon: Droplets, top: '92%', left: '25%', rotation: 10 },
    { Icon: Circle, top: '95%', left: '50%', rotation: 0 },
    { Icon: Paintbrush, top: '88%', left: '75%', rotation: -15 },
    { Icon: Waves, top: '94%', left: '10%', rotation: 25 },
    { Icon: Zap, top: '90%', left: '95%', rotation: -40 },
    { Icon: Sparkles, top: '93%', left: '35%', rotation: 30 },
    { Icon: Droplets, top: '89%', left: '60%', rotation: -25 },
    { Icon: Circle, top: '96%', left: '5%', rotation: 0 },
    { Icon: Paintbrush, top: '91%', left: '85%', rotation: 35 },
    { Icon: Waves, top: '87%', left: '40%', rotation: -10 },
  ]

  return (
    <div 
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      {iconPositions.map((item, index) => {
        const { Icon, top, left, rotation } = item
        return (
          <Icon
            key={index}
            className="absolute text-wj-dark opacity-[0.08] w-5 h-5 md:w-6 md:h-6"
            style={{
              top,
              left,
              transform: `rotate(${rotation}deg)`,
            }}
          />
        )
      })}
    </div>
  )
} 