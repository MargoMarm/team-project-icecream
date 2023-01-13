const defaultOptions = { linkClass: '.card' };

const explosionClassName = 'explosion';
const explosionOpenedClassName = 'explosion_Opened';
const explosionOpeningClassName = 'explosion_Opening';

const explosionSummaryClassName = 'explosionSummary';
const explosionControlsClassName = 'explosionControls';
const explosionImagesClassName = 'explosionImages';

const explosionSummaryContentClassName = 'explosionSummaryContent';
const explosionTitleClassName = 'explosionTitle';
const explosionDescriptionClassName = 'explosionDescription';
const explosionImageClassName = 'explosionImage';

const explosionCloseClassName = 'explosionClose';
const explosionNavsClassName = 'explosionNavs';

const explosionNavClassName = 'explosionNav';
const explosionNavPrevClassName = 'explosionNavPrev';
const explosionNavNextClassName = 'explosionNavNext';
const explosionCouterClassName = 'explosionCounter';
const explosionNavDisabledClassName = 'explosionNavDisabled';

const explosionPrevHiddenImageClassName = 'explosionImage_PrevHidden';
const explosionPrevShowingImageClassName = 'explosionImage_PrevShowing';
const explosionActiveImageClassName = 'explosionImage_Active';
const explosionNextShowingImageClassName = 'explosionImage_NextShowing';
const explosionNextHiddenImageClassName = 'explosionImage_NextHidden';

class ExplosionGallery {
  constructor(elementNode, options) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
    this.containerNode = elementNode;
    this.linkNodes = elementNode.querySelectorAll(this.options.linkClass);

    this.minWidth = 1023;
    this.minHeight = 600;
    this.showingCount = 4;
    this.currentIndex = 0;

    this.size = this.linkNodes.length;

