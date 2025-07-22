// Sharing utilities for the reflection app

export interface ShareableEntry {
  id: string;
  date: string;
  photo: string;
  thought: string;
  moodScore: number;
  emotions: string[];
  tags: string[];
  category: string;
}

export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  shareLink: string;
}

// Simulate email sending (in real app, would use email service like SendGrid, Mailgun, etc.)
export async function sendEmailNotifications(
  emails: string[], 
  shareLink: string, 
  entry: any, 
  message?: string
): Promise<boolean> {
  try {
    console.log('📧 Sending email notifications...');
    
    for (const email of emails) {
      const emailData: EmailNotification = {
        to: email,
        subject: `🌟 Someone shared a reflection with you!`,
        body: generateEmailBody(shareLink, entry, message),
        shareLink
      };
      
      // Simulate API call to email service
      await simulateEmailSend(emailData);
    }
    
    // Show success notification
    showNotification('✅ Email notifications sent successfully!', 'success');
    return true;
  } catch (error) {
    console.error('Failed to send emails:', error);
    showNotification('❌ Failed to send email notifications', 'error');
    return false;
  }
}

function generateEmailBody(shareLink: string, entry: any, message?: string): string {
  return `
🌟 **You've received a shared reflection!**

${message ? `**Personal Message:** ${message}\n\n` : ''}

**Reflection Preview:**
📅 Date: ${entry.date}
😊 Mood: ${entry.moodScore}/10
💭 "${entry.thought.substring(0, 150)}${entry.thought.length > 150 ? '...' : ''}"

🔗 **View Full Reflection:** ${shareLink}

This link will expire based on the sender's settings. View it while you can!

---
Sent from Professional Growth Hub 📊
  `.trim();
}

async function simulateEmailSend(emailData: EmailNotification): Promise<void> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // Log email details (in real app, would call email API)
  console.log(`📧 Email sent to: ${emailData.to}`);
  console.log(`📧 Subject: ${emailData.subject}`);
  console.log(`📧 Share Link: ${emailData.shareLink}`);
  
  // Simulate occasional failures for realism
  if (Math.random() < 0.05) {
    throw new Error('Email service temporarily unavailable');
  }
}

export function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-500 translate-x-full ${
    type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
    type === 'error' ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' :
    'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
  }`;
  
  notification.innerHTML = `
    <div class="flex items-center space-x-3">
      <span class="text-lg font-bold">${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-gray-200 text-xl font-bold">×</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 500);
  }, 5000);
}

// Generate shareable link with proper routing
export function generateShareableLink(entryId: string, shareSettings: any): string {
  const shareId = Math.random().toString(36).substring(7);
  const baseUrl = window.location.origin;
  
  // Store share data in localStorage (in real app, would use database)
  const shareData = {
    entryId,
    shareId,
    settings: shareSettings,
    createdAt: new Date().toISOString(),
    expiresAt: shareSettings.expiresIn > 0 
      ? new Date(Date.now() + shareSettings.expiresIn * 24 * 60 * 60 * 1000).toISOString()
      : null
  };
  
  localStorage.setItem(`share_${shareId}`, JSON.stringify(shareData));
  
  return `${baseUrl}/shared/${shareId}`;
}

// Validate and load shared content
export function loadSharedEntry(shareId: string): any | null {
  try {
    const shareData = localStorage.getItem(`share_${shareId}`);
    if (!shareData) return null;
    
    const parsed = JSON.parse(shareData);
    
    // Check if expired
    if (parsed.expiresAt && new Date() > new Date(parsed.expiresAt)) {
      localStorage.removeItem(`share_${shareId}`);
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to load shared entry:', error);
    return null;
  }
}