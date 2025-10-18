import React, { useState, useEffect, useRef } from 'react';
import Toolbar from './components/Toolbar';
import CanvasItemComponent from './components/CanvasItem';
import GenerateModal from './components/modals/GenerateModal';
import TrainingModal from './components/modals/TrainingModal';
import DrawingCanvas from './components/DrawingCanvas';
import DrawingToolbar from './components/DrawingToolbar';
import ChatPanel from './components/ChatPanel';
import WelcomeScreen from './components/WelcomeScreen';
import { CanvasItem, CanvasItemType, ChatMessage } from './types';
import * as geminiService from './services/geminiService';

// FIX: Add types for Web Speech API to resolve compilation errors, as they
// are not always included in default TypeScript DOM library definitions.
interface SpeechRecognitionAlternative {
  readonly transcript: string;
}

interface SpeechRecognitionResult {
  readonly [index: number]: SpeechRecognitionAlternative;
  readonly length: number;
}

interface SpeechRecognitionResultList {
  readonly [index: number]: SpeechRecognitionResult;
  readonly length: number;
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start: () => void;
  stop: () => void;
}

export interface KnowledgeFile {
  name: string;
  content: string;
}

type GenerateModalConfig = {
  title: string;
  placeholder: string;
  generateFunction: (prompt: string, options?: any) => Promise<any>;
  itemType: CanvasItemType;
  defaultWidth: number;
  defaultHeight: number;
};