    this.initModal();
    this.events();
  }
  initModal() {
    this.modalContainerNode = document.createElement('div');
    this.modalContainerNode.className = explosionClassName;

    this.modalContainerNode.innerHTML = `
        <div class='${explosionSummaryClassName}'>
          <div class='${explosionSummaryContentClassName}'>
            <h2 class='${explosionTitleClassName}'></h2>
            <p class='${explosionDescriptionClassName}'></p>
          </div>
        </div>
        <div class='${explosionControlsClassName}'>
          <button class='${explosionCloseClassName}'></button>
          <div class='${explosionNavsClassName}'>
            <button class='${explosionNavClassName} ${explosionNavPrevClassName}'></button>
            <div class='${explosionCouterClassName}'>1/${this.size}</div>
            <button class='${explosionNavClassName} ${explosionNavNextClassName}'></button>
          </div>
        </div>
        <div class='${explosionImagesClassName}'>
          ${Array.from(this.linkNodes)
            .map(
              linkNode => `
            <img src="${linkNode.getAttribute('href')}" alt="$
            {linkNode.dataset.title}" class="$
            {explosionImagesClassName}" data-title="${
              linkNode.dataset.title
            }" data-description="${linkNode.dataset.description}" />
            `
            )
            .join('')}
        </div>
       `;
    document.body.appendChild(this.modalContainerNode);

    this.explosionImageNodes = this.modalContainerNode.querySelectorAll(
      'img'
      // `.${explosionImagesClassName}`
    );
    // console.log(this.explosionImageNodes);
  }
  events() {
    this.containerNode.addEventListener('click', this.activateGallery);
  }
  activateGallery = event => {
    event.preventDefault();
    const linkNode = event.target.closest('a');

    if (
      !linkNode ||
      this.modalContainerNode.classList.contains(explosionOpenedClassName) ||
      this.modalContainerNode.classList.contains(explosionOpeningClassName)
    ) {
      return;
    }

    this.currentIndex = Array.from(this.linkNodes).findIndex(
      itemNode => linkNode === itemNode
    );
    // console.log(this.currentIndex);
    this.modalContainerNode.classList.add(explosionOpeningClassName);

    fadeIn(this.modalContainerNode, () => {
      this.modalContainerNode.classList.remove(explosionOpeningClassName);
      this.modalContainerNode.classList.add(explosionOpenedClassName);
      this.switchChanges();
    });

    this.setInitSizesToImages();
    this.setInitPositionsToImages();
  };
  setInitSizesToImages() {
    this.linkNodes.forEach((linkNode, index) => {
      const data = linkNode.getBoundingClientRect();
      this.explosionImageNodes[index].style.width = data.width + 'px';
      this.explosionImageNodes[index].style.heigth = data.heigth + 'px';
    });
  }
  setInitPositionsToImages() {
    this.linkNodes.forEach((linkNode, index) => {
      const data = linkNode.getBoundingClientRect();
      this.explosionImageNodes[index], data.left, data.top;
    });
  }
  setPositionStyles(element, x, y) {
    element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(
      1
    )}px,0)`;
  }
  switchChanges() {
    this.setCurrentState();
    // set photo to proper place
    // set controls state
    // change counter
    //set/change description
  }
  setCurrentState() {
    this.explosionPrevHiddenImageNodes = [];
    this.explosionPrevShowingImageNodes = [];
    this.explosionActiveImageNodes = [];
    this.explosionNextShowingImageNodes = [];
    this.explosionNextHiddenImageNodes = [];

    this.currentIndex;
    this.showingCount;

    this.explosionImageNodes.forEach((imageNode, index) => {
      if (index + this.showingCount < this.currentIndex) {
        this.explosionPrevHiddenImageNodes.unshift(imageNode);
      } else if (index < this.currentIndex) {
        this.explosionPrevShowingImageNodes.unshift(imageNode);
      } else if (index === this.currentIndex) {
        this.explosionActiveImageNodes.push(imageNode);
      } else if (index <= this.currentIndex + this.showingCount) {
        this.explosionNextShowingImageNodes.push(imageNode);
      } else {
        this.explosionNextHiddenImageNodes.push(imageNode);
      }
    });
    console.log(this.explosionPrevHiddenImageNodes);
    console.log(this.explosionPrevShowingImageNodes);
    console.log(this.explosionActiveImageNodes);
    console.log(this.explosionNextShowingImageNodes);
    console.log(this.explosionNextHiddenImageNodes);

    this.setGalleryStyles();
  }

  setGalleryStyles() {
    const imageWidth = this.linkNodes[0].offsetWidth;
    const imageHeight = this.linkNodes[0].offsetHeight;
    const modalWidth = Math.min(this.minWidth, window.innerWidth);
    const modalHeight = Math.min(this.minHeight, window.innerHeight);

    console.log(imageWidth);
    console.log(imageHeight);
    console.log(modalWidth);
    console.log(modalHeight);

    this.explosionPrevHiddenImageNodes.forEach(node =>
      this.setImagesStyles(node, {
        top: -modalHeight,
        left: 0.7 * modalWidth,
        opacity: 0.1,
        zIndex: 1,
        scale: 0.4,
      })
    );
    this.setImagesStyles(this.explosionPrevShowingImageNodes[0], {
      top: modalHeight - imageHeight,
      left: modalWidth,
      opacity: 0.4,
      zIndex: 4,
      scale: 0.75,
    });
    this.setImagesStyles(this.explosionPrevShowingImageNodes[1], {
      top: 0.35 * modalHeight,
      left: 0.11 * modalWidth,
      opacity: 0.3,
      zIndex: 3,
      scale: 0.6,
    });
    this.setImagesStyles(this.explosionPrevShowingImageNodes[2], {
      top: 0,
      left: 0.17 * modalWidth,
      opacity: 0.2,
      zIndex: 2,
      scale: 0.5,
    });
    this.setImagesStyles(this.explosionPrevShowingImageNodes[3], {
      top: -0.3 * modalHeight,
      left: 0.31 * modalWidth,
      opacity: 0.1,
      zIndex: 1,
      scale: 0.4,
    });
    this.explosionActiveImageNode.forEach(node =>
      this.setImagesStyles(node, {
        top: modalHeight - imageHeight,
        left: modalWidth - imageWidth,
        opacity: 1,
        zIndex: 5,
        scale: 1.2,
      })
    );
    this.setImagesStyles(this.explosionNextShowingImageNodes[0], {
      top: 0,
      left: 0.2 * modalWidth,
      opacity: 0.4,
      zIndex: 4,
      scale: 0.75,
    });
    this.setImagesStyles(this.explosionNextShowingImageNodes[1], {
      top: 0.12 * modalHeight,
      left: 0.3 * modalWidth,
      opacity: 0.3,
      zIndex: 3,
      scale: 0.6,
    });
    this.setImagesStyles(this.explosionNextShowingImageNodes[2], {
      top: 0.43 * modalHeight,
      left: 0.6 * modalWidth,
      opacity: 0.2,
      zIndex: 2,
      scale: 0.5,
    });
    this.setImagesStyles(this.explosionNextShowingImageNodes[3], {
      top: 0.67 * modalHeight,
      left: 0.53 * modalWidth,
      opacity: 0.1,
      zIndex: 1,
      scale: 0.4,
    });
    this.explosionNextHiddenImageNodes.forEach(node =>
      this.setImagesStyles(node, {
        top: 1.5 * modalHeight,
        left: 0.53 * modalWidth,
        opacity: 0.1,
        zIndex: 0.4,
        scale: 0.4,
      })
    );
  }
  setImagesStyles(element, { top, left, opacity, zIndex, scale }) {
    if (!element) {
      return;
    }
    element.style.opacity = opacity;
    element.style.transform = `translate3d(${left.toFixed(1)}px, ${top.toFixed(
      1
    )}px,0) scale(${scale})`;
    element.style.zIndex = zIndex;
  }
}

/**
 * Helpers
 */
function fadeIn(element, callback) {
  animation();

  function animation() {
    let opacity = Number(element.style.opacity);
    if (opacity < 1) {
      opacity = opacity + 0.1;
      element.style.opacity = opacity;
      window.requestAnimationFrame(animation);
      return;
    }

    if (callback) {
      callback();
    }
  }
}

function fadeOut(element, callback) {
  animation();

  function animation() {
    let opacity = Number(element.style.opacity);

    if (opacity > 0) {
      opacity = opacity - 0.04;
      element.style.opacity = opacity;
      window.requestAnimationFrame(animation);
      return;
    }

    if (callback) {
      callback();
    }
  }
}

function throttle(callback, delay = 200) {
  let isWaiting = false;
  let savedArgs = null;
  let savedThis = null;
  return function wrapper(...args) {
    if (isWaiting) {
      savedArgs = args;
      savedThis = this;
      return;
    }

    callback.apply(this, args);

    isWaiting = true;
    setTimeout(() => {
      isWaiting = false;
      if (savedThis) {
        wrapper.apply(savedThis, savedArgs);
        savedThis = null;
        savedArgs = null;
      }
    }, delay);
  };
}
const explosionGallery = new ExplosionGallery(
  document.querySelector('.gallery')
);
