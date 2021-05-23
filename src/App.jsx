import { useState, useEffect, useRef } from "react";
import { getImageList } from "./imageAPI";
import "./App.css";

const makeDragEvent = (target, changeLeft) => {
  let maxWidth = 0;
  let isMouseDown = false;
  let clientXPrev = 0;
  let prevLeft = 0;
  const onMouseDown = (e) => {
    const viewWidth = window.innerWidth;
    maxWidth = -(target.current.clientWidth - viewWidth * 0.8);
    clientXPrev = e.clientX;
    isMouseDown = true;
    const currentLeft = target.current.style.left;
    target.current.style.transitionDuration = "0ms";
    let currentLeftValue = Number(
      currentLeft.slice(0, currentLeft.indexOf("px"))
    );
    prevLeft = currentLeftValue;
  };
  const onMouseLeave = () => {
    isMouseDown = false;
  };
  const onMouseUp = () => {
    isMouseDown = false;
  };
  const handleMouseMove = (e) => {
    const currentClientX = e.clientX;
    const moveX = currentClientX - clientXPrev;
    moveImageList(moveX);
  };

  const onMouseMove = (e) => {
    if (!isMouseDown) {
      e.stopPropagation();
      return;
    }

    handleMouseMove(e);
  };
  const moveImageList = (moveX) => {
    let newLeft = moveX + prevLeft;
    newLeft = newLeft > 0 ? 0 : newLeft;
    newLeft = maxWidth > newLeft ? maxWidth : newLeft;
    changeLeft(newLeft);
    // target.current.style.left = `${newLeft}px`;
  };
  return { ref: target, onMouseDown, onMouseMove, onMouseLeave, onMouseUp };
};

const useSlide = (target, moveV, changeLeft) => {
  const slideEl = target;
  const leftEl = useRef(null);
  const rightEl = useRef(null);
  const calWidth = () => {
    const viewWidth = window.innerWidth;
    const maxWidth = -(slideEl.current.clientWidth - viewWidth * 0.8);
    const currentLeft = slideEl.current.style.left;
    let currentLeftValue = Number(
      currentLeft.slice(0, currentLeft.indexOf("px"))
    );
    return { currentLeftValue, maxWidth };
  };
  const handleLeftClick = () => {
    slideEl.current.style.transitionDuration = "500ms";
    const { currentLeftValue } = calWidth();
    let newLeft = moveV + currentLeftValue;
    newLeft = newLeft > 0 ? 0 : newLeft;
    if (newLeft === 0) {
      leftEl.current.style.display = "none";
    }
    rightEl.current.style.display = "block";
    changeLeft(newLeft);
    // slideEl.current.style.left = `${newLeft}px`;
  };
  const handleRightClick = () => {
    slideEl.current.style.transitionDuration = "500ms";

    const { currentLeftValue, maxWidth } = calWidth();
    let newLeft = -moveV + currentLeftValue;
    newLeft = maxWidth > newLeft ? maxWidth : newLeft;
    if (newLeft === maxWidth) {
      rightEl.current.style.display = "none";
    }
    leftEl.current.style.display = "block";
    changeLeft(newLeft);
    // slideEl.current.style.left = `${newLeft}px`;
  };
  const checkVisibleBtn = () => {
    const { maxWidth, currentLeftValue } = calWidth();
    currentLeftValue === 0
      ? (leftEl.current.style.display = "none")
      : Math.floor(currentLeftValue) === Math.floor(maxWidth)
      ? (rightEl.current.style.display = "none")
      : ((leftEl.current.style.display = "block"),
        (rightEl.current.style.display = "block"));

    // if (slideEl.current.style.left === 0) {
    //   leftEl.current.style.display = "none";
    // } else if (slideEl.current.style.left === maxWidth) {
    //   leftEl.current.style.display = "none";
    // } else {
    //   leftEl.current.style.display = "block";
    //   rightEl.current.style.display = "block";
    // }
  };
  return {
    leftBtn: { ref: leftEl, onClick: handleLeftClick },
    rightBtn: { ref: rightEl, onClick: handleRightClick },
    checkVisibleBtn,
  };
};
const useSlideX = () => {
  const el = useRef();
  const que = [];
  const changeLeft = (value) => {
    el.current.style.left = `${value}px`;
    if (que.length) {
      que.forEach((connectEvent) => {
        connectEvent();
      });
    }
  };
  const dragAction = makeDragEvent(el, changeLeft);
  const slideAction = useSlide(el, 400, changeLeft);
  que.push(slideAction.checkVisibleBtn);
  return { target: el, dragAction, slideAction };
};
function App() {
  const [imageList, setimageList] = useState([]);
  useEffect(() => {
    getImageList().then((imageList) => {
      setimageList(imageList);
    });
  }, []);
  const {
    target,
    dragAction,
    slideAction: { leftBtn, rightBtn },
  } = useSlideX();
  return (
    <div className="App-wrapper">
      <div className="App-container">
        <h1 class="title">IMAGE SLIDE</h1>
        <div className="image-wrapper">
          <button {...leftBtn} className="nav-button-left">
            ◀
          </button>
          <button {...rightBtn} className="nav-button-right">
            ▶
          </button>
          <ul ref={target} {...dragAction} className="image-list">
            {imageList.map((image, i) => (
              <li key={i} className="icon-item">
                <div className="badge">
                  <div className="badge-container">
                    <div
                      className={`badge-icon ${i === 0 ? "winner" : ""}`}
                    ></div>
                    <div className="badge-ranking ">{i + 1}</div>
                  </div>
                </div>
                <div>
                  <img
                    className="icon-image"
                    key={i}
                    alt={image.name + image.author}
                    src={image.url}
                  />
                </div>
                <div>
                  <div className="image-title">{image.name}</div>
                  <div className="image-title">{image.author}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
