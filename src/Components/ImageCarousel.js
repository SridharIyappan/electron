import React from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { Carousel } from "react-bootstrap";

const ImageCarousel = ({ closePopupCircle, index, images, eventId }) => {
  return (
    <div>
      <span className="close-icon">
        <AiFillCloseCircle
          color="red"
          fontSize="30"
          onClick={closePopupCircle}
        />
      </span>
      <div className="image-carousel">
        <Carousel defaultActiveIndex={index} keyboard={true}>
          {images.map((item) => {
            let img = `https://beta.imageproof.ai/api/photographer/get-images/${eventId}/${item}`;
            return (
              <Carousel.Item>
                <img src={img} loading="lazy" alt="item" />
              </Carousel.Item>
            );
          })}
        </Carousel>
      </div>
    </div>
  );
};

export default ImageCarousel;
