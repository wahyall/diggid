"use strict";

// On document ready
if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', KTDialer.init);
} else {
    KTDialer.init();
}

// On document ready
if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', KTDrawer.init);
} else {
    KTDrawer.init();
}

// On document ready
if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', KTImageInput.init);
} else {
    KTImageInput.init();
}

// On document ready
if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', KTMenu.init);
} else {
   KTMenu.init();
}

// On document ready
if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', KTPasswordMeter.init);
} else {
    KTPasswordMeter.init();
}

// On document ready
if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', KTScroll.init);
} else {
    KTScroll.init();
}

// On document ready
if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', KTScrolltop.init);
} else {
    KTScrolltop.init();
}

// On document ready
if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', KTSticky.init);
} else {
    KTSticky.init();
}

// On document ready
if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', KTSwapper.init);
} else {
    KTSwapper.init();
}

// On document ready
if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', KTToggle.init);
} else {
    KTToggle.init();
}

// KTAPPLOADER
// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTApp.init();
});

// KTAPPLOADER

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTLayoutAside.init();
});