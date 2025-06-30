document.addEventListener('DOMContentLoaded', function () {
    // GSAP Scroll Animations
    gsap.registerPlugin(ScrollTrigger);

    // Creative Hero Animation
    const heroSection = document.querySelector('.hero');
    const logo = document.querySelector('.header .logo');
    
    if (heroSection && logo) {
        // Get hero elements
        const heroContainer = heroSection.querySelector('.hero-container');
        const heroText = heroSection.querySelector('.hero-text');
        const heroImage = heroSection.querySelector('.hero-image');
        const h1 = heroSection.querySelector('h1');
        const h3 = heroSection.querySelector('h3');
        const h5 = heroSection.querySelector('h5');
        const bullets = heroSection.querySelector('.bullets');
        const applyButton = heroSection.querySelector('.apply-button');
        const sharksVisual = heroSection.querySelector('.sharks-visual');
        const abcMention = heroSection.querySelector('.abc-mention');

        // Set initial states
        gsap.set([heroContainer, heroText, heroImage], { opacity: 0 });
        gsap.set(heroContainer, { scale: 0.2, y: 50, transformOrigin: "center bottom" });
        gsap.set(heroText, { x: 0 });
        gsap.set(heroImage, { x: 0, scale: 0.8 });
        gsap.set([h1, h3, h5, bullets], { opacity: 0, y: 80 });
        gsap.set(applyButton, { opacity: 0, scale: 0.8, y: 20 });
        gsap.set(sharksVisual, { opacity: 0, scale: 0.7 });
        gsap.set(abcMention, { opacity: 0, scale: 0.5, y: 20 });
        gsap.set(logo, { opacity: 0, y: 60 });
        // Set logo initial state - perfectly centered in viewport

        // Create timeline for hero animation
        const heroTl = gsap.timeline({ delay: 0 });

        // Logo animation - fade in and move up
        heroTl.to(logo, {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.5,
            ease: "power4.out"
        }, 0);

        // Main container animation
        heroTl.to(heroContainer, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.5,
            ease: "power4.out"
        }, 0);

        // Text and image slide in
        heroTl.to(heroText, {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power4.out"
        }, 0.2);

        heroTl.to(heroImage, {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
            ease: "power4.out"
        }, 0.2);

        // Text elements stagger in
        heroTl.to(h1, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out"
        }, 0.3);

        heroTl.to(h3, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out"
        }, 0.4);

        heroTl.to(h5, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out"
        }, 0.5);

        heroTl.to(bullets, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out"
        }, 0.6);

        // Sharks visual animation
        heroTl.to(sharksVisual, {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power4.out"
        }, 0.6);

        // ABC mention animation
        heroTl.to(abcMention, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "power4.out"
        }, 0.7);

        // Apply button animation
        heroTl.to(applyButton, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "power4.out"
        }, 0.8);
    }

    // Minimal fade-in for all <section> elements only - Fixed to prevent jumping
    document.querySelectorAll('section:not(.hero)').forEach(section => {
        // Set initial state without affecting document flow
        gsap.set(section, { 
            opacity: 0, 
            scale: 0.9,
            transformOrigin: "center center"
        });
        
        gsap.to(section, {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Combine animation for .step and .box elements since they use the same effect - Fixed to prevent jumping
    const animatedFlexContainers = [
        document.querySelector('.steps .flex-container'),
        document.querySelector('.solutions .flex-container')
    ];
    animatedFlexContainers.forEach(flex => {
        if (flex) {
            const items = flex.querySelectorAll('.step, .box');
            const steps = flex.querySelectorAll('.step');
            const totalSteps = steps.length;
            
            // Set initial state without affecting document flow
            gsap.set(items, { 
                opacity: 0, 
                y: 100,
                scale: 0.95,
                transformOrigin: "center center"
            });
            
            steps.forEach((step, i) => {
                step.style.zIndex = totalSteps - i;
            });
            
            gsap.to(items, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                ease: "power3.out",
                stagger: {
                    amount: 0.3,
                    onStart: function(index, target, targets) {
                        if (target.classList.contains('step')) {
                            // Set z-index so first is on top, last is at the bottom (redundant, but safe)
                            target.style.zIndex = totalSteps - Array.from(steps).indexOf(target);
                        }
                        // Do not change z-index for .box
                    }
                },
                scrollTrigger: {
                    trigger: flex,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            });
        }
    });

    // Industry Button Logic
    const industryButtons = document.querySelectorAll('.industry-button');
    const imageContainer = document.querySelector('.industries-image-container');
    let isAnimating = false;

    industryButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (this.classList.contains('active') || !this.dataset.image || this.classList.contains('more') || isAnimating) {
                return;
            }

            isAnimating = true;

            const previouslyActiveButton = document.querySelector('.industry-button.active');
            previouslyActiveButton.classList.remove('active');
            this.classList.add('active');

            const newImageSrc = this.dataset.image;
            const oldImage = imageContainer.querySelector('.industry-image');

            const newImage = new Image();
            newImage.src = newImageSrc;
            newImage.className = 'industry-image';
            newImage.style.opacity = '0';
            newImage.style.transform = 'scale(1.1)';

            if (oldImage) {
                oldImage.style.zIndex = '1';
            }
            newImage.style.zIndex = '2';

            newImage.onload = () => {
                imageContainer.appendChild(newImage);
                void newImage.offsetWidth;

                newImage.style.opacity = '1';
                newImage.style.transform = 'scale(1)';

                if (oldImage) {
                    oldImage.style.opacity = '0';
                    oldImage.style.transform = 'scale(0.9)';
                }

                setTimeout(() => {
                    if (oldImage) {
                        oldImage.remove();
                    }
                    newImage.style.zIndex = '';
                    isAnimating = false;
                }, 200); 
            };

            // Handle images that fail to load
            newImage.onerror = () => {
                console.error(`Failed to load image: ${newImageSrc}`);
                // Revert button states
                this.classList.remove('active');
                if (previouslyActiveButton) {
                    previouslyActiveButton.classList.add('active');
                }
                // Unlock the animation so other buttons work
                isAnimating = false;
            };
        });
    });

    // Smooth Scroll & Video Overlay Logic
    let lenis;

    function initSmoothScroll() {
        const script = document.createElement("script");
        script.src = "https://cdn.prod.website-files.com/659fe92f193868b7c3f4da3b/65d84ab5a204cd113a363a4f_lenis-smooth.txt";
        script.onload = () => {
          lenis = new Lenis({
            lerp: 0.5,
            wheelMultiplier: 50,
            duration: 0.7,
          });

          // Integrate Lenis with GSAP ScrollTrigger
          lenis.on("scroll", ScrollTrigger.update);

          gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
          });

          // Ensure video triggers are set up only after Lenis is ready
          setupVideoOverlayTrigger();
        };
        document.head.appendChild(script);
    }
      
    // Video Overlay Logic
    function createVideoOverlay(vimeoId) {
        // Disable All Scrolling (Forceful Method)
        document.documentElement.style.setProperty('overflow', 'hidden', 'important');
        document.body.style.setProperty('overflow', 'hidden', 'important');
        if (lenis) {
            lenis.stop();
        }
        
        // Create overlay background
        const overlay = document.createElement('div');
        overlay.className = 'video-overlay';

        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.className = 'video-overlay-close';

        // Vimeo iframe
        const iframe = document.createElement('iframe');
        iframe.src = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=1&byline=1&portrait=1&controls=1`;
        iframe.width = '960';
        iframe.height = '540';
        iframe.frameBorder = '0';
        iframe.allow = 'autoplay; fullscreen; picture-in-picture';
        iframe.allowFullscreen = true;

        // Append elements
        overlay.appendChild(iframe);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);

        // Close logic
        function removeOverlay() {
            // Re-enable All Scrolling
            document.documentElement.style.removeProperty('overflow');
            document.body.style.removeProperty('overflow');
            if (lenis) {
                lenis.start();
            }
            overlay.remove();
            document.removeEventListener('keydown', escListener);
        }

        closeBtn.addEventListener('click', removeOverlay);

        overlay.addEventListener('click', (e) => {
            // Only close if clicking directly on the overlay, not the iframe or close button
            if (e.target === overlay) removeOverlay();
        });

        // Close on Escape key
        function escListener(e) {
            if (e.key === 'Escape') {
                removeOverlay();
            }
        }
        document.addEventListener('keydown', escListener);
    }

    // Attach click event to trigger video overlay
    function setupVideoOverlayTrigger() {
      document.querySelectorAll('.vimeo-bg').forEach(bg => {
        bg.addEventListener('click', function() {
          const vimeoId = this.dataset.vimeoId;
          if (vimeoId) {
            createVideoOverlay(vimeoId);
          } else {
            console.error('No vimeo ID found on .vimeo-bg element');
          }
        });
      });
      // Add support for .featured-thumbnail
      document.querySelectorAll('.featured-thumbnail').forEach(el => {
        el.addEventListener('click', function() {
          const vimeoId = this.dataset.vimeoId;
          if (vimeoId) {
            createVideoOverlay(vimeoId);
          } else {
            console.error('No vimeo ID found on .featured-thumbnail element');
          }
        });
      });
    }

    // Slider Gallery Logic
    function initSliderGallery() {
        class DragScroll {
          constructor(el, wrap, item) {
            this.el = el;
            this.wrap = this.el.querySelector(wrap);
            this.items = this.el.querySelectorAll(item);
            this.dragThreshold = 5;
            this.isDragging = false;
            this.isMouseDown = false;
            this.startX = 0;
            this.startY = 0;
            this.isHorizontalDrag = false;
            this.startTime = 0;
            this.progress = 0;
            this.x = 0;
            this.maxScroll = 0;
            this.gridGap = 0;
            this.lastScrollY = window.scrollY || 0;
            this.init();
          }
        
          init() {
            this.bindEvents();
            requestAnimationFrame(() => {
              if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(() => {
                  setTimeout(() => this.calculate(), 0);
                });
              } else {
                setTimeout(() => this.calculate(), 0);
              }
            });
            this.raf();
          }
        
          bindEvents() {
            window.addEventListener("resize", () => this.calculate());
            this.el.addEventListener("mousedown", (e) => this.handleStart(e));
            this.el.addEventListener("touchstart", (e) => this.handleStart(e));
            window.addEventListener("mousemove", (e) => this.handleMove(e));
            window.addEventListener("mouseup", (e) => this.handleEnd(e));
            this.wrap.addEventListener("touchstart", (e) => this.handleStart(e));
            window.addEventListener("touchmove", (e) => this.handleMove(e), { passive: false });
            window.addEventListener("touchend", (e) => this.handleEnd(e));
            this.wrap.addEventListener("dragstart", (e) => this.preventDragOnLinks(e));
            window.addEventListener("wheel", (e) => this.handleWheel(e), { passive: true });
            window.addEventListener("scroll", () => this.handleScroll(), { passive: true });
          }
        
          calculate() {
            const computedStyle = window.getComputedStyle(this.wrap);
            const gridGap = parseFloat(computedStyle.getPropertyValue("grid-gap") || "0");
        
            this.gridGap = gridGap;
            this.wrapWidth = Array.from(this.items).reduce((acc, item) => acc + item.offsetWidth, 0) +
              this.gridGap * (this.items.length - 1);
        
            this.containerWidth = this.el.clientWidth;
        
            const lastItem = this.items[this.items.length - 1];
            const lastItemRight = lastItem.offsetLeft + lastItem.offsetWidth;
        
            this.maxScroll = lastItemRight - this.el.clientWidth;
            this.progress = Math.min(this.progress, this.maxScroll);
          }
        
          handleStart(e) {
            this.isMouseDown = true;
            this.startX = e.clientX || e.touches[0].clientX;
            this.startY = e.clientY || e.touches[0].clientY;
            this.lastX = this.startX;
            this.lastY = this.startY;
            this.isDragging = false;
            this.isHorizontalDrag = false;
          }
        
          handleMove(e) {
            if (!this.isMouseDown) return;
        
            const currentX = e.clientX || e.touches[0].clientX;
            const currentY = e.clientY || e.touches[0].clientY;
            const deltaX = currentX - this.lastX;
            const deltaY = currentY - this.lastY;
        
            this.lastX = currentX;
            this.lastY = currentY;
        
            const isTouch = e.type.includes("touch");
        
            if (!this.isHorizontalDrag) {
              if (isTouch && Math.abs(deltaY) > Math.abs(deltaX)) {
                this.progress += deltaY * 2.5;
                this.move();
                return;
              }
        
              if (Math.abs(deltaX) > Math.abs(deltaY)) {
                this.isHorizontalDrag = true;
              } else {
                return;
              }
            }
        
            e.preventDefault();
            this.isDragging = true;
            this.progress += -deltaX * 2.5;
            this.move();
          }
        
          handleEnd() {
            this.isMouseDown = false;
            this.isDragging = false;
          }
        
          handleWheel(e) {
            const rect = this.el.getBoundingClientRect();
            const triggerOffset = window.innerHeight * 0.5;
        
            const isInExpandedViewport =
              rect.bottom > -triggerOffset && rect.top < window.innerHeight + triggerOffset;
        
            if (!isInExpandedViewport) return;
        
            const isTrackpad = Math.abs(e.deltaY) < 50;
            const multiplier = isTrackpad ? 6 : 2;
        
            const delta = e.deltaY * multiplier;
            const newProgress = Math.max(0, Math.min(this.progress + delta, this.maxScroll));
        
            gsap.to(this, {
              progress: newProgress,
              duration: 0.4,
              ease: "power2.out",
              onUpdate: () => {
                this.move();
              }
            });
          }
        
          handleScroll() {
            const rect = this.el.getBoundingClientRect();
            const triggerOffset = window.innerHeight * 0.5;
        
            const isInExpandedViewport =
              rect.bottom > -triggerOffset && rect.top < window.innerHeight + triggerOffset;
        
            if (!isInExpandedViewport) return;
        
            const scrollY = window.scrollY || window.pageYOffset;
            const scrollDelta = scrollY - this.lastScrollY;
            this.lastScrollY = scrollY;
        
            if (Math.abs(scrollDelta) < 2) return;
        
            const delta = scrollDelta * 2.5;
            const newProgress = Math.max(0, Math.min(this.progress + delta, this.maxScroll));
        
            gsap.to(this, {
              progress: newProgress,
              duration: 0.4,
              ease: "power2.out",
              onUpdate: () => {
                this.move();
              }
            });
          }
        
          move() {
            this.progress = Math.max(0, Math.min(this.progress, this.maxScroll));
            this.wrap.style.transform = `translateX(${-this.progress}px)`;
          }
        
          resetToStart() {
            this.progress = 0;
            this.move();
          }
        
          preventDragOnLinks(e) {
            if (e.target.tagName === "A") {
              e.preventDefault();
            }
          }
        
          raf() {
            this.x += (this.progress - this.x) * 0.1;
            this.wrap.style.transform = `translateX(${-this.x}px)`;
            requestAnimationFrame(this.raf.bind(this));
          }
        }
        
        const sliders = [];
        document.querySelectorAll(".slider").forEach((sliderElement) => {
          sliders.push(new DragScroll(sliderElement, ".slider-wrapper", ".slider-item"));
        });

        // Add navigation arrows to each .slider (always, no conditions)
        document.querySelectorAll('.slider').forEach((sliderElement, sliderIndex) => {
            const sliderWrapper = sliderElement.querySelector('.slider-wrapper');
            const sliderItems = sliderElement.querySelectorAll('.slider-item');
            if (!sliderWrapper || sliderItems.length < 2) return;

            // Create arrow container
            const navWrapper = document.createElement('div');
            navWrapper.className = 'slider-arrows';

            // Create left arrow
            const leftArrow = document.createElement('button');
            leftArrow.innerHTML = '&#8249;';
            leftArrow.setAttribute('aria-label', 'Previous Slide');

            // Create right arrow
            const rightArrow = document.createElement('button');
            rightArrow.innerHTML = '&#8250;';
            rightArrow.setAttribute('aria-label', 'Next Slide');

            navWrapper.appendChild(leftArrow);
            navWrapper.appendChild(rightArrow);
            sliderElement.appendChild(navWrapper);

            // Find the DragScroll instance for this slider
            let dragScrollInstance = null;
            if (window.sliders && window.sliders[sliderIndex]) {
              dragScrollInstance = window.sliders[sliderIndex];
            } else if (typeof sliders !== 'undefined' && sliders[sliderIndex]) {
              dragScrollInstance = sliders[sliderIndex];
            }

            // Helper to get current item index
            function getCurrentIndex() {
              // Find the closest item to the left edge
              let minDiff = Infinity;
              let closestIdx = 0;
              sliderItems.forEach((item, idx) => {
                const diff = Math.abs(item.offsetLeft - (dragScrollInstance ? dragScrollInstance.progress : sliderWrapper.scrollLeft));
                if (diff < minDiff) {
                  minDiff = diff;
                  closestIdx = idx;
                }
              });
              return closestIdx;
            }

            // Scroll to a specific item
            function scrollToIndex(idx) {
              if (!dragScrollInstance) return;
              const item = sliderItems[idx];
              if (!item) return;
              const target = item.offsetLeft;
              dragScrollInstance.progress = target;
              dragScrollInstance.move();
            }

            leftArrow.addEventListener('click', () => {
              const current = getCurrentIndex();
              const prev = Math.max(0, current - 1);
              scrollToIndex(prev);
            });
            rightArrow.addEventListener('click', () => {
              const current = getCurrentIndex();
              const next = Math.min(sliderItems.length - 1, current + 1);
              scrollToIndex(next);
            });
        });
    }

    // Initialize everything in the correct order
    initSmoothScroll();
    initSliderGallery();

    const slider = document.getElementById('funding-slider');
    const amountSpan = document.getElementById('funding-amount');
    const paymentSpan = document.getElementById('funding-payment');

    function updateCalculator() {
        const amount = parseInt(slider.value, 10);
        // Example: 12 month term, 9% simple interest
        const months = 12;
        const interestRate = 0.09;
        const totalRepayment = amount * (1 + interestRate);
        const monthlyPayment = Math.round(totalRepayment / months);

        amountSpan.textContent = `$${amount.toLocaleString()}`;
        paymentSpan.textContent = `$${monthlyPayment.toLocaleString()}`;
    }

    if (slider) {
        slider.addEventListener('input', updateCalculator);
        updateCalculator();
    }

    // Funding Calculator Logic
    const timeButtons = document.querySelectorAll('.fc-toggle');
    const revenueSlider = document.getElementById('fc-revenue-slider');
    const revenueValue = document.getElementById('fc-revenue-value');
    const loanResult = document.getElementById('fc-loan-result');

    function updateLoanEstimate() {
        const revenue = parseInt(revenueSlider.value, 10);
        const activeBtn = document.querySelector('.fc-toggle.active');
        const multiplier = activeBtn ? parseInt(activeBtn.dataset.multiplier, 10) : 3;
        const estimate = revenue * multiplier * 1; // 1x monthly revenue * multiplier
        loanResult.textContent = `$${estimate.toLocaleString()}`;

        // Position the value label above the thumb
        const min = parseInt(revenueSlider.min, 10);
        const max = parseInt(revenueSlider.max, 10);
        const percent = (revenue - min) / (max - min);
        const sliderWidth = revenueSlider.offsetWidth;
        const thumbWidth = 0.02 * sliderWidth; // 2vw as fraction of slider width
        const offset = percent * (sliderWidth - thumbWidth) + thumbWidth / 2;
        revenueValue.style.left = `${offset}px`;
        revenueValue.textContent = `$${revenue.toLocaleString()}`;
    }

    timeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            timeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateLoanEstimate();
        });
    });

    if (revenueSlider) {
        revenueSlider.addEventListener('input', updateLoanEstimate);
        window.addEventListener('resize', updateLoanEstimate);
        updateLoanEstimate();
    }
});

/* ==============================================
Show/Hide Grid on Keypress
============================================== */
document.addEventListener("keydown", function (event) {
    if (event.shiftKey && event.key === "G") {
        event.preventDefault(); // Prevent default behavior
        
        const gridOverlay = document.querySelector(".grid-overlay");
        if (gridOverlay) {
            gridOverlay.remove();
            console.log("Grid overlay removed");
        } else {
            createGridOverlay();
            console.log("Grid overlay created");
        }
    }
});

function createGridOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "grid-overlay";
    
    // Determine number of columns based on screen size
    const isMobile = window.innerWidth <= 650;
    const columns = isMobile ? 6 : 12;
    
    // Create grid columns
    for (let i = 0; i < columns; i++) {
        const column = document.createElement("div");
        overlay.appendChild(column);
    }
    
    document.body.appendChild(overlay);
}

// Also handle window resize to update grid columns if needed
window.addEventListener("resize", function() {
    const gridOverlay = document.querySelector(".grid-overlay");
    if (gridOverlay) {
        gridOverlay.remove();
        createGridOverlay();
    }
});

function initHomeVideo() {
    async function getVimeoVideoUrl(videoId) {
      try {
        const response = await fetch(`https://vimeo.com/api/v2/video/${videoId}.json`);
        const data = await response.json();
        if (data && data[0] && data[0].files) {
          // Get the highest quality available
          const files = data[0].files;
          const hdFile = files.find(f => f.quality === 'hd') || 
                        files.find(f => f.quality === 'sd') || 
                        files[0];
          return hdFile.link;
        }
      } catch (error) {
        console.error('Error fetching Vimeo video URL:', error);
      }
      return null;
    }

    async function setupCustomVideoPlayer() {
      document.querySelectorAll('.vimeo-bg').forEach(async (el) => {
        const videoId = el.dataset.vimeoId;
        const videoUrl = el.dataset.videoUrl;
        
        if (!videoId && !videoUrl) return;

        // Create video element
        const video = document.createElement('video');
        video.className = 'custom-video';
        video.loop = true;
        video.muted = false;
        video.playsInline = true;
        
        // Get video URL
        let finalVideoUrl = videoUrl;
        if (!finalVideoUrl && videoId) {
          finalVideoUrl = await getVimeoVideoUrl(videoId);
        }
        
        if (!finalVideoUrl) {
          console.error('Could not get video URL');
          return;
        }
        
        video.src = finalVideoUrl;
        
        // Create custom controls container
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'custom-video-controls';
        
        // Create play/pause button
        const playButton = document.createElement('button');
        playButton.className = 'custom-play-btn';
        playButton.innerHTML = '▶';
        
        // Create volume control
        const volumeControl = document.createElement('input');
        volumeControl.type = 'range';
        volumeControl.min = '0';
        volumeControl.max = '1';
        volumeControl.step = '0.1';
        volumeControl.value = '1';
        volumeControl.className = 'custom-volume';
        
        // Create fullscreen button
        const fullscreenButton = document.createElement('button');
        fullscreenButton.className = 'custom-fullscreen-btn';
        fullscreenButton.innerHTML = '⛶';
        
        // Add controls to container
        controlsContainer.appendChild(playButton);
        controlsContainer.appendChild(volumeControl);
        controlsContainer.appendChild(fullscreenButton);
        
        // Add video and controls to element
        el.appendChild(video);
        el.appendChild(controlsContainer);
        
        // Event listeners
        playButton.addEventListener('click', () => {
          if (video.paused) {
            video.play();
            playButton.innerHTML = '⏸';
          } else {
            video.pause();
            playButton.innerHTML = '▶';
          }
        });
        
        volumeControl.addEventListener('input', (e) => {
          video.volume = e.target.value;
        });
        
        fullscreenButton.addEventListener('click', () => {
          if (video.requestFullscreen) {
            video.requestFullscreen();
          } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
          }
        });
        
        // Update play button on video events
        video.addEventListener('play', () => {
          playButton.innerHTML = '⏸';
        });
        
        video.addEventListener('pause', () => {
          playButton.innerHTML = '▶';
        });
      });
    }
  
    setupCustomVideoPlayer();
  }
  initHomeVideo();
