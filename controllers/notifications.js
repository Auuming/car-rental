const Booking = require('../models/Booking');
const { Resend } = require('resend');

//@desc    Send booking reminder emails
//@route   Internal (called by cron job)
//@access  Internal
exports.sendBookingReminders = async () => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Calculate date 1 day from now
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Start of day

    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    console.log(`Current time: ${now.toISOString()}`);
    console.log(`Looking for bookings between: ${tomorrow.toISOString()} and ${dayAfter.toISOString()}`);

    // Find bookings that are exactly 1 day away and haven't had reminder sent
    const bookings = await Booking.find({
      date: {
        $gte: tomorrow,
        $lt: dayAfter
      },
      reminderSent: false
    }).populate({
      path: 'user',
      select: 'name email'
    }).populate({
      path: 'rentalCarProvider',
      select: 'name address tel'
    });

    // Debug: Check all bookings to see what dates exist
    const allBookings = await Booking.find({}).select('date reminderSent');
    console.log(`Total bookings in database: ${allBookings.length}`);
    if (allBookings.length > 0) {
      console.log('Sample booking dates:');
      allBookings.slice(0, 5).forEach(b => {
        console.log(`  - Date: ${b.date.toISOString()}, ReminderSent: ${b.reminderSent}`);
      });
    }

    console.log(`Found ${bookings.length} bookings to send reminders for`);

    // Send email for each booking
    for (const booking of bookings) {
      try {
        const bookingDate = new Date(booking.date);
        const formattedDate = bookingDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        const formattedTime = bookingDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Booking Reminder</h2>
            <p>Hello ${booking.user.name},</p>
            <p>This is a reminder that you have a rental car booking scheduled for:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${formattedTime}</p>
              <p><strong>Rental Car Provider:</strong> ${booking.rentalCarProvider.name}</p>
              <p><strong>Address:</strong> ${booking.rentalCarProvider.address}</p>
              <p><strong>Telephone:</strong> ${booking.rentalCarProvider.tel}</p>
            </div>
            <p>Please make sure to arrive on time for your booking.</p>
            <p>Thank you for using our rental car booking service!</p>
          </div>
        `;

        const { data, error } = await resend.emails.send({
          from: 'Rental Car Booking <onboarding@resend.dev>',
          to: booking.user.email,
          subject: `Reminder: Your rental car booking is tomorrow - ${formattedDate}`,
          html: htmlContent,
        });

        if (error) {
          console.error(`Error sending reminder email for booking ${booking._id}:`, error);
          continue;
        }

        // Mark reminder as sent
        booking.reminderSent = true;
        await booking.save();

        console.log(`Reminder email sent successfully for booking ${booking._id} to ${booking.user.email}`);
      } catch (err) {
        console.error(`Error processing reminder for booking ${booking._id}:`, err);
      }
    }

    return { success: true, count: bookings.length };
  } catch (err) {
    console.error('Error in sendBookingReminders:', err);
    return { success: false, error: err.message };
  }
};

