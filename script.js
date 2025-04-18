document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const bookingForm = document.getElementById('booking-form');
    const confirmationDiv = document.getElementById('confirmation');
    const newBookingBtn = document.getElementById('new-booking');
    const dateField = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const sliderDots = document.querySelectorAll('.dot');
    const sliderTrack = document.querySelector('.testimonial-track');
    const prevArrow = document.querySelector('.slider-arrow.prev');
    const nextArrow = document.querySelector('.slider-arrow.next');
    const counterElements = document.querySelectorAll('.counter');
    
 
    // Set minimum date to today
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const todayString = `${yyyy}-${mm}-${dd}`;
    dateField.min = todayString;
    
    // Sample time slots
    const timeSlots = [
        '07:00 AM', '08:30 AM', '10:00 AM', 
        '11:30 AM', '01:00 PM', '02:30 PM', 
        '04:00 PM', '05:30 PM', '07:00 PM'
    ];
    
    // Simulate some slots as already booked (different for each day)
    const bookedSlots = {};
    
    // Pre-populate some days with booked slots
    for (let i = 0; i < 14; i++) {
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + i);
        const dateString = formatDate(futureDate);
        
        // Randomly select 3-5 slots as booked for each day
        const numBooked = Math.floor(Math.random() * 3) + 3;
        const bookedIndices = [];
        
        while (bookedIndices.length < numBooked) {
            const randomIndex = Math.floor(Math.random() * timeSlots.length);
            if (!bookedIndices.includes(randomIndex)) {
                bookedIndices.push(randomIndex);
            }
        }
        
        bookedSlots[dateString] = bookedIndices.map(index => timeSlots[index]);
    }
    
    // Load existing bookings from localStorage
    let userBookings = JSON.parse(localStorage.getItem('yogaBookings')) || [];
    
    // Update time slots based on selected date
    dateField.addEventListener('change', updateTimeSlots);
    
    // Initial population of time slots
    updateTimeSlots();
    
    // Form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        
        if (!name || !email || !date || !time) {
            alert('Please fill out all required fields');
            return;
        }
        
        // Email validation
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Save booking
        const booking = {
            name,
            email,
            date,
            time,
            timestamp: new Date().toISOString()
        };
        
        userBookings.push(booking);
        localStorage.setItem('yogaBookings', JSON.stringify(userBookings));
        
        // Add to booked slots
        if (!bookedSlots[date]) {
            bookedSlots[date] = [];
        }
        bookedSlots[date].push(time);
        
        // Show confirmation
        document.getElementById('confirm-date').textContent = formatDisplayDate(date);
        document.getElementById('confirm-time').textContent = time;
        document.getElementById('confirm-email').textContent = email;
        
        confirmationDiv.classList.remove('hidden');
        confirmationDiv.classList.add('visible');
    });
    
    // New booking button
    newBookingBtn.addEventListener('click', function() {
        bookingForm.reset();
        updateTimeSlots();
        confirmationDiv.classList.remove('visible');
        setTimeout(() => {
            confirmationDiv.classList.add('hidden');
        }, 300);
    });
    
    // Close modal when clicking outside
    confirmationDiv.addEventListener('click', function(e) {
        if (e.target === confirmationDiv) {
            confirmationDiv.classList.remove('visible');
            setTimeout(() => {
                confirmationDiv.classList.add('hidden');
            }, 300);
        }
    });
    
    // Testimonial slider
    let currentSlide = 0;
    const totalSlides = document.querySelectorAll('.testimonial-card').length;
    
    function updateSlider() {
        sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        sliderDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });
    
    prevArrow.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    });
    
    nextArrow.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    });
    
    // Auto-advance slider
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }, 7000);
    
    
   
    // Scroll animations
    function checkScroll() {
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            const delay = el.getAttribute('data-delay') || 0;
            
            if (elementTop < windowHeight * 0.85) {
                setTimeout(() => {
                    el.classList.add('revealed');
                }, delay);
            }
        });
        
        // Header scroll effect
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Counter animation
        counterElements.forEach(counter => {
            const rect = counter.getBoundingClientRect();
            
            if (rect.top < window.innerHeight && rect.bottom > 0 && !counter.classList.contains('counted')) {
                counter.classList.add('counted');
                const target = parseInt(counter.getAttribute('data-target'));
                let count = 0;
                const duration = 2000; // 2 seconds
                const increment = Math.ceil(target / (duration / 30)); // Update every 30ms
                
                const counterInterval = setInterval(() => {
                    count += increment;
                    if (count >= target) {
                        count = target;
                        clearInterval(counterInterval);
                    }
                    counter.textContent = count;
                }, 30);
            }
        });
    }
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        
        if (this.classList.contains('active')) {
            this.querySelector('span:nth-child(1)').style.transform = 'rotate(45deg) translate(5px, 5px)';
            this.querySelector('span:nth-child(2)').style.opacity = '0';
            this.querySelector('span:nth-child(3)').style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            this.querySelector('span:nth-child(1)').style.transform = 'none';
            this.querySelector('span:nth-child(2)').style.opacity = '1';
            this.querySelector('span:nth-child(3)').style.transform = 'none';
        }
    });
    
    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.querySelector('span:nth-child(1)').style.transform = 'none';
            menuToggle.querySelector('span:nth-child(2)').style.opacity = '1';
            menuToggle.querySelector('span:nth-child(3)').style.transform = 'none';
        });
    });
    
    // Initialize scroll animations
    window.addEventListener('scroll', checkScroll);
    window.addEventListener('load', checkScroll);
    window.addEventListener('resize', checkScroll);
    
    // Trigger initial check
    checkScroll();
    
    // Helper functions
    function updateTimeSlots() {
        const selectedDate = dateField.value;
        
        // Clear existing options
        timeSelect.innerHTML = '<option value="">Choose a time slot</option>';
        
        // Get booked slots for the selected date
        const bookingsForDate = selectedDate ? 
            [...(bookedSlots[selectedDate] || []), 
             ...(userBookings
                 .filter(booking => booking.date === selectedDate)
                 .map(booking => booking.time))] : [];
        
        // Add available time slots
        timeSlots.forEach(slot => {
            if (!bookingsForDate.includes(slot)) {
                const option = document.createElement('option');
                option.value = slot;
                option.textContent = slot;
                timeSelect.appendChild(option);
            }
        });
        
        // Add "booked" placeholders for visual feedback
        timeSlots.forEach(slot => {
            if (bookingsForDate.includes(slot)) {
                const option = document.createElement('option');
                option.value = "";
                option.textContent = `${slot} - Already Booked`;
                option.disabled = true;
                timeSelect.appendChild(option);
            }
        });
    }
    
    function formatDate(date) {
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const year = d.getFullYear();
        return `${year}-${month}-${day}`;
    }
    
    function formatDisplayDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});
