// EmailJS configuration and service
// Free tier: 200 emails/month

const EMAILJS_PUBLIC_KEY = 'MNNLPj_VG_5Q6AFRa';
const EMAILJS_SERVICE_ID = 'service_uwf2usn';
const EMAILJS_TEMPLATE_ID = 'template_ou62h2b';

interface EmailParams {
  to_email: string;
  proposer_name: string;
  recipient_name: string;
  proposal_type: string;
  response: 'yes' | 'no';
  status_link: string;
}

export async function sendResponseNotification(params: EmailParams): Promise<boolean> {
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: params.to_email,
          proposer_name: params.proposer_name,
          recipient_name: params.recipient_name,
          proposal_type: params.proposal_type,
          response: params.response,
          is_yes: params.response === 'yes',
          status_link: params.status_link,
        },
      }),
    });

    if (response.ok) {
      console.log('Email sent successfully');
      return true;
    } else {
      const error = await response.text();
      console.error('Email failed:', error);
      return false;
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}
