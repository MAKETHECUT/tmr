// Slide navigation logic for the multi-step form

document.addEventListener('DOMContentLoaded', function() {
    // Remove the name attribute from all custom select search inputs to prevent them from being submitted
    document.querySelectorAll('.custom-select__search').forEach(function(input) {
      input.removeAttribute('name');
    });
    // Slide 1 to Slide 2
    var startBtn = document.getElementById('start-application-btn');
    if (startBtn) {
      startBtn.addEventListener('click', function() {
        showSlideAnimated(1);
      });
    }
  
    // Enable Next button on Slide 2 after answer
    var yesBtn = document.querySelector('.ok-button');
    var noBtn = document.querySelector('.no-button');
    var nextBtn2 = document.getElementById('next-btn-2');
    var popup = document.getElementById('not-eligible-popup');
    var overlay = document.getElementById('not-eligible-overlay');
  
    function enableNext2() {
      if (nextBtn2) nextBtn2.disabled = false;
    }
  
    if (yesBtn) {
      yesBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Select the radio
        var radio = yesBtn.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
        // Add active class to the clicked button
        yesBtn.classList.add('active');
        noBtn.classList.remove('active');
        // Go to Slide 3
        showSlideAnimated(2);
      });
    }
    if (noBtn) {
      noBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Select the radio
        var radio = noBtn.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
        // Add active class to the clicked button
        noBtn.classList.add('active');
        yesBtn.classList.remove('active');
        // Show overlay and popup with fade-in
        if (popup && overlay) {
          overlay.style.display = 'block';
          overlay.classList.remove('overlay-fade-out');
          overlay.classList.add('overlay-fade-in');
          popup.style.display = 'block';
          popup.classList.remove('fade-out');
          popup.classList.add('fade-in');
          setTimeout(function() {
            popup.classList.remove('fade-in');
            popup.classList.add('fade-out');
            overlay.classList.remove('overlay-fade-in');
            overlay.classList.add('overlay-fade-out');
            setTimeout(function() {
              popup.style.display = 'none';
              overlay.style.display = 'none';
              popup.classList.remove('fade-out');
              overlay.classList.remove('overlay-fade-out');
            }, 400);
          }, 3000);
        }
      });
    }
  
    // Next button on Slide 2 (to Slide 3, if exists)
    if (nextBtn2) {
      nextBtn2.addEventListener('click', function() {
        showSlideAnimated(2);
      });
    }
  
    // Utility: Animate slide transitions with fade up
    function animateSlideTransition(currentIdx, nextIdx) {
      var slides = document.querySelectorAll('.slide');
      var currentSlide = slides[currentIdx];
      var nextSlide = slides[nextIdx];
      if (!currentSlide || !nextSlide) return;
  
      // Start exit animation
      currentSlide.classList.remove('showing');
      currentSlide.classList.add('fade-up-exit');
  
      setTimeout(function() {
        currentSlide.classList.remove('fade-up-exit');
        currentSlide.classList.remove('active');
        // Prepare next slide
        nextSlide.classList.add('active');
        nextSlide.classList.add('fade-up-enter');
        setTimeout(function() {
          nextSlide.classList.remove('fade-up-enter');
          nextSlide.classList.add('showing');
        }, 20); // Allow browser to apply initial state
      }, 400); // Match CSS transition duration
    }
  
    // Track current slide index
    var currentSlideIdx = 0;
  
    function getSlides() {
      return document.querySelectorAll('.slide');
    }
  
    function showSlideAnimated(nextIdx) {
      var slides = getSlides();
      if (nextIdx < 0 || nextIdx >= slides.length) return;
      animateSlideTransition(currentSlideIdx, nextIdx);
      currentSlideIdx = nextIdx;
    }
  
    // --- Keyboard Navigation for Testing (Cmd+1, Cmd+2, etc.) ---
    document.addEventListener('keydown', function(e) {
      // Only work when Cmd is held down (macOS) or Ctrl (Windows/Linux)
      if (e.metaKey || e.ctrlKey) {
        var slides = document.querySelectorAll('.slide');
        var slideNumber = null;
        // Check for number keys 1-9
        if (e.key >= '1' && e.key <= '9') {
          slideNumber = parseInt(e.key) - 1; // Convert to 0-based index
        }
        // Check for 0 key (for slide 10)
        if (e.key === '0') {
          slideNumber = 9; // 10th slide (0-based index 9)
        }
        if (slideNumber !== null && slideNumber < slides.length) {
          e.preventDefault();
          showSlideAnimated(slideNumber);
          console.log('Navigated to slide ' + (slideNumber + 1));
        }
      }
    });
  
    // Back arrow navigation logic (fade up)
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('slide-back-arrow')) {
        var slides = getSlides();
        var idx = Array.prototype.indexOf.call(slides, e.target.parentElement);
        if (!isNaN(idx) && idx > 0) {
          showSlideAnimated(idx - 1);
        }
      }
    });
  
    // RADIO BUTTONS: Only one active at a time in group, based on input change
    document.querySelectorAll('._w-radio input[type="radio"]').forEach(function(radio) {
      radio.addEventListener('change', function() {
        // Remove .active from all radios in the same group (by name)
        var name = radio.name;
        document.querySelectorAll('._w-radio input[type="radio"][name="' + name + '"]').forEach(function(r) {
          var l = r.closest('._w-radio');
          if (l) l.classList.remove('active');
        });
        // Add .active to the parent label of the checked radio
        if (radio.checked) {
          var label = radio.closest('._w-radio');
          if (label) label.classList.add('active');
        }
        
        // Clear errors when user makes a selection
        hideErrorBar();
      });
    });
  
    // FIXED CHECKBOX HANDLING - Don't interfere with checkbox state
    document.querySelectorAll('._w-checkbox-card input[type="checkbox"]').forEach(function(checkbox) {
      checkbox.addEventListener('change', function() {
        const label = checkbox.closest('._w-checkbox-card');
        if (label) {
          // Only toggle the visual class, don't change the checkbox state
          if (checkbox.checked) {
            label.classList.add('active');
          } else {
            label.classList.remove('active');
          }
        }
      });
    });
  
    // Add 'active' class to selected .w-radio in .buttons-wrap
    function setupRadioActiveClass() {
      var buttonWraps = document.querySelectorAll('.slide .form-content .buttons-wrap');
      buttonWraps.forEach(function(wrap) {
        wrap.addEventListener('click', function(e) {
          var label = e.target.closest('.w-radio');
          if (label && wrap.contains(label)) {
            // Remove 'active' from all siblings in this wrap
            wrap.querySelectorAll('.w-radio').forEach(function(l) {
              l.classList.remove('active');
            });
            // Add 'active' to clicked
            label.classList.add('active');
          }
        });
      });
    }
  
    setupRadioActiveClass();
  
    // --- Slide 3 navigation logic ---
    var slide3NextBtn = document.getElementById('slide3-next-btn');
    var slide3BackBtn = document.getElementById('slide3-back-btn');
    var slide3Radios = document.querySelectorAll('#slide-3 .buttons-wrap input[type="radio"]');
  
    // Next button is always enabled
    if (slide3NextBtn) {
      slide3NextBtn.disabled = false;
      slide3NextBtn.style.opacity = '1';
    }

    // Global error bar functions
    function showErrorBar(message) {
      let errorBar = document.getElementById('error-bar');
      if (!errorBar) {
        errorBar = document.createElement('div');
        errorBar.id = 'error-bar';
        errorBar.style.position = 'fixed';
        errorBar.style.bottom = '0';
        errorBar.style.left = '0';
        errorBar.style.right = '0';
        errorBar.style.backgroundColor = '#ff4444';
        errorBar.style.color = 'white';
        errorBar.style.padding = '15px 20px';
        errorBar.style.fontSize = '16px';
        errorBar.style.fontWeight = '500';
        errorBar.style.textAlign = 'center';
        errorBar.style.zIndex = '9999';
        errorBar.style.boxShadow = '0 -2px 10px rgba(0,0,0,0.1)';
        errorBar.style.transform = 'translateY(100%)';
        errorBar.style.transition = 'transform 0.3s ease';
        document.body.appendChild(errorBar);
      }
      
      errorBar.textContent = message;
      errorBar.style.transform = 'translateY(0)';
    }

    function hideErrorBar() {
      const errorBar = document.getElementById('error-bar');
      if (errorBar) {
        errorBar.style.transform = 'translateY(100%)';
        setTimeout(() => {
          if (errorBar.parentNode) {
            errorBar.parentNode.removeChild(errorBar);
          }
        }, 300);
      }
    }

    // Validate slide 3 before proceeding
    function validateSlide3() {
      const radios = document.querySelectorAll('#slide-3 .buttons-wrap input[type="radio"]');
      const anySelected = Array.from(radios).some(radio => radio.checked);
      
      if (!anySelected) {
        showErrorBar('Please select an option to continue');
        return false;
      }
      hideErrorBar();
      return true;
    }
  
    // Next button: go to Slide 4
    if (slide3NextBtn) {
      slide3NextBtn.addEventListener('click', function() {
        if (validateSlide3()) {
          showSlideAnimated(3); // Slide 4 is index 3 (0-based)
        }
      });
    }
  
    // Back button: go to Slide 2
    if (slide3BackBtn) {
      slide3BackBtn.addEventListener('click', function() {
        showSlideAnimated(1); // Slide 2 is index 1 (0-based)
      });
    }
  
    // --- Slide 4 navigation logic ---
    var slide4NextBtn = document.getElementById('slide4-next-btn');
    var slide4BackBtn = document.getElementById('slide4-back-btn');
    var slide4Radios = document.querySelectorAll('#slide-4 .buttons-wrap input[type="radio"]');
  
    // Next button is always enabled
    if (slide4NextBtn) {
      slide4NextBtn.disabled = false;
      slide4NextBtn.style.opacity = '1';
    }

    // Validate slide 4 before proceeding
    function validateSlide4() {
      const radios = document.querySelectorAll('#slide-4 .buttons-wrap input[type="radio"]');
      const anySelected = Array.from(radios).some(radio => radio.checked);
      
      if (!anySelected) {
        showErrorBar('Please select an option to continue');
        return false;
      }
      hideErrorBar();
      return true;
    }
  
    // Next button: go to Slide 5 (if exists)
    if (slide4NextBtn) {
      slide4NextBtn.addEventListener('click', function() {
        if (validateSlide4()) {
          showSlideAnimated(4); // Slide 5 is index 4 (0-based)
        }
      });
    }
  
    // Back button: go to Slide 3
    if (slide4BackBtn) {
      slide4BackBtn.addEventListener('click', function() {
        showSlideAnimated(2); // Slide 3 is index 2 (0-based)
      });
    }
  
    // --- Slide 5 navigation logic (Multiple Selection, fix for native checkbox behavior) ---
    var slide5NextBtn = document.getElementById('slide5-next-btn');
    var slide5BackBtn = document.getElementById('slide5-back-btn');
    var slide5Checkboxes = document.querySelectorAll('#slide-5 .buttons-wrap input[type="checkbox"]');
  
    // Next button is always enabled
    if (slide5NextBtn) {
      slide5NextBtn.disabled = false;
      slide5NextBtn.style.opacity = '1';
    }

    // Validate slide 5 before proceeding
    function validateSlide5() {
      // Check both possible checkbox containers
      const checkboxes1 = document.querySelectorAll('#slide-5 .buttons-wrap input[type="checkbox"]');
      const checkboxes2 = document.querySelectorAll('#slide-5 .services-grid input[type="checkbox"]');
      const allCheckboxes = [...checkboxes1, ...checkboxes2];
      
      console.log('Slide 5 validation - Found checkboxes:', allCheckboxes.length);
      console.log('Checkboxes in buttons-wrap:', checkboxes1.length);
      console.log('Checkboxes in services-grid:', checkboxes2.length);
      
      const anySelected = allCheckboxes.some(checkbox => checkbox.checked);
      console.log('Any selected:', anySelected);
      
      if (!anySelected) {
        showErrorBar('Please select at least one option to continue');
        return false;
      }
      hideErrorBar();
      return true;
    }
  
    // Handle checkbox changes for visual feedback only
    slide5Checkboxes.forEach(function(checkbox) {
      checkbox.addEventListener('change', function() {
        // Toggle .active class on the label
        var label = checkbox.closest('.w-checkbox-card');
        if (label) {
          if (checkbox.checked) {
            label.classList.add('active');
          } else {
            label.classList.remove('active');
          }
        }
        // Clear errors when user makes a selection
        hideErrorBar();
      });
    });

    // Also handle checkboxes in services-grid
    const servicesGridCheckboxes = document.querySelectorAll('#slide-5 .services-grid input[type="checkbox"]');
    servicesGridCheckboxes.forEach(function(checkbox) {
      checkbox.addEventListener('change', function() {
        // Toggle .active class on the label
        var label = checkbox.closest('.w-checkbox-card');
        if (label) {
          if (checkbox.checked) {
            label.classList.add('active');
          } else {
            label.classList.remove('active');
          }
        }
        // Clear errors when user makes a selection
        hideErrorBar();
      });
    });
  
    // Next button: go to Slide 6
    if (slide5NextBtn) {
      slide5NextBtn.addEventListener('click', function() {
        if (validateSlide5()) {
          showSlideAnimated(5); // Slide 6 is index 5 (0-based)
        }
      });
    }
  
    // Back button: go to Slide 4
    if (slide5BackBtn) {
      slide5BackBtn.addEventListener('click', function() {
        showSlideAnimated(3); // Slide 4 is index 3 (0-based)
      });
    }
  
    // --- Slide 6 navigation logic ---
    var slide6NextBtn = document.getElementById('slide6-next-btn');
    var slide6BackBtn = document.getElementById('slide6-back-btn');
    var businessNameInput = document.getElementById('business-name');
    var industrySelect = document.getElementById('industry-custom');
    var stateSelect = document.getElementById('state-custom');
  
    // Validate slide 6 before proceeding
    function validateSlide6() {
      const businessName = businessNameInput ? businessNameInput.value.trim() : '';
      const industry = industrySelect ? industrySelect.value : '';
      const state = stateSelect ? stateSelect.value : '';
      
      let errorMessages = [];
      
      if (!businessName) {
        errorMessages.push('Business name is required');
      }
      
      if (!industry) {
        errorMessages.push('Please select an industry');
      }
      
      if (!state) {
        errorMessages.push('Please select a state');
      }
      
      if (errorMessages.length > 0) {
        showErrorBar(errorMessages.join(', '));
        return false;
      }
      
      hideErrorBar();
      return true;
    }

    if (slide6NextBtn) {
      slide6NextBtn.disabled = false;
      slide6NextBtn.style.opacity = '1';
      slide6NextBtn.addEventListener('click', function() {
        if (validateSlide6()) {
          showSlideAnimated(6); // Slide 7 is index 6 (0-based)
        }
      });
    }
  
    if (slide6BackBtn) {
      slide6BackBtn.addEventListener('click', function() {
        showSlideAnimated(4); // Slide 5 is index 4 (0-based)
      });
    }
  

  
    // --- Slide 7 navigation logic ---
    var slide7NextBtn = document.getElementById('slide7-next-btn');
    var slide7BackBtn = document.getElementById('slide7-back-btn');
    var loanAmountInput = document.getElementById('loan-amount');
  
    function formatNumberWithCommas(x) {
      if (!x) return '';
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  
    // Validate slide 7 before proceeding
    function validateSlide7() {
      const loanAmount = loanAmountInput ? loanAmountInput.value.replace(/,/g, '') : '';
      const num = parseInt(loanAmount, 10);
      
      if (!loanAmount || isNaN(num) || num <= 0 || num > 5000000) {
        showErrorBar('Please enter a valid loan amount between $1 and $5,000,000');
        return false;
      }
      hideErrorBar();
      return true;
    }

    if (slide7NextBtn) {
      slide7NextBtn.disabled = false;
      slide7NextBtn.style.opacity = '1';
      slide7NextBtn.addEventListener('click', function() {
        if (validateSlide7()) {
          showSlideAnimated(7); // Slide 8 is index 7 (0-based)
        }
      });
    }
  
    if (slide7BackBtn) {
      slide7BackBtn.addEventListener('click', function() {
        showSlideAnimated(5); // Slide 6 is index 5 (0-based)
      });
    }
  

  
    // --- Slide 8 navigation logic ---
    var slide8BackBtn = document.getElementById('slide8-back-btn');
    if (slide8BackBtn) {
      slide8BackBtn.addEventListener('click', function() {
        showSlideAnimated(6); // Slide 7 is index 6 (0-based)
      });
    }
  
    // --- Slide 8 validation logic ---
    var slide8SubmitBtn = document.getElementById('slide8-submit-btn');
    var firstNameInput = document.getElementById('first-name');
    var lastNameInput = document.getElementById('last-name');
    var emailInput = document.getElementById('email');
    var phoneInput = document.getElementById('phone');
    var privacyCheckbox = document.getElementById('privacy-policy');
  
    // Add event listeners to clear errors when users interact with fields
    if (firstNameInput) {
      firstNameInput.addEventListener('input', function() {
        hideErrorBar();
      });
    }
    if (lastNameInput) {
      lastNameInput.addEventListener('input', function() {
        hideErrorBar();
      });
    }
    if (emailInput) {
      emailInput.addEventListener('input', function() {
        hideErrorBar();
      });
    }
    if (phoneInput) {
      phoneInput.addEventListener('input', function() {
        formatUSPhoneNumber(phoneInput);
        hideErrorBar();
      });
    }
    if (privacyCheckbox) {
      privacyCheckbox.addEventListener('change', function() {
        hideErrorBar();
      });
    }
    if (businessNameInput) {
      businessNameInput.addEventListener('input', function() {
        hideErrorBar();
      });
    }
    if (industrySelect) {
      industrySelect.addEventListener('change', function() {
        hideErrorBar();
      });
    }
    if (stateSelect) {
      stateSelect.addEventListener('change', function() {
        hideErrorBar();
      });
    }
    if (loanAmountInput) {
      loanAmountInput.addEventListener('input', function() {
        hideErrorBar();
      });
    }
  
    // Reusable Custom Select Dropdown Logic for all .custom-select elements
    function setupCustomSelect(selectId, selectedId, dropdownId, hiddenInputId) {
      var select = document.getElementById(selectId);
      var selected = document.getElementById(selectedId);
      var dropdown = document.getElementById(dropdownId);
      var hiddenInput = document.getElementById(hiddenInputId);
      if (!select || !selected || !dropdown || !hiddenInput) return;
  
      // Helper: update the text node before the chevron
      function setSelectedText(text) {
        // Remove all text nodes and any duplicate chevrons
        Array.from(selected.childNodes).forEach(function(node) {
          if (node.nodeType === Node.TEXT_NODE || 
              (node.classList && node.classList.contains('custom-select__chevron'))) {
            selected.removeChild(node);
          }
        });
        // Insert new text node
        var textNode = document.createTextNode(text + ' ');
        selected.appendChild(textNode);
        // Add a single chevron
        var chevronDiv = document.createElement('span');
        chevronDiv.className = 'custom-select__chevron';
        chevronDiv.innerHTML = '&#9662;';
        selected.appendChild(chevronDiv);
      }
  
      // Initial state: show placeholder
      function showPlaceholder() {
        setSelectedText(selected.getAttribute('data-placeholder') || selected.textContent);
        selected.classList.add('is-placeholder');
      }
  
      // Set placeholder attribute if not already set
      if (!selected.getAttribute('data-placeholder')) {
        selected.setAttribute('data-placeholder', selected.textContent.trim());
      }
  
      // Show placeholder if no value
      if (!hiddenInput.value) {
        showPlaceholder();
      } else {
        setSelectedText(hiddenInput.value);
        selected.classList.remove('is-placeholder');
      }
  
      selected.addEventListener('click', function(e) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        // Force height for mobile
        if (window.innerWidth <= 650) {
          dropdown.style.height = '50vh';
          dropdown.style.maxHeight = '50vh';
          dropdown.style.minHeight = '50vh';
          dropdown.style.overflowY = 'auto';
        }
      });
  
      dropdown.querySelectorAll('.custom-select__option').forEach(function(option) {
        option.addEventListener('click', function(e) {
          var value = option.getAttribute('data-value');
          hiddenInput.value = value;
          setSelectedText(value);
          selected.classList.remove('is-placeholder');
          dropdown.style.display = 'none';
          hiddenInput.dispatchEvent(new Event('change'));
        });
      });
  
      // If user clears the value (optional, for reset)
      hiddenInput.addEventListener('change', function() {
        if (!hiddenInput.value) {
          showPlaceholder();
        }
      });
  
      // Close dropdown on outside click
      document.addEventListener('click', function(e) {
        if (!select.contains(e.target)) {
          dropdown.style.display = 'none';
        }
      });

      var searchInput = dropdown.querySelector('.custom-select__search');
      if (searchInput) {
        searchInput.addEventListener('input', function() {
          var filter = searchInput.value.toLowerCase();
          dropdown.querySelectorAll('.custom-select__option').forEach(function(option) {
            var text = option.textContent.toLowerCase();
            option.style.display = text.includes(filter) ? '' : 'none';
          });
        });
        // Optional: Clear search when dropdown is closed
        selected.addEventListener('click', function() {
          searchInput.value = '';
          dropdown.querySelectorAll('.custom-select__option').forEach(function(option) {
            option.style.display = '';
          });
        });
      }
    }
  
    // Setup custom selects for industry and state
    setupCustomSelect('industry-custom-select', 'industry-selected', 'industry-dropdown', 'industry-custom');
    setupCustomSelect('state-custom-select', 'state-selected', 'state-dropdown', 'state-custom');
  
    // Validate slide 8 before submitting
    function validateSlide8() {
      const firstName = firstNameInput ? firstNameInput.value.trim() : '';
      const lastName = lastNameInput ? lastNameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value : '';
      const privacyChecked = privacyCheckbox ? privacyCheckbox.checked : false;
      
      let errorMessages = [];
      
      if (!firstName) {
        errorMessages.push('First name is required');
      }
      
      if (!lastName) {
        errorMessages.push('Last name is required');
      }
      
      if (!email) {
        errorMessages.push('Email is required');
      } else if (!isValidEmail(email)) {
        errorMessages.push('Please enter a valid email address');
      }
      
      if (!phone) {
        errorMessages.push('Phone number is required');
      } else if (!validateUSPhoneNumber(phone)) {
        errorMessages.push('Please enter a valid phone number');
      }
      
      if (!privacyChecked) {
        errorMessages.push('Please approve the privacy policy');
      }
      
      if (errorMessages.length > 0) {
        showErrorBar(errorMessages.join(', '));
        return false;
      }
      
      hideErrorBar();
      return true;
    }

    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    // Initialize submit button state
    if (slide8SubmitBtn) {
      slide8SubmitBtn.disabled = false;
      slide8SubmitBtn.style.opacity = '1';
    }
  
    // --- Loan Purpose Checkbox Logic for new structure ---
    var slide5NextBtn = document.getElementById('slide5-next-btn');
    var servicesGrid = document.querySelector('#slide-5 .services-grid');
  

  
    // Update validation on submit to check for checked checkboxes in slide 5
    var slide8SubmitBtn = document.getElementById('slide8-submit-btn');
    if (slide8SubmitBtn) {
      slide8SubmitBtn.addEventListener('click', function(e) {
        const checkboxes = servicesGrid ? servicesGrid.querySelectorAll('input[type="checkbox"]') : [];
        const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
        if (!anyChecked) {
          e.preventDefault();
          alert('Please select at least one purpose for your loan.');
          showSlideAnimated(4); // Slide 5 is index 4 (0-based)
          return;
        }
      });
    }
  
    // Submit button click handler
    if (slide8SubmitBtn) {
      slide8SubmitBtn.addEventListener('click', function(e) {
        // Validate slide 8 before submitting
        if (!validateSlide8()) {
          e.preventDefault();
          return;
        }
        

        
        // Debug: Log form data before submission
        const form = document.querySelector('form');
        if (form) {
          const formData = new FormData(form);
          console.log('=== FORM SUBMISSION DEBUG ===');
          console.log('All form data:');
          for (let [key, value] of formData.entries()) {
            console.log(key + ': ' + value);
          }
          // Check checkboxes specifically
          const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
          console.log('Checked checkboxes:', checkboxes.length);
          checkboxes.forEach(function(cb) {
            console.log('Checkbox:', cb.name, '=', cb.value);
          });
        }
        // Let the form submit naturally - don't prevent default
        console.log('Form submitted!');
      });
    }
  
    // --- Custom Thank You Slide Logic ---
    var form = document.getElementById('email-form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Optionally, send the form data via AJAX here if needed
        // Find the thank you slide index
        var slides = document.querySelectorAll('.slide');
        var thankyou = document.getElementById('slide-thankyou');
        var thankyouIdx = Array.prototype.indexOf.call(slides, thankyou);
        if (thankyou && thankyouIdx !== -1) {
          showSlideAnimated(thankyouIdx);
        }
        // Optionally, hide the default Webflow thank you
        var wfDone = document.querySelector('.w-form-done');
        if (wfDone) wfDone.style.display = 'none';
      });
    }
  
    // --- US Phone Number Formatting and Validation ---
    var phoneInput = document.getElementById('phone');
    
    function formatUSPhoneNumber(input) {
      // Remove all non-digits
      var value = input.value.replace(/\D/g, '');
      
      // Limit to 10 digits
      if (value.length > 10) {
        value = value.substring(0, 10);
      }
      
      // Format as (XXX) XXX-XXXX
      if (value.length >= 6) {
        value = '(' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6);
      } else if (value.length >= 3) {
        value = '(' + value.substring(0, 3) + ') ' + value.substring(3);
      } else if (value.length > 0) {
        value = '(' + value;
      }
      
      input.value = value;
    }
    
    function validateUSPhoneNumber(phone) {
      // Remove all non-digits for validation
      var digits = phone.replace(/\D/g, '');
      return digits.length === 10;
    }
  
    // --- Privacy Policy Approval Notification on Form Submit ---
    var form = document.querySelector('form');
    if (form) {
      form.addEventListener('submit', function(e) {
        if (privacyCheckbox && !privacyCheckbox.checked) {
          e.preventDefault();
          alert('please approve privacy policy in order to apply');
          return;
        }
      });
    }
  
  });


