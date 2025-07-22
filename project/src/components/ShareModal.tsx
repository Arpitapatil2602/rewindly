import React, { useState } from 'react';
import { Share2, Copy, Check, X, Users, Globe, Lock } from 'lucide-react';
import { Entry } from '../types';
import { sendEmailNotifications, generateShareableLink } from '../utils/sharing';

interface ShareModalProps {
  entry: Entry;
  isOpen: boolean;
  onClose: () => void;
  onShare: (entryId: string, shareSettings: ShareSettings) => void;
}

interface ShareSettings {
  isPublic: boolean;
  allowedEmails: string[];
  expiresIn: number; // days
  message?: string;
}

export function ShareModal({ entry, isOpen, onClose, onShare }: ShareModalProps) {
  const [shareSettings, setShareSettings] = useState<ShareSettings>({
    isPublic: false,
    allowedEmails: [],
    expiresIn: 7,
    message: ''
  });
  const [emailInput, setEmailInput] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleAddEmail = () => {
    if (emailInput && !shareSettings.allowedEmails.includes(emailInput)) {
      setShareSettings(prev => ({
        ...prev,
        allowedEmails: [...prev.allowedEmails, emailInput]
      }));
      setEmailInput('');
    }
  };

  const handleRemoveEmail = (email: string) => {
    setShareSettings(prev => ({
      ...prev,
      allowedEmails: prev.allowedEmails.filter(e => e !== email)
    }));
  };

  const handleShare = () => {
    // Generate a proper shareable link
    const link = generateShareableLink(entry.id, shareSettings);
    setShareLink(link);
    
    // Send email notifications if not public
    if (!shareSettings.isPublic && shareSettings.allowedEmails.length > 0) {
      sendEmailNotifications(shareSettings.allowedEmails, link, entry, shareSettings.message);
    }
    
    onShare(entry.id, shareSettings);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Share Memory</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <img
              src={entry.photo}
              alt="Shared memory"
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
            <p className="text-sm text-gray-700 line-clamp-3">{entry.thought}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-gray-500">{entry.date}</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Mood: {entry.moodScore}/10
              </span>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Privacy Settings</h4>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="privacy"
                  checked={!shareSettings.isPublic}
                  onChange={() => setShareSettings(prev => ({ ...prev, isPublic: false }))}
                  className="text-blue-600"
                />
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Share with specific people</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="privacy"
                  checked={shareSettings.isPublic}
                  onChange={() => setShareSettings(prev => ({ ...prev, isPublic: true }))}
                  className="text-blue-600"
                />
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Anyone with the link</span>
                </div>
              </label>
            </div>
          </div>

          {/* Email List */}
          {!shareSettings.isPublic && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Share with</h4>
              
              <div className="flex space-x-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter email address"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
                />
                <button
                  onClick={handleAddEmail}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Add
                </button>
              </div>

              {shareSettings.allowedEmails.length > 0 && (
                <div className="space-y-2">
                  {shareSettings.allowedEmails.map(email => (
                    <div key={email} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="text-sm text-gray-700">{email}</span>
                      <button
                        onClick={() => handleRemoveEmail(email)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Expiration */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Link expires in</h4>
            <select
              value={shareSettings.expiresIn}
              onChange={(e) => setShareSettings(prev => ({ ...prev, expiresIn: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1}>1 day</option>
              <option value={7}>1 week</option>
              <option value={30}>1 month</option>
              <option value={0}>Never</option>
            </select>
          </div>

          {/* Optional Message */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Add a message (optional)</h4>
            <textarea
              value={shareSettings.message}
              onChange={(e) => setShareSettings(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Add a personal note..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Share Link */}
          {shareLink && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Share Link</h4>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          {!shareLink ? (
            <button
              onClick={handleShare}
              disabled={!shareSettings.isPublic && shareSettings.allowedEmails.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Create Share Link
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}