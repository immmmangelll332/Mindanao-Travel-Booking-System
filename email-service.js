// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_h6ymw7g';
const EMAILJS_TEMPLATE_ID = 'template_zwwbnng';
const EMAILJS_PUBLIC_KEY = '80wETb3P1s2vgXedY';

// Wait for EmailJS library to load with retries
let emailjsRetries = 0;
const maxRetries = 10;

function initializeEmailJS() {
  if (typeof emailjs !== 'undefined') {
    try {
      emailjs.init(EMAILJS_PUBLIC_KEY);
      console.log('✅ EmailJS initialized successfully with Public Key:', EMAILJS_PUBLIC_KEY);
    } catch (e) {
      console.error('❌ EmailJS init error:', e);
    }
  } else {
    emailjsRetries++;
    if (emailjsRetries < maxRetries) {
      console.log(`⏳ Waiting for EmailJS to load... (attempt ${emailjsRetries}/${maxRetries})`);
      setTimeout(initializeEmailJS, 500); // Retry every 500ms
    } else {
      console.error('❌ EmailJS library failed to load after ' + maxRetries + ' attempts');
    }
  }
}

// Start initialization after a small delay
setTimeout(initializeEmailJS, 100);

// Function to send booking confirmation email
function sendBookingEmail(bookingData) {
  console.log('📧 Attempting to send email...');
  
  if (typeof emailjs === 'undefined') {
    throw new Error('EmailJS library is not loaded. Please refresh the page and try again.');
  }

  const emailParams = {
    to_email: bookingData.email,
    name: bookingData.fullName,
    email: bookingData.email,
    phone: bookingData.phone,
    destination: bookingData.destination,
    travel_date: bookingData.travelDate,
    guests: bookingData.guests,
    duration: bookingData.duration,
    total_price: bookingData.totalPrice,
    special_requests: bookingData.notes || 'None'
  };

  console.log('Sending to:', bookingData.email);
  return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailParams);
}

// Function to handle email sending with error handling
function sendBookingConfirmation(bookingData) {
  return new Promise((resolve, reject) => {
    try {
      if (typeof emailjs === 'undefined') {
        reject({
          success: false,
          message: 'EmailJS library not loaded. Please refresh the page and try again.'
        });
        return;
      }

      sendBookingEmail(bookingData)
        .then(function(response) {
          console.log('✅ Email sent successfully!', response);
          resolve({
            success: true,
            message: 'Booking confirmation email sent successfully!'
          });
        })
        .catch(function(error) {
          console.error('❌ EmailJS Error:', error);
          reject({
            success: false,
            message: 'Email error: ' + (error.text || error.message || JSON.stringify(error))
          });
        });
    } catch (e) {
      console.error('❌ Exception:', e);
      reject({
        success: false,
        message: 'Error: ' + e.message
      });
    }
  });
}