// Testimonials Slider Functionality

document.addEventListener('DOMContentLoaded', function() {
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    
    if (testimonialsSlider) {
        const testimonials = testimonialsSlider.querySelectorAll('.testimonial');
        let currentIndex = 0;
        const intervalTime = 5000; // 4 seconds between each testimonial
        
        // Function to show a specific testimonial
        function showTestimonial(index) {
            // Find current active testimonial
            const currentActive = testimonialsSlider.querySelector('.testimonial.active');
            
            if (currentActive) {
                // Add exit animation to current testimonial
                currentActive.classList.add('exit');
                
                // Remove exit class after animation completes
                setTimeout(() => {
                    currentActive.classList.remove('active', 'exit');
                }, 1200); // Full transition time
            }
            
            // Add active class to new testimonial immediately
            testimonials.forEach(testimonial => {
                testimonial.classList.remove('active', 'exit');
            });
            
            if (testimonials[index]) {
                testimonials[index].classList.add('active');
            }
        }
        
        // Function to go to next testimonial
        function nextTestimonial() {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
        }
        
        // Function to go to previous testimonial
        function previousTestimonial() {
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            showTestimonial(currentIndex);
        }
        
        // Initialize the slider
        function initSlider() {
            if (testimonials.length > 0) {
                // Show the first testimonial
                showTestimonial(0);
                
                // Start the automatic rotation
                setInterval(nextTestimonial, intervalTime);
            }
        }
        
        // Initialize the slider
        initSlider();
        
        // Optional: Add pause on hover functionality
        let intervalId;
        
        function startAutoRotation() {
            intervalId = setInterval(nextTestimonial, intervalTime);
        }
        
        function stopAutoRotation() {
            if (intervalId) {
                clearInterval(intervalId);
            }
        }
        
        // Pause on hover (optional - uncomment if you want this feature)
        /*
        testimonialsSlider.addEventListener('mouseenter', stopAutoRotation);
        testimonialsSlider.addEventListener('mouseleave', startAutoRotation);
        */
        
        // Start the automatic rotation
        startAutoRotation();
    }
});
