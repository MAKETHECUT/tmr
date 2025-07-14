// Slide navigation logic for the multi-step form

document.addEventListener('DOMContentLoaded', function() {
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
  
    // Initialize next button as disabled
    if (slide3NextBtn) {
      slide3NextBtn.disabled = true;
      slide3NextBtn.style.opacity = '0.3';
    }
  
    // Enable Next button when a radio is selected
    slide3Radios.forEach(function(radio) {
      radio.addEventListener('change', function() {
        if (slide3NextBtn) {
          slide3NextBtn.disabled = false;
          slide3NextBtn.style.opacity = '1';
        }
      });
    });
  
    // Next button: go to Slide 4
    if (slide3NextBtn) {
      slide3NextBtn.addEventListener('click', function() {
        showSlideAnimated(3); // Slide 4 is index 3 (0-based)
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
  
    // Initialize next button as disabled
    if (slide4NextBtn) {
      slide4NextBtn.disabled = true;
      slide4NextBtn.style.opacity = '0.3';
    }
  
    // Enable Next button when a radio is selected
    slide4Radios.forEach(function(radio) {
      radio.addEventListener('change', function() {
        if (slide4NextBtn) {
          slide4NextBtn.disabled = false;
          slide4NextBtn.style.opacity = '1';
        }
      });
    });
  
    // Next button: go to Slide 5 (if exists)
    if (slide4NextBtn) {
      slide4NextBtn.addEventListener('click', function() {
        showSlideAnimated(4); // Slide 5 is index 4 (0-based)
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
  
    // Initialize next button as disabled
    if (slide5NextBtn) {
      slide5NextBtn.disabled = true;
      slide5NextBtn.style.opacity = '0.3';
    }
  
    // Enable Next button when at least one checkbox is selected
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
        // Enable/disable next button
        if (slide5NextBtn) {
          var checkedBoxes = document.querySelectorAll('#slide-5 .buttons-wrap input[type="checkbox"]:checked');
          if (checkedBoxes.length > 0) {
            slide5NextBtn.disabled = false;
            slide5NextBtn.style.opacity = '1';
          } else {
            slide5NextBtn.disabled = true;
            slide5NextBtn.style.opacity = '0.3';
          }
        }
      });
    });
  
    // Next button: go to Slide 6
    if (slide5NextBtn) {
      slide5NextBtn.addEventListener('click', function() {
        showSlideAnimated(5); // Slide 6 is index 5 (0-based)
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
  
    function validateSlide6() {
      if (
        businessNameInput && businessNameInput.value.trim() !== '' &&
        industrySelect && industrySelect.value !== '' &&
        stateSelect && stateSelect.value !== ''
      ) {
        slide6NextBtn.disabled = false;
        slide6NextBtn.style.opacity = '1';
      } else {
        slide6NextBtn.disabled = true;
        slide6NextBtn.style.opacity = '0.3';
      }
    }
  
    if (slide6NextBtn) {
      slide6NextBtn.disabled = true;
      slide6NextBtn.style.opacity = '0.3';
      slide6NextBtn.addEventListener('click', function() {
        showSlideAnimated(6); // Slide 7 is index 6 (0-based)
      });
    }
  
    if (slide6BackBtn) {
      slide6BackBtn.addEventListener('click', function() {
        showSlideAnimated(4); // Slide 5 is index 4 (0-based)
      });
    }
  
    if (businessNameInput) businessNameInput.addEventListener('input', validateSlide6);
    if (industrySelect) industrySelect.addEventListener('change', validateSlide6);
    if (stateSelect) stateSelect.addEventListener('change', validateSlide6);
  
    // --- Slide 7 navigation logic ---
    var slide7NextBtn = document.getElementById('slide7-next-btn');
    var slide7BackBtn = document.getElementById('slide7-back-btn');
    var loanAmountInput = document.getElementById('loan-amount');
  
    function formatNumberWithCommas(x) {
      if (!x) return '';
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  
    function validateSlide7() {
      if (!loanAmountInput) return;
      // Remove commas and non-digits
      var raw = loanAmountInput.value.replace(/,/g, '').replace(/[^\d]/g, '');
      if (raw.length > 0) {
        // Format with commas
        loanAmountInput.value = formatNumberWithCommas(raw);
      } else {
        loanAmountInput.value = '';
      }
      var num = parseInt(raw, 10);
      if (
        !isNaN(num) &&
        num > 0 &&
        num <= 5000000
      ) {
        slide7NextBtn.disabled = false;
        slide7NextBtn.style.opacity = '1';
      } else {
        slide7NextBtn.disabled = true;
        slide7NextBtn.style.opacity = '0.3';
      }
    }
  
    if (slide7NextBtn) {
      slide7NextBtn.disabled = true;
      slide7NextBtn.style.opacity = '0.3';
      slide7NextBtn.addEventListener('click', function() {
        showSlideAnimated(7); // Slide 8 is index 7 (0-based)
      });
    }
  
    if (slide7BackBtn) {
      slide7BackBtn.addEventListener('click', function() {
        showSlideAnimated(5); // Slide 6 is index 5 (0-based)
      });
    }
  
    if (loanAmountInput) loanAmountInput.addEventListener('input', validateSlide7);
  
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
  
    function validateSlide8() {
      var allFilled = firstNameInput.value.trim() && lastNameInput.value.trim() && emailInput.value.trim() && phoneInput.value.trim();
      var validPhone = phoneInput && validateUSPhoneNumber(phoneInput.value);
      var privacyChecked = privacyCheckbox.checked;
      if (allFilled && validPhone && privacyChecked) {
        slide8SubmitBtn.disabled = false;
        slide8SubmitBtn.style.opacity = '1';
      } else {
        slide8SubmitBtn.disabled = true;
        slide8SubmitBtn.style.opacity = '0.3';
      }
    }
  
    if (firstNameInput) firstNameInput.addEventListener('input', validateSlide8);
    if (lastNameInput) lastNameInput.addEventListener('input', validateSlide8);
    if (emailInput) emailInput.addEventListener('input', validateSlide8);
    if (phoneInput) {
      phoneInput.addEventListener('input', function() {
        formatUSPhoneNumber(phoneInput);
        validateSlide8();
      });
    }
    if (privacyCheckbox) privacyCheckbox.addEventListener('change', validateSlide8);
  
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
  
    // Initialize submit button state
    if (slide8SubmitBtn) {
      slide8SubmitBtn.disabled = true;
      slide8SubmitBtn.style.opacity = '0.3';
      validateSlide8(); // Check initial state
    }
  
    // --- Loan Purpose Checkbox Logic for new structure ---
    var slide5NextBtn = document.getElementById('slide5-next-btn');
    var servicesGrid = document.querySelector('#slide-5 .services-grid');
  
    function updateLoanPurposeNextBtn() {
      if (!servicesGrid || !slide5NextBtn) return;
      const checkboxes = servicesGrid.querySelectorAll('input[type="checkbox"]');
      const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
      if (anyChecked) {
        slide5NextBtn.disabled = false;
        slide5NextBtn.style.opacity = '1';
      } else {
        slide5NextBtn.disabled = true;
        slide5NextBtn.style.opacity = '0.3';
      }
    }
  
    if (servicesGrid) {
      servicesGrid.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox') {
          updateLoanPurposeNextBtn();
        }
      });
      // Initial state
      updateLoanPurposeNextBtn();
    }
  
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
        // Enforce at least one loan-purpose checkbox is selected
        const loanPurposeCheckboxes = document.querySelectorAll('input[name="loan-purpose[]"]');
        const anyChecked = Array.from(loanPurposeCheckboxes).some(cb => cb.checked);
        if (!anyChecked) {
          e.preventDefault();
          alert('Please select at least one purpose for your loan.');
          // Optionally, navigate back to the loan purpose slide
          showSlideAnimated(4); // Slide 5 is index 4 (0-based)
          return;
        }
        // Enforce privacy policy approval
        if (privacyCheckbox && !privacyCheckbox.checked) {
          e.preventDefault();
          alert('please approve privacy policy in order to apply');
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
