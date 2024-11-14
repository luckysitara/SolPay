// CTA Button interaction
document.getElementById('cta-button').addEventListener('click', function() {
    alert('Thank you for getting started with Solpay!');
});

// Sign-Up Form interaction
document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    alert(`Thank you for subscribing with: ${email}`);
});
