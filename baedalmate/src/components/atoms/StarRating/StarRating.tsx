import React, {useEffect, useState} from 'react';
import {UseFormReturn} from 'react-hook-form';
import {Image} from 'react-native';
import StarRating, {StarIconProps} from 'react-native-star-rating-widget';
import {STAR_ACTIVE, STAR_DEACTIVE} from 'themes/theme';

const StarIcon = ({color, size, type}: StarIconProps) => {
  if (type === 'empty') {
    return <Image source={STAR_DEACTIVE} style={{width: 23, height: 23}} />;
  } else {
    return <Image source={STAR_ACTIVE} style={{width: 23, height: 23}} />;
  }
};
const StarRatingComponent = ({
  useForm,
  userId,
}: {
  useForm: UseFormReturn;
  userId: number;
}) => {
  const [rating, setRating] = useState(0);
  // const { setValue } = useForm;
  const {register, handleSubmit, setValue} = useForm;

  useEffect(() => {
    // setRating(Math.ceil(rating));
    setValue(`users.${userId}.userId`, userId);
    setValue(`users.${userId}.score`, rating);
    console.log(rating);
  }, [rating]);
  return (
    <StarRating
      rating={rating}
      onChange={setRating}
      StarIconComponent={StarIcon}
      enableHalfStar={false}
    />
  );
};

export default StarRatingComponent;
