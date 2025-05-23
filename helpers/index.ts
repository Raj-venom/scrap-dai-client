// Helper function to check if a time slot is valid (not passed) for today
const isTimeSlotValid = (timeSlot: string, selectedDate: string): boolean => {
    // If not today, all slots are valid
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];

    // Convert selected date to YYYY-MM-DD format if it's in DD/MM/YYYY format
    let selectedDateFormatted = selectedDate;
    if (selectedDate.includes('/')) {
        const parts = selectedDate.split('/');
        selectedDateFormatted = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    if (selectedDateFormatted !== todayFormatted) {
        return true;
    }

    // For today, check if time slot is still available
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();

    // Extract start hour from time slot (e.g., "7 AM - 9 AM" => 7)
    const match = timeSlot.match(/(\d+)\s*(AM|PM)/i);
    if (!match) return true;

    let startHour = parseInt(match[1]);
    const period = match[2].toUpperCase();

    // Convert to 24-hour format
    if (period === 'PM' && startHour !== 12) {
        startHour += 12;
    } else if (period === 'AM' && startHour === 12) {
        startHour = 0;
    }

    // Check if time slot has already passed
    return startHour > currentHour ||
        (startHour === currentHour && currentMinute < 30); // Adding 30 minute buffer
};



export { isTimeSlotValid };