
import { supabase } from "@/integrations/supabase/client";

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

// Helper function to check if email should be excluded from ALL email notifications
const shouldExcludeFromAllEmails = (email: string): boolean => {
  const excludedEmails = ['admin@conference.com'];
  return excludedEmails.includes(email.toLowerCase());
};

export const sendEmail = async (emailData: EmailData) => {
  // Check if email should be excluded from all notifications
  if (shouldExcludeFromAllEmails(emailData.to)) {
    console.log(`Skipping email to excluded address: ${emailData.to}`);
    return { success: true, message: `Email sending skipped for excluded address: ${emailData.to}` };
  }

  try {
    console.log("Sending email to:", emailData.to);
    console.log("Subject:", emailData.subject);
    
    // Use Supabase client to invoke the edge function instead of direct fetch
    const { data, error } = await supabase.functions.invoke('send-gmail', {
      body: emailData,
    });

    if (error) {
      console.error("Email function error:", error);
      throw new Error(`Email sending failed: ${error.message}`);
    }

    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Helper function to check if email should be excluded from student notifications (keeping for backward compatibility)
const shouldExcludeFromStudentEmails = (email: string): boolean => {
  return shouldExcludeFromAllEmails(email);
};

export const createRegistrationConfirmationEmail = (authorName: string, paperTitle: string) => {
  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Registration Confirmed</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your paper has been successfully submitted</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #4a5568; margin-top: 0;">Hello ${authorName},</h2>
          <p style="color: #666; font-size: 16px;">Thank you for registering and submitting your paper. We have successfully received your submission.</p>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #4a5568; margin-top: 0;">Submission Details</h3>
          <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; border-left: 4px solid #3182ce;">
            <p style="margin: 0;"><strong>Paper Title:</strong> ${paperTitle}</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #666; margin: 0;">We will review your submission and get back to you soon.</p>
          <p style="color: #666; margin: 5px 0 0 0;">Best regards,<br>Conference Review Committee</p>
        </div>
      </div>
    </div>
  `;
};

export const createReviewerCredentialsEmail = (reviewerName: string, username: string, password: string) => {
  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Reviewer Account Created</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your reviewer credentials</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #4a5568; margin-top: 0;">Hello ${reviewerName},</h2>
          <p style="color: #666; font-size: 16px;">Your reviewer account has been created successfully. Please use the credentials below to log in to the system.</p>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #4a5568; margin-top: 0;">Login Credentials</h3>
          <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; border-left: 4px solid #3182ce;">
            <p style="margin: 0 0 10px 0;"><strong>Username:</strong> <span style="font-family: monospace; background: #fff; padding: 2px 6px; border-radius: 3px;">${username}</span></p>
            <p style="margin: 0;"><strong>Password:</strong> <span style="font-family: monospace; background: #fff; padding: 2px 6px; border-radius: 3px;">${password}</span></p>
          </div>
        </div>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
          <p style="margin: 0; color: #856404;"><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #666; margin: 0;">Welcome to the review panel!</p>
          <p style="color: #666; margin: 5px 0 0 0;">Best regards,<br>Conference Review Committee</p>
        </div>
      </div>
    </div>
  `;
};

export const createSubmissionConfirmationEmail = (authorName: string, paperTitle: string, submissionId: string) => {
  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">ICAIEA 2026</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">International Conference on Advances in Industrial Engineering Applications</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #4a5568; margin-top: 0;">Dear ${authorName},</h2>
          <p style="color: #666; font-size: 16px; margin-bottom: 16px;">Greetings from ICAIEA 2026!</p>
          <p style="color: #666; font-size: 16px;">We are pleased to inform you that we have successfully received your abstract submission for the International Conference on Advances in Industrial Engineering Applications (ICAIEA 2026), themed "Innovations & Sustainable Practices in Industrial Engineering."</p>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #4a5568; margin-top: 0;">Submission Details</h3>
          <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; border-left: 4px solid #3182ce;">
            <p style="margin: 0 0 10px 0;"><strong>Submission ID:</strong> <span style="font-family: monospace; background: #fff; padding: 2px 6px; border-radius: 3px;">${submissionId}</span></p>
            <p style="margin: 0 0 10px 0;"><strong>Paper Title:</strong> ${paperTitle}</p>
            <p style="margin: 0;"><strong>Status:</strong> <span style="color: #f59e0b; font-weight: bold;">Under Review</span></p>
          </div>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #4a5568; margin-top: 0;">What's Next?</h3>
          <ul style="color: #666; padding-left: 20px; margin: 0;">
            <li style="margin-bottom: 8px;">Your abstract is currently under review by our technical committee</li>
            <li style="margin-bottom: 8px;">The review process typically takes up to 2 weeks</li>
            <li style="margin-bottom: 8px;">You will receive further communication regarding the acceptance status via email</li>
            <li style="margin-bottom: 8px;">Once accepted, you will be invited to submit the full paper for final review, presentation and publication</li>
          </ul>
        </div>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
          <p style="margin: 0; color: #856404;">If you have any questions or require further assistance, please feel free to contact us at <strong>icaiea2026@gmail.com</strong>.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #666; margin: 0 0 15px 0;">We thank you for your contribution and look forward to your active participation in ICAIEA 2026.</p>
          <p style="color: #666; margin: 0 0 15px 0; font-weight: bold;">Warm regards,</p>
          <p style="color: #666; margin: 0 0 5px 0;"><strong>Organizing Committee</strong></p>
          <p style="color: #666; margin: 0 0 5px 0;"><strong>ICAIEA 2026</strong></p>
          <p style="color: #666; margin: 0 0 15px 0;"><strong>Anna University</strong></p>
          <p style="color: #666; margin: 0; font-size: 14px;">Contact: +91 8939934561 | +91 8489224756</p>
        </div>
      </div>
    </div>
  `;
};

export const createAssignmentEmail = (reviewerName: string, paperTitle: string, authorName: string, submissionId: string) => {
  const reviewDeadline = new Date();
  reviewDeadline.setDate(reviewDeadline.getDate() + 14); // 2 weeks from now
  const deadlineStr = reviewDeadline.toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">ICAIEA 2026</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">International Conference on Advances in Industrial Engineering Applications</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #4a5568; margin-top: 0;">Dear ${reviewerName},</h2>
          <p style="color: #666; font-size: 16px;">A paper has been assigned to you for review for the International Conference on Advances in Industrial Engineering Applications (ICAIEA 2026).</p>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #4a5568; margin-top: 0;">Details:</h3>
          <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; border-left: 4px solid #3182ce;">
            <p style="margin: 0 0 10px 0;"><strong>Author:</strong> ${authorName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Submission ID:</strong> <span style="font-family: monospace; background: #fff; padding: 2px 6px; border-radius: 3px;">${submissionId}</span></p>
            <p style="margin: 0 0 10px 0;"><strong>Paper Title:</strong> ${paperTitle}</p>
            <p style="margin: 0;"><strong>Review Deadline:</strong> ${deadlineStr}</p>
          </div>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #666; font-size: 16px; margin-bottom: 16px;">Please log in to your reviewer dashboard to access the submission and begin your review.</p>
          <div style="text-align: center; margin: 20px 0;">
            <div style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; border-radius: 6px; font-weight: bold; text-decoration: none;">
              👉 Start Review / Access Dashboard
            </div>
          </div>
        </div>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
          <p style="margin: 0; color: #856404;">For queries, contact us at <strong>icaiea2026@gmail.com</strong>.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #666; margin: 0 0 15px 0;">Thank you for your contribution.</p>
          <p style="color: #666; margin: 0 0 15px 0; font-weight: bold;">Best regards,</p>
          <p style="color: #666; margin: 0 0 5px 0;"><strong>ICAIEA 2026 Review Committee</strong></p>
          <p style="color: #666; margin: 0 0 5px 0;"><strong>Anna University</strong></p>
          <p style="color: #666; margin: 0; font-size: 14px;">Contact: +91 8939934561 | +91 8489224756</p>
        </div>
      </div>
    </div>
  `;
};

export const createStatusUpdateEmail = (reviewerName: string, paperTitle: string, newStatus: string, submissionId: string) => {
  const statusColor = newStatus === 'selected' ? '#10b981' : newStatus === 'rejected' ? '#ef4444' : '#3b82f6';
  const statusText = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
  
  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Status Update</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Paper submission status has been updated</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #4a5568; margin-top: 0;">Hello ${reviewerName},</h2>
          <p style="color: #666; font-size: 16px;">The status of a paper submission has been updated in the system. Here are the details:</p>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #4a5568; margin-top: 0;">Update Details</h3>
          <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; border-left: 4px solid #3182ce;">
            <p style="margin: 0 0 10px 0;"><strong>Submission ID:</strong> <span style="font-family: monospace; background: #fff; padding: 2px 6px; border-radius: 3px;">${submissionId}</span></p>
            <p style="margin: 0 0 10px 0;"><strong>Paper Title:</strong> ${paperTitle}</p>
            <p style="margin: 0;"><strong>New Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #666; margin: 0;">Thank you for your contribution to the review process.</p>
          <p style="color: #666; margin: 5px 0 0 0;">Best regards,<br>Conference Review Committee</p>
        </div>
      </div>
    </div>
  `;
};

export const createStudentStatusUpdateEmail = (studentName: string, paperTitle: string, status: string, submissionId: string, remarks?: string) => {
  const isSelected = status === 'selected';
  const isRejected = status === 'rejected';
  const statusColor = isSelected ? '#10b981' : isRejected ? '#ef4444' : '#3b82f6';
  const statusText = status.charAt(0).toUpperCase() + status.slice(1);
  const headerColor = isSelected ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                     isRejected ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 
                     'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
  
  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="background: ${headerColor}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Paper Review Update</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your submission has been ${status}</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #4a5568; margin-top: 0;">Hello ${studentName},</h2>
          <p style="color: #666; font-size: 16px;">
            ${isSelected ? 
              'Congratulations! Your paper has been selected for the conference.' : 
              isRejected ? 
              'Thank you for your submission. After careful review, we regret to inform you that your paper was not selected for this conference.' :
              'Your paper submission status has been updated.'
            }
          </p>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #4a5568; margin-top: 0;">Submission Details</h3>
          <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; border-left: 4px solid #3182ce;">
            <p style="margin: 0 0 10px 0;"><strong>Submission ID:</strong> <span style="font-family: monospace; background: #fff; padding: 2px 6px; border-radius: 3px;">${submissionId}</span></p>
            <p style="margin: 0 0 10px 0;"><strong>Paper Title:</strong> ${paperTitle}</p>
            <p style="margin: 0;"><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
          </div>
        </div>
        
        ${remarks ? `
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #4a5568; margin-top: 0;">Reviewer Comments</h3>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #6b7280;">
            <p style="margin: 0; color: #374151;">${remarks}</p>
          </div>
        </div>
        ` : ''}
        
        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #4a5568; margin-top: 0;">
            ${isSelected ? 'Next Steps' : isRejected ? 'Future Opportunities' : 'Information'}
          </h3>
          <ul style="color: #666; padding-left: 20px;">
            ${isSelected ? `
              <li>You will receive further instructions about conference registration</li>
              <li>Please prepare your final presentation materials</li>
              <li>Watch for updates about the conference schedule</li>
              <li>Congratulations on your successful submission!</li>
            ` : isRejected ? `
              <li>We encourage you to consider our feedback for future submissions</li>
              <li>Keep an eye out for future conference announcements</li>
              <li>Continue your excellent research work</li>
              <li>Thank you for your interest in our conference</li>
            ` : `
              <li>Your submission is being processed</li>
              <li>You will receive updates as they become available</li>
              <li>Please keep your submission ID for reference</li>
            `}
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #666; margin: 0;">
            ${isSelected ? 
              'Congratulations once again, and we look forward to your participation!' : 
              'Thank you for your submission and continued interest in our conference.'
            }
          </p>
          <p style="color: #666; margin: 5px 0 0 0;">Best regards,<br>Conference Review Committee</p>
        </div>
      </div>
    </div>
  `;
};

// Enhanced function to send student status update emails with exclusion logic
export const sendStudentStatusUpdateEmail = async (studentEmail: string, studentName: string, paperTitle: string, status: string, submissionId: string, remarks?: string) => {
  // Check if email should be excluded from student notifications
  if (shouldExcludeFromStudentEmails(studentEmail)) {
    console.log(`Skipping student email to excluded address: ${studentEmail}`);
    return { success: true, message: `Email sending skipped for excluded address: ${studentEmail}` };
  }

  try {
    const emailHtml = createStudentStatusUpdateEmail(studentName, paperTitle, status, submissionId, remarks);
    
    await sendEmail({
      to: studentEmail,
      subject: `Paper Review Update: ${submissionId} - ${paperTitle}`,
      html: emailHtml
    });

    return { success: true, message: `Email sent successfully to ${studentEmail}` };
  } catch (error: any) {
    console.error("Failed to send student status update email:", error);
    throw error;
  }
};