const App: React.FC = () => {
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [generateModalConfig, setGenerateModalConfig] = useState<GenerateModalConfig | null>(null);
  const [activeAiTool, setActiveAiTool] = useState<CanvasItemType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  
  // Drawing state
  const [isDrawingModeActive, setIsDrawingModeActive] = useState(false);
  const [brushColor, setBrushColor] = useState('#FFFFFF');
  const [brushSize, setBrushSize] = useState(5);
  const [isErasing, setIsErasing] = useState(false);

  // Dragging state
  const [draggingItem, setDraggingItem] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
  const [liveTranscription, setLiveTranscription] = useState('');

  // Training state
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [systemInstruction, setSystemInstruction] = useState("You are Bentsy, a helpful and creative AI interior design assistant.");
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([]);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const wasVoiceModeActiveRef = useRef(false);

  // Effect to initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition: SpeechRecognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsVoiceModeActive(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setLiveTranscription(transcript);
    };

    recognition.onend = () => {
      setIsVoiceModeActive(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error", event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        alert('Microphone access was denied. Please allow microphone access in your browser settings to use voice input.');
      }
      setIsVoiceModeActive(false);
    };
    
    recognitionRef.current = recognition;

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  // Effect to send message when voice mode ends
  useEffect(() => {
    if (wasVoiceModeActiveRef.current && !isVoiceModeActive && liveTranscription.trim()) {
      handleSendMessage(liveTranscription.trim());
      setLiveTranscription('');
    }
    wasVoiceModeActiveRef.current = isVoiceModeActive;
  }, [isVoiceModeActive, liveTranscription]);

  const handleToggleVoiceMode = () => {
    if (!recognitionRef.current) return;

    if (isVoiceModeActive) {
      recognitionRef.current.stop();
    } else {
      setLiveTranscription('');
      recognitionRef.current.start();
    }
  };

  const toolConfigMap: Record<CanvasItemType, GenerateModalConfig> = {
    [CanvasItemType.MOODBOARD]: {
      title: 'Create a Moodboard',
      placeholder: 'e.g., "A cozy, rustic living room with a fireplace and warm tones."',
      generateFunction: geminiService.generateMoodboard,
      itemType: CanvasItemType.MOODBOARD,
      defaultWidth: 400,
      defaultHeight: 400,
    },
    [CanvasItemType.ROOM_PLAN]: {
      title: 'Generate a Room Plan',
      placeholder: 'e.g., "A modern open-plan kitchen and dining area..."',
      generateFunction: geminiService.generateRoomPlan,
      itemType: CanvasItemType.ROOM_PLAN,
      defaultWidth: 400, // This will be overridden by user input
      defaultHeight: 300, // This will be overridden by user input
    },
    [CanvasItemType.PRODUCT_SUGGESTION]: {
      title: 'Suggest Products',
      placeholder: 'e.g., "Minimalist Scandinavian-style coffee tables."',
      generateFunction: geminiService.suggestProducts,
      itemType: CanvasItemType.PRODUCT_SUGGESTION,
      defaultWidth: 300,
      defaultHeight: 250,
    },
    [CanvasItemType.INVOICE]: {
      title: 'Create an Invoice',
      placeholder: 'e.g., "Invoice for 3 hours of consultation at $150/hr and one sofa for $1200. Tax is 8%."',
      generateFunction: geminiService.createInvoice,
      itemType: CanvasItemType.INVOICE,
      defaultWidth: 400,
      defaultHeight: 350,
    },
    [CanvasItemType.LOOK]: {
      title: 'Generate a Fashion Look',
      placeholder: 'e.g., "A chic, professional outfit for a creative meeting in autumn."',
      generateFunction: geminiService.generateLook,
      itemType: CanvasItemType.LOOK,
      defaultWidth: 225,
      defaultHeight: 400,
    },
    [CanvasItemType.COLOR_PALETTE]: {
      title: 'Generate a Color Palette',
      placeholder: 'e.g., "Vibrant and energetic colors inspired by a sunset in Miami."',
      generateFunction: geminiService.generateColorPalette,
      itemType: CanvasItemType.COLOR_PALETTE,
      defaultWidth: 300,
      defaultHeight: 80,
    },
  };

  const handleItemSelect = (itemType: CanvasItemType) => {
    setActiveAiTool(itemType);
    setGenerateModalConfig(toolConfigMap[itemType]);
    setIsGenerateModalOpen(true);
    setIsDrawingModeActive(false);
  };
  
  const handleToggleDrawingMode = () => {
    setIsDrawingModeActive(prev => !prev);
    setActiveAiTool(null);
  };
  
  const handleModalClose = () => {
    setIsGenerateModalOpen(false);
    setActiveAiTool(null);
    setGenerateModalConfig(null);
  };

  const handleGenerateSubmit = async (prompt: string, options?: { width?: number; height?: number }) => {
    if (!generateModalConfig) return;
    setIsLoading(true);

    const { itemType, defaultWidth, defaultHeight, generateFunction } = generateModalConfig;
    const newItemId = `item-${Date.now()}`;

    let itemWidth = defaultWidth;
    let itemHeight = defaultHeight;

    if (itemType === CanvasItemType.ROOM_PLAN && options?.width && options?.height) {
        const MAX_DIMENSION = 500; // Max width or height in pixels
        const aspectRatio = options.width / options.height;
        if (aspectRatio > 1) { // Wider than tall
            itemWidth = MAX_DIMENSION;
            itemHeight = MAX_DIMENSION / aspectRatio;
        } else { // Taller than wide or square
            itemHeight = MAX_DIMENSION;
            itemWidth = MAX_DIMENSION * aspectRatio;
        }
    }

    const newItem: CanvasItem = {
        id: newItemId,
        type: itemType,
        x: (window.innerWidth - itemWidth) / 2,
        y: (window.innerHeight - itemHeight) / 2,
        width: itemWidth,
        height: itemHeight,
        content: null,
        title: prompt.length > 50 ? prompt.substring(0, 47) + '...' : prompt,
        status: 'pending',
    };

    setCanvasItems(prev => [...prev, newItem]);
    handleModalClose();

    try {
      const content = await generateFunction(prompt, options);
      setCanvasItems(prev =>
        prev.map(item =>
          item.id === newItemId ? { ...item, content, status: 'complete' } : item
        )
      );
    } catch (error) {
      console.error('Generation failed:', error);
      // Remove the pending item on failure
      setCanvasItems(prev => prev.filter(item => item.id !== newItemId));
      alert(`An error occurred while generating the ${itemType}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (id: string, e: React.MouseEvent) => {
    const item = canvasItems.find(i => i.id === id);
    if (!item) return;
    setDraggingItem(id);
    dragOffset.current = {
      x: e.clientX - item.x,
      y: e.clientY - item.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingItem) return;
    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;
    setCanvasItems(prev =>
      prev.map(item =>
        item.id === draggingItem ? { ...item, x: newX, y: newY } : item
      )
    );
  };

  const handleMouseUp = () => {
    setDraggingItem(null);
  };
  
  useEffect(() => {
    if (draggingItem) {
      window.addEventListener('mousemove', handleMouseMove as any);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove as any);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingItem]);

  const handleSendMessage = (message: string) => {
    // This is a placeholder for chat functionality
    console.log("Sending message:", message);
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    // Simulate model response
    setIsChatLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'model', content: "I'm processing your request..." }]);
      setIsChatLoading(false);
    }, 1500);
  };

  const handleSaveTraining = (instruction: string, files: KnowledgeFile[]) => {
    setSystemInstruction(instruction);
    setKnowledgeFiles(files);
    setIsTrainingModalOpen(false);
    // You would typically use this info to configure your Chat instance
    console.log("Training saved:", { instruction, files });
  };
  
  return (
    <div ref={canvasRef} className="relative w-screen h-screen overflow-hidden" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <WelcomeScreen isOpen={showWelcomeScreen} onClose={() => setShowWelcomeScreen(false)} />
      
      <Toolbar 
        onItemSelect={handleItemSelect}
        activeAiTool={activeAiTool}
        onToggleDrawingMode={handleToggleDrawingMode}
        isDrawingModeActive={isDrawingModeActive}
      />
      
      {canvasItems.map(item => (
        <CanvasItemComponent 
          key={item.id} 
          item={item} 
          isDragging={draggingItem === item.id}
          onDragStart={handleDragStart}
        />
      ))}

      <DrawingCanvas
        width={window.innerWidth}
        height={window.innerHeight}
        brushColor={brushColor}
        brushSize={brushSize}
        isErasing={isErasing}
        isVisible={isDrawingModeActive}
      />

      {isDrawingModeActive && (
        <DrawingToolbar
          brushColor={brushColor}
          setBrushColor={setBrushColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          isErasing={isErasing}
          setIsErasing={setIsErasing}
          onExit={() => setIsDrawingModeActive(false)}
        />
      )}

      {generateModalConfig && (
        <GenerateModal 
          isOpen={isGenerateModalOpen}
          onClose={handleModalClose}
          onSubmit={handleGenerateSubmit}
          title={generateModalConfig.title}
          placeholder={generateModalConfig.placeholder}
          isLoading={isLoading}
          itemType={generateModalConfig.itemType}
        />
      )}
      
      <button onClick={() => setIsChatOpen(true)} className="fixed bottom-6 right-6 glass-effect p-4 rounded-full shadow-lg text-white hover:bg-white/15 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300">
        AI Chat
      </button>

      <button onClick={() => setIsTrainingModalOpen(true)} className="fixed bottom-24 right-6 glass-effect p-4 rounded-full shadow-lg text-white hover:bg-white/15 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300">
        Train AI
      </button>
      
      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isChatLoading}
        isVoiceModeActive={isVoiceModeActive}
        onToggleVoiceMode={handleToggleVoiceMode}
        liveTranscription={liveTranscription}
      />

      <TrainingModal
        isOpen={isTrainingModalOpen}
        onClose={() => setIsTrainingModalOpen(false)}
        onSave={handleSaveTraining}
        initialInstruction={systemInstruction}
        initialFiles={knowledgeFiles}
      />
    </div>
  );
};

export default App;