import React from 'react';
import Slider from 'react-slick';
import './Testimonials.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import YangYang from '../../../assets/YangYang.jpg';
import GDragon from '../../../assets/GDragon.png';
import Ahyeon from '../../../assets/Ahyeon.jpg';
import Rosie from '../../../assets/Rosie.jpg';

const testimonials = [
  {
    name: 'Yang Yang',
    feedback: 'Care4Paws is amazing! They helped me find my lost dog within hours.',
    image: YangYang,
  },
  {
    name: 'G Dragon',
    feedback: 'The pet community is fantastic. I have made so many new friends!',
    image: GDragon,
  },
  {
    name: 'AhYeon',
    feedback: 'Adopting a pet through Care4Paws was a wonderful experience.',
    image: Ahyeon,
  },
  {
    name: 'Rosie',
    feedback: 'The educational resources and donation options are top-notch.',
    image: Rosie,
  },
];

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  function NextArrow(props) {
    const { onClick } = props;
    return (
      <button className="nav-button next-button" onClick={onClick}>
        <FaChevronRight />
      </button>
    );
  }

  function PrevArrow(props) {
    const { onClick } = props;
    return (
      <button className="nav-button prev-button" onClick={onClick}>
        <FaChevronLeft />
      </button>
    );
  }

  return (
    <div className="testimonials-page">
      <h1 className="testimonials-title">Testimonials</h1>
      <Slider {...settings}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial">
            <img src={testimonial.image} alt={testimonial.name} className="testimonial-image" />
            <p className="testimonial-feedback">{testimonial.feedback}</p>
            <p className="testimonial-name">- {testimonial.name}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimonials;