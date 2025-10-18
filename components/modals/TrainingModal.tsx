import React, { useState } from 'react';
import { KnowledgeFile } from '../../App';
import { UploadIcon, TrashIcon } from '../icons';

interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (instruction: string, files: KnowledgeFile[]) => void;
  initialInstruction: string;
  initialFiles: KnowledgeFile[];
}

const TrainingModal: React.FC<TrainingModalProps> = ({ isOpen, onClose, onSave, initialInstruction, initialFiles }) => {
  const [instruction, setInstruction] = useState(initialInstruction);
  const [files, setFiles] = useState<KnowledgeFile[]>(initialFiles);
  const [isReadingFiles, setIsReadingFiles] = useState(false);
  const [textInput, setTextInput] = useState('');

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsReadingFiles(true);
      const newFiles = Array.from(e.target.files);
      const fileReadPromises = newFiles.map(file => {
        return new Promise<KnowledgeFile>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              resolve({ name: file.name, content: event.target.result as string });
            } else {
              reject(new Error("File read resulted in null"));
            }
          };
          reader.onerror = (error) => reject(error);
          reader.readAsText(file);
        });
      });
      
      try {
        const fileContents = await Promise.all(fileReadPromises);
        setFiles(prev => [...prev, ...fileContents.filter(f => !prev.some(pf => pf.name === f.name))]);
      } catch (error) {
        console.error("Error reading files:", error);
        alert("There was an error reading one or more files. Please ensure they are text-based files.");
      } finally {
        setIsReadingFiles(false);
        // Reset file input value to allow re-uploading the same file
        e.target.value = '';
      }
    }
  };
  
  const handleRemoveFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const handleAddText = () => {
    if (textInput.trim()) {
      const newFile: KnowledgeFile = {
        name: `Text Snippet ${files.filter(f => f.name.startsWith('Text Snippet')).length + 1}`,
        content: textInput.trim(),
      };
      setFiles(prev => [...prev, newFile]);
      setTextInput(''); // Clear textarea
    }
  };

  const handleSave = () => {
    onSave(instruction, files);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
      <div className="glass-effect rounded-2xl p-8 w-full max-w-2xl flex flex-col" style={{height: '80vh'}} onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4 flex-shrink-0 text-shadow">Train Bentsy</h2>
        
        <div className="flex-grow overflow-y-auto pr-2 space-y-6">
            <div>
                <label htmlFor="core-role" className="block text-lg font-semibold mb-2 text-gray-200 text-shadow">Core Role</label>
                <p className="text-sm text-gray-400 mb-2">Define Bentsy's personality and primary function. This is its core system instruction.</p>
                <textarea
                    id="core-role"
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    placeholder="e.g., You are a witty interior designer with a flair for modernism..."
                    className="w-full h-36 p-3 bg-gray-900/70 border border-white/20 rounded-lg resize-y focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-200 text-shadow">Custom Knowledge</h3>
                <p className="text-sm text-gray-400 mb-3">Upload text files (.txt, .md, etc.) or paste text to provide Bentsy with specific information it can reference.</p>
                
                <div className="flex items-start space-x-3 mb-4">
                    <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Paste or type knowledge here..."
                        className="flex-grow h-24 p-3 bg-gray-900/70 border border-white/20 rounded-lg resize-y focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-shadow"
                    />
                    <button
                        type="button"
                        onClick={handleAddText}
                        disabled={!textInput.trim()}
                        className="px-5 py-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all duration-300 shadow-md hover:shadow-indigo-500/40 disabled:from-gray-500 disabled:to-gray-600 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                        Add
                    </button>
                </div>

                <label htmlFor="file-upload" className="w-full flex justify-center items-center px-4 py-6 bg-black/20 text-gray-300 rounded-lg shadow-inner border-2 border-dashed border-white/20 hover:border-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">
                    <div className="text-center">
                        <UploadIcon />
                        <span className="mt-2 block text-sm font-medium">{isReadingFiles ? 'Processing files...' : 'Or upload files...'}</span>
                    </div>
                    <input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} disabled={isReadingFiles} />
                </label>

                {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <h4 className="font-semibold text-sm">Knowledge Sources:</h4>
                        <ul className="max-h-48 overflow-y-auto bg-black/20 p-2 rounded-md border border-white/10">
                            {files.map(file => (
                                <li key={file.name} className="flex items-center justify-between text-sm p-2 rounded hover:bg-white/10">
                                    <span className="truncate text-gray-300" title={file.name}>{file.name}</span>
                                    <button onClick={() => handleRemoveFile(file.name)} className="p-1 text-gray-500 hover:text-red-400 transition-colors">
                                        <TrashIcon />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>

        <div className="flex justify-end mt-6 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-gray-300 bg-white/5 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 ml-3 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-indigo-500/40"
          >
            Save Training
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingModal;