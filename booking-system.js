// Variables to store booking data
let selectedSpot = '';
let pricePerDay = 0;
let currentGalleryIndex = 0;
let currentSpotImages = [];
let currentSpotTitle = '';

// Image data for each tourist spot
const spotImages = {
  'Durano View Camp Site & Mountain Resort': {
    title: 'Durano View Camp Site & Mountain Resort',
    images: [
      'images/durano1.jpg',
      'images/durano2.jpg',
      'images/durano3.jpg',
      'images/durano4.jpg'
    ]
  },
  'Cathedral Falls': {
    title: 'Cathedral Falls',
    images: [
      'images/cathedral1.jpg',
      'images/cathedral2.jpg',
      'images/cathedral3.jpg',
      'images/cathedral4.jpg'
    ]
  },
  'Sta. Cruz Falls': {
    title: 'Sta. Cruz Falls',
    images: [
      'images/stacruz1.jpg',
      'images/stacruz2.jpg',
      'images/stacruz3.jpg',
      'images/stacruz4.jpg'
    ]
  },
  'Jardin de Rachma': {
    title: 'Jardin de Rachma',
    images: [
      'images/jardin1.jpg',
      'images/jardin2.jpg',
      'images/jardin3.jpg',
      'images/jardin4.jpg'
    ]
  },
  'Bakilid Leisure & Events Place': {
    title: 'Bakilid Leisure & Events Place',
    images: [
      'images/bakilid1.jpg',
      'images/bakilid2.jpg',
      'images/bakilid3.jpg',
      'images/bakilid4.jpg'
    ]
  },
  'My Father\'s Resort': {
    title: 'My Father\'s Resort',
    images: [
      'images/myfather1.jpg',
      'images/myfather2.jpg',
      'images/myfather3.jpg',
      'images/myfather4.jpg'
    ]
  }
};

// When page loads
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('bookingForm');
  const confirmationModal = document.getElementById('confirmationModal');
  const galleryModal = document.getElementById('galleryModal');
  const closeBtn = document.querySelector('.close');
  const closeModalBtn = document.querySelector('.close-modal-btn');
  const closeGalleryBtn = document.querySelector('.close-gallery');

  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    submitBooking();
  });

  // Confirmation modal close button
  closeBtn.addEventListener('click', function() {
    confirmationModal.style.display = 'none';
  });

  closeModalBtn.addEventListener('click', function() {
    confirmationModal.style.display = 'none';
  });

  // Gallery modal close button
  closeGalleryBtn.addEventListener('click', function() {
    galleryModal.style.display = 'none';
  });

  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target == confirmationModal) {
      confirmationModal.style.display = 'none';
    }
    if (e.target == galleryModal) {
      galleryModal.style.display = 'none';
    }
  });
});

// Select a tourist spot and show gallery
function selectSpot(spotName, price) {
  selectedSpot = spotName;
  pricePerDay = price;
  currentSpotTitle = spotName;

  // Show gallery if images exist
  if (spotImages[spotName]) {
    showGallery(spotName);
  } else {
    // Fallback to booking form if no images
    document.getElementById('spot').value = spotName;
    document.querySelector('.booking-section').scrollIntoView({ behavior: 'smooth' });
    calculatePrice();
  }
}

// Select destination from dropdown
function selectDestination() {
  const selectElement = document.getElementById('spot');
  const spotName = selectElement.value;
  const priceStr = selectElement.options[selectElement.selectedIndex].getAttribute('data-price');

  if (!spotName) {
    selectedSpot = '';
    pricePerDay = 0;
    calculatePrice();
    return;
  }

  selectedSpot = spotName;
  pricePerDay = parseInt(priceStr);
  calculatePrice();
}

// Show gallery modal
function showGallery(spotName) {
  const galleryModal = document.getElementById('galleryModal');
  const spotData = spotImages[spotName];

  if (!spotData) return;

  currentSpotImages = spotData.images;
  currentGalleryIndex = 0;
  currentSpotTitle = spotName;

  // Update gallery title
  document.getElementById('galleryTitle').textContent = spotData.title;

  // Display first image
  displayGalleryImage();

  // Show modal
  galleryModal.style.display = 'block';
}

// Display current gallery image
function displayGalleryImage() {
  const img = document.getElementById('galleryImage');
  const counter = document.getElementById('imageCounter');
  const dots = document.querySelectorAll('.dot');

  img.src = currentSpotImages[currentGalleryIndex];
  counter.textContent = (currentGalleryIndex + 1) + ' / ' + currentSpotImages.length;

  // Update dots
  dots.forEach((dot, index) => {
    if (index === currentGalleryIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// Change gallery image
function changeGalleryImage(direction) {
  currentGalleryIndex += direction;

  if (currentGalleryIndex < 0) {
    currentGalleryIndex = currentSpotImages.length - 1;
  } else if (currentGalleryIndex >= currentSpotImages.length) {
    currentGalleryIndex = 0;
  }

  displayGalleryImage();
}

// Go to specific gallery image
function goToGalleryImage(index) {
  currentGalleryIndex = index;
  displayGalleryImage();
}

// Book current spot from gallery
function bookCurrentSpot() {
  const galleryModal = document.getElementById('galleryModal');
  const selectElement = document.getElementById('spot');
  
  // Set the select value
  selectElement.value = currentSpotTitle;
  
  // Update selectedSpot and pricePerDay
  selectedSpot = currentSpotTitle;
  // Find the price from the spot data
  const spotData = spotImages[currentSpotTitle];
  const option = Array.from(selectElement.options).find(opt => opt.value === currentSpotTitle);
  if (option) {
    pricePerDay = parseInt(option.getAttribute('data-price'));
  }
  
  galleryModal.style.display = 'none';
  document.querySelector('.booking-section').scrollIntoView({ behavior: 'smooth' });
  calculatePrice();
}

// Calculate total price
function calculatePrice() {
  const guests = parseInt(document.getElementById('guests').value) || 1;
  const duration = parseInt(document.getElementById('duration').value) || 1;

  // Display price per day
  document.getElementById('pricePerDay').textContent = '₱' + pricePerDay;

  // Calculate total
  const totalPrice = pricePerDay * guests * duration;
  document.getElementById('totalPrice').textContent = '₱' + totalPrice.toFixed(2);
}

// Submit booking
function submitBooking() {
  // Get form data
  const spot = document.getElementById('spot').value;
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const travelDate = document.getElementById('date').value;
  const guests = document.getElementById('guests').value;
  const duration = document.getElementById('duration').value;
  const notes = document.getElementById('notes').value;
  const totalPrice = document.getElementById('totalPrice').textContent;

  // Validate that a spot is selected
  if (!spot) {
    alert('Please select a destination first!');
    return;
  }

  // Create booking details
  const bookingDetails = `
    <p><strong>Destination:</strong> ${spot}</p>
    <p><strong>Name:</strong> ${fullName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Travel Date:</strong> ${formatDate(travelDate)}</p>
    <p><strong>Number of Guests:</strong> ${guests}</p>
    <p><strong>Duration:</strong> ${duration} day(s)</p>
    ${notes ? `<p><strong>Special Requests:</strong> ${notes}</p>` : ''}
    <p><strong>Total Price:</strong> ₱${totalPrice}</p>
  `;

  // Display confirmation modal
  document.getElementById('confirmationDetails').innerHTML = bookingDetails;
  document.getElementById('confirmationModal').style.display = 'block';

  // Reset form
  document.getElementById('bookingForm').reset();
  document.getElementById('spot').value = '';
  selectedSpot = '';
  pricePerDay = 0;
  document.getElementById('pricePerDay').textContent = '₱0';
  document.getElementById('totalPrice').textContent = '₱0';
}


// Format date to readable format
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Keyboard shortcut: Press Escape to close modal
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const confirmationModal = document.getElementById('confirmationModal');
    const galleryModal = document.getElementById('galleryModal');
    if (confirmationModal.style.display === 'block') {
      confirmationModal.style.display = 'none';
    }
    if (galleryModal.style.display === 'block') {
      galleryModal.style.display = 'none';
    }
  }
});

// Scroll to booking section
function scrollToBooking() {
  const bookingSection = document.querySelector('.booking-section');
  bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
